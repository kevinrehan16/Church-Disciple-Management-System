<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Enums\MemberStatus;

class Member extends Model
{
    protected $fillable = [
        'user_id',
        'member_id',
        'nickname',
        'last_name',
        'first_name',
        'middle_name',
        'gender',
        'birthday',
        'age',
        'spouse_name',
        'father_name',
        'mother_name',
        'facebook_name',
        'lifestage',
        'mobile_number',
        'contact_details',
        'home_address',
        'country',
        'region',
        'city',
        'barangay',
        'occupation',
        'industry',
        'college_school',
        'college_degree',
        'high_school',
        'received_jesus',
        'baptized_immersion',
        'baptized_date',
        'spiritual_gift',
        'picture',
        'purpose_reg',
        'prev_church',
        'church_affiliation',
        'satellite_id',
        'member_position',
        'member_status',
        'Active',
        'membership_date',
        'rec_for_baptism',
        'rec_for_membership',
        'comment',
        'user_added',
        'user_updated'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected $casts = [
        'member_status' => MemberStatus::class,
    ];

    public function scopeByPosition($query, $position)
    {
        if (!$position) return $query;

        // I-convert ang comma-separated string sa array (e.g., "Pastor,Elder" -> ["Pastor", "Elder"])
        $positions = is_array($position) ? $position : explode(',', $position);

        return $query->whereIn('member_position', $positions);
    }

    public function scopeByRank($query, $rank)
    {
        return $rank ? $query->where('position_rank', $rank) : $query;
    }

    // Define mo dito ang rules para madaling i-update sa future
    const RANK_MAP = [
        'Senior Pastor'         => 1,
        'Pastoral Staff'        => 2,
        'Elders'                => 2,
        'Deacons'               => 2,
        'Growth Group Leaders'  => 3,
        'Growth Group Members'  => 4,
        'No Growth Group'       => 5,
    ];

    // Ito ang "Magic": Automatic na magse-set ng rank bago i-save sa database
    protected static function booted()
    {
        static::saving(function ($member) {
            // I-lookup ang rank base sa position. Default is 99.
            $member->position_rank = self::RANK_MAP[$member->member_position] ?? 99;
        });
    }

    // Scope para sa pag-sort
    public function scopeOrderedByPosition($query)
    {
        return $query->orderBy('position_rank', 'asc');
    }
}
