<?php

namespace App\Domains\Competition\Models;

use App\Domains\IdentityAccess\Models\Organization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RosterEntry extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'team_id',
        'player_profile_id',
        'position',
        'jersey_number',
        'is_active',
        'joined_at',
        'left_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'joined_at' => 'date',
        'left_at' => 'date',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function playerProfile()
    {
        return $this->belongsTo(PlayerProfile::class);
    }
}

