<?php

namespace App\Services\Agency;

use App\Models\JobPosting\JobPosting;

class DashboardService
{
    protected $creditService;
    protected $maidService;
    protected $applicationService;

    public function __construct(
        CreditService $creditService,
        MaidService $maidService,
        ApplicationService $applicationService
    ) {
        $this->creditService = $creditService;
        $this->maidService = $maidService;
        $this->applicationService = $applicationService;
    }

    /**
     * Get all dashboard data for an agency
     */
    public function getDashboardData($agency)
    {
        $creditStats = $this->creditService->getCreditStats($agency->id);
        $maidStats = $this->maidService->getMaidStats($agency->id);
        $recentMaids = $this->maidService->getRecentMaids($agency->id);
        $premiumMaids = $this->maidService->getPremiumMaids($agency->id);
        $applicationStats = $this->applicationService->getApplicationStats($agency->id);
        $recentApplications = $this->applicationService->getRecentApplications($agency->id);
        $nearbyJobs = $this->getNearbyJobs($agency);
        $creditHistory = $this->creditService->getCreditHistory($agency->id);

        return [
            'agency' => [
                'id' => $agency->id,
                'name' => $agency->name,
                'status' => $agency->status,
                'is_premium' => $agency->is_premium,
                'is_verified' => $agency->is_verified,
                'placement_fee' => $agency->placement_fee,
            ],
            'creditStats' => $creditStats,
            'maidStats' => $maidStats,
            'recentMaids' => $recentMaids,
            'premiumMaids' => $premiumMaids,
            'applicationStats' => $applicationStats,
            'recentApplications' => $recentApplications,
            'nearbyJobs' => $nearbyJobs,
            'creditHistory' => $creditHistory,
            'quickLinks' => $this->getQuickLinks(),
        ];
    }

    /**
     * Get nearby job opportunities
     */
    private function getNearbyJobs($agency)
    {
        // Get active job postings
        // In a real implementation, you would add location filtering
        return JobPosting::with(['employer.user.profile', 'location'])
            ->where('status', 'active')
            ->where('is_archived', false)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();
    }

    /**
     * Get quick links for the dashboard
     */
    private function getQuickLinks()
    {
        return [
            [
                'title' => 'Add New Maid',
                'description' => 'Register a new maid to your agency',
                'url' => route('agency.maids.create'),
                'icon' => 'UserPlus'
            ],
            [
                'title' => 'Purchase Credits',
                'description' => 'Buy credits to apply for job postings',
                'url' => route('agency.credits.purchase'),
                'icon' => 'CreditCard'
            ],
            [
                'title' => 'Applications',
                'description' => 'Manage your job applications',
                'url' => route('agency.applications.index'),
                'icon' => 'ClipboardList'
            ],
            [
                'title' => 'Agency Profile',
                'description' => 'Update your agency information',
                'url' => route('agency.settings.profile.index'),
                'icon' => 'Building'
            ],
        ];
    }
}
