<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(){
    Schema::create('prix_distinctions', function (Blueprint $table) {
        $table->id();
        $table->string('titre_fr');
        $table->string('titre_en')->nullable();
        $table->string('titre_ar')->nullable();
        $table->text('description_fr')->nullable();
        $table->text('description_en')->nullable();
        $table->text('description_ar')->nullable();
        $table->date('date_obtention');
        $table->string('organisme')->nullable();
        $table->string('image_url')->nullable();
        $table->string('lien_externe')->nullable();
        $table->foreignId('membre_id')->constrained()->onDelete('cascade');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prix_distinctions');
    }
};
