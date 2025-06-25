<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PrixDistinction;
use App\Models\Membre;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PrixDistinctionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            \Log::info('PrixDistinctionController::index - Début de la méthode');
            
            $prix = PrixDistinction::with('membres')->get();
            \Log::info('PrixDistinctionController::index - Données récupérées: ' . $prix->count());
            
            // Transformer les données pour correspondre au format attendu par le frontend
            $transformedPrix = $prix->map(function ($item) {
                return [
                    'id' => $item->id,
                    'titre_fr' => $item->titre_fr,
                    'titre_en' => $item->titre_en,
                    'titre_ar' => $item->titre_ar,
                    'description_fr' => $item->description_fr,
                    'description_en' => $item->description_en,
                    'description_ar' => $item->description_ar,
                    'date_obtention' => $item->date_obtention,
                    'organisme' => $item->organisme,
                    'image_url' => $item->image_url,
                    'lien_externe' => $item->lien_externe,
                    'membres' => $item->membres->map(function ($membre) {
                        return [
                            'id' => $membre->id,
                            'nom' => $membre->nom,
                            'prenom' => $membre->prenom,
                            'role' => $membre->pivot->role,
                            'ordre' => $membre->pivot->ordre
                        ];
                    }),
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at
                ];
            });
            
            \Log::info('PrixDistinctionController::index - Données transformées');
            
            return response()->json([
                'success' => true,
                'data' => $transformedPrix,
                'message' => 'Prix et distinctions récupérés avec succès'
            ]);
        } catch (\Exception $e) {
            \Log::error('PrixDistinctionController::index - Erreur: ' . $e->getMessage());
            \Log::error('PrixDistinctionController::index - Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des prix et distinctions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'titre_fr' => 'required|string|max:255', // Accepter 'nom' du frontend
                'titre_en' => 'nullable|string|max:255',
                'titre_ar' => 'nullable|string|max:255',
                'description_fr' => 'nullable|string',
                'description_en' => 'nullable|string',
                'description_ar' => 'nullable|string',
                'date_obtention' => 'required|date',
                'organisme' => 'nullable|string|max:255',
                'image_url' => 'nullable|string|max:255',
                'lien_externe' => 'nullable|string|max:255',
                'membres' => 'required|array|min:1', // Array de membres avec leurs rôles
                'membres.*.membre_id' => 'required|exists:membres,id',
                'membres.*.role' => 'nullable|string|max:255',
                'membres.*.ordre' => 'nullable|integer|min:0',
            ]);
            
            // Mapper 'nom' vers 'titre' pour la base de données
            $prixData = [
                'titre_fr' => $validated['titre_fr'],
                'titre_en' => $validated['titre_en'] ?? null,
                'titre_ar' => $validated['titre_ar'] ?? null,
                'description_fr' => $validated['description_fr'] ?? null,
                'description_en' => $validated['description_en'] ?? null,
                'description_ar' => $validated['description_ar'] ?? null,
                'date_obtention' => $validated['date_obtention'],
                'organisme' => $validated['organisme'] ?? null,
                'image_url' => $validated['image_url'] ?? null,
                'lien_externe' => $validated['lien_externe'] ?? null,
            ];
            
            $prix = PrixDistinction::create($prixData);
            
            // Ajouter les membres avec leurs rôles
            foreach ($validated['membres'] as $membreData) {
                $prix->addMembre(
                    Membre::find($membreData['membre_id']),
                    $membreData['role'] ?? null,
                    $membreData['ordre'] ?? 0
                );
            }
            
            // Recharger avec les membres pour la réponse
            $prix->load('membres');
            
            // Retourner dans le format attendu par le frontend
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $prix->id,
                    'titre_fr' => $prix->titre_fr,
                    'titre_en' => $prix->titre_en,
                    'titre_ar' => $prix->titre_ar,
                    'description_fr' => $prix->description_fr,
                    'description_en' => $prix->description_en,
                    'description_ar' => $prix->description_ar,
                    'date_obtention' => $prix->date_obtention,
                    'organisme' => $prix->organisme,
                    'image_url' => $prix->image_url,
                    'lien_externe' => $prix->lien_externe,
                    'membres' => $prix->membres->map(function ($membre) {
                        return [
                            'id' => $membre->id,
                            'nom' => $membre->nom,
                            'prenom' => $membre->prenom,
                            'role' => $membre->pivot->role,
                            'ordre' => $membre->pivot->ordre
                        ];
                    }),
                    'created_at' => $prix->created_at,
                    'updated_at' => $prix->updated_at
                ],
                'message' => 'Prix/distinction créé avec succès'
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du prix/distinction',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(PrixDistinction $prixDistinction)
    {
        try {
            $prix = $prixDistinction->load('membres');
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $prix->id,
                    'titre_fr' => $prix->titre_fr,
                    'titre_en' => $prix->titre_en,
                    'titre_ar' => $prix->titre_ar,
                    'description_fr' => $prix->description_fr,
                    'description_en' => $prix->description_en,
                    'description_ar' => $prix->description_ar,
                    'date_obtention' => $prix->date_obtention,
                    'organisme' => $prix->organisme,
                    'image_url' => $prix->image_url,
                    'lien_externe' => $prix->lien_externe,
                    'membres' => $prix->membres->map(function ($membre) {
                        return [
                            'id' => $membre->id,
                            'nom' => $membre->nom,
                            'prenom' => $membre->prenom,
                            'role' => $membre->pivot->role,
                            'ordre' => $membre->pivot->ordre
                        ];
                    }),
                    'created_at' => $prix->created_at,
                    'updated_at' => $prix->updated_at
                ],
                'message' => 'Prix/distinction récupéré avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du prix/distinction',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PrixDistinction $prixDistinction)
    {
        try {
            $validated = $request->validate([
                'titre_fr' => 'sometimes|string|max:255',
                'titre_en' => 'nullable|string|max:255',
                'titre_ar' => 'nullable|string|max:255',
                'description_fr' => 'nullable|string',
                'description_en' => 'nullable|string',
                'description_ar' => 'nullable|string',
                'date_obtention' => 'sometimes|date',
                'organisme' => 'nullable|string|max:255',
                'image_url' => 'nullable|string|max:255',
                'lien_externe' => 'nullable|string|max:255',
                'membres' => 'sometimes|array',
                'membres.*.membre_id' => 'required_with:membres|exists:membres,id',
                'membres.*.role' => 'nullable|string|max:255',
                'membres.*.ordre' => 'nullable|integer|min:0',
            ]);
            
            // Extraire les membres des données validées
            $membres = $validated['membres'] ?? null;
            unset($validated['membres']);
            
            // Mettre à jour le prix/distinction
            $prixDistinction->update($validated);
            
            // Mettre à jour les membres si fournis
            if ($membres !== null) {
                // Supprimer tous les membres existants
                $prixDistinction->membres()->detach();
                
                // Ajouter les nouveaux membres
                foreach ($membres as $membreData) {
                    $prixDistinction->addMembre(
                        Membre::find($membreData['membre_id']),
                        $membreData['role'] ?? null,
                        $membreData['ordre'] ?? 0
                    );
                }
            }
            
            // Recharger avec les membres pour la réponse
            $prixDistinction->load('membres');
            
            // Retourner dans le format attendu par le frontend
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $prixDistinction->id,
                    'titre_fr' => $prixDistinction->titre_fr,
                    'titre_en' => $prixDistinction->titre_en,
                    'titre_ar' => $prixDistinction->titre_ar,
                    'description_fr' => $prixDistinction->description_fr,
                    'description_en' => $prixDistinction->description_en,
                    'description_ar' => $prixDistinction->description_ar,
                    'date_obtention' => $prixDistinction->date_obtention,
                    'organisme' => $prixDistinction->organisme,
                    'image_url' => $prixDistinction->image_url,
                    'lien_externe' => $prixDistinction->lien_externe,
                    'membres' => $prixDistinction->membres->map(function ($membre) {
                        return [
                            'id' => $membre->id,
                            'nom' => $membre->nom,
                            'prenom' => $membre->prenom,
                            'role' => $membre->pivot->role,
                            'ordre' => $membre->pivot->ordre
                        ];
                    }),
                    'created_at' => $prixDistinction->created_at,
                    'updated_at' => $prixDistinction->updated_at
                ],
                'message' => 'Prix/distinction mis à jour avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du prix/distinction',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PrixDistinction $prixDistinction)
    {
        try {
            $prixDistinction->delete();
            return response()->json([
                'success' => true,
                'message' => 'Prix/distinction supprimé avec succès'
            ], Response::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du prix/distinction',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function byMembre($membreId)
    {
        try {
            $prix = PrixDistinction::whereHas('membres', function ($query) use ($membreId) {
                $query->where('membres.id', $membreId);
            })->with('membres')->get();
            
            // Transformer les données pour correspondre au format attendu par le frontend
            $transformedPrix = $prix->map(function ($item) {
                return [
                    'id' => $item->id,
                    'titre_fr' => $item->titre_fr,
                    'titre_en' => $item->titre_en,
                    'titre_ar' => $item->titre_ar,
                    'description_fr' => $item->description_fr,
                    'description_en' => $item->description_en,
                    'description_ar' => $item->description_ar,
                    'date_obtention' => $item->date_obtention,
                    'organisme' => $item->organisme,
                    'image_url' => $item->image_url,
                    'lien_externe' => $item->lien_externe,
                    'membres' => $item->membres->map(function ($membre) {
                        return [
                            'id' => $membre->id,
                            'nom' => $membre->nom,
                            'prenom' => $membre->prenom,
                            'role' => $membre->pivot->role,
                            'ordre' => $membre->pivot->ordre
                        ];
                    }),
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at
                ];
            });
            
            return response()->json([
                'success' => true,
                'data' => $transformedPrix,
                'message' => 'Prix et distinctions du membre récupérés avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des prix et distinctions du membre',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
