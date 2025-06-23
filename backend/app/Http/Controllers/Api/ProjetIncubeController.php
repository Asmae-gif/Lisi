<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProjetIncube;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ProjetIncubeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $incubes = ProjetIncube::with('project')->get();
        return response()->json($incubes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'incubateur' => 'required|string|max:255',
            'lieu_incubation' => 'nullable|string|max:255',
            'accompagnateur' => 'nullable|string|max:255',
            'date_entree' => 'nullable|date',
        ]);

        $incube = ProjetIncube::create($validated);
        return response()->json($incube, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(ProjetIncube $projetIncube)
    {
        return response()->json($projetIncube->load('project'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProjetIncube $projetIncube)
    {
        $validated = $request->validate([
            'project_id' => 'sometimes|exists:projects,id',
            'incubateur' => 'sometimes|string|max:255',
            'lieu_incubation' => 'nullable|string|max:255',
            'accompagnateur' => 'nullable|string|max:255',
            'date_entree' => 'nullable|date',
        ]);

        $projetIncube->update($validated);
        return response()->json($projetIncube);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProjetIncube $projetIncube)
    {
        $projetIncube->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }

    /**
     * Get incubations by project ID
     */
    public function byProject($projectId)
    {
        $incubes = ProjetIncube::where('project_id', $projectId)->get();
        return response()->json($incubes);
    }
}
