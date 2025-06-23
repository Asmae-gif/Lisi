<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Support\Str;

class RegisteredUserController extends Controller
{
    /**
     * Gère l'inscription d'un nouvel utilisateur + création du profil Membre.
     */
    public function store(Request $request): JsonResponse
    {
        // 1) Validation
        $request->validate([
            'prenom'   => ['required', 'string', 'max:255'],
            'nom'      => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'statut'   => ['required', 'string', 'max:255'],
        ]);

        // 2) Création du User
        $user = User::create([
            'name'        => "{$request->prenom} {$request->nom}",
            'email'       => $request->email,
            'password'    => Hash::make($request->password),
            'is_approved' => false,
            'is_blocked'  => false,
        ]);

        // 3) Assignation du rôle “membre”
        $user->assignRole('membre');

        // 4) Création du profil Membre
        $user->membre()->create([
            'prenom'        => $request->prenom,
            'nom'           => $request->nom,
            'email_complet' => $request->email,
            'statut'        => $request->statut,
            'slug'          => Str::slug($request->prenom . '-' . $request->nom) . '-' . uniqid(),
        ]);

        // 5) Event Registered (pour envoi d’email si besoin)
        event(new Registered($user));

        return response()->json([
            'message' => 'Votre compte a été créé avec succès. Il est en attente de validation par un administrateur.',
            'user'    => $user,
        ], 201);
    }
}
