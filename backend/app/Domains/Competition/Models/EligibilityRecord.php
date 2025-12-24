<?php

namespace App\Domains\Competition\Models;

use App\Domains\IdentityAccess\Models\Organization;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EligibilityRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'player_profile_id',
        'season_id',
        'status',
        'custom_fields_jsonb',
        'notes',
        'verified_by',
        'verified_at',
    ];

    protected $casts = [
        'custom_fields_jsonb' => 'array',
        'verified_at' => 'datetime',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function playerProfile()
    {
        return $this->belongsTo(PlayerProfile::class);
    }

    public function season()
    {
        return $this->belongsTo(Season::class);
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}

