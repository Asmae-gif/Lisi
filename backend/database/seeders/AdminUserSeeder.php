<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Vérifier si l'utilisateur admin existe déjà
        $adminUser = User::where('email', 'admin@lisi.com')->first();
        
        if (!$adminUser) {
            // Créer l'utilisateur admin
            User::create([
                'name' => 'Administrateur LISI',
                'email' => 'admin@lisi.com',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
                'is_admin' => true,
            ]);

            $this->command->info('Utilisateur admin créé avec succès !');
        } else {
            // Mettre à jour le mot de passe si l'utilisateur existe
            $adminUser->update([
                'password' => Hash::make('password123'),
                'is_admin' => true,
            ]);

            $this->command->info('Utilisateur admin mis à jour avec succès !');
        }

        $this->command->info('Email: admin@lisi.com');
        $this->command->info('Mot de passe: password123');
    }
}
