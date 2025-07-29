<?php

namespace App\Http\Controllers\Employer\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileUpdateRequest;

class ProfileUpdateController extends Controller
{

    public function index()
    {
        $user = auth()->user()->load([
            'photos',
            'profile',
            'employer.children',
            'employer.pets',
        ]);

        return inertia('Employer/Profile/index', [
            'user' => $user,
            'photos' => $user->photos,
            'profile' => $user->profile,
            'employer' => $user->employer,
            'children' => $user->employer?->children ?? [],
            'pets' => $user->employer?->pets ?? [],
        ]);
    }

    public function update(ProfileUpdateRequest $request)
    {
        $profile = auth()->user()->profile;

        $profile->fill($request->validated())->save();
        return redirect()->back()->with('success', 'Profile updated successfully!');
    }
}