<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjetFinance extends Model
{
    protected $fillable = [
        'project_id',
        'financeur',
        'montant',
        'type_financement',
        'date_financement',
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'date_financement' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
