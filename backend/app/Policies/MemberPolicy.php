<?php

namespace App\Policies;

use App\Models\Member;
use App\Models\User;

class MemberPolicy
{
    // Awtomatikong pinapayagan ang Super Admin sa lahat ng aksyon
    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }
        return null;
    }

    public function viewAny(User $user): bool
    {
        return $user->can('view members');
    }

    public function view(User $user, Member $member): bool
    {
        return $user->can('view members') && $user->church_id === $member->church_id;
    }

    public function update(User $user, Member $member): bool
    {
        // Kailangan may permission at dapat magkatugma ang branch (church_id)
        return $user->can('edit members') && $user->church_id === $member->church_id;
    }

    public function delete(User $user, Member $member): bool
    {
        return $user->can('delete members') && $user->church_id === $member->church_id;
    }
}
