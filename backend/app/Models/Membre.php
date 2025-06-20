<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Storage;

class Membre extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nom',
        'prenom',
        'email',
        'photo',
        'statut',
        'biographie',
        'slug',
        'google_id',
        'linkedin',
        'researchgate',
        'google_scholar',
        'grade',
        'is_comite',
    ];
    protected $appends = ['photo_url', 'email_complet'];

    protected $casts = [
        'biographie' => 'string',
        'is_comite' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function publications()
    {
        return $this->belongsToMany(Publication::class, 'auteur_publication');
    }
    public function prixDistinctions()
    {
        return $this->belongsToMany(PrixDistinction::class, 'prix_distinction_membre')
                    ->withPivot('role', 'ordre')
                    ->withTimestamps();
    }
    public function axes()
    {
        return $this->belongsToMany(Axe::class, 'axe_membre')
            ->withPivot('position')
            ->withTimestamps();
    }

    // Méthode pour ajouter un membre à un axe
    public function addToAxe(Axe $axe, string $position = null)
    {
        return $this->axes()->attach($axe->id, ['position' => $position]);
    }

    // Méthode pour retirer un membre d'un axe
    public function removeFromAxe(Axe $axe)
    {
        return $this->axes()->detach($axe->id);
    }

    // Méthode pour mettre à jour la position dans un axe
    public function updateAxePosition(Axe $axe, string $position)
    {
        return $this->axes()->updateExistingPivot($axe->id, ['position' => $position]);
    }

    // Accessor pour récupérer l'URL de la photo
    protected function photoUrl(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->photo
                ? asset('storage/membres/photos/' . $this->photo)
                : asset('images/default-avatar.png'),
        );
    }

    // Accessor pour l'email
    protected function emailComplet(): Attribute
    {
        return Attribute::make(
            get: function () {
                return $this->user ? $this->user->email : $this->email;
            }
        );
    }
} 