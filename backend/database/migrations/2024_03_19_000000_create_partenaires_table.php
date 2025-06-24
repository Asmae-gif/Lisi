<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('partenaires', function (Blueprint $table) {
            $table->id();
            $table->string('nom_fr');
            $table->string('nom_en')->nullable();
            $table->string('nom_ar')->nullable();
            $table->string('logo')->nullable();
            $table->string('lien');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('partenaires');
    }
}; 