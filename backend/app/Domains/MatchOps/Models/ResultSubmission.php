<?php

namespace App\Domains\MatchOps\Models;

use App\Domains\Competition\Models\Team;
use App\Domains\IdentityAccess\Models\Organization;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResultSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'match_id',
        'submitted_by',
        'team_id',
        'scores',
        'notes',
    ];

    protected $casts = [
        'scores' => 'array',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function match()
    {
        return $this->belongsTo(GameMatch::class, 'match_id');
    }

    public function submitter()
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function confirmations()
    {
        return $this->hasMany(ResultConfirmation::class);
    }
}

