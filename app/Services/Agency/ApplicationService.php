<?php

namespace App\Services\Agency;

use App\Models\JobPosting\JobApplication;
use App\Models\Agency\AgencyMaid;

class ApplicationService
{
    /**
     * Get application statistics for the agency
     */
    public function getApplicationStats($agencyId)
    {
        // Get maids belonging to this agency
        $agencyMaidIds = AgencyMaid::where('agency_id', $agencyId)
            ->pluck('maid_id')
            ->toArray();

        if (empty($agencyMaidIds)) {
            return $this->getEmptyStats();
        }

        // Get applications for those maids
        $applications = JobApplication::whereIn('maid_id', $agencyMaidIds)->get();

        $totalApplications = $applications->count();

        if ($totalApplications === 0) {
            return $this->getEmptyStats();
        }

        // Count applications by status
        $pendingApplications = $applications->where('status', 'pending')->count();
        $reviewedApplications = $applications->where('status', 'reviewed')->count();
        $shortlistedApplications = $applications->where('status', 'shortlisted')->count();
        $hiredApplications = $applications->where('status', 'hired')->count(); // Changed from accepted to hired
        $rejectedApplications = $applications->where('status', 'rejected')->count();
        $withdrawnApplications = $applications->where('status', 'withdrawn')->count();

        // Calculate success rate (hired / total applications)
        $successRate = $totalApplications > 0
            ? round(($hiredApplications / $totalApplications) * 100)
            : 0;

        return [
            'totalApplications' => $totalApplications,
            'pendingApplications' => $pendingApplications,
            'reviewedApplications' => $reviewedApplications,
            'shortlistedApplications' => $shortlistedApplications,
            'hiredApplications' => $hiredApplications,
            'rejectedApplications' => $rejectedApplications,
            'withdrawnApplications' => $withdrawnApplications,
            'successRate' => $successRate,
        ];
    }

    /**
     * Get empty stats when no applications are found
     */
    private function getEmptyStats()
    {
        return [
            'totalApplications' => 0,
            'pendingApplications' => 0,
            'reviewedApplications' => 0,
            'shortlistedApplications' => 0,
            'hiredApplications' => 0,
            'rejectedApplications' => 0,
            'withdrawnApplications' => 0,
            'successRate' => 0,
        ];
    }

    /**
     * Get recent applications for maids from this agency
     */
    public function getRecentApplications($agencyId, $limit = 5)
    {
        // Get maids belonging to this agency
        $agencyMaidIds = AgencyMaid::where('agency_id', $agencyId)
            ->pluck('maid_id')
            ->toArray();

        if (empty($agencyMaidIds)) {
            return collect();
        }

        return JobApplication::with([
            'maid.user.profile',
            'jobPosting.employer.user.profile',
            'jobPosting.location'
        ])
            ->whereIn('maid_id', $agencyMaidIds)
            ->orderBy('created_at', 'desc')
            ->take($limit)
            ->get();
    }
}
