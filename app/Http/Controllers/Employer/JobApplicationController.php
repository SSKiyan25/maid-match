<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\JobPosting\JobPosting;
use App\Models\JobPosting\JobApplication;
use App\Models\Maid\MaidDocument;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobApplicationController extends Controller
{
    public function index(Request $request)
    {
        $employer = $request->user()->employer;

        $jobPostings = JobPosting::with([
            'applications.maid.user.profile',
            'applications.maid.documents',
            'location'
        ])
            ->where('employer_id', $employer->id)
            ->get();

        $allApplicants = $jobPostings->flatMap(function ($job) {
            return $job->applications->map(function ($app) use ($job) {
                $agency = $app->maid->agency ?? null;

                // Get required documents for the maid
                $documents = $app->maid->documents->where('is_archived', false)->map(function ($doc) {
                    $url = $doc->url;
                    if ($url && !str_starts_with($url, '/storage/')) {
                        $url = '/storage/' . $url;
                    } else if ($url && str_contains($url, '/storage//storage/')) {
                        // Fix double storage issue
                        $url = str_replace('/storage//storage/', '/storage/', $url);
                    }

                    return [
                        'id' => $doc->id,
                        'title' => $doc->title,
                        'type' => $doc->type,
                        'type_label' => $doc->type_label,
                        'url' => $url,
                        'description' => $doc->description,
                    ];
                });

                // Group documents by type for easier access
                $documentsByType = $documents->groupBy('type')->toArray();

                // Check if all required documents are available
                $hasRequiredDocuments = true;
                $missingDocuments = [];

                foreach (MaidDocument::REQUIRED_DOCUMENTS as $type => $label) {
                    if (!isset($documentsByType[$type]) || empty($documentsByType[$type])) {
                        $hasRequiredDocuments = false;
                        $missingDocuments[] = $label;
                    }
                }

                return [
                    'job_posting_id' => $job->id,
                    'job_title' => $job->title,
                    'application' => $app,
                    'agency_id' => $agency ? $agency->id : null,
                    'agency_name' => $agency ? $agency->name : null,
                    'documents' => $documents,
                    'documents_by_type' => $documentsByType,
                    'has_required_documents' => $hasRequiredDocuments,
                    'missing_documents' => $missingDocuments,
                    'verification_level' => $app->maid->verification_level,
                ];
            });
        });

        return Inertia::render('Employer/JobApplication/index', [
            'jobPostings' => $jobPostings,
            'allApplicants' => $allApplicants,
            'documentTypes' => MaidDocument::DOCUMENT_TYPES,
            'requiredDocuments' => MaidDocument::REQUIRED_DOCUMENTS,
        ]);
    }

    public function updateStatus(Request $request, $applicationId)
    {
        $request->validate([
            'status' => 'required|string|in:pending,shortlisted,rejected,hired,withdrawn',
        ]);

        $application = JobApplication::findOrFail($applicationId);
        $newStatus = $request->input('status');

        // If status is being set to shortlisted, handle ranking
        if ($newStatus === 'shortlisted') {
            $jobPosting = $application->jobPosting;
            $maxRanking = $jobPosting->applications()
                ->where('status', 'shortlisted')
                ->max('ranking_position');
            $application->ranking_position = $maxRanking ? $maxRanking + 1 : 1;
        } else {
            $application->ranking_position = null;
        }

        // If status is being set to hired, set hired_at
        if ($newStatus === 'hired') {
            $application->hired_at = now();
        } else {
            $application->hired_at = null;
        }

        $application->status = $newStatus;
        $application->save();

        return back()->with('success', "Applicant status updated to {$newStatus}.");
    }
}
