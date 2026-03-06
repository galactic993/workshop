<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    protected $table = 'permissions';

    protected $primaryKey = 'permission_id';

    // created_at は使用しない
    const CREATED_AT = null;

    protected $fillable = [
        'permission_key',
        'permission_name',
    ];

    /**
     * この権限が割り当てられている役割を取得
     */
    public function roles()
    {
        return $this->belongsToMany(
            Role::class,
            'permission_role',
            'permission_id',
            'role_id',
            'permission_id',
            'role_id'
        );
    }
}
