<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class MemberSpiritualGift extends Pivot
{
    protected $table = 'member_spiritual_gifts';

    // Enables auto-incrementing ID if you used $table->id() in the pivot migration
    public $incrementing = true;

    protected $fillable = [
        'member_id',
        'spiritual_gift_id',
        'level',
        'score',
        'notes',
    ];

    protected $casts = [
        'score' => 'integer',
    ];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function spiritualGift()
    {
        return $this->belongsTo(SpiritualGift::class);
    }
}
