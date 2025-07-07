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
        Schema::create('chatbot_interactions', function (Blueprint $table) {
            $table->id();
            $table->string('interaction_id')->unique();
            $table->string('session_id');
            $table->timestamp('timestamp');
            $table->text('user_message');
            $table->text('bot_response');
            $table->string('page_url');
            $table->text('user_agent');
            $table->enum('interaction_type', ['message', 'quick_action', 'session_start']);
            $table->integer('response_time'); // en millisecondes
            $table->timestamps();

            $table->index('session_id');
            $table->index('timestamp');
            $table->index('interaction_type');
            
            // Clé étrangère vers chatbot_sessions
            $table->foreign('session_id')->references('session_id')->on('chatbot_sessions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chatbot_interactions');
    }
}; 