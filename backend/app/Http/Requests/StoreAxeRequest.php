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
            'slug'               => 'required|string|max:255|unique:axes,slug',
            'title'              => 'required|string|max:255',
            'icon'               => 'nullable|string|max:255',
            // On retire “description”
            'problematique'      => 'nullable|string',
            'objectif'           => 'nullable|string',
            'approche'           => 'nullable|string',
            'resultats_attendus' => 'nullable|string',
        ];
    }
}
