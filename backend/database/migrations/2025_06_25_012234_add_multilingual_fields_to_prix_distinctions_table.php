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
        Schema::table('prix_distinctions', function (Blueprint $table) {
            $table->string('titre_fr')->after('titre');
            $table->string('titre_en')->nullable()->after('titre_fr');
            $table->string('titre_ar')->nullable()->after('titre_en');
            $table->text('description_fr')->after('description');
            $table->text('description_en')->nullable()->after('description_fr');
            $table->text('description_ar')->nullable()->after('description_en');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prix_distinctions', function (Blueprint $table) {
            $table->dropColumn(['titre_fr', 'titre_en', 'titre_ar', 'description_fr', 'description_en', 'description_ar']);
        });
    }
};
