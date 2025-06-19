<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('formations', function (Blueprint $table) {
            $table->id();
            $table->string('titre_formation');
            $table->text('description_formation')->nullable();
            $table->date('date_debut');
            $table->date('date_fin');
            $table->string('lieu')->nullable();
            $table->string('type_formation')->default('formation');
            $table->string('statut_formation')->default('planifiee');
            $table->integer('nombre_places')->nullable();
            $table->string('formateur')->nullable();
            $table->text('objectifs')->nullable();
            $table->text('prerequis')->nullable();
            $table->text('programme')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('formations');
    }
}; 