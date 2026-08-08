<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cluster extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'church_id',
        'name',
        'code',
        'member_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function church(): BelongsTo
    {
        return $this->belongsTo(Church::class);
    }

    public function head(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    public function leader(): BelongsTo
    {
        // Kung ang member_id sa clusters table ay tumutukoy sa members table:
        return $this->belongsTo(Member::class, 'member_id');
    }

    public function growthGroups(): HasMany
    {
        return $this->hasMany(GrowthGroup::class);
    }

    public function members(): HasMany
    {
        return $this->hasMany(Member::class);
    }
}
