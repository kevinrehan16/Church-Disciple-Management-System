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

            // Optionally includes total members using this gift if loaded
            'members_count'        => $this->whenCounted('members'),

            'pivot'                => $this->when($this->pivot, function () {
                return [
                    'level' => $this->pivot->level,
                    'score' => $this->pivot->score,
                    'notes' => $this->pivot->notes,
                ];
            }),
        ];
    }
}
