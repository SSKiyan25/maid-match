<?php

namespace App\Providers;

use App\Services\MaidMatchingService;
use App\Services\MaidQueryService;
use App\Services\AgencyQueryService;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Resources\UserResource;
use App\Http\Resources\Agency\AgencyResource;
use App\Http\Resources\Agency\AgencyCreditResource;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Register MaidMatchingService
        $this->app->singleton(MaidMatchingService::class, function () {
            return new MaidMatchingService();
        });

        // Register MaidQueryService with dependency injection
        $this->app->singleton(MaidQueryService::class, function ($app) {
            return new MaidQueryService(
                $app->make(MaidMatchingService::class)
            );
        });

        // Register AgencyQueryService
        $this->app->singleton(AgencyQueryService::class, function () {
            return new AgencyQueryService();
        });
    }

    public function boot(): void
    {
        Inertia::share('auth.user', function () {
            $user = Auth::id() ? \App\Models\User::with(['profile', 'photos'])->find(Auth::id()) : null;
            return $user ? new UserResource($user) : null;
        });

        // Share agency info and credits if user is an agency
        Inertia::share('agency', function () {
            $user = Auth::user();
            if ($user && $user->hasRole('agency')) {
                // Eager load credits to avoid N+1 problem
                $agency = $user->agency()->with('credits')->first();

                if (!$agency) {
                    return null;
                }

                // Make sure credits are loaded - even if empty
                $credits = $agency->credits ?? collect([]);

                // Calculate available credits (not expired)
                $availableCredits = $credits
                    ->where(function ($credit) {
                        return $credit->expires_at === null || $credit->expires_at > now();
                    })
                    ->sum('amount');

                // Get recent transactions (from already loaded relationship)
                $recentTransactions = $credits
                    ->sortByDesc('created_at')
                    ->take(3);

                // Create agency resource and transform to array
                $agencyData = (new AgencyResource($agency))->toArray(request());

                // Add credits information
                $agencyData['credits'] = [
                    'available' => $availableCredits,
                    'recent_transactions' => AgencyCreditResource::collection($recentTransactions)->toArray(request()),
                ];

                return $agencyData;
            }
            return null;
        });

        Vite::prefetch(concurrency: 3);
    }
}
