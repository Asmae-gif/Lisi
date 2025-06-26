<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ChatbotAnalyticsController extends Controller
{
    /**
     * Stocker une interaction du chatbot
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'id' => 'required|string',
                'timestamp' => 'required|date',
                'userMessage' => 'required|string',
                'botResponse' => 'required|string',
                'sessionId' => 'required|string',
                'pageUrl' => 'required|url',
                'userAgent' => 'required|string',
                'interactionType' => 'required|in:message,quick_action,session_start',
                'responseTime' => 'required|integer|min:0',
            ]);

            // Stocker dans la base de données
            DB::table('chatbot_interactions')->insert([
                'interaction_id' => $validated['id'],
                'session_id' => $validated['sessionId'],
                'timestamp' => Carbon::parse($validated['timestamp']),
                'user_message' => $validated['userMessage'],
                'bot_response' => $validated['botResponse'],
                'page_url' => $validated['pageUrl'],
                'user_agent' => $validated['userAgent'],
                'interaction_type' => $validated['interactionType'],
                'response_time' => $validated['responseTime'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Log pour debugging
            Log::info('Chatbot interaction stored', [
                'session_id' => $validated['sessionId'],
                'interaction_type' => $validated['interactionType'],
                'user_message' => substr($validated['userMessage'], 0, 100) . '...',
            ]);

            return response()->json(['message' => 'Interaction stored successfully'], 201);

        } catch (\Exception $e) {
            Log::error('Error storing chatbot interaction', [
                'error' => $e->getMessage(),
                'data' => $request->all()
            ]);

            return response()->json(['error' => 'Failed to store interaction'], 500);
        }
    }

    /**
     * Stocker un résumé de session du chatbot
     */
    public function storeSessionSummary(Request $request)
    {
        try {
            $validated = $request->validate([
                'sessionId' => 'required|string',
                'duration' => 'required|integer|min:0',
                'totalMessages' => 'required|integer|min:0',
                'pageUrl' => 'required|url',
                'userAgent' => 'required|string',
                'startTime' => 'required|date',
                'endTime' => 'required|date',
            ]);

            // Stocker dans la base de données
            DB::table('chatbot_sessions')->insert([
                'session_id' => $validated['sessionId'],
                'duration' => $validated['duration'],
                'total_messages' => $validated['totalMessages'],
                'page_url' => $validated['pageUrl'],
                'user_agent' => $validated['userAgent'],
                'start_time' => Carbon::parse($validated['startTime']),
                'end_time' => Carbon::parse($validated['endTime']),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Log pour debugging
            Log::info('Chatbot session summary stored', [
                'session_id' => $validated['sessionId'],
                'duration' => $validated['duration'],
                'total_messages' => $validated['totalMessages'],
            ]);

            return response()->json(['message' => 'Session summary stored successfully'], 201);

        } catch (\Exception $e) {
            Log::error('Error storing chatbot session summary', [
                'error' => $e->getMessage(),
                'data' => $request->all()
            ]);

            return response()->json(['error' => 'Failed to store session summary'], 500);
        }
    }

    /**
     * Obtenir les statistiques du chatbot (pour l'admin)
     */
    public function getStats()
    {
        try {
            // Statistiques générales
            $totalSessions = DB::table('chatbot_sessions')->count();
            $totalInteractions = DB::table('chatbot_interactions')->count();
            $avgSessionDuration = DB::table('chatbot_sessions')->avg('duration');
            $avgMessagesPerSession = DB::table('chatbot_sessions')->avg('total_messages');

            // Questions les plus populaires
            $popularQuestions = DB::table('chatbot_interactions')
                ->where('interaction_type', 'message')
                ->where('user_message', '!=', '')
                ->select('user_message', DB::raw('count(*) as count'))
                ->groupBy('user_message')
                ->orderBy('count', 'desc')
                ->limit(10)
                ->get();

            // Statistiques par jour (7 derniers jours)
            $dailyStats = DB::table('chatbot_interactions')
                ->select(
                    DB::raw('DATE(timestamp) as date'),
                    DB::raw('count(*) as interactions'),
                    DB::raw('count(DISTINCT session_id) as sessions')
                )
                ->where('timestamp', '>=', Carbon::now()->subDays(7))
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            return response()->json([
                'total_sessions' => $totalSessions,
                'total_interactions' => $totalInteractions,
                'avg_session_duration' => round($avgSessionDuration / 1000, 2), // en secondes
                'avg_messages_per_session' => round($avgMessagesPerSession, 2),
                'popular_questions' => $popularQuestions,
                'daily_stats' => $dailyStats,
            ]);

        } catch (\Exception $e) {
            Log::error('Error getting chatbot stats', [
                'error' => $e->getMessage()
            ]);

            return response()->json(['error' => 'Failed to get stats'], 500);
        }
    }
} 