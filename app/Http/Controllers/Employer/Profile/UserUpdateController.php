<?php

namespace App\Http\Controllers\Employer\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserUpdateRequest;
use Illuminate\Support\Facades\Hash;

class UserUpdateController extends Controller
{
    public function index()
    {
        $user = auth()->user()->load([
            'profile',
            'employer.children',
            'employer.pets',
        ]);

        return inertia('Employer/Profile/index', [
            'user' => $user,
            'profile' => $user->profile,
            'employer' => $user->employer,
            'children' => $user->employer?->children ?? [],
            'pets' => $user->employer?->pets ?? [],
        ]);
    }

    public function update(UserUpdateRequest $request)
    {
        $user = auth()->user();

        $validated = $request->validated();

        $user->email = $validated['email'];

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        // Only update avatar if a new file is uploaded
        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $avatarPath;
        }

        $user->save();

        return redirect()->back()->with('success', 'Account updated successfully!');
    }
}
