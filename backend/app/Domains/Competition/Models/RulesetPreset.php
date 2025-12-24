<?php

namespace App\Domains\Competition\Models;

use App\Domains\IdentityAccess\Models\Organization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RulesetPreset extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'game_title_id',
        'name',
        'description',
        'config_jsonb',
        'default_best_of',
        'is_default',
    ];

    protected $casts = [
        'config_jsonb' => 'array',
        'is_default' => 'boolean',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function gameTitle()
    {
        return $this->belongsTo(GameTitle::class);
    }

    public function seasons()
    {
        return $this->hasMany(Season::class);
    }
}

