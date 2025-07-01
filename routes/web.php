<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\AgencyRegisterController;
use App\Http\Controllers\Auth\EmployerRegisterController;
use App\Http\Controllers\Employer\JobPostingController;
use App\Http\Controllers\Employer\JobPosting\BonusController;
use App\Http\Controllers\Employer\JobPosting\LocationController;
use App\Http\Controllers\Employer\JobPosting\PhotoController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Agency Registration Routes (Public)
Route::prefix('agency')->name('agency.')->group(function () {
    Route::get('register', [AgencyRegisterController::class, 'create'])->name('register');
    Route::post('register', [AgencyRegisterController::class, 'store'])->name('register.store');
    Route::post('check-availability', [AgencyRegisterController::class, 'checkAvailability'])->name('check.availability');
});

// Employer Registration Routes (Public)
Route::prefix('employer')->name('employer.')->group(function () {
    Route::get('register', [EmployerRegisterController::class, 'create'])->name('register');
    Route::post('register', [EmployerRegisterController::class, 'store'])->name('register.store');
});

// Role-specific dashboards
Route::middleware(['auth', 'verified', 'role:employer'])->group(function () {
    Route::get('/employer/dashboard', function () {
        return Inertia::render('Employer/Dashboard');
    })->name('employer.dashboard');
});

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard');
});

Route::middleware(['auth', 'verified', 'role:maid'])->group(function () {
    Route::get('/maid/dashboard', function () {
        return Inertia::render('Maid/Dashboard');
    })->name('maid.dashboard');
});

Route::middleware(['auth', 'verified', 'role:agency'])->group(function () {
    Route::get('/agency/dashboard', [AgencyRegisterController::class, 'dashboard'])->name('agency.dashboard');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified', 'role:employer'])->prefix('employer')->name('employer.')->group(function () {
    // Job Postings CRUD
    Route::resource('job-postings', JobPostingController::class)
        ->except(['show', 'destroy']); // You can add/remove as needed

    // Archive and Archived routes for job postings
    Route::patch('job-postings/{jobPosting}/archive', [JobPostingController::class, 'archive'])->name('job-postings.archive');
    Route::get('job-postings-archived', [JobPostingController::class, 'archived'])->name('job-postings.archived');

    // Bonuses
    Route::resource('job-postings.bonuses', BonusController::class)
        ->shallow()
        ->except(['show', 'destroy']);
    Route::patch('bonuses/{bonus}/archive', [BonusController::class, 'archive'])->name('bonuses.archive');
    Route::get('job-postings/{jobPosting}/bonuses-archived', [BonusController::class, 'archived'])->name('bonuses.archived');

    // Locations
    Route::resource('job-postings.locations', LocationController::class)
        ->shallow()
        ->except(['show', 'destroy']);
    Route::patch('locations/{location}/archive', [LocationController::class, 'archive'])->name('locations.archive');
    Route::get('job-postings/{jobPosting}/locations-archived', [LocationController::class, 'archived'])->name('locations.archived');

    // Photos
    Route::resource('job-postings.photos', PhotoController::class)
        ->shallow()
        ->except(['show', 'destroy']);
    Route::patch('photos/{photo}/archive', [PhotoController::class, 'archive'])->name('photos.archive');
    Route::get('job-postings/{jobPosting}/photos-archived', [PhotoController::class, 'archived'])->name('photos.archived');
});

require __DIR__ . '/auth.php';
