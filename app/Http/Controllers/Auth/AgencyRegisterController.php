<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\AgencyRegisterRequest;
use App\Models\User;
use App\Models\Agency\Agency;
use App\Models\Agency\AgencySetting;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AgencyRegisterController extends Controller
{
    /**
     * Display the agency registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register/Agency/index');
    }

    /**
     * Handle an incoming agency registration request.
     */
    public function store(AgencyRegisterRequest $request): RedirectResponse
    {
        $user = DB::transaction(function () use ($request) {
            // Create user account
            $user = User::create($request->getUserData());

            // Handle license photo uploads
            $agencyData = $request->getAgencyData();
            $agencyData['user_id'] = $user->id;

            if ($request->hasFile('license_photo_front')) {
                $agencyData['license_photo_front'] = $request->file('license_photo_front')->store('licenses', 'public');
            }
            if ($request->hasFile('license_photo_back')) {
                $agencyData['license_photo_back'] = $request->file('license_photo_back')->store('licenses', 'public');
            }

            $agency = Agency::create($agencyData);

            // Create default agency settings
            AgencySetting::create([
                'agency_id' => $agency->id,
                'show_fees_publicly' => $agencyData['show_fee_publicly'] ?? false,
                'allow_fee_negotiation' => true,
                'accept_direct_inquiries' => true,
                'notify_new_job_postings' => true,
                'notify_maid_applications' => true,
                'notify_employer_inquiries' => true,
                'highlight_training' => false,
                'replacement_guarantee_days' => 0,
                'is_archived' => false,
            ]);

            $agency->credits()->create([
                'amount' => 25,
                'type' => 'initial',
                'description' => 'Initial signup credits',
            ]);

            return $user;
        });

        event(new Registered($user));
        Auth::login($user);

        return redirect()->route('agency.dashboard')->with('success', 'Welcome to Maid Match!');
    }
}
