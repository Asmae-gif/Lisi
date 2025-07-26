<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Seeder des rôles et permissions uniquement
        $this->call([
            RolePermissionSeeder::class,
        ]);
    }
}
