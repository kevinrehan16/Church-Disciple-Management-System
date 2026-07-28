<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GrowthGroupsMembersResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'target_demographic' => $this->target_demographic,
            'meeting_day' => $this->meeting_day,
            'meeting_time' => $this->meeting_time,
            'location_type' => $this->location_type,
            'venue_address' => $this->venue_address,
            'is_active' => $this->is_active,
            // Leader details (hiwalay ang first_name at last_name)
            'leader' => $this->leader ? [
                'id' => $this->leader->id,
                'first_name' => $this->leader->first_name,
                'last_name' => $this->leader->last_name,
                'mobile_number' => $this->leader->mobile_number,
            ] : null,
            // Listahan ng mga miyembro gamit ang Member Resource
            'members' => GrowthGroupMemberResource::collection(
                $this->whenLoaded('members', function () {
                    return $this->members->reject(function ($member) {
                        return $member->id === $this->leader_id; // Di lalabas yung leader sa members list
                    });
                })
            ),
        ];
    }
}
