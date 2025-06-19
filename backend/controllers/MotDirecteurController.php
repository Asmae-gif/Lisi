<?php

namespace App\Http\Controllers\Api;

use App\Models\MotDirecteur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class MotDirecteurController extends Controller
{
    public function index()
    {
        try {
            $motDirecteur = MotDirecteur::first();
            return response()->json([
                'success' => true,
                'data' => $motDirecteur,
                'message' => 'Mot du directeur récupéré avec succès'
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération du mot du directeur: ' . $e->getMessage());
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
            $request->validate([
                'titre' => 'required|string|max:255',
                'contenu' => 'required|string',
                'image' => 'nullable|string',
                'nom_directeur' => 'required|string|max:255',
                'poste' => 'required|string|max:255'
            ]);

            $data = $request->all();
            
            // Gestion de l'image
            if ($request->has('image') && $request->image) {
                $imagePath = $this->saveImage($request->image);
                if ($imagePath) {
                    $data['image'] = $imagePath;
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Erreur lors du traitement de l\'image'
                    ], 400);
                }
            }

            $motDirecteur = MotDirecteur::create($data);

            return response()->json([
                'success' => true,
                'data' => $motDirecteur,
                'message' => 'Mot du directeur créé avec succès'
            ], 201);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la création du mot du directeur: ' . $e->getMessage());
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
            $request->validate([
                'titre' => 'required|string|max:255',
                'contenu' => 'required|string',
                'image' => 'nullable|string',
                'nom_directeur' => 'required|string|max:255',
                'poste' => 'required|string|max:255'
            ]);

            $motDirecteur = MotDirecteur::findOrFail($id);
            $data = $request->all();
            
            // Gestion de l'image
            if ($request->has('image') && $request->image) {
                // Supprimer l'ancienne image si elle existe
                if ($motDirecteur->image && Storage::disk('public')->exists($motDirecteur->image)) {
                    Storage::disk('public')->delete($motDirecteur->image);
                }
                
                $imagePath = $this->saveImage($request->image);
                if ($imagePath) {
                    $data['image'] = $imagePath;
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Erreur lors du traitement de l\'image'
                    ], 400);
                }
            }

            $motDirecteur->update($data);

            return response()->json([
                'success' => true,
                'data' => $motDirecteur,
                'message' => 'Mot du directeur mis à jour avec succès'
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour du mot du directeur: ' . $e->getMessage());
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
            
            // Supprimer l'image si elle existe
            if ($motDirecteur->image && Storage::disk('public')->exists($motDirecteur->image)) {
                Storage::disk('public')->delete($motDirecteur->image);
            }
            
            $motDirecteur->delete();

            return response()->json([
                'success' => true,
                'message' => 'Mot du directeur supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression du mot du directeur: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du mot du directeur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Sauvegarde une image encodée en base64
     */
    private function saveImage($base64Image)
    {
        try {
            // Vérifier si c'est une image base64 valide
            if (strpos($base64Image, 'data:image') === 0) {
                $image_parts = explode(";base64,", $base64Image);
                $image_type_aux = explode("image/", $image_parts[0]);
                $image_type = $image_type_aux[1];
                $image_base64 = base64_decode($image_parts[1]);
                
                // Générer un nom de fichier unique
                $fileName = 'mot_directeur_' . time() . '_' . uniqid() . '.' . $image_type;
                $filePath = 'images/mot_directeur/' . $fileName;
                
                // Sauvegarder l'image
                if (Storage::disk('public')->put($filePath, $image_base64)) {
                    return $filePath;
                }
            }
            
            return false;
        } catch (\Exception $e) {
            Log::error('Erreur lors de la sauvegarde de l\'image: ' . $e->getMessage());
            return false;
        }
    }
} 