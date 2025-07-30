<?php

namespace App\Http\Controllers\Browse;

use App\Http\Controllers\Controller;
use App\Http\Resources\Maid\MaidResource;
use App\Http\Resources\Maid\MaidDocumentResource;
use App\Models\Maid\Maid;
use Inertia\Inertia;

class MaidPageController extends Controller
{
    /**
     * Display the maid's profile page
     *
     * @param int $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        // Find the maid with related data
        $maid = Maid::with([
            'user.profile',
            'user.photos',
            'agency',
            'documents',
            'characterReferences',
        ])->findOrFail($id);

        // Return Inertia view with data
        return Inertia::render('Browse/Maids/Maid', [
            'maid' => new MaidResource($maid),
            'documents' => MaidDocumentResource::collection($maid->documents),
        ]);
    }
}