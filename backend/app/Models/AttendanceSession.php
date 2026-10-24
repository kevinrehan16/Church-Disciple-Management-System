<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AttendanceSession extends Model
{
    protected $fillable = [
        'activity_id',
        'title',
        'starts_at',
        'ends_at',
        'status',
        'version',
        'created_by',
        'finalized_by',
        'finalized_at'
    ];

    public function activity(): BelongsTo
    {
        return $this->belongsTo(AttendanceActivity::class, 'activity_id');
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(GrowthGroup::class, 'group_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function finalizer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'finalized_by');
    }

    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(
            ChurchGroup::class,
            'attendance_session_groups',
            'session_id',
            'group_id'
        );
    }

    public function records(): HasMany
    {
        return $this->hasMany(AttendanceRecord::class, 'session_id');
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AttendanceAuditLog::class, 'session_id');
    }
}
