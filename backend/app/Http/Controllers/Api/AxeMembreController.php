<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Axe;
use App\Models\Membre;
use Illuminate\Support\Facades\DB;

class AxeMembreController extends Controller
{
    /**
     * Affiche toutes les relations axe-membre avec les détails.
     */
    public function index()
    {
        $relations = DB::table('axe_membre')
            ->join('axes', 'axe_membre.axe_id', '=', 'axes.id')
            ->join('membres', 'axe_membre.membre_id', '=', 'membres.id')
            ->select(
                'axe_membre.id',
                'axe_membre.position',
                'axe_membre.axe_id',
                'axe_membre.membre_id',
                'axes.title as axe_title',
                'membres.nom as membre_nom',
                'membres.prenom as membre_prenom',
                'membres.email as membre_email',
                'membres.statut as membre_statut',
                'axe_membre.created_at',
                'axe_membre.updated_at'
            )
            ->orderBy('axes.title')
            ->orderBy('axe_membre.position')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $relations
        ]);
    }
} 