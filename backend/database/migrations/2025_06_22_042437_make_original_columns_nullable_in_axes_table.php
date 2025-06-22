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
        Schema::table('axes', function (Blueprint $table) {
            // Make original columns nullable since we're using multilingual columns
            $table->string('title')->nullable()->change();
            $table->text('problematique')->nullable()->change();
            $table->text('objectif')->nullable()->change();
            $table->text('approche')->nullable()->change();
            $table->text('resultats_attendus')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('axes', function (Blueprint $table) {
            // Revert to not nullable
            $table->string('title')->nullable(false)->change();
            $table->text('problematique')->nullable(false)->change();
            $table->text('objectif')->nullable(false)->change();
            $table->text('approche')->nullable(false)->change();
            $table->text('resultats_attendus')->nullable(false)->change();
        });
    }
};
