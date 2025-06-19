<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Membre;

class UpdateMembreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        
        // Les administrateurs peuvent modifier n'importe quel membre
        if ($user && $user->hasRole('admin')) {
            return true;
        }
        
        // L'utilisateur peut modifier son propre profil
        return $user && $user->membre;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $user = $this->user();
        $membre = $user ? $user->membre : null;
        $membreId = $membre ? $membre->id : null;
        $userId = $membre ? $membre->user_id : null;
        
        // Si c'est un admin, récupérer l'ID du membre depuis la route
        if ($user && $user->hasRole('admin')) {
            $routeMembre = $this->route('membre');
            $membreId = $routeMembre ? $routeMembre->id : null;
            $userId = $routeMembre ? $routeMembre->user_id : null;
        }

        return [
            'nom'           => 'sometimes|required|string|max:255',
            'prenom'        => 'sometimes|required|string|max:255',
            'statut'        => 'sometimes|required|string|max:255',
            'email'         => 'sometimes|required|email|max:255|unique:users,email,' . $userId,
            'biographie'    => 'nullable|string|max:1000',
            'photo'         => 'nullable|image|max:2048',  
            'slug'          => 'sometimes|required|string|max:255|unique:membres,slug,' . $membreId,
            'grade'         => 'nullable|string|max:255',
            'linkedin'      => 'nullable|url|max:255',
            'researchgate'  => 'nullable|url|max:255',
            'google_scholar'=> 'nullable|url|max:255',
            'axes'          => 'nullable|array',
            'axes.*.id'     => 'required_with:axes|exists:axes,id',
            'axes.*.position'=> 'nullable|string|max:255',
        ];
    }
}
