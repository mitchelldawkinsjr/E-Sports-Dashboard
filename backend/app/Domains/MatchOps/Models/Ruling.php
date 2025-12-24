<?php

namespace App\Domains\MatchOps\Models;

use App\Domains\IdentityAccess\Models\Organization;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ruling extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'dispute_id',
        'match_id',
        'ruled_by',
        'decision',
        'reasoning',
        'adjusted_scores',
    ];

    protected $casts = [
        'adjusted_scores' => 'array',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function dispute()
    {
        return $this->belongsTo(Dispute::class);
    }

    public function match()
    {
        return $this->belongsTo(GameMatch::class, 'match_id');
    }

    public function ruler()
    {
        return $this->belongsTo(User::class, 'ruled_by');
    }
}

