<?php

namespace App\Http\Controllers\Api\V1\Role;

use App\Http\Controllers\Controller;
use App\Http\Requests\Role\RoleRequest;
use App\Http\Resources\RoleResource;
use App\Services\RoleService;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    protected $roleService;

    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    public function index()
    {
        $roles = $this->roleService->getAllRoles();
        return RoleResource::collection($roles);
    }

    public function store(RoleRequest $request)
    {
        $role = $this->roleService->createRole($request->validated());

        return (new RoleResource($role))
            ->additional(['success' => true, 'message' => 'Role created successfully'])
            ->response()
            ->setStatusCode(201);
    }

    public function show(Role $role)
    {
        return new RoleResource($role->load('permissions'));
    }

    public function update(RoleRequest $request, Role $role)
    {
        $updatedRole = $this->roleService->updateRole($role, $request->validated());

        return (new RoleResource($updatedRole))
            ->additional(['success' => true, 'message' => 'Role updated successfully']);
    }

    public function destroy(Role $role)
    {
        try {
            $this->roleService->deleteRole($role);
            return response()->json(['success' => true, 'message' => 'Role deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }

    public function syncPermissions(Request $request, Role $role)
    {
        $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'string|exists:permissions,name'
        ]);

        $updatedRole = $this->roleService->syncPermissions($role, $request->permissions);

        return (new RoleResource($updatedRole))
            ->additional(['success' => true, 'message' => 'Permissions synced successfully']);
    }
}
