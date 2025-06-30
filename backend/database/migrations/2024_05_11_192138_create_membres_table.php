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
        Schema::create('membres', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
                $table->string('nom');
                $table->string('prenom');
                $table->string('statut')->nullable();
                $table->string('email')->nullable();
                $table->text('biographie')->nullable();
                $table->string('photo')->nullable();
                $table->string('slug')->unique();
                $table->string('google_id')->nullable()->unique();
                $table->string('linkedin')->nullable(); 
                $table->string('researchgate')->nullable();
                $table->string('google_scholar')->nullable();
                $table->string('grade')->nullable();
                $table->boolean('is_comite')->default(false);

                $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('membres');
    }
};
