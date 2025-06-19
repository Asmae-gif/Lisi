<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AdminUserController extends Controller
{
    public function __construct()
    {
        // Seuls les admins (policy viewAny) peuvent accéder à index()
        $this->middleware('can:viewAny,App\Models\User')->only('index');
    }

    /**
     * Liste tous les utilisateurs (admin seulement).
     */
    public function index()
    {
        // Le middleware 'can:viewAny' l'a déjà vérifié
        $users = User::with(['roles', 'membre'])->get();

        return response()->json([
            'status' => 'success',
            'data'   => $users,
        ], 200);
    }

    /**
     * Affiche les détails d'un utilisateur (admin ou owner).
     */
    public function show($id)
    {
        $user = User::with(['roles', 'membre'])->findOrFail($id);
        $this->authorize('view', $user);

        return response()->json([
            'status' => 'success',
            'data'   => $user,
        ], 200);
    }

    /**
     * Approuver un utilisateur.
     */
    public function approve(User $user)
    {
        $this->authorize('manage', $user);

        if ($user->isAdmin()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Les administrateurs sont approuvés automatiquement.',
            ], 400);
        }

        try {
            DB::beginTransaction();
            
            // Mise à jour de l'utilisateur
            $user->is_approved = true;
            $user->email_verified_at = now();
            $user->save();
            
            // Recharger les relations sans la relation user dans membre
            $user->load(['roles', 'membre' => function($query) {
                $query->without('user');
            }]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Compte approuvé.',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de l\'approbation', [
                'error' => $e->getMessage(),
                'user_id' => $user->id
            ]);
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de l\'approbation.',
            ], 500);
        }
    }

    /**
     * Rejeter un utilisateur.
     */
    public function reject(User $user)
    {
        $this->authorize('manage', $user);

        if ($user->isAdmin()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Impossible de rejeter un administrateur.',
            ], 400);
        }

        $user->update(['is_approved' => false]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Compte rejeté.',
            'data'    => $user->load(['roles', 'membre']),
        ], 200);
    }

    /**
     * Bloquer un utilisateur.
     */
    public function block(User $user)
    {
        $this->authorize('manage', $user);

        if ($user->isAdmin()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Impossible de bloquer un administrateur.',
            ], 400);
        }

        try {
            DB::beginTransaction();
            
            // Mise à jour de l'utilisateur
            $user->is_blocked = true;
            $user->save();
            
            // Recharger les relations sans la relation user dans membre
            $user->load(['roles', 'membre' => function($query) {
                $query->without('user');
            }]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Compte bloqué.',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur lors du blocage', [
                'error' => $e->getMessage(),
                'user_id' => $user->id
            ]);
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors du blocage.',
            ], 500);
        }
    }

    /**
     * Débloquer un utilisateur.
     */
    public function unblock(User $user)
    {
        $this->authorize('manage', $user);

        if ($user->isAdmin()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Les administrateurs ne peuvent pas être bloqués.',
            ], 400);
        }

        try {
            DB::beginTransaction();
            
            // Mise à jour de l'utilisateur
            $user->is_blocked = false;
            $user->save();
            
            // Recharger les relations sans la relation user dans membre
            $user->load(['roles', 'membre' => function($query) {
                $query->without('user');
            }]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Compte débloqué.',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur lors du déblocage', [
                'error' => $e->getMessage(),
                'user_id' => $user->id
            ]);
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors du déblocage.',
            ], 500);
        }
    }

    /**
     * Met à jour un utilisateur (admin seulement).
     * → Seuls `name` et `email` sont gérés ici.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $this->authorize('manage', $user);

        if ($user->isAdmin()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Modification d\'un administrateur non autorisée',
            ], 400);
        }

        $validated = $request->validate([
            'name'  => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
        ]);

        $user->update($validated);

        return response()->json([
            'status'  => 'success',
            'message' => 'Utilisateur mis à jour.',
            'data'    => $user,
        ], 200);
    }

    /**
     * Supprime un utilisateur (admin seulement).
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $this->authorize('manage', $user);

        if ($user->isAdmin()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Impossible de supprimer un administrateur.',
            ], 400);
        }

        $user->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Utilisateur supprimé.',
        ], 200);
    }
}
