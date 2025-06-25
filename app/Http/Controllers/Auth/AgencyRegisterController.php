<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\AgencyRegisterRequest;
use App\Http\Resources\Agency\AgencyResource;
use App\Models\User;
use App\Models\Agency\Agency;
use App\Models\Agency\AgencySetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AgencyRegisterController extends Controller
{
    /**
     * Show the agency registration form.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register/Agency', [
            'provinces' => $this->getPhilippineProvinces(),
        ]);
    }

    /**
     * Handle agency registration request.
     */
    public function store(AgencyRegisterRequest $request): JsonResponse
    {
        try {
            $agency = DB::transaction(function () use ($request) {
                // Create user account
                $user = User::create($request->getUserData());

                // Create agency profile
                $agencyData = $request->getAgencyData();
                $agencyData['user_id'] = $user->id;
                $agency = Agency::create($agencyData);

                // Create default agency settings
                AgencySetting::create([
                    'agency_id' => $agency->id,
                    'show_fees_publicly' => $agencyData['show_fee_publicly'],
                    'allow_fee_negotiation' => true,
                    'accept_direct_inquiries' => true,
                    'notify_new_job_postings' => true,
                    'notify_maid_applications' => true,
                    'notify_employer_inquiries' => true,
                    'highlight_training' => false,
                    'replacement_guarantee_days' => 0,
                    'is_archived' => false,
                ]);

                return $agency;
            });

            // Auto-login the new agency user
            Auth::loginUsingId($agency->user_id);

            return response()->json([
                'success' => true,
                'message' => 'Agency registration successful! Welcome to MaidMatch.',
                'data' => new AgencyResource($agency->load('user', 'settings')),
                'redirect' => route('agency.dashboard'),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
            ], 500);
        }
    }

    /**
     * Show agency dashboard after successful registration.
     */
    public function dashboard(): Response
    {
        $user = auth()->user();

        // Ensure user has agency role
        if (!$user || !$user->hasRole('agency')) {
            abort(403, 'Access denied. Agency account required.');
        }

        // Get agency with relationships
        $agency = Agency::with([
            'agencyMaids.maid.user.profile',
            'inquiries' => fn($q) => $q->pending()->latest()->take(5),
            'photos' => fn($q) => $q->notArchived()->ordered(),
            'settings'
        ])->where('user_id', $user->id)->first();

        if (!$agency) {
            abort(404, 'Agency profile not found.');
        }

        return Inertia::render('Agency/Dashboard', [
            'agency' => new AgencyResource($agency),
            'stats' => [
                'total_maids' => $agency->agencyMaids()->notArchived()->count(),
                'active_maids' => $agency->agencyMaids()->active()->count(),
                'hired_maids' => $agency->agencyMaids()->where('status', 'hired')->count(),
                'pending_inquiries' => $agency->inquiries()->pending()->count(),
                'this_month_inquiries' => $agency->inquiries()
                    ->whereMonth('created_at', now()->month)
                    ->count(),
            ],
            'recentInquiries' => $agency->inquiries()->with(['employer.user.profile'])
                ->pending()
                ->latest()
                ->take(5)
                ->get(),
        ]);
    }

    /**
     * Check if agency name is available.
     */
    public function checkAvailability(): JsonResponse
    {
        $name = request('name');
        $licenseNumber = request('license_number');

        $conflicts = [];

        if ($name && Agency::where('name', $name)->exists()) {
            $conflicts['name'] = 'This agency name is already taken.';
        }

        if ($licenseNumber && Agency::where('license_number', $licenseNumber)->exists()) {
            $conflicts['license_number'] = 'This license number is already registered.';
        }

        return response()->json([
            'available' => empty($conflicts),
            'conflicts' => $conflicts,
        ]);
    }

    /**
     * Get Philippine provinces for dropdown.
     */
    private function getPhilippineProvinces(): array
    {
        return [
            'Metro Manila' => 'Metro Manila',
            'Cebu' => 'Cebu',
            'Davao del Sur' => 'Davao del Sur',
            'Benguet' => 'Benguet',
            'Iloilo' => 'Iloilo',
            'Misamis Oriental' => 'Misamis Oriental',
            'Pampanga' => 'Pampanga',
            'Cavite' => 'Cavite',
            'Laguna' => 'Laguna',
            'Rizal' => 'Rizal',
            'Bulacan' => 'Bulacan',
            // Need More Provinces
        ];
    }
}
