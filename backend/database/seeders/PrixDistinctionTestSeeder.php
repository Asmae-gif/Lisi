<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PrixDistinction;
use App\Models\Membre;

class PrixDistinctionTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer un prix de test
        $prix = PrixDistinction::create([
            'titre' => 'Prix de Recherche Excellence',
            'description' => 'Prix décerné pour l\'excellence en recherche',
            'date_obtention' => '2024-01-15',
            'organisme' => 'Académie des Sciences',
            'image_url' => null,
            'lien_externe' => null,
        ]);

        // Récupérer quelques membres
        $membres = Membre::take(2)->get();

        // Associer les membres au prix avec des rôles
        foreach ($membres as $index => $membre) {
            $prix->addMembre($membre, $index === 0 ? 'Gagnant principal' : 'Co-gagnant', $index + 1);
        }

        echo "Prix de test créé avec ID: " . $prix->id . "\n";
        echo "Membres associés: " . $membres->count() . "\n";
    }
}
