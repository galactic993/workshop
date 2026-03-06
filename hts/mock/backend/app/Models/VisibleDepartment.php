<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VisibleDepartment extends Model
{
    protected $table = 'visible_departments';

    protected $primaryKey = 'visible_department_id';

    public $incrementing = false;

    const CREATED_AT = null; // created_at は使用しない

    protected $fillable = [
        'visible_department_id',
        'employee_id',
        'department_id',
        'employee_cd',
        'remarks',
    ];

    /**
     * 社員マスタとのリレーション
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'employee_id');
    }

    /**
     * 組織マスタとのリレーション
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'department_id', 'department_id');
    }
}
