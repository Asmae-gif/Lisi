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
                'telephone' => '0600000001',
                'statut' => 'actif',
                'slug' => 'jean-dupont',
                'grade' => 'Professeur',
                'specialite' => 'Intelligence Artificielle',
                'biographie' => 'Spécialiste en IA et machine learning avec plus de 15 ans d\'expérience.',
                'bureau' => 'A101'
            ],
            [
                'nom' => 'Martin',
                'prenom' => 'Marie',
                'email' => 'marie.martin@lisi.com',
                'telephone' => '0600000002',
                'statut' => 'actif',
                'slug' => 'marie-martin',
                'grade' => 'Maître de Conférences',
                'specialite' => 'Systèmes Distribués',
                'biographie' => 'Experte en systèmes distribués et architectures cloud.',
                'bureau' => 'A102'
            ],
            [
                'nom' => 'Bernard',
                'prenom' => 'Pierre',
                'email' => 'pierre.bernard@lisi.com',
                'telephone' => '0600000003',
                'statut' => 'actif',
                'slug' => 'pierre-bernard',
                'grade' => 'Docteur',
                'specialite' => 'Cybersécurité',
                'biographie' => 'Chercheur en cybersécurité et cryptographie.',
                'bureau' => 'A103'
            ],
            [
                'nom' => 'Petit',
                'prenom' => 'Sophie',
                'email' => 'sophie.petit@lisi.com',
                'telephone' => '0600000004',
                'statut' => 'actif',
                'slug' => 'sophie-petit',
                'grade' => 'Chargée de Recherche',
                'specialite' => 'Big Data',
                'biographie' => 'Spécialiste en traitement de données massives et analytics.',
                'bureau' => 'A104'
            ],
            [
                'nom' => 'Robert',
                'prenom' => 'Claude',
                'email' => 'claude.robert@lisi.com',
                'telephone' => '0600000005',
                'statut' => 'actif',
                'slug' => 'claude-robert',
                'grade' => 'Professeur',
                'specialite' => 'Réseaux et Télécommunications',
                'biographie' => 'Expert en réseaux 5G et technologies de communication.',
                'bureau' => 'A105'
            ]
        ];

        foreach ($membres as $membre) {
            Membre::create($membre);
        }

        $this->command->info('Membres créés avec succès !');
    }
}
