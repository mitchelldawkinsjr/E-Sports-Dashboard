<?php

namespace App\Domains\Communications\Models;

use App\Domains\IdentityAccess\Models\Organization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailDelivery extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'to_email',
        'to_name',
        'subject',
        'template',
        'template_data',
        'status',
        'error_message',
        'sent_at',
    ];

    protected $casts = [
        'template_data' => 'array',
        'sent_at' => 'datetime',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }
}

