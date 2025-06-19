<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        // Réinitialiser les rôles et permissions en cache
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Créer les permissions
        $permissions = [
            'user_management',
            'role_management',
            'permission_management',
            'publication_management',
            'projet_management',
            'theme_management',
            'membre_management'
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Créer le rôle admin s'il n'existe pas
        $adminRole = Role::firstOrCreate(['name' => 'admin']);

        // Donner toutes les permissions au rôle admin
        $adminRole->givePermissionTo(Permission::all());

        // Créer le rôle membre s'il n'existe pas
        $membreRole = Role::firstOrCreate(['name' => 'membre']);

        // Donner des permissions spécifiques au rôle membre
        $membreRole->givePermissionTo([
            'publication_management',
            'projet_management',
            'theme_management'
        ]);
    }
}
