<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;



class UserController extends Controller
{
    public function create()
    {
        // Retourner les rôles disponibles (utile si formulaire)
        $roles = Role::all();

        return response()->json(['roles' => $roles]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|exists:roles,name',
            'statut' => 'nullable|string',
            'profile_image' => 'nullable|image|max:2048',
        ]);

        // Traitement de l'image de profil
        $imagePath = null;
        if ($request->hasFile('profile_image')) {
            $imagePath = $request->file('profile_image')->store('profiles', 'public');
        }

        // Création de l'utilisateur
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'statut' => $validated['statut'] ?? null,
            'photo' => $imagePath,
        ]);

        // Attribution du rôle (Spatie)
        $user->assignRole($validated['role']);

        return response()->json([
            'message' => 'Utilisateur créé avec succès',
            'user' => $user,
        ], 201);
    }
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'role' => 'sometimes|required|exists:roles,name',
            'statut' => 'nullable|string|max:255',
            'is_blocked' => 'nullable|boolean',
            'profile_image' => 'nullable|image|max:2048',
        ]);

        // Traitement image de profil si besoin
        if ($request->hasFile('profile_image')) {
            $imagePath = $request->file('profile_image')->store('profiles', 'public');
            $validated['photo'] = $imagePath;
        }

        // Gestion du rôle séparément (Spatie)
        if (isset($validated['role'])) {
            $user->syncRoles([$validated['role']]);
            unset($validated['role']);
        }


        // Mise à jour des données utilisateur
        $user->update($validated);



        return response()->json([
            'message' => 'Utilisateur mis à jour avec succès.',
            'user' => $user,
        ]);
    }
}
