<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\Membre;
use App\Policies\MembrePolicy;
use App\Models\Axe;
use App\Policies\AxePolicy;
use App\Models\Setting;
use App\Policies\SettingPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Membre::class => MembrePolicy::class,
        Axe::class => AxePolicy::class,
        Setting::class => SettingPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
        
        Gate::define('manage-settings', function ($user) {
            \Log::info('Checking manage-settings permission', [
                'user_id' => $user->id,
                'user_roles' => $user->roles->pluck('name')->toArray(),
                'has_admin_role' => $user->hasRole('admin'),
                'is_admin' => $user->isAdmin()
            ]);
            return $user->hasRole('admin'); // ou votre logique de permission
        });
    }
}
