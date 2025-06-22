<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'type_projet',
        'status',
        'date_debut',
        'date_fin',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'date_debut' => 'date',
        'date_fin' => 'date',
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