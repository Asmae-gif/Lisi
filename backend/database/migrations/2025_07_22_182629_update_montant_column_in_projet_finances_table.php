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
        Schema::table('projet_finances', function (Blueprint $table) {
            // Attention : nécessite doctrine/dbal pour modifier une colonne
            $table->unsignedBigInteger('montant')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projet_finances', function (Blueprint $table) {
            // Revenir à la version précédente (par exemple unsignedInteger)
            $table->unsignedInteger('montant')->change();
        });
    }
};
