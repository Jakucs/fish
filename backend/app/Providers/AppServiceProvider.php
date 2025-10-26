<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {

        // Admin vagy superadmin hozzáférés
        Gate::define('admin-access', function ($user) {
            return $user->role >= 1; // role=1 vagy role=2
        });
    }
}
