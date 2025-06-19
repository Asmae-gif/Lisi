<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Cette méthode s'exécute AVANT les autres.
     * Si l'utilisateur est admin, on lui donne tous les droits.
     */
    public function before(User $user, $ability)
    {
        if ($user->isAdmin()) {
            return true;
        }
        return null; // Laisse Laravel invoquer les autres méthodes de la policy
    }

    /**
     * Détermine si l'utilisateur peut voir la liste de tous les utilisateurs.
     * Seuls les admins (via `before`) sont autorisés.
     */
    public function viewAny(User $user): bool
    {
        return false;
        // (le `before` autorise l'admin, et personne d'autre ne peut lister)
    }

    /**
     * Détermine si l'utilisateur peut voir le profil d'un utilisateur donné.
     * - Un utilisateur peut voir SA propre fiche.
     * - Un admin est déjà autorisé par `before`.
     */
    public function view(User $user, User $model): bool
    {
        return $user->id === $model->id;
    }

    /**
     * Détermine si l'utilisateur peut créer un compte User.
     * Ici, on ne passe pas par la policy pour l'inscription publique.
     * Si jamais vous invoquez `can:create,User::class`, renvoyer false.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Détermine si l'utilisateur peut mettre à jour un profil User donné.
     * - Un utilisateur peut modifier SON propre profil.
     * - Un admin est autorisé par `before`.
     */
    public function update(User $user, User $model): bool
    {
        return $user->id === $model->id;
    }

    /**
     * Détermine si l'utilisateur peut supprimer un profil User donné.
     * - Aucun utilisateur normal ne peut supprimer.
     * - Un admin l'est via `before`.
     */
    public function delete(User $user, User $model): bool
    {
        return false;
    }

    /**
     * (Optionnel) Méthode “manage” pour centraliser les droits d'administration.
     * Si vous appelez `$this->authorize('manage', $user)` dans un contrôleur,
     * un admin passera (via `before`), sinon ce renvoie false.
     */
    public function manage(User $user, User $model): bool
    {
        return false;
    }
}
