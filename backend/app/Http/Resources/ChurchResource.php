<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChurchResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'address' => $this->address,
            'contact_number' => $this->contact_number,
            'email' => $this->email,
            'is_main_campus' => (bool) $this->is_main_campus,
            'is_active' => (bool) $this->is_active,
            'clusters_count' => $this->whenCounted('clusters'),
            'growth_groups_count' => $this->whenCounted('growthGroups'),
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
        ];
    }
}
