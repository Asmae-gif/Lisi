<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AssignAdminRole extends Command
{
    protected $signature = 'user:make-admin 
                            {email : Email de l\'utilisateur}
                            {--password=admin123 : Mot de passe si le compte est créé ou mis à jour}';

    protected $description = 'Crée un utilisateur (si nécessaire) et lui assigne le rôle admin';

    public function handle()
    {
        $email = $this->argument('email');
        $password = $this->option('password') ?? 'admin123';

        // Récupérer ou créer l'utilisateur
        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => 'Administrateur',
                'password' => Hash::make($password),
                'email_verified_at' => now(),
                'is_approved' => true,
            ]
        );

        // Si l'utilisateur existait déjà, mettre à jour le mot de passe + approbation
        if (!$user->wasRecentlyCreated) {
            $user->update([
                'password' => Hash::make($password),
                'is_approved' => true,
            ]);
            $this->info("ℹ️  Utilisateur existant mis à jour.");
        } else {
            $this->info("✅ Nouvel utilisateur admin créé.");
        }

        // Créer le rôle s’il n’existe pas et l’assigner
        $role = Role::firstOrCreate(['name' => 'admin']);
        $user->assignRole($role);
        if (!$user->membre) {
            $user->membre()->create([
                'nom' => 'Admin',
                'prenom' => 'LISI',
                'statut' => 'admin',
            ]);
            $this->info("📄 Profil Membre lié créé avec succès.");
        }
        
        $this->info("👤 Email : {$email}");
        $this->info("🔐 Mot de passe : {$password}");
        $this->info("🏷️  Rôle : admin");
    }
}
