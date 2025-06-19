<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            $user = Auth::user();
            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'message' => 'Connexion réussie'
            ])->cookie(
                'auth_token',
                $token,
                60 * 24, // 24 heures
                '/',
                null,
                true, // Secure
                true  // HTTPOnly
            );
        }

        return response()->json([
            'message' => 'Identifiants invalides'
        ], 401);
    }
} 