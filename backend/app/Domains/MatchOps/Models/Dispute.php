<?php

namespace App\Domains\MatchOps\Models;

use App\Domains\Competition\Models\Team;
use App\Domains\IdentityAccess\Models\Organization;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dispute extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'match_id',
        'created_by',
        'team_id',
        'status',
        'reason',
        'evidence',
        'resolved_by',
        'resolved_at',
    ];

    protected $casts = [
        'resolved_at' => 'datetime',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function match()
    {
        return $this->belongsTo(GameMatch::class, 'match_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function resolver()
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }

    public function ruling()
    {
        return $this->hasOne(Ruling::class);
    }
}

