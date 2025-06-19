<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Histoire extends Model
{
    use HasFactory;

    protected $table = 'histoire';

    protected $fillable = [
        'titre',
        'contenu',
        'image',
        'date',
        'ordre'
    ];

    protected $casts = [
        'date' => 'date',
        'ordre' => 'integer'
    ];
} 