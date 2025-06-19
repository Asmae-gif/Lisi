<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ThemeRechercheController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->membre->themesRecherche;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre_theme' => 'required|string',
            'description_theme' => 'required|string',
            'mots_cles' => 'nullable|string',
        ]);

        return $request->user()->membre->themesRecherche()->create($validated);
    }

    public function show(Request $request, $id)
    {
        $theme = $request->user()->membre->themesRecherche()->findOrFail($id);
        return response()->json($theme);
    }

    public function update(Request $request, $id)
    {
        $theme = $request->user()->membre->themesRecherche()->findOrFail($id);
        
        $validated = $request->validate([
            'titre_theme' => 'sometimes|string',
            'description_theme' => 'sometimes|string',
            'mots_cles' => 'nullable|string',
        ]);

        $theme->update($validated);
        return response()->json($theme);
    }

    public function destroy(Request $request, $id)
    {
        $theme = $request->user()->membre->themesRecherche()->findOrFail($id);
        $theme->delete();
        return response()->json(['message' => 'Thème supprimé'], Response::HTTP_NO_CONTENT);
    }
}

