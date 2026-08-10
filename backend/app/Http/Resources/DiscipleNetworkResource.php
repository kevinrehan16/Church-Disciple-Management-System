<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DiscipleNetworkResource extends JsonResource
{
    /**
     * Transform the resource array into format for frontend React Tree.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'        => $this['id'],
            'parentId'  => $this['parentId'],
            'name'      => $this['name'],
            'email'     => $this['email'],
            'position'  => $this['position'],
            'rank'      => $this['rank'],
            'cluster'   => $this['cluster'],
            'avatarBg'  => $this['avatarBg'],
        ];
    }
}
