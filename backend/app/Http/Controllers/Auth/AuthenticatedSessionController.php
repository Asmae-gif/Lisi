<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cookie;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request (mode SPA‐cookie).
     */
    public function store(Request $request)
    {
        try {
            // 1. Validation
            $credentials = $request->validate([
                'email'    => ['required', 'email'],
                'password' => ['required'],
            ]);

            // 2. Authentifier l'utilisateur (création de la session)
            if (Auth::attempt($credentials)) {
                // Auth::attempt met automatiquement en place la session (cookie de session)
                $user = Auth::user();
                $token = $user->createToken('auth-token')->plainTextToken;

                // 3. Vérifier les flags métiers
                if ($user->is_blocked) {
                    Auth::logout();
                    return response()->json([
                        'status'  => 'error',
                        'message' => 'Votre compte a été bloqué par un administrateur.'
                    ], 403);
                }
                if (! $user->is_approved && ! $user->isAdmin()) {
                    Auth::logout();
                    return response()->json([
                        'status'  => 'error',
                        'message' => 'Votre compte est en attente de validation par un administrateur.'
                    ], 403);
                }
                
                // On ne retourne plus de redirect_url, le frontend gère la redirection
                return response()->json([
                    'status' => 'success',
                    'access_token' => $token,
                    'token_type' => 'Bearer',
                    'user' => $user->load(['roles', 'membre']),
                    'type' => $user->roles->pluck('name')->contains('admin') ? 'admin' : 'membre',
                ], 200);
            }

            return response()->json([
                'status'  => 'error',
                'message' => 'Les identifiants fournis sont incorrects.'
            ], 401);

        } catch (\Exception $e) {
            Log::error('Authentication error', [
                'message' => $e->getMessage(),
                'trace'   => $e->getTraceAsString()
            ]);

            return response()->json([
                'status'  => 'error',
                'message' => 'Une erreur est survenue lors de la connexion.'
            ], 500);
        }
    }

    /**
     * Destroy an authenticated session (mode SPA‐cookie).
     */
    public function destroy(Request $request)
    {
        // Gère à la fois la déconnexion basée sur les cookies et les jetons
        Auth::guard('web')->logout();

        if ($request->user()) {
            $request->user()->tokens()->delete();
        }
        
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // 2. Préparer la suppression des cookies côté client
        //    : XSRF-TOKEN et laravel_session
        $cookieXSRF  = Cookie::forget('XSRF-TOKEN');
        $cookieSess  = Cookie::forget('laravel_session');

        // 3. Répondre en JSon avec les instructions pour effacer les cookies
        return response()->json([
            'status'  => 'success',
            'message' => 'Déconnexion réussie.',
        ])
        ->withCookie($cookieXSRF)
        ->withCookie($cookieSess);
    }
}
