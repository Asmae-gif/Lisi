<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Galleries extends Model
{
    use HasFactory;

    protected $fillable = [
        'galleriesable_id',
        'galleriesable_type',
        'title',
        'description',
        'image_path'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function galleriesable()
    {
        return $this->morphTo();
    }

    /**
     * Récupère l'URL complète de l'image
     */
    public function getImageUrlAttribute()
    {
        if (!$this->image_path) {
            return null;
        }
    
        // Si l'image est une URL complète (externe)
        if (Str::startsWith($this->image_path, ['http://', 'https://'])) {
            return $this->image_path;
        }
    
        // Sinon, c’est une image locale
        return asset('storage/' . $this->image_path);
    }
    
}
