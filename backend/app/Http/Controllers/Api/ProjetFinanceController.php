<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProjetFinance;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ProjetFinanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $finances = ProjetFinance::with('project')->get();
        return response()->json($finances);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'financeur' => 'required|string|max:255',
            'montant' => 'required|numeric|min:0',
            'type_financement' => 'required|string|max:255',
            'date_financement' => 'nullable|date',
        ]);

        $finance = ProjetFinance::create($validated);
        return response()->json($finance, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(ProjetFinance $projetFinance)
    {
        return response()->json($projetFinance->load('project'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProjetFinance $projetFinance)
    {
        $validated = $request->validate([
            'project_id' => 'sometimes|exists:projects,id',
            'financeur' => 'sometimes|string|max:255',
            'montant' => 'sometimes|numeric|min:0',
            'type_financement' => 'sometimes|string|max:255',
            'date_financement' => 'nullable|date',
        ]);

        $projetFinance->update($validated);
        return response()->json($projetFinance);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProjetFinance $projetFinance)
    {
        $projetFinance->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }

    public function byProject($projectId)
    {
        $finances = ProjetFinance::where('project_id', $projectId)->get();
        return response()->json($finances);
    }
}
