<?php

namespace App\Http\Controllers\Agency;

use App\Http\Controllers\Controller;
use App\Http\Requests\Agency\AgencyCreditRequest;
use App\Http\Resources\Agency\AgencyCreditResource;
use App\Models\Agency\AgencyMaid;
use App\Models\Agency\AgencyCredit;
use App\Models\JobPosting\JobPosting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AgencyCreditController extends Controller
{
    /**
     * Display a listing of credits for the current agency
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Get the current user's agency
        $user = Auth::user();
        $agency = $user->agency;

        if (!$agency) {
            abort(404, 'Agency not found');
        }

        // Get agency credits with pagination and eager load related models
        $credits = $agency->credits()
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // Calculate total credits
        $totalCredits = $agency->credits()
            ->where(function ($query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->sum('amount');

        // Get recent credit transactions
        $recentTransactions = $agency->credits()
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Extract maid and job IDs for prefetching
        $maidIds = [];
        $jobIds = [];

        foreach ($credits->concat($recentTransactions) as $credit) {
            if (preg_match('/Applied maid ID (\d+) to job post ID (\d+)/', $credit->description, $matches)) {
                if (isset($matches[1])) $maidIds[] = $matches[1];
                if (isset($matches[2])) $jobIds[] = $matches[2];
            }
        }

        // Prefetch maid and job data
        $maids = AgencyMaid::whereIn('id', array_unique($maidIds))->get()->keyBy('id');
        $jobs = JobPosting::whereIn('id', array_unique($jobIds))->get()->keyBy('id');

        // Enhance credit descriptions
        foreach ($credits as $credit) {
            $this->enhanceDescription($credit, $maids, $jobs);
        }

        foreach ($recentTransactions as $transaction) {
            $this->enhanceDescription($transaction, $maids, $jobs);
        }

        // Return Inertia view with data
        return Inertia::render('Agency/Credits/index', [
            'credits' => AgencyCreditResource::collection($credits),
            'pagination' => [
                'current_page' => $credits->currentPage(),
                'last_page' => $credits->lastPage(),
                'per_page' => $credits->perPage(),
                'total' => $credits->total(),
            ],
            'stats' => [
                'totalCredits' => $totalCredits,
            ],
            'recentTransactions' => AgencyCreditResource::collection($recentTransactions),
        ]);
    }

    /**
     * Enhance credit transaction descriptions with user-friendly information
     * 
     * @param AgencyCredit $credit
     * @param Collection $maids
     * @param Collection $jobs
     */
    private function enhanceDescription($credit, $maids, $jobs)
    {
        // Check if this is a job application credit
        if (preg_match('/Applied maid ID (\d+) to job post ID (\d+)/', $credit->description, $matches)) {
            $maidId = $matches[1] ?? null;
            $jobId = $matches[2] ?? null;

            // Get maid and job information
            $maid = $maidId ? $maids->get($maidId) : null;
            $job = $jobId ? $jobs->get($jobId) : null;

            // Update the description with friendly names and add URLs
            if ($maid && $job) {
                // Get the maid's name properly through the relationships
                // First, check if the agencyMaid has a related maid model
                if ($maid->maid && $maid->maid->user && $maid->maid->user->profile) {
                    // Use the full name from the profile
                    $maidName = $maid->maid->user->profile->full_name;
                } elseif ($maid->maid && $maid->maid->full_name) {
                    // Fallback to the maid model's full_name attribute
                    $maidName = $maid->maid->full_name;
                } elseif ($maid->user && $maid->user->profile) {
                    // Fallback to direct user relationship if exists
                    $maidName = $maid->user->profile->full_name;
                } else {
                    // Ultimate fallback
                    $maidName = "Maid #$maidId";
                }

                $jobTitle = $job->title ?? "Job #$jobId";

                $credit->friendly_description = "Applied $maidName to \"$jobTitle\"";
                $credit->links = [
                    'maid' => [
                        'id' => $maidId,
                        'name' => $maidName,
                        'url' => route('browse.maids.show', $maidId)
                    ],
                    'job' => [
                        'id' => $jobId,
                        'title' => $jobTitle,
                        'url' => route('browse.job-applications.show', $jobId)
                    ]
                ];
            }
        } else {
            // For other types, just keep the original description
            $credit->friendly_description = $credit->description;
        }
    }

    /**
     * Add credits to an agency (admin or agency user purchase)
     *
     * @param AgencyCreditRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function addCredits(AgencyCreditRequest $request)
    {
        $user = Auth::user();
        $data = $request->validated();

        // If the user is an agency, ensure they can only add credits to their own agency
        if ($user->hasRole('agency')) {
            // Ensure the agency can only add credits to their own account
            if ($user->agency->id != $data['agency_id']) {
                return redirect()->back()->with('error', 'You can only add credits to your own agency.');
            }

            // For agency users, only allow 'purchase' type
            if ($data['type'] !== 'purchase') {
                return redirect()->back()->with('error', 'Invalid credit type for agency users.');
            }

            // Logic for processing payment would go here
            // For now, we'll just simulate a successful payment

            // Create the credit record
            $credit = AgencyCredit::create([
                'agency_id' => $data['agency_id'],
                'amount' => $data['amount'],
                'type' => 'purchase',
                'description' => $data['description'] ?? 'Credit purchase',
                'expires_at' => $data['expires_at'] ?? now()->addYear(), // Default expiry of 1 year
            ]);

            return redirect()->route('agency.credits.index')->with('success', 'Credits added successfully.');
        }

        // For admin users, allow all types of credit operations
        if ($user->hasRole('admin')) {
            $credit = AgencyCredit::create($data);
            return redirect()->back()->with('success', 'Credits added to agency successfully.');
        }

        return redirect()->back()->with('error', 'You do not have permission to add credits.');
    }

    /**
     * Display the form to purchase credits
     * 
     * @return \Inertia\Response
     */
    public function showPurchaseForm()
    {
        $user = Auth::user();
        $agencyData = $user->agency;

        if (!$agencyData) {
            abort(404, 'Agency not found');
        }

        // Get available credit packages (this could come from a database table)
        $creditPackages = [
            ['id' => 1, 'name' => 'Basic', 'credits' => 10, 'price' => 500],
            ['id' => 2, 'name' => 'Standard', 'credits' => 50, 'price' => 2000],
            ['id' => 3, 'name' => 'Premium', 'credits' => 100, 'price' => 3500],
        ];

        return Inertia::render('Agency/Credits/Purchase', [
            'agencyData' => [
                'id' => $agencyData->id,
                'name' => $agencyData->name,
            ],
            'creditPackages' => $creditPackages,
        ]);
    }

    /**
     * Process a credit usage
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function useCredits(Request $request)
    {
        $request->validate([
            'amount' => 'required|integer|min:1',
            'description' => 'required|string',
        ]);

        $user = Auth::user();
        $agency = $user->agency;

        if (!$agency) {
            return response()->json(['error' => 'Agency not found'], 404);
        }

        // Check if agency has enough credits
        $availableCredits = $agency->credits()
            ->where(function ($query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->sum('amount');

        if ($availableCredits < $request->amount) {
            return response()->json(['error' => 'Insufficient credits'], 400);
        }

        // Create a negative credit entry to record usage
        $credit = AgencyCredit::create([
            'agency_id' => $agency->id,
            'amount' => -1 * abs($request->amount), // Make sure it's negative
            'type' => 'used',
            'description' => $request->description,
        ]);

        return response()->json([
            'message' => 'Credits used successfully',
            'credit' => new AgencyCreditResource($credit),
            'remaining_credits' => $availableCredits - $request->amount,
        ]);
    }
}
