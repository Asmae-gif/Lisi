<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Formation extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre_formation',
        'description_formation',
        'date_debut',
        'date_fin',
        'lieu',
        'type_formation',
        'statut_formation',
        'nombre_places',
        'prix',
        'formateur',
        'objectifs',
        'prerequis',
        'programme',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
        'prix' => 'decimal:2',
        'nombre_places' => 'integer',
    ];

    public function participants()
    {
        return $this->belongsToMany(Membre::class, 'formation_participant');
    }

    public function galleries()
    {
        return $this->morphMany(Galleries::class, 'galleriesable');
    }

    /**
     * Récupère le statut de la formation
     */
    public function getStatutFormationAttribute($value)
    {
        return $value ?? 'planifiee';
    }

    /**
     * Vérifie si la formation est en cours
     */
    public function isEnCours()
    {
        $now = now();
        return $this->date_debut <= $now && $this->date_fin >= $now;
    }

    /**
     * Vérifie si la formation est terminée
     */
    public function isTerminee()
    {
        return $this->date_fin < now();
    }

    /**
     * Vérifie si la formation est à venir
     */
    public function isAVenir()
    {
        return $this->date_debut > now();
    }
} 