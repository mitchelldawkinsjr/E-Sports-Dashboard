<?php

namespace App\Domains\Competition\Models;

use App\Domains\IdentityAccess\Models\Organization;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Team extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'season_id',
        'division_id',
        'conference_id',
        'name',
        'slug',
        'description',
        'logo_url',
        'coach_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function season()
    {
        return $this->belongsTo(Season::class);
    }

    public function division()
    {
        return $this->belongsTo(Division::class);
    }

    public function conference()
    {
        return $this->belongsTo(Conference::class);
    }

    public function coach()
    {
        return $this->belongsTo(User::class, 'coach_id');
    }

    public function rosterEntries()
    {
        return $this->hasMany(RosterEntry::class);
    }

    public function matchParticipants()
    {
        return $this->hasMany(\App\Domains\MatchOps\Models\MatchParticipant::class);
    }
}

