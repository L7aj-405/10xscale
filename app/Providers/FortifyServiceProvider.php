<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Fortify::loginView(fn () => Inertia::render('Auth/Login'));

        RateLimiter::for('login', function (Request $request) {
            $key = Str::transliterate(Str::lower($request->string(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($key);
        });
    }
}
