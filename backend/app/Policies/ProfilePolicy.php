<?php

namespace App\Policies;

use App\Models\User;

class ProfilePolicy
{
    // Awtomatikong pinapayagan ang super_admin sa lahat ng aksyon
    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasRole('super_admin')) {
            return true;
        }
        return null;
    }

    /**
     * Pwede lang tingnan ang profile kung siya mismo ang may-ari 
     * o kung may permission siyang mag-manage ng users.
     */
    public function view(User $user, User $model): bool
    {
        return $user->id === $model->id || $user->can('manage users');
    }

    /**
     * Pwede lang i-update ang profile kung siya mismo ang may-ari 
     * o kung isa siyang admin/pastor na pinahihintulutan.
     */
    public function update(User $user, User $model): bool
    {
        return $user->id === $model->id || $user->can('manage users');
    }
}
