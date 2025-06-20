<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAxeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'slug' => 'required|string|max:255|unique:axes,slug',
            'icon' => 'nullable|string|max:255',
            
            // Champs multilingues - au moins le français est requis
            'title_fr' => 'required|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'title_ar' => 'nullable|string|max:255',
            
            'problematique_fr' => 'nullable|string',
            'problematique_en' => 'nullable|string',
            'problematique_ar' => 'nullable|string',
            
            'objectif_fr' => 'nullable|string',
            'objectif_en' => 'nullable|string',
            'objectif_ar' => 'nullable|string',
            
            'approche_fr' => 'nullable|string',
            'approche_en' => 'nullable|string',
            'approche_ar' => 'nullable|string',
            
            'resultats_attendus_fr' => 'nullable|string',
            'resultats_attendus_en' => 'nullable|string',
            'resultats_attendus_ar' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'title_fr.required' => 'Le titre en français est obligatoire.',
            'slug.unique' => 'Ce slug existe déjà.',
        ];
    }
}
