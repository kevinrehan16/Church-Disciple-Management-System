<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class GrowthGroup extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'church_id',
        'name',
        'code',
        'cluster_id',
        'leader_id',
        'meeting_day',
        'meeting_time',
        'location_type',
        'venue_address',
        'target_demographic',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Relationship: Growth Group belongs to a Church
     */
    public function church(): BelongsTo
    {
        return $this->belongsTo(Church::class);
    }

    /**
     * Relationship sa Leader ng Growth Group (Member model).
     */
    public function leader(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'leader_id');
    }

    /**
     * Relationship sa Cluster (kung may Cluster model ka na).
     */
    public function cluster(): BelongsTo
    {
        return $this->belongsTo(Cluster::class);
    }

    /**
     * Relationship para sa mga Members na KABILANG sa Growth Group na ito.
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(Member::class, 'growth_group_member')
            ->withPivot('role', 'joined_at')
            ->withTimestamps();
    }
}
