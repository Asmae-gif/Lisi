<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Projet;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ProjetController extends Controller
{
    public function index()
    {
        $projets = Projet::all();
        return response()->json($projets);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre_projet' => 'required|string|max:255',
            'description_projet' => 'required|string',
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date|after:date_debut',
            'statut_projet' => 'required|string|in:en_cours,termine,planifie'
        ]);

        $projet = Projet::create($validated);
        return response()->json($projet, Response::HTTP_CREATED);
    }

    public function show(Projet $projet)
    {
        return response()->json($projet);
    }

    public function update(Request $request, Projet $projet)
    {
        $validated = $request->validate([
            'titre_projet' => 'sometimes|string|max:255',
            'description_projet' => 'sometimes|string',
            'date_debut' => 'sometimes|date',
            'date_fin' => 'nullable|date|after:date_debut',
            'statut_projet' => 'sometimes|string|in:en_cours,termine,planifie'
        ]);

        $projet->update($validated);
        return response()->json($projet);
    }

    public function destroy(Projet $projet)
    {
        $projet->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
} 