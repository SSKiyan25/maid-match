<?php

namespace App\Http\Controllers\Agency\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Agency\AgencyRequest;
use App\Models\Agency\Agency;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class UpdateController extends Controller
{
    public function index()
    {
        $user = Auth::user()->load('profile', 'agency');
        $agency = $user->agency;

        // Load agency photos (not archived, ordered)
        $photos = $agency
            ? $agency->photos()->notArchived()->ordered()->get()
            : collect();

        return inertia('Agency/Settings/Profile/index', [
            'user' => $user,
            'agency' => $agency,
            'photos' => $photos,
        ]);
    }

    public function update(AgencyRequest $request, Agency $agency)
    {
        $user = Auth::user();

        // Only allow update if the agency belongs to the user
        if ($agency->user_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        $data = $request->validated();

        $licenseChanged = false;

        // Handle license photo uploads
        foreach (['license_photo_front', 'license_photo_back'] as $photoField) {
            if ($request->hasFile($photoField)) {
                // Delete old photo if exists
                if ($agency->$photoField && Storage::disk('public')->exists($agency->$photoField)) {
                    Storage::disk('public')->delete($agency->$photoField);
                }
                $data[$photoField] = $request->file($photoField)->store('agency_licenses', 'public');
                $licenseChanged = true;
            }
        }

        // Check if license number is changed
        if (isset($data['license_number']) && $data['license_number'] !== $agency->license_number) {
            $licenseChanged = true;
        }

        // If license changed, revert verification status
        if ($licenseChanged) {
            $data['is_verified'] = false;
            $data['verified_at'] = null;
        }

        $agency->fill($data);
        $agency->save();

        return redirect()->back()->with('success', 'Agency information updated successfully!');
    }
}
