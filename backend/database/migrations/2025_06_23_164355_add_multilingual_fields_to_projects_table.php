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
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['name', 'description']);
            $table->string('name_fr')->nullable()->after('id');
            $table->string('name_en')->nullable()->after('name_fr');
            $table->string('name_ar')->nullable()->after('name_en');
            $table->text('description_fr')->nullable()->after('name_ar');
            $table->text('description_en')->nullable()->after('description_fr');
            $table->text('description_ar')->nullable()->after('description_en');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn([
                'name_fr',
                'name_en',
                'name_ar',
                'description_fr',
                'description_en',
                'description_ar',
            ]);
        });
    }
};
