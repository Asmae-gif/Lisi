<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['page', 'key', 'value'];

    /**
     * Retourne toutes les paires key=>value pour une page donnée
     */
    public static function forPage(string $page): array
    {
        \Log::info('Recherche des settings pour la page', ['page' => $page]);
        
        $settings = self::where('page', $page)
                       ->get(['key', 'value'])
                       ->mapWithKeys(function ($item) {
                           return [$item->key => $item->value];
                       })
                       ->toArray();
                       
        \Log::info('Settings trouvés', ['settings' => $settings]);
        
        return $settings;
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