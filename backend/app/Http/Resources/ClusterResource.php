<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\ChurchResource;
use Illuminate\Http\Resources\Json\JsonResource;

class ClusterResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'church_id'    => $this->church_id,
            'name'         => $this->name,
            'code'         => $this->code,
            'is_active'    => (bool) $this->is_active,
            'church'       => new ChurchResource($this->whenLoaded('church')),
            'member_id'    => $this->member_id,
            'cluster_mentor' => $this->whenLoaded('leader', function () {
                return [
                    'id' => $this->leader->id,
                    'full_name' => $this->leader->first_name . ' ' . $this->leader->last_name,
                    'mobile' => $this->leader->mobile_number,
                ];
            }),
            'growth_groups_count' => $this->growth_groups_count ?? 0,
            'members_count' => $this->members_count ?? 0,
            'created_at'   => $this->created_at?->toDateTimeString(),
            'updated_at'   => $this->updated_at?->toDateTimeString(),
        ];
    }
}
