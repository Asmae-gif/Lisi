<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAxeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isAdmin();
    }

    public function rules(): array
    {
        $axeId = $this->route('axe')->id;

        return [
            'slug' => [
                'required',
                'alpha_dash',
                Rule::unique('axes', 'slug')->ignore($axeId),
            ],
            'title'             => 'required|string|max:255',
            'icon'              => 'nullable|string|max:255',
            // On supprime “description” qui n’existe pas
            'problematique'     => 'nullable|string',
            'objectif'          => 'nullable|string',
            'approche'          => 'nullable|string',
            'resultats_attendus'=> 'nullable|string',
        ];
    }
}
