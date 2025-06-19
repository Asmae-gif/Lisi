<?php

namespace App\Http\Controllers\Api;

use App\Models\Histoire;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;

class HistoireController extends Controller
{
    public function index()
    {
        $histoires = Histoire::orderBy('ordre')->get();
        return response()->json([
            'data' => $histoires,
            'message' => 'Histoires récupérées avec succès'
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'contenu' => 'required|string',
            'image' => 'nullable|string',
            'date' => 'required|date',
            'ordre' => 'required|integer'
        ]);

        $histoire = Histoire::create($request->all());

        return response()->json([
            'data' => $histoire,
            'message' => 'Histoire créée avec succès'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'contenu' => 'required|string',
            'image' => 'nullable|string',
            'date' => 'required|date',
            'ordre' => 'required|integer'
        ]);

        $histoire = Histoire::findOrFail($id);
        $histoire->update($request->all());

        return response()->json([
            'data' => $histoire,
            'message' => 'Histoire mise à jour avec succès'
        ]);
    }

    public function destroy($id)
    {
        $histoire = Histoire::findOrFail($id);
        $histoire->delete();

        return response()->json([
            'message' => 'Histoire supprimée avec succès'
        ]);
    }
} 