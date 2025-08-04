<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserReportRequest;
use App\Http\Resources\UserReportResource;
use App\Models\User;
use App\Models\UserReport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class UserReportController extends Controller
{
    /**
     * Show the form for creating a new report.
     */
    public function create(User $user): Response
    {
        // Pass the reported user to the form
        return Inertia::render('Report/User/index', [
            'reportedUser' => $user
        ]);
    }

    /**
     * Store a newly created report in storage.
     */
    public function store(UserReportRequest $request): RedirectResponse
    {
        // Get validated data
        $validated = $request->validated();

        // Add reporter_id
        $validated['reporter_id'] = auth()->id();

        // Handle file upload if present
        if ($request->hasFile('evidence_photo')) {
            $path = $request->file('evidence_photo')->store('reports/evidence', 'public');
            $validated['evidence_photo'] = $path;
        }

        // Create the report
        $report = UserReport::create($validated);

        // Determine redirect route based on user role
        $user = auth()->user();
        if ($user->role === 'employer') {
            $redirectRoute = 'employer.dashboard';
        } elseif ($user->role === 'agency') {
            $redirectRoute = 'agency.dashboard';
        } else {
            $redirectRoute = 'dashboard'; // fallback for other roles
        }

        // Redirect with success message
        return redirect()->route($redirectRoute)
            ->with('success', 'Your report has been submitted and will be reviewed by our team.');
    }
}
