<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Log;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share('auth.user', function () {
            $user = Auth::id() ? \App\Models\User::with('profile')->find(Auth::id()) : null;
            return $user ? new \App\Http\Resources\UserResource($user) : null;
        });
        Vite::prefetch(concurrency: 3);
    }
}
