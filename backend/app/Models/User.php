<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasUuids, HasApiTokens, HasRoles;

    /**
     * I-set ang primary key properties para sa UUID.
     */
    protected $primaryKey = 'id';
    protected $keyType = 'string';
    public $incrementing = false;

    protected string $guard_name = 'sanctum';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    protected function getDefaultGuardName(): string
    {
        return 'sanctum';
    }

    public function member(): HasOne
    {
        return $this->hasOne(Member::class);
    }

    public function scopeByRole($query, $role)
    {
        return $role ? $query->where('role', $role) : $query;
    }
}
