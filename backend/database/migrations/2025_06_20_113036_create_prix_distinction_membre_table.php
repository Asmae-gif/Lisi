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
        Schema::create('prix_distinction_membre', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prix_distinction_id')->constrained('prix_distinctions')->onDelete('cascade');
            $table->foreignId('membre_id')->constrained('membres')->onDelete('cascade');
            $table->string('role')->nullable(); // 'gagnant', 'co-gagnant', 'mention honorable', etc.
            $table->integer('ordre')->default(0); // Pour ordonner les membres
            $table->timestamps();
            
            // Index pour optimiser les requêtes
            $table->index(['prix_distinction_id', 'membre_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prix_distinction_membre');
    }
};
