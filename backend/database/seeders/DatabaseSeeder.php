<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Membre;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
        ]);

        // Créer un admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@univ.fr'],
            [
                'name' => 'Admin Principal',
                'password' => Hash::make('admin123'),
            ]
        );
        $admin->assignRole('admin');
        $admin->is_approved = true;
$admin->save();

        // Créer un utilisateur spécifique
        $utilisateur = User::firstOrCreate(
            ['email' => 'enseignant@univ.fr'],
            [
                'name' => 'Enseignant Test',
                'password' => Hash::make('enseignant123'),
            ]
        );
        
        $utilisateur->assignRole('membre');

        if (!$utilisateur->membre) {
            $utilisateur->membre()->create([
                'nom' => 'Test',
                'prenom' => 'Enseignant',
                'statut' => 'enseignant',
            ]);
        }

        // Créer 10 utilisateurs + leur page pro + assigner le rôle
        if (User::count() < 12) { // Only create additional users if we don't have enough
            User::factory()
                ->configure()
                ->count(10)
                ->create()
                ->each(fn($user) => $user->assignRole('membre'));
        }
    }
}
