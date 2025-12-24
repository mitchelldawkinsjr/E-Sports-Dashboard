<?php

namespace App\Domains\Competition\Models;

use App\Domains\IdentityAccess\Models\Organization;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PlayerProfile extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'user_id',
        'display_name',
        'in_game_name',
        'date_of_birth',
        'grade',
        'school',
        'custom_fields_jsonb',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'custom_fields_jsonb' => 'array',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function rosterEntries()
    {
        return $this->hasMany(RosterEntry::class);
    }

    public function eligibilityRecords()
    {
        return $this->hasMany(EligibilityRecord::class);
    }
}

