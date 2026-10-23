<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AttendanceActivity extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'is_active', 'created_by'];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(GrowthGroup::class, 'attendance_activity_groups', 'activity_id', 'group_id');
    }

    public function sessions(): HasMany
    {
        return $this->hasMany(AttendanceSession::class, 'activity_id');
    }
}
