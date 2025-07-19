<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Membre;
use Illuminate\Support\Str;

class MembreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $membres = [
            [
                'nom' => 'Dupont',
                'prenom' => 'Jean',
                'email' => 'jean.dupont@lisi.com',
                'statut' => 'actif',
                'biographie' => 'Spécialiste en IA et machine learning avec plus de 15 ans d\'expérience.'
            ],
            [
                'nom' => 'Martin',
                'prenom' => 'Marie',
                'email' => 'marie.martin@lisi.com',
                'statut' => 'actif',
                'biographie' => 'Experte en systèmes distribués et architectures cloud.',
                
            ],
            [
                'nom' => 'Bernard',
                'prenom' => 'Pierre',
                'email' => 'pierre.bernard@lisi.com',
                'statut' => 'actif',
                'biographie' => 'Chercheur en cybersécurité et cryptographie.',
                
            ],
            [
                'nom' => 'Petit',
                'prenom' => 'Sophie',
                'email' => 'sophie.petit@lisi.com',
                'statut' => 'actif',
                'biographie' => 'Spécialiste en traitement de données massives et analytics.',
            ],
            [
                'nom' => 'Robert',
                'prenom' => 'Claude',
                'email' => 'claude.robert@lisi.com',
                'statut' => 'actif',
                'biographie' => 'Expert en réseaux 5G et technologies de communication.',
            ]
        ];

        foreach ($membres as $membre) {
            Membre::create($membre);
        }

        $this->command->info('Membres créés avec succès !');
    }
}
