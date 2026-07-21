<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\ClusterResource;
use Illuminate\Http\Resources\Json\JsonResource;

class ChurchWithClustersResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'address' => $this->address,
            'is_main_campus' => $this->is_main_campus,
            'is_active' => $this->is_active,
            'clusters' => ClusterResource::collection($this->whenLoaded('clusters')),
        ];
    }
}
