<?php

namespace App\Http\Controllers\Agency;

use App\Http\Controllers\Controller;
use App\Http\Requests\Maid\MaidRequest;
use App\Models\Agency\AgencyMaid;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\Agency\AgencyResource;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class MaidController extends Controller
{
    public function index()
    {
        $agency = auth()->user()->agency;

        if (!$agency) {
            return redirect()->route('agency.dashboard')
                ->with('error', 'Agency profile not found.');
        }

        $maids = AgencyMaid::with([
            'maid.user.profile',
            'maid.user.photos',
            'maid.documents',
            'maid.characterReferences'
        ])
            ->where('agency_id', $agency->id)
            ->notArchived()
            ->latest()
            ->get();

        // Calculate statistics
        $stats = [
            'total' => AgencyMaid::where('agency_id', $agency->id)->count(),
            'available' => AgencyMaid::where('agency_id', $agency->id)
                ->whereHas('maid', function ($query) {
                    $query->where('status', 'available');
                })->count(),
            'employed' => AgencyMaid::where('agency_id', $agency->id)
                ->whereHas('maid', function ($query) {
                    $query->where('status', 'employed');
                })->count(),
            'verified' => AgencyMaid::where('agency_id', $agency->id)
                ->whereHas('maid', function ($query) {
                    $query->where('is_verified', true);
                })->count(),
            'premium' => AgencyMaid::where('agency_id', $agency->id)
                ->where('is_premium', true)->count(),
            'archived' => AgencyMaid::where('agency_id', $agency->id)
                ->where('is_archived', true)->count(),
        ];

        return inertia('Agency/Maids/index', [
            'maids' => $maids,
            'agency' => new AgencyResource($agency),
            'stats' => $stats,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    public function create()
    {
        return inertia('Agency/Maids/Create', [
            'documentTypes' => \App\Models\Maid\MaidDocument::DOCUMENT_TYPES,
            'requiredDocuments' => \App\Models\Maid\MaidDocument::REQUIRED_DOCUMENTS,
        ]);
    }

    public function store(MaidRequest $request)
    {
        $agency = auth()->user()->agency;

        if (!$agency) {
            return redirect()->route('agency.dashboard')
                ->with('error', 'Agency profile not found.');
        }

        $data = $request->getOrganizedData();

        try {
            $profileFullName = null;

            DB::transaction(function () use ($data, $agency, &$profileFullName) {
                // Step 1.1 Create User
                $user = User::create([
                    'email' => $data['user']['email'],
                    'password' => Hash::make($data['user']['password']),
                    'email_verified_at' => now(),
                    'role' => 'maid',
                ]);

                // Step 1.2 Create Profile
                $profile = $user->profile()->create($data['profile']);
                $profileFullName = $profile->full_name;

                // Step 2.1 Create Maid
                $maid = $user->maid()->create([
                    ...$data['maid'],
                    'user_id' => $user->id,
                    'agency_id' => $agency->id,
                    'registration_type' => 'agency',
                    'agency_assigned_at' => now(),
                ]);

                // Step 2.2 Create AgencyMaid relationship
                AgencyMaid::create([
                    ...$data['agency_maid'],
                    'agency_id' => $agency->id,
                    'maid_id' => $maid->id,
                ]);

                // Step 3. Create Documents if any
                if (!empty($data['documents'])) {
                    foreach ($data['documents'] as $documentData) {
                        $maid->documents()->create($documentData);
                    }
                }
            });

            return redirect()->route('agency.maids.index')
                ->with('success', "Maid profile for {$profileFullName} has been created successfully!");
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to create maid profile. Please try again.');
        }
    }

    public function edit(AgencyMaid $agencyMaid)
    {
        $agency = auth()->user()->agency;
        Log::info([
            'agencyMaid_id' => $agencyMaid->id,
            'agencyMaid_agency_id' => $agencyMaid->agency_id,
            'user_agency_id' => $agency->id,
            'user_id' => auth()->id(),
        ]);

        if ($agencyMaid->agency_id !== $agency->id) {
            abort(403, 'Unauthorized access to maid profile.');
        }

        $agencyMaid->load([
            'maid.user.profile',
            'maid.documents',
        ]);

        return inertia('Agency/Maids/Edit', [
            'agencyMaid' => $agencyMaid,
            'documentTypes' => \App\Models\Maid\MaidDocument::DOCUMENT_TYPES,
        ]);
    }

    public function update(MaidRequest $request, AgencyMaid $agencyMaid)
    {
        $agency = auth()->user()->agency;

        if ($agencyMaid->agency_id !== $agency->id) {
            abort(403, 'Unauthorized access to maid profile.');
        }

        $data = $request->getOrganizedData();

        try {
            DB::transaction(function () use ($data, $agency, $agencyMaid) {
                // Update User
                $agencyMaid->maid->user->update([
                    'email' => $data['user']['email'],
                    ...(!empty($data['user']['password']) ? ['password' => Hash::make($data['user']['password'])] : []),
                ]);

                // Update Profile
                $agencyMaid->maid->user->profile->update($data['profile']);

                // Update Maid
                $agencyMaid->maid->update([
                    ...$data['maid'],
                    'agency_id' => $agency->id,
                    'registration_type' => 'agency',
                    'agency_assigned_at' => now(),
                ]);

                // Update AgencyMaid
                $agencyMaid->update($data['agency_maid']);

                // --- Handle Documents ---
                $maid = $agencyMaid->maid;
                $existingDocs = $maid->documents()->get()->keyBy(function ($doc) {
                    return $doc->type . '_' . $doc->title;
                });

                $submittedDocs = collect($data['documents'] ?? []);

                // Track docs that are still present
                $keptDocKeys = [];

                foreach ($submittedDocs as $docData) {
                    $docKey = $docData['type'] . '_' . $docData['title'];
                    $keptDocKeys[] = $docKey;

                    // If doc exists, update it (except file/url, which is only set if changed)
                    if ($existingDocs->has($docKey)) {
                        $doc = $existingDocs[$docKey];
                        $updateData = [
                            'description' => $docData['description'] ?? null,
                            'is_archived' => false,
                        ];
                        // If a new file was uploaded, update the url
                        if (!empty($docData['url'])) {
                            $updateData['url'] = $docData['url'];
                        }
                        $doc->update($updateData);
                    } else {
                        // New doc, create it
                        $maid->documents()->create($docData);
                    }
                }

                // Optionally, archive docs that were removed in the update
                foreach ($existingDocs as $key => $doc) {
                    if (!in_array($key, $keptDocKeys)) {
                        $doc->update(['is_archived' => true]);
                    }
                }
            });

            $fullName = $agencyMaid->maid->user->profile->full_name;

            return redirect()->route('agency.maids.index')
                ->with('success', "Maid profile for {$fullName} has been updated successfully!");
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to update maid profile. Please try again.');
        }
    }

    public function archive(Request $request, User $user)
    {
        // Ensure agency has permission to archive this maid
        $agency = auth()->user()->agency;
        $maid = $user->maid;

        if (!$maid || $maid->agency_id !== $agency->id) {
            abort(403, 'Unauthorized access to maid profile.');
        }

        // Get the AgencyMaid record
        $agencyMaid = AgencyMaid::where('agency_id', $agency->id)
            ->where('maid_id', $maid->id)
            ->first();

        if (!$agencyMaid) {
            abort(404, 'Maid not found in this agency.');
        }

        $maidName = $user->profile->full_name;

        $agencyMaid->update(['is_archived' => true]);
        $maid->update(['is_archived' => true]);

        return redirect()->route('agency.maids.index')
            ->with('success', "Maid profile for {$maidName} has been archived.");
    }

    public function updateAvatar(Request $request, User $user)
    {
        // Ensure agency has permission to update this maid
        $agency = auth()->user()->agency;
        $maid = $user->maid;

        if (!$maid || $maid->agency_id !== $agency->id) {
            abort(403, 'Unauthorized access to maid profile.');
        }

        $request->validate([
            'avatar' => 'required|image|max:5012', // max 5MB
        ]);

        try {
            // Delete old avatar file if exists
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }
            // Store new avatar
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->update([
                'avatar' => $path,
            ]);

            return redirect()->back()->with('success', 'Profile picture updated successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to update profile picture');
        }
    }
}