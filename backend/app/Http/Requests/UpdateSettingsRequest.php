<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Config;

class UpdateSettingsRequest extends FormRequest
{
    public function authorize()
    {
        return auth()->check() && auth()->user()->isAdmin();
    }

    public function rules()
    {
        $page = $this->route('page');
        $fields = Config::get("page_settings.{$page}", []);

        $rules = [];
        
        // Ajouter les règles pour les champs avec des points (format config)
        foreach ($fields as $key => $config) {
            $rules[$key] = $config['validation'] ?? 'nullable';
        }
        
        // Ajouter les règles pour les champs avec des underscores (format frontend)
        foreach ($fields as $key => $config) {
            $underscoreKey = str_replace('.', '_', $key);
            $rules[$underscoreKey] = $config['validation'] ?? 'nullable';
        }
        
        // Ajouter des règles génériques pour les fichiers
        $rules['nos_domaines_image'] = 'nullable|image|mimes:jpeg,png,jpg,gif|max:4048';
        $rules['page'] = 'required|string';
        
        return $rules;
    }
}