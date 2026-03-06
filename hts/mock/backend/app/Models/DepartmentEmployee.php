<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DepartmentEmployee extends Model
{
    use HasFactory;

    protected $table = 'department_employee';

    protected $primaryKey = 'department_employee_id';

    const CREATED_AT = null; // created_at は使用しない

    public $incrementing = false; // 自動採番なし

    protected $fillable = [
        'department_employee_id',
        'department_id',
        'employee_id',
    ];

    /**
     * 組織
     */
    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id', 'department_id');
    }

    /**
     * 社員
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'employee_id');
    }
}
