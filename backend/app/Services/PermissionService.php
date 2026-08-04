<?php

namespace App\Services;

use Spatie\Permission\Models\Permission;

class PermissionService
{
    public function getAllPermissions(int $perPage = 10, ?string $search = null)
    {
        return Permission::with('roles') // I-eager load ang roles
            ->when($search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('id', 'desc')
            ->paginate($perPage);
    }

    public function createPermission(array $data)
    {
        return Permission::create([
            'name'       => $data['name'],
            'guard_name' => $data['guard_name'] ?? 'web',
        ]);
    }

    public function deletePermission(Permission $permission)
    {
        return $permission->delete();
    }
}
