<?php

namespace App\Models;

use App\Traits\HasCustomId;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Enums\MemberStatus;

class Member extends Model
{
    use HasCustomId;

    public $idPrefix = 'GCFSM-'; // Pwede mong baguhin bawat Model
    public $idColumn = 'mem_id';

    protected $fillable = [
        'user_id',
        'mem_id',
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
        'picture',
        'purpose_reg',
        'prev_church',
        'church_affiliation',
        'church_id',
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
        'Elder'                 => 2,
        'Deacon'                => 2,
        'Growth Group Leader'   => 3,
        'Growth Group Member'   => 4,
        'No Growth Group'       => 5,
    ];

    // Ito ang "Magic": Automatic na magse-set ng rank bago i-save sa database
    protected static function booted()
    {
        static::saving(function ($member) {
            // I-lookup ang rank base sa position. Default is 5.
            $member->position_rank = self::RANK_MAP[$member->member_position] ?? 5;
        });
    }

    // Scope para sa pag-sort
    public function scopeOrderedByPosition($query)
    {
        return $query->orderBy('position_rank', 'asc');
    }

    public function growthGroups(): BelongsToMany
    {
        return $this->belongsToMany(GrowthGroup::class, 'growth_group_member')
            ->withPivot('id', 'role', 'joined_at')
            ->withTimestamps();
    }

    public function church()
    {
        return $this->belongsTo(Church::class);
    }

    public function cluster()
    {
        return $this->belongsTo(Cluster::class);
    }

    public function spiritualGifts()
    {
        return $this->belongsToMany(
            SpiritualGift::class,
            'member_spiritual_gifts', // Pivot table name
            'member_id',             // Foreign key sa pivot table para sa Member
            'spiritual_gift_id'      // Foreign key sa pivot table para sa SpiritualGift
        )
            ->using(MemberSpiritualGift::class)
            ->withPivot('id', 'level', 'score', 'notes')
            ->withTimestamps();
    }

    public function familyMembership(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(FamilyMember::class);
    }

    // Shortcut method para makuha agad ang pamilya ng miyembro
    public function family()
    {
        return $this->hasOneThrough(
            Family::class,
            FamilyMember::class,
            'member_id', // Foreign key sa family_members table
            'id',        // Foreign key sa families table
            'id',        // Local key sa members table
            'family_id'  // Local key sa family_members table
        );
    }
}
