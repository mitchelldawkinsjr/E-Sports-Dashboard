<?php

namespace App\Domains\Competition\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GameTitle extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'publisher',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function rulesetPresets()
    {
        return $this->hasMany(RulesetPreset::class);
    }

    public function seasons()
    {
        return $this->hasMany(Season::class);
    }
}

