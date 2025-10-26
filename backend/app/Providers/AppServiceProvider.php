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

            // Admin hozzáférés (admin és superadmin)
            Gate::define('admin-access', function ($user) {
                return $user->role >= 1; // 1 vagy 2
            });

            // Csak superadmin hozzáférés
            Gate::define('superadmin-access', function ($user) {
                return $user->role === 2;
            });
    }
}
