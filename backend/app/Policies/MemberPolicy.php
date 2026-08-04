<?php

namespace App\Policies;

use App\Models\Member;
use App\Models\User;

class MemberPolicy
{
    // Awtomatikong pinapayagan ang super_admin sa lahat ng aksyon
    public function before(User $user, string $ability): ?bool
    {
        // ITAMA ITO: Gawing 'super_admin' katulad sa database
        if ($user->hasRole('super_admin')) {
            return true;
        }
        return null;
    }

    public function viewAny(User $user): bool
    {
        // ITAMA ITO: Palitan ang space ng underscore kung ganyan ang seeder mo (view_members)
        return $user->can('view_members');
    }

    public function view(User $user, Member $member): bool
    {
        return $user->can('view_members') && $user->church_id === $member->church_id;
    }

    public function update(User $user, Member $member): bool
    {
        // ITAMA ITO: 'edit_members' sa halip na 'edit members'
        return $user->can('edit_members') && $user->church_id === $member->church_id;
    }

    public function delete(User $user, Member $member): bool
    {
        // ITAMA ITO: 'delete_members' sa halip na 'delete members'
        return $user->can('delete_members') && $user->church_id === $member->church_id;
    }
}
