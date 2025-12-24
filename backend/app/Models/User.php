<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
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
        ];
    }

    public function organizationMembers()
    {
        return $this->hasMany(\App\Domains\IdentityAccess\Models\OrganizationMember::class);
    }

    public function playerProfile()
    {
        return $this->hasOne(\App\Domains\Competition\Models\PlayerProfile::class);
    }

    public function teams()
    {
        return $this->hasManyThrough(
            \App\Domains\Competition\Models\Team::class,
            \App\Domains\IdentityAccess\Models\OrganizationMember::class,
            'user_id',
            'organization_id',
            'id',
            'organization_id'
        )->whereHas('coach', function ($query) {
            $query->where('id', $this->id);
        });
    }
}
