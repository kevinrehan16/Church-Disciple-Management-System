<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\ClusterMemberResource;
use App\Http\Resources\ClusterGrowthGroupResource;

class ClusterMGResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'is_active' => $this->is_active,
            'number_of_members' => $this->members_count ?? $this->members->count(),
            'number_of_growth_groups' => $this->growth_groups_count ?? $this->growthGroups->count(),
            'leader' => ClusterMemberResource::make($this->whenLoaded('leader')),
            'members' => ClusterMemberResource::collection($this->whenLoaded('members')),
            'growth_groups' => ClusterGrowthGroupResource::collection($this->whenLoaded('growthGroups')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
