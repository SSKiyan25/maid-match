<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Auth & Registration Controllers
use App\Http\Controllers\Auth\AgencyRegisterController;
use App\Http\Controllers\Auth\EmployerRegisterController;

// Employer Controllers
use App\Http\Controllers\Employer\JobPostingController;
use App\Http\Controllers\Employer\Profile\UserUpdateController;
use App\Http\Controllers\Employer\Profile\ProfileUpdateController;
use App\Http\Controllers\Employer\Profile\EmployerUpdateController;
use App\Http\Controllers\Employer\Profile\EmployerChildUpdateController;
use App\Http\Controllers\Employer\Profile\EmployerPetUpdateController;

// Agency Controllers
use App\Http\Controllers\Agency\MaidController;
use App\Http\Controllers\Agency\Profile\UpdateController;
use App\Http\Controllers\Agency\Profile\PhotoUpdateController;
use App\Http\Controllers\Agency\SettingUpdateController;

// Browse Controllers
use App\Http\Controllers\Browse\ForJobPostsController;

// General Controllers
use App\Http\Controllers\UserController;


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
        Route::post('/photos', [PhotoUpdateController::class, 'store'])->name('photos.store');
        Route::patch('/photos/{photo}', [PhotoUpdateController::class, 'update'])->name('photos.update');
        Route::delete('/photos/{photo}', [PhotoUpdateController::class, 'destroy'])->name('photos.destroy');
    });


    // Agency Settings (configuration)
    Route::patch('settings/configuration/{setting}', [SettingUpdateController::class, 'update'])->name('settings.configuration.update');
});

Route::middleware(['auth', 'verified', 'role:employer'])->prefix('employer')->name('employer.')->group(function () {
    // Job Postings CRUD
    Route::resource('job-postings', JobPostingController::class)
        ->except(['show', 'destroy']);

    // Archive and Archived routes for job postings
    Route::patch('job-postings/{jobPosting}/archive', [JobPostingController::class, 'archive'])->name('job-postings.archive');
    Route::get('job-postings-archived', [JobPostingController::class, 'archived'])->name('job-postings.archived');

    Route::get('/profile', [UserUpdateController::class, 'index'])->name('profile.index');

    // Employer Profile Update routes
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::patch('/user', [UserUpdateController::class, 'update'])->name('user.update');
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

Route::prefix('browse')->name('browse.')->group(function () {
    Route::get('job-posts', [ForJobPostsController::class, 'index'])
        ->name('job-posts.index');

    Route::get('job-posts/near-you', [ForJobPostsController::class, 'nearYou'])
        ->name('job-posts.near-you');

    Route::get('job-posts/recommended', [ForJobPostsController::class, 'recommended'])
        ->name('job-posts.recommended');
});

require __DIR__ . '/auth.php';
