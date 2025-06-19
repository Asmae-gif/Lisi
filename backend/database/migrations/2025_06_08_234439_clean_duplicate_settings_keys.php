<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Nettoyer les entrées en double en gardant le format avec underscore
        $duplicates = DB::table('settings')
            ->where('page', 'recherche')
            ->where(function($query) {
                $query->where('key', 'like', 'nos.domaines_%')
                      ->orWhere('key', 'like', 'axes.strategiques_%');
            })
            ->get();

        foreach ($duplicates as $duplicate) {
            // Convertir le format avec point vers le format avec underscore
            $newKey = str_replace('.', '_', $duplicate->key);
            
            // Vérifier si l'entrée avec underscore existe déjà
            $existing = DB::table('settings')
                ->where('page', $duplicate->page)
                ->where('key', $newKey)
                ->first();
            
            if ($existing) {
                // Si l'entrée avec underscore existe, supprimer celle avec point
                DB::table('settings')->where('id', $duplicate->id)->delete();
            } else {
                // Sinon, mettre à jour la clé
                DB::table('settings')
                    ->where('id', $duplicate->id)
                    ->update(['key' => $newKey]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Convertir les clés avec underscore vers le format avec point
        $settings = DB::table('settings')
            ->where('page', 'recherche')
            ->where(function($query) {
                $query->where('key', 'like', 'nos_domaines_%')
                      ->orWhere('key', 'like', 'axes_strategiques_%');
            })
            ->get();

        foreach ($settings as $setting) {
            $newKey = str_replace('_', '.', $setting->key);
            DB::table('settings')
                ->where('id', $setting->id)
                ->update(['key' => $newKey]);
        }
    }
};
