<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FamilyMemberResource extends JsonResource
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
            'role' => $this->role,
            // 'member_id' => $this->member_id,

            // I-include ang basic details ng Member gamit ang relationship
            // (Siguraduhing naka-load ang 'member' relationship sa service mamaya)
            'member_details' => $this->whenLoaded('member', function () {
                return [
                    'id' => $this->member->id,
                    'full_name' => $this->member->last_name . ', ' . $this->member->first_name, // O kung ano mang method/field meron ka para sa pangalan
                    'birthdate' => $this->member->birthday,
                    'gender' => $this->member->gender,
                ];
            }),
        ];
    }
}
