<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SpiritualGift extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'category',
        'description',
        'scripture_references',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Members who have this spiritual gift.
     */
    public function members()
    {
        return $this->belongsToMany(Member::class, 'member_spiritual_gifts')
            ->using(MemberSpiritualGift::class)
            ->withPivot('id', 'level', 'score', 'notes')
            ->withTimestamps();
    }
}
