<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Resources\UserResource;
use App\Http\Resources\Agency\AgencyResource;
use Illuminate\Support\Facades\Log;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Inertia::share('auth.user', function () {
            $user = Auth::id() ? \App\Models\User::with(['profile', 'agency'])->find(Auth::id()) : null;
            return $user ? new UserResource($user) : null;
        });

        // Share agency info if user is an agency
        Inertia::share('agency', function () {
            $user = Auth::user();
            if ($user && $user->agency) {
                return (new AgencyResource($user->agency))->toArray(request());
            }
            return null;
        });

        Vite::prefetch(concurrency: 3);
    }
}
