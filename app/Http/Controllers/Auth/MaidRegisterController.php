<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\MaidRegisterRequest;
use App\Models\User;
use App\Models\Profile;
use App\Models\Maid\Maid;
use App\Models\Maid\MaidCharacterReference;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class MaidRegisterController extends Controller
{
    /**
     * Display the maid registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register/Maid', [
            'formOptions' => MaidRegisterRequest::getFormOptions(),
        ]);
    }

    /**
     * Handle an incoming maid registration request.
     */
    public function store(MaidRegisterRequest $request): RedirectResponse
    {
        $data = $request->getOrganizedData();

        $user = DB::transaction(function () use ($data) {
            // Create user account
            $user = User::create([
                'email' => $data['user']['email'],
                'password' => Hash::make($data['user']['password']),
            ]);

            // Assign maid role
            $user->assignRole('maid');

            // Create profile
            Profile::create([
                'user_id' => $user->id,
                ...$data['profile']
            ]);

            // Create maid profile
            $maid = Maid::create([
                'user_id' => $user->id,
                ...$data['maid']
            ]);

            // Create character reference records if provided
            if (!empty($data['character_references'])) {
                foreach ($data['character_references'] as $referenceData) {
                    MaidCharacterReference::create([
                        'maid_id' => $maid->id,
                        ...$referenceData
                    ]);
                }
            }

            return $user;
        });

        event(new Registered($user));
        Auth::login($user);

        return redirect()->route('maid.dashboard')->with('success', 'Welcome to Maid Match!');
    }
}
