<?php

use App\Http\Controllers\AuditRequestController;
use App\Http\Controllers\BrandLogoImageController;
use App\Http\Controllers\Dashboard\AuditRequestController as DashboardAuditRequestController;
use App\Http\Controllers\Dashboard\BrandLogoController as DashboardBrandLogoController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Dashboard\SiteAppearanceController;
use App\Http\Controllers\Dashboard\TeamMemberController as DashboardTeamMemberController;
use App\Http\Controllers\Dashboard\UserController as DashboardUserController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\SiteAppearanceLogoController;
use App\Http\Controllers\TeamMemberPhotoController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PageController::class, 'landing'])->name('home');
Route::get('/blog', [PageController::class, 'blog'])->name('blog');
Route::get('/thank-you', [PageController::class, 'thankYou'])->name('thank-you');

Route::post('/audit-requests', AuditRequestController::class)
    ->middleware('throttle:5,1')
    ->name('audit-requests.store');

Route::get('/brand-logos/{brandLogo}/image', BrandLogoImageController::class)
    ->name('brand-logos.image');
Route::get('/team-members/{teamMember}/photo', TeamMemberPhotoController::class)
    ->name('team-members.photo');
Route::get('/site-appearance/logo/{mode}', SiteAppearanceLogoController::class)
    ->whereIn('mode', ['light', 'dark'])
    ->name('site-appearance.logo');

Route::middleware(['auth', 'dashboard.role'])
    ->prefix('dashboard')
    ->name('dashboard.')
    ->group(function () {
        Route::get('/', DashboardController::class)->name('index');
        Route::get('/audit-requests', [DashboardAuditRequestController::class, 'index'])
            ->name('audit-requests.index');

        Route::middleware('admin')->group(function () {
            Route::resource('brand-logos', DashboardBrandLogoController::class)
                ->only(['index', 'store', 'update', 'destroy']);
            Route::resource('team-members', DashboardTeamMemberController::class)
                ->only(['index', 'store', 'update', 'destroy']);
            Route::get('/appearance', [SiteAppearanceController::class, 'edit'])
                ->name('appearance.edit');
            Route::put('/appearance', [SiteAppearanceController::class, 'update'])
                ->name('appearance.update');
            Route::delete('/appearance', [SiteAppearanceController::class, 'reset'])
                ->name('appearance.reset');
            Route::resource('users', DashboardUserController::class)->except('show');
        });
    });

Route::get('/{document}', [PageController::class, 'legal'])
    ->whereIn('document', [
        'privacy-policy',
        'terms-and-conditions',
        'cookie-policy',
        'data-processing-agreement',
    ])
    ->name('legal.show');
