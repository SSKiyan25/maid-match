<?php

namespace App\Http\Controllers\Employer\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileUpdateRequest;

class ProfileUpdateController extends Controller
{
    public function update(ProfileUpdateRequest $request)
    {
        $profile = auth()->user()->profile;

        $profile->fill($request->validated())->save();
        return redirect()->back()->with('success', 'Profile updated successfully!');
    }
}
