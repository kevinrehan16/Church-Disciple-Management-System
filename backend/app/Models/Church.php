<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Church extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'address',
        'contact_number',
        'email',
        'is_main_campus',
        'is_active',
    ];

    protected $casts = [
        'is_main_campus' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function clusters(): HasMany
    {
        return $this->hasMany(Cluster::class);
    }

    public function growthGroups(): HasMany
    {
        return $this->hasMany(GrowthGroup::class);
    }
}
