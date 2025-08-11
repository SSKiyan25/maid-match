<?php

namespace App\Http\Controllers\Agency;

use App\Http\Controllers\Controller;
use App\Http\Resources\Agency\AgencyMaidResource;
use App\Http\Resources\JobPosting\JobPostingResource;
use App\Http\Resources\Agency\AgencyCreditResource;
use App\Http\Resources\JobPosting\JobApplicationResource;
use App\Services\Agency\DashboardService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AgencyDashboardController extends Controller
{
    protected $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    /**
     * Display the agency dashboard with relevant data
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $user = Auth::user();
        $agencyData = $user->agency;

        if (!$agencyData) {
            abort(404, 'Agency not found');
        }

        // Load credits relationship
        $agencyData->load('credits');

        // Calculate available credits
        $totalCredits = 0;
        if ($agencyData->credits) {
            foreach ($agencyData->credits as $credit) {
                $totalCredits += $credit->amount;
            }

            // Create the proper credits structure
            $agencyData->credits = [
                'available' => $totalCredits,
                'recent_transactions' => $agencyData->credits->take(5),
            ];
        }

        // Get all dashboard data from the service
        $dashboardData = $this->dashboardService->getDashboardData($agencyData);

        // Apply resources to collections
        $dashboardData['recentMaids'] = AgencyMaidResource::collection($dashboardData['recentMaids']);
        $dashboardData['premiumMaids'] = AgencyMaidResource::collection($dashboardData['premiumMaids']);
        $dashboardData['nearbyJobs'] = JobPostingResource::collection($dashboardData['nearbyJobs']);

        if (isset($dashboardData['recentApplications'])) {
            $dashboardData['recentApplications'] = JobApplicationResource::collection($dashboardData['recentApplications']);
        }

        $dashboardData['agency'] = $agencyData;

        return Inertia::render('Agency/Dashboard', $dashboardData);
    }
}
