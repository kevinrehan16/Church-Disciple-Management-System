<?php

namespace App\Http\Controllers\Api\V1\Permission;

use App\Http\Controllers\Controller;
use App\Http\Requests\Permission\StorePermissionRequest;
use App\Http\Resources\PermissionResource;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    protected $permissionService;

    public function __construct(PermissionService $permissionService)
    {
        $this->permissionService = $permissionService;
    }

    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10); // Default ay 10 items per page
        $search = $request->query('search');

        $permissions = $this->permissionService->getAllPermissions($perPage, $search);

        return PermissionResource::collection($permissions);
    }

    public function store(StorePermissionRequest $request)
    {
        $permission = $this->permissionService->createPermission($request->validated());

        return (new PermissionResource($permission))
            ->additional(['success' => true, 'message' => 'Permission created successfully'])
            ->response()
            ->setStatusCode(201);
    }

    public function destroy(Permission $permission)
    {
        $this->permissionService->deletePermission($permission);

        return response()->json([
            'success' => true,
            'message' => 'Permission deleted successfully'
        ]);
    }
}
