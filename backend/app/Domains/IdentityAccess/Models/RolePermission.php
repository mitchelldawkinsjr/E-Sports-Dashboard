<?php

namespace App\Domains\IdentityAccess\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RolePermission extends Model
{
    use HasFactory;

    protected $table = 'role_permissions';

    protected $fillable = [
        'role_id',
        'permission',
    ];

    public function role()
    {
        return $this->belongsTo(Role::class);
    }
}

