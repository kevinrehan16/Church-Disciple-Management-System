<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // Para makagawa ng FACTORIES
use Illuminate\Database\Eloquent\Model;

class Visitor extends Model
{
    use HasFactory;

    protected $fillable = [
        'date_visited',
        'service_time',
        'first_name',
        'last_name',
        'birthday',
        'age_group',
        'gender',
        'barangay',
        'city',
        'province',
        'life_stage',
        'life_stage_other',
        'current_church',
        'mobile_number',
        'email',
        'facebook_name',
        'heard_from_invitee',
        'heard_from_details',
        'prayer_requests',
        'remarks',
        'welcome_by',
    ];
}
