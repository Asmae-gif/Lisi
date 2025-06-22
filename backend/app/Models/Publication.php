<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Publication extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre_publication',
        'resume',
        'type_publication',
        'date_publication',
        'fichier_pdf_url',
        'lien_externe_doi',
        'reference_complete',
    ];

    public function auteurs()
    {
        return $this->belongsToMany(Membre::class, 'auteur_publication');
    }
    public function galleries()
    {
        return $this->morphMany(Galleries::class, 'galleriesable');
    }
}

