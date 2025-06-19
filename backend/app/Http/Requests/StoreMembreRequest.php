<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMembreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:membres,email',
            'telephone' => 'nullable|string|max:20',
            'position' => 'required|string|in:chercheur,doctorant,post-doc,autre',
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date|after:date_debut',
            'description' => 'nullable|string',
            'publications' => 'nullable|array',
            'publications.*' => 'exists:publications,id',
            'axes' => 'required|array|min:1',
            'axes.*' => 'exists:axes,id',
            'photo' => 'nullable|image|max:2048', // 2MB max
            'cv' => 'nullable|mimes:pdf|max:5120', // 5MB max
        ];
    }

    public function messages()
    {
        return [
            'nom.required' => 'Le nom est requis',
            'prenom.required' => 'Le prénom est requis',
            'email.required' => 'L\'email est requis',
            'email.email' => 'L\'email doit être une adresse valide',
            'email.unique' => 'Cet email est déjà utilisé',
            'position.required' => 'La position est requise',
            'position.in' => 'La position doit être : chercheur, doctorant, post-doc ou autre',
            'date_debut.required' => 'La date de début est requise',
            'date_debut.date' => 'La date de début doit être une date valide',
            'date_fin.date' => 'La date de fin doit être une date valide',
            'date_fin.after' => 'La date de fin doit être après la date de début',
            'axes.required' => 'Au moins un axe de recherche est requis',
            'axes.array' => 'Les axes doivent être une liste',
            'axes.min' => 'Au moins un axe de recherche est requis',
            'photo.image' => 'Le fichier doit être une image',
            'photo.max' => 'L\'image ne doit pas dépasser 2MB',
            'cv.mimes' => 'Le CV doit être un fichier PDF',
            'cv.max' => 'Le CV ne doit pas dépasser 5MB',
        ];
    }
} 