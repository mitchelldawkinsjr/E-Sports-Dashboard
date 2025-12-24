<?php

namespace App\Domains\MatchOps\Models;

use App\Domains\Competition\Models\{Division, RulesetPreset, Season};
use App\Domains\IdentityAccess\Models\Organization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GameMatch extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'matches';

    protected $fillable = [
        'organization_id',
        'season_id',
        'division_id',
        'ruleset_preset_id',
        'name',
        'status',
        'scheduled_at',
        'best_of',
        'map_pool',
        'notes',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'map_pool' => 'array',
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

    public function rulesetPreset()
    {
        return $this->belongsTo(RulesetPreset::class);
    }

    public function participants()
    {
        // Explicitly use match_id to align with the schema
        return $this->hasMany(MatchParticipant::class, 'match_id');
    }

    public function games()
    {
        // Explicitly use match_id to align with the schema
        return $this->hasMany(MatchGame::class, 'match_id');
    }

    public function resultSubmissions()
    {
        // Explicitly use match_id to align with the schema
        return $this->hasMany(ResultSubmission::class, 'match_id');
    }

    public function disputes()
    {
        // Explicitly use match_id to align with the schema
        return $this->hasMany(Dispute::class, 'match_id');
    }
}

