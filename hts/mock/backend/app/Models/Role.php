<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Role extends Model
{
    use SoftDeletes;

    protected $table = 'roles';

    protected $primaryKey = 'role_id';

    public $incrementing = false;

    // created_at は使用しない
    const CREATED_AT = null;

    protected $fillable = [
        'role_id',
        'role_name',
    ];

    /**
     * このロールに紐付いている権限を取得
     */
    public function permissions()
    {
        return $this->belongsToMany(
            Permission::class,
            'permission_role',
            'role_id',
            'permission_id',
            'role_id',
            'permission_id'
        );
    }

    /**
     * このロールを持っている社員を取得
     */
    public function employees()
    {
        return $this->belongsToMany(
            Employee::class,
            'employee_role',
            'role_id',
            'employee_id',
            'role_id',
            'employee_id'
        );
    }
}
