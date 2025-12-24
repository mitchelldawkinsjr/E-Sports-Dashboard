<?php

namespace App\Domains\Competition\Models;

use App\Domains\IdentityAccess\Models\Organization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Season extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'game_title_id',
        'ruleset_preset_id',
        'name',
        'slug',
        'description',
        'start_date',
        'end_date',
        'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function gameTitle()
    {
        return $this->belongsTo(GameTitle::class);
    }

    public function rulesetPreset()
    {
        return $this->belongsTo(RulesetPreset::class);
    }

    public function divisions()
    {
        return $this->hasMany(Division::class);
    }

    public function teams()
    {
        return $this->hasMany(Team::class);
    }

    public function matches()
    {
        return $this->hasMany(\App\Domains\MatchOps\Models\GameMatch::class, 'season_id');
    }
}

