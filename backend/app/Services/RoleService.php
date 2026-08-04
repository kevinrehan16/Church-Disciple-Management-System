<?php

namespace App\Services;

use Spatie\Permission\Models\Role;

class RoleService
{
    public function getAllRoles(array $params = [])
    {
        $query = Role::with('permissions');

        // Suriin kung may 'search' key sa params
        if (!empty($params['search'])) {
            $searchTerm = $params['search'];

            $query->where(function ($q) use ($searchTerm) {
                // I-search ang role name
                $q->where('name', 'ilike', '%' . $searchTerm . '%')
                    // O kaya ang pangalan ng permissions na nakakabit sa role
                    ->orWhereHas('permissions', function ($permQuery) use ($searchTerm) {
                        $permQuery->where('name', 'ilike', '%' . $searchTerm . '%');
                    });
            });
        }

        // Siguraduhing gamit ang paginate()
        return $query->paginate($params['per_page'] ?? 10);
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
