<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class AssignAdminRole extends Command
{
    protected $signature = 'user:make-admin {email}';
    protected $description = 'Assigne le rôle admin à un utilisateur';

    public function handle()
    {
        $email = $this->argument('email');
        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("Utilisateur non trouvé avec l'email : {$email}");
            return 1;
        }

        $user->assignRole('admin');
        $this->info("Rôle admin assigné à l'utilisateur : {$user->name}");
        return 0;
    }
} 