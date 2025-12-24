<?php

namespace App\Domains\MatchOps\Models;

use App\Domains\Competition\Models\Team;
use App\Domains\IdentityAccess\Models\Organization;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResultConfirmation extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'match_id',
        'result_submission_id',
        'confirmed_by',
        'team_id',
        'is_confirmed',
        'notes',
    ];

    protected $casts = [
        'is_confirmed' => 'boolean',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function match()
    {
        return $this->belongsTo(GameMatch::class, 'match_id');
    }

    public function resultSubmission()
    {
        return $this->belongsTo(ResultSubmission::class);
    }

    public function confirmer()
    {
        return $this->belongsTo(User::class, 'confirmed_by');
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }
}

