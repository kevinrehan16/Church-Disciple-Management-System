<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClusterMemberResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'cluster_id' => $this->cluster_id,
            'first_name' => $this->first_name ?? null,
            'last_name' => $this->last_name ?? null,
            'name' => $this->name ?? ($this->first_name . ' ' . $this->last_name),
        ];
    }
}
