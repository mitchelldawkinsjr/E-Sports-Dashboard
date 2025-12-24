<?php

namespace App\Domains\MatchOps\Models;

use App\Domains\Competition\Models\Team;
use App\Domains\IdentityAccess\Models\Organization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MatchParticipant extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'match_id',
        'team_id',
        'side',
        'score',
        'is_winner',
    ];

    protected $casts = [
        'is_winner' => 'boolean',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function match()
    {
        return $this->belongsTo(GameMatch::class, 'match_id');
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }
}

