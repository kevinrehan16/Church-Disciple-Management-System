<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GrowthGroupMemberResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'member_id' => $this->id,
            'full_name' => $this->first_name . ', ' . $this->last_name,
            'mobile' => $this->mobile_number,
            'role' => $this->pivot->role ?? 'member',
            'joined_at' => $this->pivot->joined_at ?? null,
        ];
    }
}
