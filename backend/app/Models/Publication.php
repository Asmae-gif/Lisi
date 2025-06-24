<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Publication extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre_publication_fr',
        'titre_publication_en',
        'titre_publication_ar',
        'resume_fr',
        'resume_en',
        'resume_ar',
        'type_publication',
        'date_publication',
        'fichier_pdf_url',
        'lien_externe_doi',
        'reference_complete_fr',
        'reference_complete_en',
        'reference_complete_ar',
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

