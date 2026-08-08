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

            'member' => [
                'firstName' => $this->member?->first_name ?? 'N/A',
                'lastName'  => $this->member?->last_name ?? 'N/A',
                'mobile'    => $this->member?->mobile_number ?? 'N/A',
                'church_id'    => $this->member?->church_id ?? 'N/A',
                'cluster_id'    => $this->member?->cluster_id ?? 'N/A',
            ],
        ];
    }
}
