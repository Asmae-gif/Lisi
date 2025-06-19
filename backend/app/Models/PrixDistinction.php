<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrixDistinction extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'description',
        'date_obtention',
        'organisme',
        'image_url',
        'lien_externe',
        'membre_id',
    ];

    public function membre()
    {
        return $this->belongsTo(Membre::class);
    }
}
