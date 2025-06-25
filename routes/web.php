<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\AgencyRegisterController;
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

// Role-specific dashboards
Route::middleware(['auth', 'verified', 'role:employer'])->group(function () {
    Route::get('/employer/dashboard', function () {
        return Inertia::render('Employer/Dashboard');
    })->name('employer.dashboard');
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

require __DIR__ . '/auth.php';
