<?php

namespace App\Domains\Reporting\Models;

use App\Domains\Competition\Models\Division;
use App\Domains\Competition\Models\Season;
use App\Domains\IdentityAccess\Models\Organization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StandingsSnapshot extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'season_id',
        'division_id',
        'standings_data',
        'computed_at',
    ];

    protected $casts = [
        'standings_data' => 'array',
        'computed_at' => 'datetime',
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
}

