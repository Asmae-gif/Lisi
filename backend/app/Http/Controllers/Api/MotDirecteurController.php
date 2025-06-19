<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MotDirecteur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MotDirecteurController extends Controller
{
    public function index()
    {
        try {
            $motDirecteur = MotDirecteur::first();
            return response()->json([
                'success' => true,
                'message' => 'Mot du directeur récupéré avec succès',
                'data' => $motDirecteur
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du mot du directeur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'titre' => 'required|string|max:255',
                'contenu' => 'required|string',
                'image' => 'nullable|string',
                'nom_directeur' => 'required|string|max:255',
                'poste' => 'required|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Supprimer l'ancien mot du directeur s'il existe
            MotDirecteur::truncate();

            $motDirecteur = MotDirecteur::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Mot du directeur créé avec succès',
                'data' => $motDirecteur
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du mot du directeur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'titre' => 'required|string|max:255',
                'contenu' => 'required|string',
                'image' => 'nullable|string',
                'nom_directeur' => 'required|string|max:255',
                'poste' => 'required|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }

            $motDirecteur = MotDirecteur::findOrFail($id);
            $motDirecteur->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Mot du directeur mis à jour avec succès',
                'data' => $motDirecteur
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du mot du directeur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $motDirecteur = MotDirecteur::findOrFail($id);
            $motDirecteur->delete();

            return response()->json([
                'success' => true,
                'message' => 'Mot du directeur supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du mot du directeur',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 