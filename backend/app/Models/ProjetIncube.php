<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjetIncube extends Model
{
    protected $fillable = [
        'project_id',
        'incubateur',
        'lieu_incubation',
        'accompagnateur',
        'date_entree',
    ];

    protected $casts = [
        'date_entree' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
