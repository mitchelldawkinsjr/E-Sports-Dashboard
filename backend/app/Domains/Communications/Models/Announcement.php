<?php

namespace App\Domains\Communications\Models;

use App\Domains\Competition\Models\Season;
use App\Domains\IdentityAccess\Models\Organization;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Announcement extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'season_id',
        'created_by',
        'title',
        'content',
        'scope',
        'is_pinned',
        'published_at',
    ];

    protected $casts = [
        'is_pinned' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function season()
    {
        return $this->belongsTo(Season::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}

