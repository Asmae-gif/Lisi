<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['page', 'key', 'value'];

    /**
     * Retourne toutes les paires key=>value pour une page donnée
     * Détecte automatiquement s'il faut une structure plate ou hiérarchique
     */
    public static function forPage(string $page): array
    {
        \Log::info('Recherche des settings pour la page', ['page' => $page]);
        
        $flatSettings = self::where('page', $page)
                           ->get(['key', 'value'])
                           ->mapWithKeys(function ($item) {
                               return [$item->key => $item->value];
                           })
                           ->toArray();
                           
        \Log::info('Settings bruts trouvés', ['settings' => $flatSettings]);
        
        // Pages qui utilisent une structure hiérarchique (multilingue intégrée)
        $hierarchicalPages = ['index', 'membres'];
        
        // Si c'est une page hiérarchique, restructurer les données
        if (in_array($page, $hierarchicalPages)) {
            return self::buildHierarchicalStructure($flatSettings);
        }
        
        // Pour les autres pages, garder la structure plate
        return $flatSettings;
    }
    
    /**
     * Construit une structure hiérarchique pour les pages multilingues
     */
    private static function buildHierarchicalStructure(array $flatSettings): array
    {
        $structuredSettings = [];
        $languages = ['fr', 'ar', 'en'];
        
        // Initialiser les objets de langue
        foreach ($languages as $lang) {
            $structuredSettings[$lang] = [];
        }
        
        foreach ($flatSettings as $key => $value) {
            // Ignorer les entrées invalides (objets JavaScript)
            if ($value === '[object Object]' || is_null($value)) {
                \Log::warning('Valeur invalide ignorée', ['key' => $key, 'value' => $value]);
                continue;
            }
            
            $processed = false;
            
            // Vérifier si la clé se termine par _fr, _ar, ou _en
            foreach ($languages as $lang) {
                $suffix = '_' . $lang;
                if (str_ends_with($key, $suffix)) {
                    $baseKey = substr($key, 0, -strlen($suffix));
                    $structuredSettings[$lang][$baseKey] = $value;
                    $processed = true;
                    break;
                }
            }
            
            // Si la clé n'a pas de suffixe de langue, l'ajouter au niveau racine
            if (!$processed) {
                $structuredSettings[$key] = $value;
            }
        }
        
        \Log::info('Settings structurés (hiérarchique)', ['settings' => $structuredSettings]);
        
        return $structuredSettings;
    }

    public function scopeForPage($query, string $page)
    {
        return $query->where('page', $page);
    }

    public function scopeForKey($query, string $key)
    {
        return $query->where('key', $key);
    }
}