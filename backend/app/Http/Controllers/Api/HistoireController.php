<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Histoire;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class HistoireController extends Controller
{
    public function index()
    {
        try {
            $histoires = Histoire::orderBy('ordre')->get();
            return response()->json([
                'success' => true,
                'message' => 'Histoires récupérées avec succès',
                'data' => $histoires
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des histoires',
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
                'date' => 'required|date',
                'ordre' => 'required|integer|min:0'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }

            $histoire = Histoire::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Histoire créée avec succès',
                'data' => $histoire
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de l\'histoire',
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
                'date' => 'required|date',
                'ordre' => 'required|integer|min:0'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }

            $histoire = Histoire::findOrFail($id);
            $histoire->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Histoire mise à jour avec succès',
                'data' => $histoire
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour de l\'histoire',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $histoire = Histoire::findOrFail($id);
            $histoire->delete();

            return response()->json([
                'success' => true,
                'message' => 'Histoire supprimée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de l\'histoire',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 