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
        //////// USED THIS WHEN YOU USE THE DiscipleNetworkService_copy.php
        // return [
        //     'id'              => $this['id'],
        //     'parentId'        => $this['parentId'],
        //     'name'            => $this['name'],
        //     'email'           => $this['email'],
        //     'position'        => $this['position'],
        //     'rank'            => $this['rank'],
        //     'hasGrowthGroup'  => $this['hasGrowthGroup'],
        //     'growthGroupName' => $this['growthGroupName'],
        //     'avatarBg'        => $this['avatarBg'],
        // ];
        //////// USED THIS WHEN YOU USE THE DiscipleNetworkService_copy.php

        return [
            'nodeKey'         => $this['nodeKey'],
            'memberId'        => $this['memberId'],
            'parentId'        => $this['parentId'],
            'name'            => $this['name'],
            'email'           => $this['email'],
            'churchPosition'  => $this['churchPosition'] ?? null,
            'ggRole'          => $this['ggRole'] ?? 'None',
            'rank'            => $this['rank'],
            'primaryRank'     => $this['primaryRank'],
            'hasGrowthGroup'  => $this['hasGrowthGroup'],
            'growthGroupName' => $this['growthGroupName'],
            'isDuplicate'     => $this['isDuplicate'],
            'isGroupFolder'   => $this['isGroupFolder'] ?? false,
            'avatarBg'        => $this['avatarBg'],
        ];
    }
}
