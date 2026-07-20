<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GrowthGroupResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id,
            'church_id'          => $this->church_id,
            'cluster_id'         => $this->cluster_id,
            'leader_id'          => $this->leader_id,
            'name'               => $this->name,
            'code'               => $this->code,
            'meeting_day'        => $this->meeting_day,
            'meeting_time'       => $this->meeting_time,
            'location_type'      => $this->location_type,
            'venue_address'      => $this->venue_address,
            'target_demographic' => $this->target_demographic,
            'is_active'          => (bool) $this->is_active,

            // Relationships (Lalabas lang kapag naka-eager load sa query)
            'church'             => new ChurchResource($this->whenLoaded('church')),
            'cluster'            => new ClusterResource($this->whenLoaded('cluster')),
            'leader'             => $this->whenLoaded('leader'), // I-wrap sa MemberResource kung mayroon na

            'created_at'         => $this->created_at?->toDateTimeString(),
            'updated_at'         => $this->updated_at?->toDateTimeString(),
        ];
    }
}
