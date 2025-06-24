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
        Schema::table('publications', function (Blueprint $table) {
            // Supprimer les anciens champs monolingues
            $table->dropColumn(['titre_publication', 'resume', 'reference_complete']);
            
            // Ajouter les nouveaux champs multilingues
            $table->string('titre_publication_fr')->after('id');
            $table->string('titre_publication_en')->after('titre_publication_fr');
            $table->string('titre_publication_ar')->after('titre_publication_en');
            
            $table->text('resume_fr')->after('titre_publication_ar');
            $table->text('resume_en')->after('resume_fr');
            $table->text('resume_ar')->after('resume_en');
            
            $table->text('reference_complete_fr')->after('lien_externe_doi');
            $table->text('reference_complete_en')->after('reference_complete_fr');
            $table->text('reference_complete_ar')->after('reference_complete_en');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('publications', function (Blueprint $table) {
            // Supprimer les champs multilingues
            $table->dropColumn([
                'titre_publication_fr', 'titre_publication_en', 'titre_publication_ar',
                'resume_fr', 'resume_en', 'resume_ar',
                'reference_complete_fr', 'reference_complete_en', 'reference_complete_ar'
            ]);
            
            // Restaurer les anciens champs monolingues
            $table->string('titre_publication')->after('id');
            $table->text('resume')->after('titre_publication');
            $table->text('reference_complete')->after('lien_externe_doi');
        });
    }
};
