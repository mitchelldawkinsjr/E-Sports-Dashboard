<?php

namespace App\Domains\Reporting\Models;

use App\Domains\IdentityAccess\Models\Organization;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExportJob extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'created_by',
        'type',
        'filters',
        'status',
        'file_path',
        'error_message',
        'completed_at',
    ];

    protected $casts = [
        'filters' => 'array',
        'completed_at' => 'datetime',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}

