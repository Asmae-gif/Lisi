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
        Schema::create('axe_membre', function (Blueprint $table) {
            $table->id();
            $table->foreignId('membre_id')->constrained()->onDelete('cascade');
            $table->foreignId('axe_id')->constrained()->onDelete('cascade');
            $table->string('position')->nullable(); // Position dans l'axe (Chercheur, Doctorant, etc.)
            $table->timestamps();

            // Empêcher les doublons
            $table->unique(['membre_id', 'axe_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('axe_membre');
    }
}; 