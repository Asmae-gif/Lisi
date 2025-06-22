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
        Schema::table('axes', function (Blueprint $table) {
            // Add multilingual columns for title
            $table->string('title_fr')->nullable()->after('title');
            $table->string('title_en')->nullable()->after('title_fr');
            $table->string('title_ar')->nullable()->after('title_en');
            
            // Add multilingual columns for problematique
            $table->text('problematique_fr')->nullable()->after('problematique');
            $table->text('problematique_en')->nullable()->after('problematique_fr');
            $table->text('problematique_ar')->nullable()->after('problematique_en');
            
            // Add multilingual columns for objectif
            $table->text('objectif_fr')->nullable()->after('objectif');
            $table->text('objectif_en')->nullable()->after('objectif_fr');
            $table->text('objectif_ar')->nullable()->after('objectif_en');
            
            // Add multilingual columns for approche
            $table->text('approche_fr')->nullable()->after('approche');
            $table->text('approche_en')->nullable()->after('approche_fr');
            $table->text('approche_ar')->nullable()->after('approche_en');
            
            // Add multilingual columns for resultats_attendus
            $table->text('resultats_attendus_fr')->nullable()->after('resultats_attendus');
            $table->text('resultats_attendus_en')->nullable()->after('resultats_attendus_fr');
            $table->text('resultats_attendus_ar')->nullable()->after('resultats_attendus_en');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('axes', function (Blueprint $table) {
            // Drop multilingual columns
            $table->dropColumn([
                'title_fr', 'title_en', 'title_ar',
                'problematique_fr', 'problematique_en', 'problematique_ar',
                'objectif_fr', 'objectif_en', 'objectif_ar',
                'approche_fr', 'approche_en', 'approche_ar',
                'resultats_attendus_fr', 'resultats_attendus_en', 'resultats_attendus_ar'
            ]);
        });
    }
};
