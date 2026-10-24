<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChurchGroup extends Model
{
    protected $fillable = ['name', 'slug', 'description'];

    // Ang isang church group ay pwedeng magkaroon ng maraming miyembro
    public function members(): HasMany
    {
        return $this->hasMany(Member::class, 'church_group_id');
    }
}
