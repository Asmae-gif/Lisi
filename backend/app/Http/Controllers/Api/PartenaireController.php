<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Partenaire;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PartenaireController extends Controller
{
    public function index()
    {
        try {
            Log::info('Récupération de la liste des partenaires');
            $partenaires = Partenaire::all();
            return response()->json(['data' => $partenaires]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des partenaires: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la récupération des partenaires'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            Log::info('Tentative d\'ajout d\'un partenaire', $request->all());
            
            $validated = $request->validate([
                'nom' => 'required|string|max:255',
                'logo' => 'nullable|url|max:255',
                'lien' => 'required|url|max:255',
            ]);

            $partenaire = Partenaire::create($validated);
            Log::info('Partenaire créé avec succès', ['id' => $partenaire->id]);
            
            return response()->json(['data' => $partenaire], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Erreur de validation lors de la création du partenaire', ['errors' => $e->errors()]);
            return response()->json(['message' => 'Erreur de validation', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la création du partenaire: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la création du partenaire'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            Log::info('Tentative de mise à jour du partenaire', ['id' => $id, 'data' => $request->all()]);
            
            $partenaire = Partenaire::findOrFail($id);
            
            $validated = $request->validate([
                'nom' => 'required|string|max:255',
                'logo' => 'nullable|url|max:255',
                'lien' => 'required|url|max:255',
            ]);

            $partenaire->update($validated);
            Log::info('Partenaire mis à jour avec succès', ['id' => $id]);
            
            return response()->json(['data' => $partenaire]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Partenaire non trouvé', ['id' => $id]);
            return response()->json(['message' => 'Partenaire non trouvé'], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Erreur de validation lors de la mise à jour du partenaire', ['errors' => $e->errors()]);
            return response()->json(['message' => 'Erreur de validation', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour du partenaire: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la mise à jour du partenaire'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            Log::info('Tentative de suppression du partenaire', ['id' => $id]);
            
            $partenaire = Partenaire::findOrFail($id);
            $partenaire->delete();
            
            Log::info('Partenaire supprimé avec succès', ['id' => $id]);
            return response()->json(['message' => 'Partenaire supprimé avec succès']);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Partenaire non trouvé lors de la suppression', ['id' => $id]);
            return response()->json(['message' => 'Partenaire non trouvé'], 404);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression du partenaire: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la suppression du partenaire'], 500);
        }
    }
} 