<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SpiritualGiftResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                   => $this->id,
            'name'                 => $this->name,
            'code'                 => $this->code,
            'category'             => $this->category,
            'description'          => $this->description,
            'scripture_references' => $this->scripture_references,
            'is_active'            => $this->is_active,
            'created_at'           => $this->created_at?->toIso8601String(),
            'updated_at'           => $this->updated_at?->toIso8601String(),

            // Optionally includes total members using this gift if loaded
            'members_count'        => $this->whenCounted('members'),
        ];
    }
}
