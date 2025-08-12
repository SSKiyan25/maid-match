<?php

namespace App\Http\Controllers\Browse;

use App\Http\Controllers\Controller;
use App\Models\Maid\Maid;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BookmarkController extends Controller
{
    /**
     * Toggle bookmark status for a maid
     * 
     * @param Request $request
     * @param int $maidId
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggle(Request $request, $maidId)
    {
        try {
            // Get the authenticated user's employer profile
            $employer = Auth::user()->employer;

            if (!$employer) {
                return response()->json([
                    'success' => false,
                    'message' => 'Employer profile not found',
                ], 404);
            }

            // Find the maid
            $maid = Maid::findOrFail($maidId);

            // Check if this bookmark exists (including archived ones)
            // Using the new allBookmarkedMaids relationship
            $existingBookmark = $employer->allBookmarkedMaids()
                ->wherePivot('maid_id', $maid->id)
                ->first();

            if ($existingBookmark) {
                // Bookmark exists - check if it's active or archived
                $isArchived = $existingBookmark->pivot->is_archived;

                if ($isArchived) {
                    // It's archived, so reactivate it
                    // Using the new allBookmarkedMaids relationship
                    $employer->allBookmarkedMaids()
                        ->updateExistingPivot($maid->id, ['is_archived' => false]);

                    return response()->json([
                        'success' => true,
                        'bookmarked' => true,
                        'message' => 'Maid added to bookmarks',
                    ]);
                } else {
                    // It's active, so archive it
                    // Using the new allBookmarkedMaids relationship
                    $employer->allBookmarkedMaids()
                        ->updateExistingPivot($maid->id, ['is_archived' => true]);

                    return response()->json([
                        'success' => true,
                        'bookmarked' => false,
                        'message' => 'Maid removed from bookmarks',
                    ]);
                }
            } else {
                // No existing bookmark, create a new one
                // We can use the regular bookmarkedMaids() here since it's a new record
                $description = $request->input('description', null);
                $employer->bookmarkedMaids()->attach($maid->id, [
                    'description' => $description,
                    'is_archived' => false,
                ]);

                return response()->json([
                    'success' => true,
                    'bookmarked' => true,
                    'message' => 'Maid added to bookmarks',
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Bookmark toggle error', [
                'maid_id' => $maidId,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update bookmark: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Check if a maid is bookmarked by the current employer
     * 
     * @param int $maidId
     * @return \Illuminate\Http\JsonResponse
     */
    public function check($maidId)
    {
        try {
            $employer = Auth::user()->employer;

            if (!$employer) {
                return response()->json([
                    'success' => false,
                    'message' => 'Employer profile not found',
                    'bookmarked' => false,
                ], 200);
            }

            $isBookmarked = $employer->bookmarkedMaids()
                ->wherePivot('maid_id', $maidId)
                ->exists();

            return response()->json([
                'success' => true,
                'bookmarked' => $isBookmarked,
            ]);
        } catch (\Exception $e) {
            Log::error('Bookmark check error', [
                'maid_id' => $maidId,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to check bookmark status',
                'bookmarked' => false,
            ], 200);
        }
    }

    /**
     * Display a list of all bookmarked maids for the current employer
     * 
     * @return \Inertia\Response
     */
    public function list()
    {
        $employer = Auth::user()->employer;

        if (!$employer) {
            return redirect()->route('browse.maids.index');
        }

        $bookmarkedMaids = $employer->bookmarkedMaids()
            ->with(['user.profile', 'user.photos', 'agency'])
            ->paginate(20);

        // Transform collection for the frontend
        $transformedMaids = $bookmarkedMaids->map(function ($maid) {
            $maidArray = $maid->toArray();

            // Agency name for easier access
            if ($maid->agency) {
                $maidArray['agency_name'] = $maid->agency->name;
            }

            // Bookmark pivot data
            $maidArray['bookmark_data'] = [
                'description' => $maid->pivot->description,
                'created_at' => $maid->pivot->created_at,
            ];

            return $maidArray;
        });

        // Pagination metadata
        $pagination = [
            'current_page' => $bookmarkedMaids->currentPage(),
            'last_page' => $bookmarkedMaids->lastPage(),
            'per_page' => $bookmarkedMaids->perPage(),
            'total' => $bookmarkedMaids->total(),
        ];

        return Inertia::render('Browse/Maids/ViewAll', [
            'maids' => $transformedMaids,
            'pagination' => $pagination,
            'collectionType' => 'bookmarked'
        ]);
    }
}
