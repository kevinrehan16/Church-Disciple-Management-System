<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Family extends Model
{
    protected $fillable = [
        'family_name',
        'head_member_id',
        'address_line1',
        'address_line2',
        'city',
    ];

    // Kunin ang lahat ng miyembro sa pamilyang ito
    public function familyMembers(): HasMany
    {
        return $this->hasMany(FamilyMember::class);
    }

    // Kunin ang Head of the Family
    public function head(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'head_member_id');
    }
}
