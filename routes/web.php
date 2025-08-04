<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Auth & Registration Controllers
use App\Http\Controllers\Auth\AgencyRegisterController;
use App\Http\Controllers\Auth\EmployerRegisterController;

// Employer Controllers
use App\Http\Controllers\Employer\JobPostingController;
use App\Http\Controllers\Employer\Profile\ProfileUpdateController;
use App\Http\Controllers\Employer\Profile\EmployerUpdateController;
use App\Http\Controllers\Employer\Profile\EmployerChildUpdateController;
use App\Http\Controllers\Employer\Profile\EmployerPetUpdateController;
use App\Http\Controllers\Employer\JobApplicationController;
use \App\Http\Controllers\Employer\ShortlistRankingController;
use App\Http\Controllers\Employer\HiredApplicantsController;

// Agency Controllers
use App\Http\Controllers\Agency\MaidController;
use App\Http\Controllers\Agency\Profile\UpdateController;
use App\Http\Controllers\Agency\Profile\PhotoUpdateController;
use App\Http\Controllers\Agency\SettingUpdateController;
use App\Http\Controllers\Agency\ApplicationsController;

// Browse Controllers
use App\Http\Controllers\Browse\ForJobPostsController;
use App\Http\Controllers\JobApplication\AgencyJobApplicationController;
use App\Http\Controllers\Browse\EmployerPageController;
use App\Http\Controllers\Browse\AgencyPageController;
use App\Http\Controllers\Browse\MaidPageController;

// General Controllers
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserPhotoController;

// Report Controller
use App\Http\Controllers\UserReportController;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

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

Route::middleware(['auth', 'verified', 'role:agency'])->prefix('agency')->name('agency.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Agency/Dashboard');
    })->name('dashboard');

    // Maid CRUD for agency, except show
    Route::resource('maids', MaidController::class)
        ->except(['show'])
        ->parameters(['maids' => 'agencyMaid']);
    Route::patch('maids/{user}/archive', [MaidController::class, 'archive'])->name('maids.archive');
    Route::post('maids/{user}/update-avatar', [MaidController::class, 'updateAvatar'])->name('maids.update-avatar');

    // Agency Profile Settings (user, agency info, and photos in one page)
    Route::prefix('settings/profile')->name('settings.profile.')->group(function () {
        Route::get('/', [UpdateController::class, 'index'])->name('index');
        Route::patch('/user', [UserController::class, 'update'])->name('user.update');
        Route::patch('/{agency}', [UpdateController::class, 'update'])->name('update');

        // Agency Photos under profile settings
        Route::resource('photos', PhotoUpdateController::class)
            ->only(['store', 'update', 'destroy'])
            ->names([
                'store' => 'photos.store',
                'update' => 'photos.update',
                'destroy' => 'photos.destroy',
            ]);
    });

    // Agency Settings (configuration)
    Route::patch('settings/configuration/{setting}', [SettingUpdateController::class, 'update'])->name('settings.configuration.update');

    // Agency Applications Page
    Route::get('applications', [ApplicationsController::class, 'index'])->name('applications.index');
    Route::post('applications/{application}/mark-as-hired', [ApplicationsController::class, 'markAsHired'])->name('applications.markAsHired');
    Route::post('applications/{application}/cancel', [ApplicationsController::class, 'cancel'])->name('applications.cancel');
});

Route::middleware(['auth', 'verified', 'role:employer'])->prefix('employer')->name('employer.')->group(function () {
    // Job Postings CRUD
    Route::resource('job-postings', JobPostingController::class)
        ->except(['show', 'destroy']);

    // Archive and Archived routes for job postings
    Route::patch('job-postings/{jobPosting}/archive', [JobPostingController::class, 'archive'])->name('job-postings.archive');
    Route::get('job-postings-archived', [JobPostingController::class, 'archived'])->name('job-postings.archived');

    // Employer Job Applications Page
    Route::get('job-applications', [JobApplicationController::class, 'index'])->name('job-applications.index');
    Route::patch('job-applications/{application}/status', [JobApplicationController::class, 'updateStatus'])->name('job-applications.update-status');

    // Shortlist Ranking Page
    Route::get('shortlist-ranking', [ShortlistRankingController::class, 'index'])
        ->name('shortlist-ranking.index');
    Route::post('shortlist-ranking/update', [ShortlistRankingController::class, 'updateRankings'])
        ->name('shortlist-ranking.update');

    // Hired Applicants Page
    Route::get('hired-applicants', [HiredApplicantsController::class, 'index'])
        ->name('hired-applicants.index');

    Route::get('/profile', [ProfileUpdateController::class, 'index'])->name('profile.index');

    // Employer Profile Update routes
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::patch('/user', [UserController::class, 'update'])->name('user.update');
        Route::patch('/profile', [ProfileUpdateController::class, 'update'])->name('profile.update');
        Route::patch('/employer', [EmployerUpdateController::class, 'update'])->name('employer.update');

        // Use resource for children and pets
        Route::resource('child', EmployerChildUpdateController::class)
            ->only(['update', 'store', 'destroy'])
            ->parameters(['child' => 'child'])
            ->names([
                'update' => 'child.update',
                'store' => 'child.store',
                'destroy' => 'child.destroy',
            ]);

        Route::resource('pet', EmployerPetUpdateController::class)
            ->only(['update', 'store', 'destroy'])
            ->parameters(['pet' => 'pet'])
            ->names([
                'update' => 'pet.update',
                'store' => 'pet.store',
                'destroy' => 'pet.destroy',
            ]);
    });
});

Route::middleware(['auth'])->prefix('browse')->name('browse.')->group(function () {

    // Job Posts Routes
    Route::get('job-posts', [ForJobPostsController::class, 'index'])
        ->name('job-posts.index');

    Route::get('job-posts/near-you', [ForJobPostsController::class, 'nearYou'])
        ->name('job-posts.near-you');
    Route::get('job-posts/recommended', [ForJobPostsController::class, 'recommended'])
        ->name('job-posts.recommended');
    Route::get('job-applications/{jobPost}', [AgencyJobApplicationController::class, 'show'])
        ->name('job-applications.show');
    Route::post('job-applications/{jobPost}/apply', [AgencyJobApplicationController::class, 'apply'])
        ->name('job-applications.apply');

    Route::get('/employers/{id}', [EmployerPageController::class, 'show'])
        ->name('employers.show');
    Route::get('/agencies/{id}', [AgencyPageController::class, 'show'])
        ->name('agencies.show');
    Route::get('/maids/{id}', [MaidPageController::class, 'show'])
        ->name('maids.show');
});

// User Photos Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('user-photos', UserPhotoController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->names([
            'index' => 'user-photos.index',
            'store' => 'user-photos.store',
            'update' => 'user-photos.update',
            'destroy' => 'user-photos.destroy',
        ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/report/user/{user}', [UserReportController::class, 'create'])
        ->name('report.user.create');
    Route::post('/report/user', [UserReportController::class, 'store'])
        ->name('report.user.store');
});


require __DIR__ . '/auth.php';
