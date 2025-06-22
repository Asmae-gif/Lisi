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
    ];

    // Relation many-to-many avec les membres
    public function membres()
    {
        return $this->belongsToMany(Membre::class, 'prix_distinction_membre')
                    ->withPivot('role', 'ordre')
                    ->withTimestamps();
    }
    
    // Méthode pour ajouter un membre à un prix
    public function addMembre(Membre $membre, string $role = null, int $ordre = 0)
    {
        return $this->membres()->attach($membre->id, [
            'role' => $role,
            'ordre' => $ordre
        ]);
    }

    // Méthode pour retirer un membre d'un prix
    public function removeMembre(Membre $membre)
    {
        return $this->membres()->detach($membre->id);
    }

    // Méthode pour mettre à jour le rôle d'un membre
    public function updateMembreRole(Membre $membre, string $role, int $ordre = null)
    {
        $data = ['role' => $role];
        if ($ordre !== null) {
            $data['ordre'] = $ordre;
        }
        return $this->membres()->updateExistingPivot($membre->id, $data);
    }
    public function galleries()
    {
        return $this->morphMany(Galleries::class, 'galleriesable');
    }
}
