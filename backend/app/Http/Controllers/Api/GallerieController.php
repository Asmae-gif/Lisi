<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Galleries;
use App\Models\Projet;
use App\Models\Publication;
use App\Models\Axe;
use App\Models\Formation;
use App\Models\Partnership;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

class GallerieController extends Controller
{
    /**
     * Display a listing of galleries for a specific entity type.
     */
    public function index(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'galleriesable_id' => 'required|string|in:projet,publication,axe de recherche,partenariat,pris et distinctions',
            'galleriesable_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $entityType = $request->galleriesable_type;
        $entityId = $request->galleriesable_id;

        // Déterminer le modèle en fonction du type d'entité
        $modelClass = match($entityType) {
            'projet' => Projet::class,
            'publication' => Publication::class,
            'axe' => Axe::class,
            'formation' => Formation::class,
            'partnership' => Partnership::class,
            default => null
        };

        if (!$modelClass) {
            return response()->json([
                'status' => 'error',
                'message' => 'Type d\'entité non valide'
            ], 400);
        }

        // Vérifier que l'entité existe
        $entity = $modelClass::find($entityId);
        if (!$entity) {
            return response()->json([
                'status' => 'error',
                'message' => ucfirst($entityType) . ' non trouvé'
            ], 404);
        }

        // Récupérer les galeries liées à cette entité
        $galleries = $entity->galleries()->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'entity' => $entity,
                'galleries' => $galleries->map(function ($gallery) {
                    return [
                        'id' => $gallery->id,
                        'title' => $gallery->title,
                        'description' => $gallery->description,
                        'image_path' => $gallery->image_path,
                        'image_url' => $gallery->image_url,
                        'galleriesable_type' => $this->getFrontendType($gallery->galleriesable_type),
                        'created_at' => $gallery->created_at,
                        'updated_at' => $gallery->updated_at,
                    ];
                })
            ]
        ]);
    }

    /**
     * Store a newly created gallery in storage.
     */
    public function store(Request $request): JsonResponse
    {
        // Vérifier que l'utilisateur est admin
        if (!$request->user() || !$request->user()->hasRole('admin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Accès non autorisé. Seuls les administrateurs peuvent créer des galeries.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image_path' => 'required|string|url',
            'galleriesable_type' => 'required|string|in:projet,publication,axe,formation,partnership',
            'galleriesable_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Vérifier que l'URL d'image est accessible
        try {
            $headers = get_headers($request->image_path, 1);
            if (!$headers || strpos($headers[0], '200') === false) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'L\'URL de l\'image n\'est pas accessible ou retourne une erreur',
                    'errors' => ['image_path' => ['L\'URL de l\'image n\'est pas accessible']]
                ], 422);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Impossible de vérifier l\'URL de l\'image',
                'errors' => ['image_path' => ['URL d\'image invalide']]
            ], 422);
        }

        $entityType = $request->galleriesable_type;
        $entityId = $request->galleriesable_id;

        // Déterminer le modèle en fonction du type d'entité
        $modelClass = match($entityType) {
            'projet' => Projet::class,
            'publication' => Publication::class,
            'axe' => Axe::class,
            'formation' => Formation::class,
            'partnership' => Partnership::class,
            default => null
        };

        if (!$modelClass) {
            return response()->json([
                'status' => 'error',
                'message' => 'Type d\'entité non valide'
            ], 400);
        }

        // Vérifier que l'entité existe
        $entity = $modelClass::find($entityId);
        if (!$entity) {
            return response()->json([
                'status' => 'error',
                'message' => ucfirst($entityType) . ' non trouvé'
            ], 404);
        }

        try {
            // Créer la galerie avec le chemin d'image fourni
            $gallery = new Galleries([
                'title' => $request->title,
                'description' => $request->description,
                'image_path' => $request->image_path,
            ]);

            // Associer la galerie à l'entité via la relation polymorphe
            $entity->galleries()->save($gallery);

            return response()->json([
                'status' => 'success',
                'message' => 'Galerie créée avec succès',
                'data' => [
                    'id' => $gallery->id,
                    'title' => $gallery->title,
                    'description' => $gallery->description,
                    'image_path' => $gallery->image_path,
                    'image_url' => $gallery->image_url,
                    'galleriesable_type' => $this->getFrontendType($entityType),
                    'galleriesable_id' => $entityId,
                    'created_at' => $gallery->created_at,
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la création de la galerie',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified gallery.
     */
    public function show(string $id): JsonResponse
    {
        $gallery = Galleries::find($id);

        if (!$gallery) {
            return response()->json([
                'status' => 'error',
                'message' => 'Galerie non trouvée'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => $gallery->id,
                'title' => $gallery->title,
                'description' => $gallery->description,
                'image_path' => $gallery->image_path,
                'image_url' => $gallery->image_url,
                'galleriesable_type' => $this->getFrontendType($gallery->galleriesable_type),
                'galleriesable_id' => $gallery->galleriesable_id,
                'galleriesable' => $gallery->galleriesable,
                'created_at' => $gallery->created_at,
                'updated_at' => $gallery->updated_at,
            ]
        ]);
    }

    /**
     * Update the specified gallery in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        // Vérifier que l'utilisateur est admin
        if (!$request->user() || !$request->user()->hasRole('admin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Accès non autorisé. Seuls les administrateurs peuvent modifier des galeries.'
            ], 403);
        }

        $gallery = Galleries::find($id);

        if (!$gallery) {
            return response()->json([
                'status' => 'error',
                'message' => 'Galerie non trouvée'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'image_path' => 'sometimes|required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Mettre à jour les champs
            if ($request->has('title')) {
                $gallery->title = $request->title;
            }
            if ($request->has('description')) {
                $gallery->description = $request->description;
            }
            if ($request->has('image_path')) {
                $gallery->image_path = $request->image_path;
            }

            $gallery->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Galerie mise à jour avec succès',
                'data' => [
                    'id' => $gallery->id,
                    'title' => $gallery->title,
                    'description' => $gallery->description,
                    'image_path' => $gallery->image_path,
                    'image_url' => $gallery->image_url,
                    'galleriesable_type' => $this->getFrontendType($gallery->galleriesable_type),
                    'galleriesable_id' => $gallery->galleriesable_id,
                    'updated_at' => $gallery->updated_at,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la mise à jour de la galerie',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified gallery from storage.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        // Vérifier que l'utilisateur est admin
        if (!$request->user() || !$request->user()->hasRole('admin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Accès non autorisé. Seuls les administrateurs peuvent supprimer des galeries.'
            ], 403);
        }

        $gallery = Galleries::find($id);

        if (!$gallery) {
            return response()->json([
                'status' => 'error',
                'message' => 'Galerie non trouvée'
            ], 404);
        }

        try {
            // Supprimer la galerie
            $gallery->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Galerie supprimée avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la suppression de la galerie',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Liste toutes les galeries (pour les administrateurs).
     */
    public function allGalleries(Request $request): JsonResponse
    {
        // Vérifier que l'utilisateur est admin
        if (!$request->user() || !$request->user()->hasRole('admin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Accès non autorisé. Seuls les administrateurs peuvent voir toutes les galeries.'
            ], 403);
        }

        $galleries = Galleries::with('galleriesable')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($gallery) {
                return [
                    'id' => $gallery->id,
                    'title' => $gallery->title,
                    'description' => $gallery->description,
                    'image_path' => $gallery->image_path,
                    'image_url' => $gallery->image_url,
                    'galleriesable_type' => $this->getFrontendType($gallery->galleriesable_type),
                    'galleriesable_id' => $gallery->galleriesable_id,
                    'galleriesable' => $gallery->galleriesable,
                    'created_at' => $gallery->created_at,
                    'updated_at' => $gallery->updated_at,
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $galleries
        ]);
    }

    /**
     * Liste toutes les galeries publiques (pour le frontend).
     */
    public function getGalleries(): JsonResponse
    {
        $galleries = Galleries::with('galleriesable')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($gallery) {
                return [
                    'id' => $gallery->id,
                    'title' => $gallery->title,
                    'description' => $gallery->description,
                    'image_path' => $gallery->image_url, // Utiliser l'URL complète
                    'galleriesable_type' => $this->getFrontendType($gallery->galleriesable_type),
                    'created_at' => $gallery->created_at,
                    'updated_at' => $gallery->updated_at,
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $galleries
        ]);
    }

    /**
     * Convertit les types de modèles Laravel en types frontend.
     */
    private function getFrontendType(string $modelType): string
    {
        return match($modelType) {
            'App\\Models\\Projet' => 'projet',
            'App\\Models\\Publication' => 'publication',
            'App\\Models\\Axe' => 'Axes',
            'App\\Models\\Formation' => 'Formations',
            'App\\Models\\Partnership' => 'Partenariats',
            default => $modelType
        };
    }
}
