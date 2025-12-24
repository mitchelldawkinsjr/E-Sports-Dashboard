<?php

namespace App\Domains\MatchOps\Models;

use App\Domains\Competition\Models\Team;
use App\Domains\IdentityAccess\Models\Organization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MatchGame extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'match_id',
        'game_number',
        'map_name',
        'winner_team_id',
        'scores',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'scores' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function match()
    {
        return $this->belongsTo(GameMatch::class, 'match_id');
    }

    public function winnerTeam()
    {
        return $this->belongsTo(Team::class, 'winner_team_id');
    }
}

