<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('galleries', function (Blueprint $table) {
            // Ajouter les colonnes multilingues pour le titre
            $table->string('title_fr')->nullable()->after('title');
            $table->string('title_en')->nullable()->after('title_fr');
            $table->string('title_ar')->nullable()->after('title_en');
            
            // Ajouter les colonnes multilingues pour la description
            $table->text('description_fr')->nullable()->after('description');
            $table->text('description_en')->nullable()->after('description_fr');
            $table->text('description_ar')->nullable()->after('description_en');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('galleries', function (Blueprint $table) {
            // Supprimer les colonnes multilingues
            $table->dropColumn([
                'title_fr',
                'title_en', 
                'title_ar',
                'description_fr',
                'description_en',
                'description_ar'
            ]);
        });
    }
};
