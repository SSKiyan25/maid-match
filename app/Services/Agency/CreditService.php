<?php

namespace App\Services\Agency;

use App\Models\Agency\AgencyCredit;
use App\Http\Resources\Agency\AgencyCreditResource;
use Carbon\Carbon;

class CreditService
{
    /**
     * Get credit statistics for the agency
     */
    public function getCreditStats($agencyId)
    {
        // Get total available credits
        $totalCredits = AgencyCredit::where('agency_id', $agencyId)
            ->where(function ($query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->sum('amount');

        // Get credits used in the last 30 days
        $creditsUsedLastMonth = AgencyCredit::where('agency_id', $agencyId)
            ->where('amount', '<', 0)
            ->where('created_at', '>=', now()->subDays(30))
            ->sum('amount') * -1;

        // Get credits purchased in the last 30 days
        $creditsPurchasedLastMonth = AgencyCredit::where('agency_id', $agencyId)
            ->where('amount', '>', 0)
            ->where('type', 'purchase')
            ->where('created_at', '>=', now()->subDays(30))
            ->sum('amount');

        // Get expiring credits
        $expiringCredits = AgencyCredit::where('agency_id', $agencyId)
            ->where('amount', '>', 0)
            ->whereNotNull('expires_at')
            ->where('expires_at', '>', now())
            ->where('expires_at', '<', now()->addDays(30))
            ->sum('amount');

        // Get recent transactions
        $recentTransactions = AgencyCredit::where('agency_id', $agencyId)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return [
            'totalCredits' => $totalCredits,
            'creditsUsedLastMonth' => $creditsUsedLastMonth,
            'creditsPurchasedLastMonth' => $creditsPurchasedLastMonth,
            'expiringCredits' => $expiringCredits,
            'recentTransactions' => AgencyCreditResource::collection($recentTransactions),
        ];
    }

    /**
     * Get credit history for charts
     */
    public function getCreditHistory($agencyId)
    {
        // Get credit data for the last 6 months for charting
        $sixMonthsAgo = Carbon::now()->subMonths(6)->startOfMonth();

        $credits = AgencyCredit::where('agency_id', $agencyId)
            ->where('created_at', '>=', $sixMonthsAgo)
            ->get();

        $creditData = collect();

        // Group by month
        for ($i = 0; $i < 6; $i++) {
            $monthDate = Carbon::now()->subMonths($i);
            $monthKey = $monthDate->format('Y-m');
            $monthName = $monthDate->format('M Y');

            $monthCredits = $credits->filter(function ($credit) use ($monthDate) {
                $creditDate = Carbon::parse($credit->created_at);
                return $creditDate->year === $monthDate->year &&
                    $creditDate->month === $monthDate->month;
            });

            $purchased = $monthCredits->where('amount', '>', 0)->sum('amount');
            $used = $monthCredits->where('amount', '<', 0)->sum('amount') * -1;

            $creditData->put($monthKey, [
                'month' => $monthName,
                'purchased' => $purchased,
                'used' => $used
            ]);
        }

        return $creditData->sortKeys()->values();
    }
}
