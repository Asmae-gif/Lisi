<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Membre;
use App\Models\Axe;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\UpdateMembreRequest;

class AdminMembreController extends Controller
{
    /**
     * Liste tous les membres pour l'administration.
     */
    public function index()
    {
        $membres = Membre::with(['user', 'axes'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($membre) {
                return [
                    'id' => $membre->id,
                    'nom' => $membre->nom,
                    'prenom' => $membre->prenom,
                    'email' => $membre->email_complet,
                    'statut' => $membre->statut,
                    'grade' => $membre->grade,
                    'photo' => $membre->photo,
                    'is_comite' => $membre->is_comite,
                    'axes' => $membre->axes->map(function ($axe) {
                        return [
                            'id' => $axe->id,
                            'nom' => $axe->nom,
                            'position' => $axe->pivot->position
                        ];
                    }),
                    'user' => $membre->user ? [
                        'id' => $membre->user->id,
                        'is_approved' => $membre->user->is_approved,
                        'is_blocked' => $membre->user->is_blocked,
                        'roles' => $membre->user->roles->pluck('name')
                    ] : null,
                    'created_at' => $membre->created_at,
                    'updated_at' => $membre->updated_at
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => [
                'membres' => $membres,
                'total' => $membres->count()
            ]
        ]);
    }

    /**
     * Créer un nouveau membre et son compte utilisateur associé.
     */
    public function store(Request $request)
    {
        $createUser = $request->input('create_user', 'true') === 'true';
        
        $validationRules = [
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'statut' => 'required|string|max:255',
            'grade' => 'nullable|string|max:255',
            'biographie' => 'nullable|string',
            'photo' => 'nullable|image|max:2048',
            'axes' => 'nullable|array',
            'axes.*.id' => 'required|exists:axes,id',
            'axes.*.position' => 'nullable|string',
            'create_user' => 'nullable|string'
        ];

        // Ajouter la validation email selon si on crée un utilisateur ou non
        if ($createUser) {
            $validationRules['email'] = 'required|email|unique:users,email';
            $validationRules['password'] = 'nullable|string|min:8';
        } else {
            $validationRules['email'] = 'required|email';
        }

        $validated = $request->validate($validationRules);

        try {
            DB::beginTransaction();

            $userId = null;

            // 1. Créer l'utilisateur seulement si create_user est true
            if ($createUser) {
                $user = new User();
                $user->name = $validated['prenom'] . ' ' . $validated['nom'];
                $user->email = $validated['email'];
                // Générer un mot de passe aléatoire si non fourni
                $password = $validated['password'] ?? Str::random(12);
                $user->password = Hash::make($password);
                $user->is_approved = false;
                $user->is_blocked = false;
                $user->save();
                
                // Assigner le rôle membre
                $user->assignRole('membre');
                $userId = $user->id;
            }

            // 2. Gérer la photo si fournie
            $photoPath = null;
            if ($request->hasFile('photo')) {
                $photoPath = basename($request->file('photo')->store('membres/photos', 'public'));
            }

            // 3. Créer le membre
            $membre = Membre::create([
                'user_id' => $userId, // null si pas d'utilisateur créé
                'prenom' => $validated['prenom'],
                'nom' => $validated['nom'],
                'email' => $validated['email'],
                'statut' => $validated['statut'],
                'grade' => $validated['grade'] ?? null,
                'biographie' => $validated['biographie'] ?? null,
                'photo' => $photoPath,
                'slug' => Str::slug($validated['prenom'] . '-' . $validated['nom']) . '-' . uniqid()
            ]);

            // 4. Associer les axes si fournis
            if (isset($validated['axes'])) {
                $axesSync = collect($validated['axes'])->mapWithKeys(function ($axe) {
                    return [$axe['id'] => ['position' => $axe['position'] ?? null]];
                })->toArray();
                
                $membre->axes()->sync($axesSync);
            }

            DB::commit();

            // 5. Charger les relations et retourner la réponse
            $membre->load(['user.roles', 'axes']);

            return response()->json([
                'status' => 'success',
                'message' => $createUser ? 'Membre créé avec succès' : 'Membre créé sans compte utilisateur',
                'data' => $membre
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            // Supprimer la photo si elle a été uploadée
            if (isset($photoPath)) {
                Storage::disk('public')->delete('membres/photos/' . $photoPath);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la création du membre: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mettre à jour un membre existant.
     */
    public function update(UpdateMembreRequest $request, Membre $membre)
    {
        $validated = $request->validated();

        try {
            DB::beginTransaction();

            // 1. Mettre à jour l'utilisateur si email modifié
            if (isset($validated['email'])) {
                $membre->user->update([
                    'email' => $validated['email'],
                    'name' => ($validated['prenom'] ?? $membre->prenom) . ' ' . ($validated['nom'] ?? $membre->nom)
                ]);
            }

            // 2. Gérer la photo si fournie
            if ($request->hasFile('photo')) {
                // Supprimer l'ancienne photo
                if ($membre->photo) {
                    Storage::disk('public')->delete('membres/photos/' . $membre->photo);
                }
                $validated['photo'] = basename($request->file('photo')->store('membres/photos', 'public'));
            }

            // 3. Mettre à jour le membre avec tous les champs validés
            $membre->update($validated);

            // 4. Mettre à jour les axes si fournis
            if (isset($validated['axes'])) {
                $axesSync = collect($validated['axes'])->mapWithKeys(function ($axe) {
                    return [$axe['id'] => ['position' => $axe['position'] ?? null]];
                })->toArray();
                
                $membre->axes()->sync($axesSync);
            }

            DB::commit();

            // 5. Charger les relations et retourner la réponse
            $membre->load(['user.roles', 'axes']);

            return response()->json([
                'status' => 'success',
                'message' => 'Membre mis à jour avec succès',
                'data' => $membre
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la mise à jour du membre: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un membre et son compte utilisateur associé.
     */
    public function destroy(Membre $membre)
    {
        try {
            DB::beginTransaction();

            // 1. Supprimer la photo si elle existe
            if ($membre->photo) {
                Storage::disk('public')->delete('membres/photos/' . $membre->photo);
            }

            // 2. Supprimer le membre (et ses relations via onDelete cascade)
            $membre->delete();

            // 3. Supprimer l'utilisateur associé
            if ($membre->user) {
                $membre->user->delete();
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Membre supprimé avec succès'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la suppression du membre: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bascule le statut de comité d'un membre.
     */
    public function toggleComite(Membre $membre)
    {
        try {
            DB::beginTransaction();

            // Bascule le statut
            $membre->is_comite = !$membre->is_comite;
            $membre->save();

            // Recharger les relations
            $membre->load(['user.roles', 'axes']);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => $membre->is_comite ? 'Membre ajouté au comité.' : 'Membre retiré du comité.',
                'data' => $membre
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la modification du statut de comité: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getComite()
    {
        $comiteMembers = User::whereHas('membre', function ($query) {
            $query->where('is_comite', true);
        })
        ->with(['membre.axes', 'roles'])
        ->get()
        ->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_blocked' => $user->is_blocked,
                'is_approved' => $user->is_approved,
                'membre' => $user->membre ? [
                    'id' => $user->membre->id,
                    'nom' => $user->membre->nom,
                    'prenom' => $user->membre->prenom,
                    'photo' => $user->membre->photo,
                    'photo_url' => $user->membre->photo_url,
                    'biographie' => $user->membre->biographie,
                    'position' => $user->membre->position,
                    'is_comite' => $user->membre->is_comite,
                    'grade' => $user->membre->grade,
                    'linkedin' => $user->membre->linkedin,
                    'researchgate' => $user->membre->researchgate,
                    'google_scholar' => $user->membre->google_scholar,
                    'axes' => $user->membre->axes ?? [],
                ] : null,
                'roles' => $user->roles->pluck('name'),
            ];
        });
        return response()->json($comiteMembers);
    }
}