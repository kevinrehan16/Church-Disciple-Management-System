<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    // Awtomatikong pinapayagan ang super_admin sa lahat ng aksyon
    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasRole('super_admin')) {
            return true;
        }
        return null;
    }

    public function viewAny(User $user): bool
    {
        // Halimbawa: Ang mga may 'manage users' permission lang ang pwedeng tumingin ng listahan
        return $user->can('manage users');
    }

    public function update(User $user, User $model): bool
    {
        // Halimbawa: Pwedeng i-update kung may permission, o kaya ay sarili niyang account
        return $user->can('manage users') || $user->id === $model->id;
    }

    public function delete(User $user, User $model): bool
    {
        // Hindi pwedeng i-delete ng user ang sarili niya kahit super_admin pa siya (safety measure)
        if ($user->id === $model->id) {
            return false;
        }

        return $user->can('manage users');
    }
}
