<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Publication;
use App\Models\Membre;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PublicationController extends Controller
{
    public function index()
    {
        $publications = Publication::orderBy('date_publication', 'desc')
            ->get();
        return response()->json($publications);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'titre_publication_fr' => 'required|string|max:255',
            'titre_publication_en' => 'nullable|string|max:255',
            'titre_publication_ar' => 'nullable|string|max:255',
            'resume_fr' => 'required|string',
            'resume_en' => 'nullable|string',
            'resume_ar' => 'nullable|string',
            'type_publication' => 'required|string',
            'date_publication' => 'required|date',
            'fichier_pdf' => 'nullable|file|mimes:pdf|max:10240', // max 10MB
            'lien_externe_doi' => 'nullable|url',
            'reference_complete_fr' => 'nullable|string',
            'reference_complete_en' => 'nullable|string',
            'reference_complete_ar' => 'nullable|string',
            'auteurs' => 'required|array',
            'auteurs.*' => 'exists:membres,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $data = $request->all();
            
            // Gestion du fichier PDF
            if ($request->hasFile('fichier_pdf')) {
                $file = $request->file('fichier_pdf');
                $path = $file->store('publications', 'public');
                $data['fichier_pdf_url'] = Storage::url($path);
            }

            $publication = Publication::create($data);
            
            // Attacher les auteurs
            if (isset($data['auteurs'])) {
                $publication->auteurs()->attach($data['auteurs']);
            }

            return response()->json([
                'message' => 'Publication créée avec succès',
                'publication' => $publication->load('auteurs')
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la création de la publication',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show(Publication $publication)
    {
        return response()->json($publication->load('auteurs'));
    }

    public function update(Request $request, Publication $publication)
    {
        $validator = Validator::make($request->all(), [
            'titre_publication_fr' => 'sometimes|string|max:255',
            'titre_publication_en' => 'nullable|string|max:255',
            'titre_publication_ar' => 'nullable|string|max:255',
            'resume_fr' => 'sometimes|string',
            'resume_en' => 'nullable|string',
            'resume_ar' => 'nullable|string',
            'type_publication' => 'sometimes|string',
            'date_publication' => 'sometimes|date',
            'fichier_pdf' => 'nullable|file|mimes:pdf|max:10240',
            'lien_externe_doi' => 'nullable|url',
            'reference_complete_fr' => 'nullable|string',
            'reference_complete_en' => 'nullable|string',
            'reference_complete_ar' => 'nullable|string',
            'auteurs' => 'sometimes|array',
            'auteurs.*' => 'exists:membres,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $data = $request->all();

            // Gestion du fichier PDF
            if ($request->hasFile('fichier_pdf')) {
                // Supprimer l'ancien fichier s'il existe
                if ($publication->fichier_pdf_url) {
                    Storage::delete(str_replace('/storage/', 'public/', $publication->fichier_pdf_url));
                }
                
                $file = $request->file('fichier_pdf');
                $path = $file->store('publications', 'public');
                $data['fichier_pdf_url'] = Storage::url($path);
            }

            $publication->update($data);

            // Mise à jour des auteurs
            if (isset($data['auteurs'])) {
                $publication->auteurs()->sync($data['auteurs']);
            }

            return response()->json([
                'message' => 'Publication mise à jour avec succès',
                'publication' => $publication->load('auteurs')
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la mise à jour de la publication',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy(Publication $publication)
    {
        try {
            // Supprimer le fichier PDF s'il existe
            if ($publication->fichier_pdf_url) {
                Storage::delete(str_replace('/storage/', 'public/', $publication->fichier_pdf_url));
            }

            // Supprimer les relations avec les auteurs
            $publication->auteurs()->detach();
            
            $publication->delete();

            return response()->json([
                'message' => 'Publication supprimée avec succès'
            ], Response::HTTP_NO_CONTENT);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la suppression de la publication',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Récupérer les publications d'un membre spécifique
     */
    public function byMembre($membreId)
    {
        try {
            $membre = Membre::findOrFail($membreId);
            $publications = $membre->publications()
                ->orderBy('date_publication', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $publications,
                'message' => 'Publications du membre récupérées avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des publications du membre',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 