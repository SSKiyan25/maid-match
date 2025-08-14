<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\EmployerRegisterRequest;
use App\Models\User;
use App\Models\Profile;
use App\Models\Employer\Employer;
use App\Models\Employer\EmployerChild;
use App\Models\Employer\EmployerPet;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class EmployerRegisterController extends Controller
{
    /**
     * Display the employer registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register/Employer/index');
    }

    /**
     * Handle an incoming employer registration request.
     */
    public function store(EmployerRegisterRequest $request): RedirectResponse
    {
        $data = $request->getOrganizedData();

        $user = DB::transaction(function () use ($data) {
            // Create user account
            $user = User::create([
                'email' => $data['user']['email'],
                'password' => Hash::make($data['user']['password']),
                'role' => 'employer',
            ]);

            // Create profile
            Profile::create([
                'user_id' => $user->id,
                ...$data['profile']
            ]);

            // Create employer profile
            $employer = Employer::create([
                'user_id' => $user->id,
                ...$data['employer']
            ]);

            // Create children if provided
            if (!empty($data['children'])) {
                foreach ($data['children'] as $childData) {
                    EmployerChild::create([
                        'employer_id' => $employer->id,
                        ...$childData
                    ]);
                }
            }

            // Create pets if provided
            if (!empty($data['pets'])) {
                foreach ($data['pets'] as $petData) {
                    EmployerPet::create([
                        'employer_id' => $employer->id,
                        ...$petData
                    ]);
                }
            }

            return $user;
        });

        event(new Registered($user));
        Auth::login($user);

        return redirect()->route('browse.maids.index')->with('success', 'Welcome to Maid Match!');
    }
}
