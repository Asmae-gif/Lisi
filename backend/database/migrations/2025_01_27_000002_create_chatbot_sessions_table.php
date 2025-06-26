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
        Schema::create('chatbot_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('session_id')->unique();
            $table->integer('duration'); // en millisecondes
            $table->integer('total_messages');
            $table->string('page_url');
            $table->text('user_agent');
            $table->timestamp('start_time');
            $table->timestamp('end_time');
            $table->timestamps();

            $table->index('session_id');
            $table->index('start_time');
            $table->index('end_time');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chatbot_sessions');
    }
}; 