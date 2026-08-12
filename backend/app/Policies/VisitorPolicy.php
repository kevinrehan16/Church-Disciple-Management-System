<?php

namespace App\Policies;

use App\Models\Visitor;
use App\Models\User;

class VisitorPolicy
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
        return $user->can('view_visitors');
    }

    public function view(User $user, Visitor $visitor): bool
    {
        return $user->can('view_visitors');
    }

    // Idinagdag ko na rin ang 'create' dahil ginagamit ito sa store() method mo sa controller
    public function create(User $user): bool
    {
        return $user->can('create_visitors');
    }

    public function update(User $user, Visitor $visitor): bool
    {
        return $user->can('edit_visitors');
    }

    public function delete(User $user, Visitor $visitor): bool
    {
        return $user->can('delete_visitors');
    }
}
