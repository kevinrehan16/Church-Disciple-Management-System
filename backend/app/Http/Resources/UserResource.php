<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'        => $this->id,
            'email'     => $this->email,
            'role'      => $this->role,
            'createdAt' => $this->created_at,
            'mustChangePassword' => $this->must_change_password,
            'is_active' => $this->is_active,
            'member' => [
                'firstName' => $this->member?->first_name ?? 'N/A',
                'lastName'  => $this->member?->last_name ?? 'N/A',
                'mobile'    => $this->member?->mobile_number ?? 'N/A',
                'church_id'    => $this->member?->church_id ?? 'N/A',
                'cluster_id'    => $this->member?->cluster_id ?? 'N/A',
            ],
            // --- IDAGDAG ITO PARA SA SPATIE ROLES AT PERMISSIONS ---
            'roles'              => $this->getRoleNames(),
            'permissions'        => $this->getAllPermissions()->pluck('name'),

            // --- IDAGDAG ITO KUNG MAY GUSTO KANG IPASA NA POLICIES/GATES ---
            'can' => [
                'update' => $request->user()?->can('update', $this->resource),
                'delete' => $request->user()?->can('delete', $this->resource),
            ],
        ];
    }
}
