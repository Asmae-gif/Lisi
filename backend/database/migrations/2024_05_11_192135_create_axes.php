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
         // Création de la table "axes"
        Schema::create('axes', function (Blueprint $table) {
            // Clé primaire auto-incrémentée (BIGINT UNSIGNED)
            $table->id();
            // Slug unique permettant d'identifier l’axe dans les URLs (ex : "recherche-ia")
            // ->unique() crée un index UNIQUE pour éviter les doublons.
            $table->string('slug')->unique();         
            $table->string('title');                  
            $table->string('icon')->nullable();       
            // 4 blocs de contenu
            $table->text('problematique')->nullable();
            $table->text('objectif')->nullable();
            $table->text('approche')->nullable();
            $table->text('resultats_attendus')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('axes');
    }
};
