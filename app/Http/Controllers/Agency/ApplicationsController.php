<?php

namespace App\Http\Controllers\Agency;

use App\Http\Controllers\Controller;
use App\Http\Resources\JobPosting\JobApplicationResource;
use App\Models\JobPosting\JobApplication;
use Illuminate\Http\Request;

class ApplicationsController extends Controller
{
    public function index(Request $request)
    {
        $agency = $request->user()->agency;

        // Get all job applications for maids belonging to this agency
        $applications = JobApplication::with([
            'jobPosting.employer.user',
            'jobPosting.location',
            'maid.user.profile',
            'interviews',

        ])
            ->whereHas('maid', function ($query) use ($agency) {
                $query->where('agency_id', $agency->id);
            })
            ->latest()
            ->get();

        return inertia('Agency/Applications/index', [
            'applications' => JobApplicationResource::collection($applications),
        ]);
    }

    public function markAsHired(Request $request, $id)
    {
        $application = JobApplication::with('maid')->findOrFail($id);

        // Set the maid's status to "employed"
        $application->maid->update(['status' => 'employed']);


        return back()->with('success', 'Maid marked as employed from a job.');
    }

    public function cancel(Request $request, $id)
    {
        $application = JobApplication::with('maid')->findOrFail($id);

        // Only set maid status to "available" if not already "employed"
        if ($application->maid->status !== 'employed') {
            $application->maid->update(['status' => 'available']);
        }

        $application->delete();

        return back()->with('success', 'Application cancelled and removed. Maid status updated if applicable.');
    }
}
