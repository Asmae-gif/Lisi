<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Membre;
use Illuminate\Support\Facades\Cache;
use App\Models\Publication;
use App\Models\Project;
use App\Models\Axe;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->hasRole('admin')) {
            // Dashboard admin : statistiques globales
            return response()->json([
                'total_users' => User::count(),
                'total_pages' => Membre::count(),
                'blocked_users' => User::where('is_blocked', true)->count(),
            ]);
        }

        // Dashboard utilisateur : info personnelle
        return response()->json([
            'user' => $user,
            'membre' => $user->membre,
        ]);
    }

    /**
     * Get public statistics
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function publicStats()
    {
        try {
            $stats = Cache::remember('public_stats', 60 * 5, function () {
                return [
                    'membres' => Membre::count(),
                    'publications' => Publication::count(),
                    'projets' => Project::count(),
                    'axes' => Axe::count(),
                    'last_update' => now()->toISOString()
                ];
            });

            return response()->json($stats);
        } catch (\Exception $e) {
            return response()->json([
                'membres' => 0,
                'publications' => 0,
                'projets' => 0,
                'axes' => 0,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
