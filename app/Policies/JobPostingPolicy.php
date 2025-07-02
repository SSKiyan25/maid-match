<?php

namespace App\Policies;

use App\Models\JobPosting\JobPosting;
use App\Models\User;

class JobPostingPolicy
{
    /**
     * Determine whether the user can view any job postings.
     */
    public function viewAny(User $user): bool
    {
        // Allow all authenticated users to view their job postings list
        return true;
    }

    /**
     * Determine whether the user can view the job posting.
     */
    public function view(User $user, JobPosting $jobPosting): bool
    {
        // Any authenticated user can view any job posting
        return true;
    }

    /**
     * Determine whether the user can create job postings.
     */
    public function create(User $user): bool
    {
        // Allow all authenticated users to create job postings
        return true;
    }

    /**
     * Determine whether the user can update the job posting.
     */
    public function update(User $user, JobPosting $jobPosting): bool
    {
        // Only the owner (employer) can update their job posting
        return $jobPosting->employer_id === $user->id;
    }

    /**
     * Determine whether the user can delete (archive) the job posting.
     */
    public function delete(User $user, JobPosting $jobPosting): bool
    {
        // Only the owner (employer) can delete/archive their job posting
        return $jobPosting->employer_id === $user->id;
    }

    /**
     * Determine whether the user can restore the job posting.
     */
    public function restore(User $user, JobPosting $jobPosting): bool
    {
        // Only the owner (employer) can restore their job posting
        return $jobPosting->employer_id === $user->id;
    }

    /**
     * Determine whether the user can permanently delete the job posting.
     */
    public function forceDelete(User $user, JobPosting $jobPosting): bool
    {
        // Only the owner (employer) can force delete their job posting
        return $jobPosting->employer_id === $user->id;
    }
}
