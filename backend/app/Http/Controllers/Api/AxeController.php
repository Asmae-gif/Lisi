<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAxeRequest;
use App\Http\Requests\UpdateAxeRequest;
use App\Models\Axe;
use App\Models\Membre;
use Illuminate\Http\Request;

class AxeController extends Controller
{
    /**
     * Affiche la liste de tous les axes avec leurs membres ordonnés par position.
     */
    public function index()
    {
        return Axe::with(['membres' => function ($query) {
            // "position" est la colonne dans la table de pivot "axe_membre"
            $query->orderBy('axe_membre.position');
        }])->get();
    }

    public function show(Axe $axe)
    {
        return $axe->load(['membres' => function ($query) {
            $query->orderBy('axe_membre.position');
        }]);
    }

    // Routes protégées (admin uniquement)
    public function store(StoreAxeRequest $request)
    {
        $this->authorize('create', Axe::class);
        return Axe::create($request->validated());
    }

    public function update(UpdateAxeRequest $request, Axe $axe)
    {
        $this->authorize('update', $axe);
        $axe->update($request->validated());
        return $axe;
    }

    public function destroy(Axe $axe)
    {
            $this->authorize('delete', $axe);
            $axe->delete();
            return response()->noContent();
    

    }

    /**
     * Ajouter un membre à un axe.
     */
    public function addMembre(Request $request, Axe $axe)
    {
        $this->authorize('manage', $axe);

        $request->validate([
            'membre_id' => 'required|exists:membres,id',
            'position'  => 'nullable|string|max:255'
        ]);

        $membre = Membre::findOrFail($request->membre_id);

        // Vérifier si le membre n'est pas déjà dans cet axe
        if ($axe->membres()->where('membre_id', $membre->id)->exists()) {
            return response()->json([
                'message' => 'Ce membre est déjà dans cet axe'
            ], 422);
        }

        $axe->addMembre($membre, $request->position);

        return response()->json([
            'message' => 'Membre ajouté à l\'axe avec succès',
            'axe'     => $axe->load(['membres' => function ($query) {
                $query->orderBy('axe_membre.position');
            }])
        ]);
    }

    /**
     * Retirer un membre d'un axe.
     */
    public function removeMembre(Request $request, Axe $axe, Membre $membre)
    {
        $this->authorize('manage', $axe);

        // Vérifier si le membre est bien dans l'axe
        if (! $axe->membres()->where('membre_id', $membre->id)->exists()) {
            return response()->json([
                'message' => 'Ce membre n\'est pas dans cet axe'
            ], 422);
        }

        $axe->removeMembre($membre);

        return response()->json([
            'message' => 'Membre retiré de l\'axe avec succès',
            'axe'     => $axe->load(['membres' => function ($query) {
                $query->orderBy('axe_membre.position');
            }])
        ]);
    }

    /**
     * Mettre à jour la position d'un membre dans un axe.
     */
    public function updateMembrePosition(Request $request, Axe $axe, Membre $membre)
    {
        $this->authorize('manage', $axe);

        $request->validate([
            'position' => 'required|string|max:255'
        ]);

        // Vérifier si le membre est bien dans l'axe
        if (! $axe->membres()->where('membre_id', $membre->id)->exists()) {
            return response()->json([
                'message' => 'Ce membre n\'est pas dans cet axe'
            ], 422);
        }

        $axe->updateMembrePosition($membre, $request->position);

        return response()->json([
            'message' => 'Position du membre mise à jour avec succès',
            'axe'     => $axe->load(['membres' => function ($query) {
                $query->orderBy('axe_membre.position');
            }])
        ]);
    }

    /**
     * Obtenir tous les membres d'un axe avec une position spécifique.
     */
    public function getMembresByPosition(Request $request, Axe $axe)
    {
        $request->validate([
            'position' => 'required|string|max:255'
        ]);

        $membres = $axe->getMembresByPosition($request->position);

        return response()->json([
            'membres' => $membres
        ]);
    }
}
