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
        Schema::table('partenaires', function (Blueprint $table) {
            $table->string('nom_fr')->after('nom');
            $table->string('nom_en')->nullable()->after('nom_fr');
            $table->string('nom_ar')->nullable()->after('nom_en');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('partenaires', function (Blueprint $table) {
            $table->dropColumn(['nom_fr', 'nom_en', 'nom_ar']);
        });
    }
};
