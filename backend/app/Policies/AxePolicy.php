<?php

namespace App\Policies;

use App\Models\Axe;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Auth\Access\HandlesAuthorization;

class AxePolicy
{
    use HandlesAuthorization;

    public function before(User $user, $ability)
    {
        if ($user->isAdmin()) {
            return true;
        }
    }
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // Tout le monde peut voir la liste des axes
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Axe $axe): bool
    {
        return true; // Tout le monde peut voir un axe
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Axe $axe): bool
    {
        return $user->hasRole('admin');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Axe $axe): bool
    {
        return $user->hasRole('admin');
    }

    /**
     * Determine whether the user can manage members in the axe.
     */
    public function manage(User $user, Axe $axe): bool
    {
        return $user->hasRole('admin');
    }
}
