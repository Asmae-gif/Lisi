<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PrixDistinction;
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
            $prix = PrixDistinction::with('membre')->get();
            
            // Transformer les données pour correspondre au format attendu par le frontend
            $transformedPrix = $prix->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nom' => $item->titre, // Mapper titre vers nom
                    'description' => $item->description,
                    'date_obtention' => $item->date_obtention,
                    'membre_id' => $item->membre_id,
                    'membre' => $item->membre ? [
                        'nom' => $item->membre->nom,
                        'prenom' => $item->membre->prenom
                    ] : null,
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at
                ];
            });
            
            return response()->json([
                'success' => true,
                'data' => $transformedPrix,
                'message' => 'Prix et distinctions récupérés avec succès'
            ]);
        } catch (\Exception $e) {
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
                'nom' => 'required|string|max:255', // Accepter 'nom' du frontend
                'description' => 'nullable|string',
                'date_obtention' => 'required|date',
                'organisme' => 'nullable|string|max:255',
                'image_url' => 'nullable|string|max:255',
                'lien_externe' => 'nullable|string|max:255',
                'membre_id' => 'required|exists:membres,id',
            ]);
            
            // Mapper 'nom' vers 'titre' pour la base de données
            $validated['titre'] = $validated['nom'];
            unset($validated['nom']);
            
            $prix = PrixDistinction::create($validated);
            
            // Retourner dans le format attendu par le frontend
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $prix->id,
                    'nom' => $prix->titre,
                    'description' => $prix->description,
                    'date_obtention' => $prix->date_obtention,
                    'membre_id' => $prix->membre_id,
                    'membre' => $prix->membre ? [
                        'nom' => $prix->membre->nom,
                        'prenom' => $prix->membre->prenom
                    ] : null,
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
            $prix = $prixDistinction->load('membre');
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $prix->id,
                    'nom' => $prix->titre,
                    'description' => $prix->description,
                    'date_obtention' => $prix->date_obtention,
                    'membre_id' => $prix->membre_id,
                    'membre' => $prix->membre ? [
                        'nom' => $prix->membre->nom,
                        'prenom' => $prix->membre->prenom
                    ] : null,
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
                'nom' => 'sometimes|string|max:255', // Accepter 'nom' du frontend
                'description' => 'nullable|string',
                'date_obtention' => 'sometimes|date',
                'organisme' => 'nullable|string|max:255',
                'image_url' => 'nullable|string|max:255',
                'lien_externe' => 'nullable|string|max:255',
                'membre_id' => 'sometimes|exists:membres,id',
            ]);
            
            // Mapper 'nom' vers 'titre' pour la base de données
            if (isset($validated['nom'])) {
                $validated['titre'] = $validated['nom'];
                unset($validated['nom']);
            }
            
            $prixDistinction->update($validated);
            
            // Retourner dans le format attendu par le frontend
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $prixDistinction->id,
                    'nom' => $prixDistinction->titre,
                    'description' => $prixDistinction->description,
                    'date_obtention' => $prixDistinction->date_obtention,
                    'membre_id' => $prixDistinction->membre_id,
                    'membre' => $prixDistinction->membre ? [
                        'nom' => $prixDistinction->membre->nom,
                        'prenom' => $prixDistinction->membre->prenom
                    ] : null,
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
            $prix = PrixDistinction::where('membre_id', $membreId)->get();
            
            // Transformer les données pour correspondre au format attendu par le frontend
            $transformedPrix = $prix->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nom' => $item->titre,
                    'description' => $item->description,
                    'date_obtention' => $item->date_obtention,
                    'membre_id' => $item->membre_id,
                    'membre' => $item->membre ? [
                        'nom' => $item->membre->nom,
                        'prenom' => $item->membre->prenom
                    ] : null,
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
