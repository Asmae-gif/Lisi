<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MotDirecteur extends Model
{
    use HasFactory;

    protected $table = 'mot_directeur';

    protected $fillable = [
        'titre',
        'contenu',
        'image',
        'nom_directeur',
        'poste'
    ];
} 