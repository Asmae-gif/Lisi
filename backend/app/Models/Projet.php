<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Projet extends Model
{
    protected $fillable = [
        'titre_projet',
        'description_projet',
        'date_debut',
        'date_fin',
        'statut_projet',
        'type_projet',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function finances()
    {
        return $this->hasMany(ProjetFinance::class);
    }

    public function incubations()
    {
        return $this->hasMany(ProjetIncube::class);
    }

    public function galleries()
    {
        return $this->morphMany(Galleries::class, 'galleriesable');
    }
}
