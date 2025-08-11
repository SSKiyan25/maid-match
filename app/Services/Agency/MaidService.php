<?php

namespace App\Services\Agency;

use App\Models\Agency\AgencyMaid;
use App\Http\Resources\Agency\AgencyMaidResource;

class MaidService
{
    /**
     * Get maid statistics for the agency
     */
    public function getMaidStats($agencyId)
    {
        $totalMaids = AgencyMaid::where('agency_id', $agencyId)->count();

        // Using the correct statuses from your migration
        $activeMaids = AgencyMaid::where('agency_id', $agencyId)
            ->where('status', 'active')
            ->where('is_archived', false)
            ->count();

        $inactiveMaids = AgencyMaid::where('agency_id', $agencyId)
            ->where('status', 'inactive')
            ->where('is_archived', false)
            ->count();

        $hiredMaids = AgencyMaid::where('agency_id', $agencyId)
            ->where('status', 'hired')
            ->count();

        $notAvailableMaids = AgencyMaid::where('agency_id', $agencyId)
            ->where('status', 'not_available')
            ->count();

        $archivedMaids = AgencyMaid::where('agency_id', $agencyId)
            ->where('is_archived', true)
            ->count();

        // Calculate premium and trained maids
        $premiumMaids = AgencyMaid::where('agency_id', $agencyId)
            ->where('is_premium', true)
            ->count();

        $trainedMaids = AgencyMaid::where('agency_id', $agencyId)
            ->where('is_trained', true)
            ->count();

        return [
            'totalMaids' => $totalMaids,
            'activeMaids' => $activeMaids,
            'inactiveMaids' => $inactiveMaids,
            'hiredMaids' => $hiredMaids,
            'notAvailableMaids' => $notAvailableMaids,
            'archivedMaids' => $archivedMaids,
            'premiumMaids' => $premiumMaids,
            'trainedMaids' => $trainedMaids,
        ];
    }

    /**
     * Get recent maids added by the agency
     */
    public function getRecentMaids($agencyId)
    {
        return AgencyMaid::with([
            'maid.user.profile',
        ])
            ->where('agency_id', $agencyId)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();
    }

    /**
     * Get premium maids
     */
    public function getPremiumMaids($agencyId, $limit = 3)
    {
        return AgencyMaid::with(['maid.user.profile'])
            ->where('agency_id', $agencyId)
            ->where('is_premium', true)
            ->where('is_archived', false)
            ->orderBy('created_at', 'desc')
            ->take($limit)
            ->get();
    }
}
