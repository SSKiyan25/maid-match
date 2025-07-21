<?php

namespace App\Http\Controllers\Browse;

use App\Http\Controllers\Controller;
use App\Http\Resources\Agency\AgencyResource;
use App\Http\Resources\Agency\AgencyMaidResource;
use App\Http\Resources\Agency\AgencyPhotoResource;
use App\Models\Agency\Agency;
use Inertia\Inertia;

class AgencyPageController extends Controller
{
    /**
     * Display the agency's profile page
     *
     * @param int $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        // Find the agency with related data
        $agency = Agency::with([
            'user',
            'agencyMaids' => function ($query) {
                $query->with(['maid.user.profile', 'maid.documents']);
            },
            'photos'
        ])->findOrFail($id);

        // Calculate agency stats
        $stats = [
            'total_maids' => $agency->maids()->count(),
            'total_photos' => $agency->photos()->count(),
            // Will add more in the future
        ];

        // Return Inertia view with data
        return Inertia::render('Browse/Agencies/Agency', [
            'agency' => (new AgencyResource($agency))->additional([
                'stats' => $stats
            ]),
            'maids' => AgencyMaidResource::collection($agency->agencyMaids),
            'photos' => AgencyPhotoResource::collection($agency->photos),
        ]);
    }
}
