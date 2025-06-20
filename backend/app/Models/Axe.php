<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Axe extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'slug',
        'title_fr',
        'title_en',
        'title_ar',
        'icon',
        'problematique_fr',
        'problematique_en',
        'problematique_ar',
        'objectif_fr',
        'objectif_en',
        'objectif_ar',
        'approche_fr',
        'approche_en',
        'approche_ar',
        'resultats_attendus_fr',
        'resultats_attendus_en',
        'resultats_attendus_ar',
    ];

    /**
     * Relation Many-to-Many entre Axe et Membre.
     * La table pivot s'appelle "axe_membre" et contient une colonne "position".
     */
    public function membres()
    {
        return $this->belongsToMany(Membre::class, 'axe_membre')
                    ->withPivot('position')
                    ->withTimestamps();
    }

    /**
     * Ajoute un membre à cet axe, en précisant éventuellement sa position.
     *
     * @param  Membre      $membre
     * @param  string|null $position
     * @return void
     */
    public function addMembre(Membre $membre, string $position = null): void
    {
        $this->membres()->attach($membre->id, ['position' => $position]);
    }

    /**
     * Retire un membre de cet axe.
     *
     * @param  Membre $membre
     * @return int   Nombre de lignes supprimées dans le pivot
     */
    public function removeMembre(Membre $membre): int
    {
        return $this->membres()->detach($membre->id);
    }

    /**
     * Met à jour la position d'un membre existant dans cet axe.
     *
     * @param  Membre $membre
     * @param  string $position
     * @return bool   True si la mise à jour a été effectuée
     */
    public function updateMembrePosition(Membre $membre, string $position): bool
    {
        return $this->membres()->updateExistingPivot($membre->id, ['position' => $position]);
    }

    /**
     * Récupère tous les membres dont la position dans cet axe correspond à la valeur passée.
     *
     * @param  string       $position
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getMembresByPosition(string $position)
    {
        return $this->membres()->wherePivot('position', $position)->get();
    }

    public function galleries()
    {
        return $this->morphMany(Galleries::class, 'galleriesable');
    }

    /**
     * Récupère le contenu dans la langue spécifiée
     *
     * @param  string $field
     * @param  string $language
     * @return string
     */
    public function getContent(string $field, string $language = 'fr'): string
    {
        $key = "{$field}_{$language}";
        return $this->$key ?? $this->{"{$field}_fr"} ?? '';
    }

    /**
     * Accesseur pour le titre dans la langue actuelle
     */
    public function getTitleAttribute(): string
    {
        return $this->title_fr ?? '';
    }

    /**
     * Accesseur pour la problématique dans la langue actuelle
     */
    public function getProblematiqueAttribute(): string
    {
        return $this->problematique_fr ?? '';
    }

    /**
     * Accesseur pour l'objectif dans la langue actuelle
     */
    public function getObjectifAttribute(): string
    {
        return $this->objectif_fr ?? '';
    }

    /**
     * Accesseur pour l'approche dans la langue actuelle
     */
    public function getApprocheAttribute(): string
    {
        return $this->approche_fr ?? '';
    }

    /**
     * Accesseur pour les résultats attendus dans la langue actuelle
     */
    public function getResultatsAttendusAttribute(): string
    {
        return $this->resultats_attendus_fr ?? '';
    }
}
