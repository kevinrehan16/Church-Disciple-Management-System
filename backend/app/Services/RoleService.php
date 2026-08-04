<?php

namespace App\Services;

use Spatie\Permission\Models\Role;

class RoleService
{
    public function getAllRoles(int $perPage = 10, ?string $search = null)
    {
        return Role::with('permissions')
            ->when($search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('id', 'asc')
            ->paginate($perPage);
    }

    public function createRole(array $data)
    {
        $role = Role::create(['name' => $data['name']]);

        if (!empty($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return $role->load('permissions');
    }

    public function updateRole(Role $role, array $data)
    {
        $role->update(['name' => $data['name']]);

        if (isset($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return $role->load('permissions');
    }

    public function deleteRole(Role $role)
    {
        if ($role->name === 'superadmin') {
            throw new \Exception('Cannot delete superadmin role.', 403);
        }

        return $role->delete();
    }

    public function syncPermissions(Role $role, array $permissions)
    {
        $role->syncPermissions($permissions);
        return $role->load('permissions');
    }
}
