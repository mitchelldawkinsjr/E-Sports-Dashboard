<?php

namespace App\Domains\IdentityAccess\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Organization extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'organizations';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'logo_url',
        'settings',
        'is_active',
    ];

    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
    ];

    public function members()
    {
        return $this->hasMany(OrganizationMember::class);
    }

    public function roles()
    {
        return $this->hasMany(Role::class);
    }

    public function invites()
    {
        return $this->hasMany(Invite::class);
    }
}

