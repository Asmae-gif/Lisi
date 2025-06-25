<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Migrer les données existantes vers les nouvelles colonnes multilingues
        DB::table('prix_distinctions')->whereNull('titre_fr')->update([
            'titre_fr' => DB::raw('titre'),
            'description_fr' => DB::raw('description')
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Pas de rollback nécessaire car on ne supprime pas les anciennes colonnes
    }
};
