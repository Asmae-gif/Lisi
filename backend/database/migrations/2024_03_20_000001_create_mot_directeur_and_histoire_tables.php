<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Création de la table mot_directeur si elle n'existe pas
        if (!Schema::hasTable('mot_directeur')) {
            Schema::create('mot_directeur', function (Blueprint $table) {
                $table->id();
                $table->string('titre');
                $table->text('contenu');
                $table->string('image')->nullable();
                $table->string('nom_directeur');
                $table->string('poste');
                $table->timestamps();
            });
        }

        // Création de la table histoire si elle n'existe pas
        if (!Schema::hasTable('histoire')) {
            Schema::create('histoire', function (Blueprint $table) {
                $table->id();
                $table->string('titre');
                $table->text('contenu');
                $table->string('image')->nullable();
                $table->date('date');
                $table->integer('ordre')->default(0);
                $table->timestamps();
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('mot_directeur');
        Schema::dropIfExists('histoire');
    }
}; 