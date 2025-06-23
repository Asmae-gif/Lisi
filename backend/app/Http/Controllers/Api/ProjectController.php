<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    public function index(): JsonResponse
    {
        $projects = Project::with(['finances', 'incubations'])->get();
        return response()->json($projects);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'type_projet' => 'required|string|in:finance,incube',
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'status' => 'required|string|in:en_attente,en_cours,suspendu,termine,annule,publie,archive,rejete',
        ]);

        $project = Project::create($validated);
        return response()->json($project, 201);
    }

    public function show(Project $project): JsonResponse
    {
        $project->load(['finances', 'incubations']);
        return response()->json($project);
    }

    public function update(Request $request, Project $project): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'type_projet' => 'required|string|in:finance,incube',
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'status' => 'required|string|in:en_attente,en_cours,suspendu,termine,annule,publie,archive,rejete',
        ]);

        $project->update($validated);
        return response()->json($project);
    }

    public function destroy(Project $project): JsonResponse
    {
        $project->delete();
        return response()->json(null, 204);
    }
} 