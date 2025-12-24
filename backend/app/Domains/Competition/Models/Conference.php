<?php

namespace App\Domains\Competition\Models;

use App\Domains\IdentityAccess\Models\Organization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Conference extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'season_id',
        'division_id',
        'name',
        'slug',
        'description',
        'sort_order',
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

    public function teams()
    {
        return $this->hasMany(Team::class);
    }
}

