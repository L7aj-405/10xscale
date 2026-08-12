<?php

namespace App\Providers;

use App\Contracts\TeamMemberTranslator;
use App\Services\GoogleTeamMemberTranslator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(TeamMemberTranslator::class, GoogleTeamMemberTranslator::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
