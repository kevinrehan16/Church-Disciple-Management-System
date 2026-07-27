<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FamilyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'family_name' => $this->family_name,

            // I-format ang Head details
            'head_details' => $this->whenLoaded('head', function () {
                return [
                    'id' => $this->head->id,
                    'full_name' => $this->head->last_name . ', ' . $this->head->first_name,
                ];
            }),

            'address' => [
                'line1' => $this->address_line1,
                'city' => $this->city,
            ],

            // I-include ang lahat ng miyembro gamit ang FamilyMemberResource sa itaas
            'members' => FamilyMemberResource::collection($this->whenLoaded('familyMembers')),

            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}
