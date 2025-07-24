<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\UpdateMembreRequest;
use App\Models\Membre;
use App\Models\Axe;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\UserResource;
use App\Models\User;

class MembreController extends Controller
{
    /**
     * Route authentifiée : créer un membre.
     */
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'nom' => 'required|string',
                'prenom' => 'required|string',
                'statut' => 'nullable|string',
                'email' => 'nullable|string',
                'biographie' => 'nullable|string',
                'linkedin' => 'nullable|string',
                'researchgate' => 'nullable|string',
                'google_scholar' => 'nullable|string',
                'user_id' => 'nullable|exists:users,id',
            ]);
            // slug ignoré volontairement
            $membre = Membre::create($data);
            $membre->load(['axes', 'user']);
            $axes = Axe::all();
            return response()->json([
                'status' => 'success',
                'message' => 'Membre créé avec succès',
                'membre' => $membre,
                'user' => $membre->user,
                'axes_disponibles' => $axes,
                'axes_selectionnes' => $membre->axes,
            ], 201);
        } catch (\Exception $e) {
            $response = [
                'status' => 'error',
                'message' => 'Erreur lors de la création du membre: ' . $e->getMessage(),
            ];
            if (config('app.debug')) {
                $response['exception'] = get_class($e);
                $response['file'] = $e->getFile();
                $response['line'] = $e->getLine();
                $response['trace'] = $e->getTraceAsString();
            }
            return response()->json($response, 500);
        }
    }
    /**
     * Route publique : afficher un membre spécifique (avec ses axes).
     */
    public function showPublic(Membre $membre)
    {
        return response()->json([
            'membre' => $membre->load('axes')
        ]);
    }

    /**
     * Route publique : lister tous les membres.
     */
    public function index()
    {
        $membres = Membre::with('user')
            ->orderBy('nom')
            ->get()
            ->map(function ($membre) {
                return [
                    'id' => $membre->id,
                    'nom' => $membre->nom,
                    'prenom' => $membre->prenom,
                    'statut' => $membre->statut,
                    'email' => $membre->user ? $membre->user->email : $membre->email,
                    'biographie' => $membre->biographie,
                    // 'grade' => $membre->grade,
                    'linkedin' => $membre->linkedin,
                    'researchgate' => $membre->researchgate,
                    'google_scholar' => $membre->google_scholar,
                ];
            });

        // Retourner directement le tableau (pas d'objet status/data)
        return response()->json($membres->values());
    }

    /**
     * Route authentifiée : afficher le profil du membre connecté + axes disponibles.
     */
    public function show(Request $request)
    {
        $user = $request->user()->load(['membre.axes']);
        $axes = Axe::all();

        if (!$user->membre) {
            return response()->json([
                'user' => $user,
                'membre' => null,
                'axes_disponibles' => $axes,
                'axes_selectionnes' => [],
                'message' => 'Aucun profil membre associé à cet utilisateur'
            ], 404);
        }

        return response()->json([
            'user' => $user,
            'membre' => $user->membre,
            'axes_disponibles' => $axes,
            'axes_selectionnes' => $user->membre->axes,
        ]);
    }

    /**
     * Met à jour le profil du membre connecté.
     * L'autorisation est gérée dans UpdateMembreRequest.
     */
    public function update(UpdateMembreRequest $request)
    {
        try {
            // Récupérer le membre connecté
            $user = $request->user();
            $membre = $user->membre;

            if (!$membre) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Aucun profil membre associé à cet utilisateur'
                ], 404);
            }

            // 1) Construire le tableau $data pour Membre
            $data = $request->validated();

            // 2) Gérer l'upload de la photo
            if ($request->hasFile('photo')) {
                if ($membre->photo) {
                    Storage::disk('public')->delete('membres/photos/' . $membre->photo);
                }
                $chemin = $request->file('photo')->store('membres/photos', 'public');
                $data['photo'] = basename($chemin);
            }

            // 3) Mise à jour du membre
            $membre->update($data);

            // 4) Si le membre a un compte utilisateur et que l'email a changé, mettre à jour l'utilisateur aussi
            if ($membre->user_id && isset($data['email']) && $data['email'] !== $membre->user->email) {
                $membre->user->update(['email' => $data['email']]);
            }

            // 5) Gérer la synchronisation des axes (si fournis)
            if ($request->filled('axes')) {
                $axesSync = collect($request->axes)->mapWithKeys(function ($axe) {
                    return [
                        $axe['id'] => ['position' => $axe['position'] ?? null]
                    ];
                })->toArray();

                $membre->axes()->sync($axesSync);
            }

            // 6) Recharger les relations
            $membre->load(['axes', 'user']);
            $axes = Axe::all();

            return response()->json([
                'status' => 'success',
                'message' => 'Profil mis à jour avec succès',
                'membre' => $membre,
                'user' => $membre->user,
                'axes_disponibles' => $axes,
                'axes_selectionnes' => $membre->axes,
            ]);

        } catch (\Exception $e) {
            $response = [
                'status' => 'error',
                'message' => 'Erreur lors de la mise à jour du profil: ' . $e->getMessage(),
            ];
            if (config('app.debug')) {
                $response['exception'] = get_class($e);
                $response['file'] = $e->getFile();
                $response['line'] = $e->getLine();
                $response['trace'] = $e->getTraceAsString();
            }
            return response()->json($response, 500);
        }
    }
}