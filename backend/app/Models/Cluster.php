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
        'head_id',
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
        return $this->belongsTo(Member::class, 'head_id');
    }

    public function growthGroups(): HasMany
    {
        return $this->hasMany(GrowthGroup::class);
    }
}
