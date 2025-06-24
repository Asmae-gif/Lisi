<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Partenaire extends Model
{
    use HasFactory;

    protected $fillable = ['nom_fr', 'nom_en', 'nom_ar', 'logo', 'lien'];

    public function galleries()
    {
        return $this->morphMany(Galleries::class, 'galleriesable');
    }
} 

