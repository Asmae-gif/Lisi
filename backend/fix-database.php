<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

// Charger l'application Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Diagnostic de la base de données ===\n";

try {
    // Vérifier la connexion à la base de données
    echo "1. Test de connexion à la base de données...\n";
    DB::connection()->getPdo();
    echo "✅ Connexion à la base de données réussie\n";
    
    // Vérifier les tables
    echo "\n2. Vérification des tables...\n";
    
    $tables = ['users', 'membres', 'publications', 'projects', 'mot_directeur', 'histoire'];
    
    foreach ($tables as $table) {
        if (Schema::hasTable($table)) {
            $count = DB::table($table)->count();
            echo "✅ Table '$table' existe avec $count enregistrements\n";
        } else {
            echo "❌ Table '$table' n'existe pas\n";
        }
    }
    
    // Créer les tables manquantes
    echo "\n3. Création des tables manquantes...\n";
    
    if (!Schema::hasTable('mot_directeur')) {
        Schema::create('mot_directeur', function ($table) {
            $table->id();
            $table->string('titre');
            $table->text('contenu');
            $table->string('image')->nullable();
            $table->string('nom_directeur');
            $table->string('poste');
            $table->timestamps();
        });
        echo "✅ Table 'mot_directeur' créée\n";
    }
    
    if (!Schema::hasTable('histoire')) {
        Schema::create('histoire', function ($table) {
            $table->id();
            $table->string('titre');
            $table->text('contenu');
            $table->string('image')->nullable();
            $table->date('date');
            $table->integer('ordre')->default(0);
            $table->timestamps();
        });
        echo "✅ Table 'histoire' créée\n";
    }
    
    // Test des modèles
    echo "\n4. Test des modèles...\n";
    
    try {
        $membreCount = \App\Models\Membre::count();
        echo "✅ Modèle Membre fonctionne: $membreCount membres\n";
    } catch (Exception $e) {
        echo "❌ Erreur avec le modèle Membre: " . $e->getMessage() . "\n";
    }
    
    try {
        $publicationCount = \App\Models\Publication::count();
        echo "✅ Modèle Publication fonctionne: $publicationCount publications\n";
    } catch (Exception $e) {
        echo "❌ Erreur avec le modèle Publication: " . $e->getMessage() . "\n";
    }
    
    try {
        $projectCount = \App\Models\Project::count();
        echo "✅ Modèle Project fonctionne: $projectCount projets\n";
    } catch (Exception $e) {
        echo "❌ Erreur avec le modèle Project: " . $e->getMessage() . "\n";
    }
    
    try {
        $motDirecteurCount = \App\Models\MotDirecteur::count();
        echo "✅ Modèle MotDirecteur fonctionne: $motDirecteurCount mot du directeur\n";
    } catch (Exception $e) {
        echo "❌ Erreur avec le modèle MotDirecteur: " . $e->getMessage() . "\n";
    }
    
    try {
        $histoireCount = \App\Models\Histoire::count();
        echo "✅ Modèle Histoire fonctionne: $histoireCount histoires\n";
    } catch (Exception $e) {
        echo "❌ Erreur avec le modèle Histoire: " . $e->getMessage() . "\n";
    }
    
    echo "\n=== Diagnostic terminé ===\n";
    
} catch (Exception $e) {
    echo "❌ Erreur générale: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
} 