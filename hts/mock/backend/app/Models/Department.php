<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'departments';

    protected $primaryKey = 'department_id';

    const CREATED_AT = null; // created_at は使用しない

    protected $fillable = [
        'department_id',
        'department_name',
        'is_center',
        'display_name',
        'display_order',
        'center_id',
        'department_category',
    ];

    protected $casts = [
        'is_center' => 'boolean',
        'display_order' => 'integer',
    ];

    /**
     * 親センター（自己参照）
     */
    public function center()
    {
        return $this->belongsTo(Department::class, 'center_id', 'department_id');
    }

    /**
     * チーム（このセンターに所属するチーム）
     */
    public function teams()
    {
        return $this->hasMany(Department::class, 'center_id', 'department_id');
    }

    /**
     * 所属社員
     */
    public function employees()
    {
        return $this->belongsToMany(
            Employee::class,
            'department_employee',
            'department_id',
            'employee_id',
            'department_id',
            'employee_id'
        );
    }

    /**
     * 組織別部署コード
     */
    public function departmentSectionCd()
    {
        return $this->hasOne(DepartmentSectionCd::class, 'department_id', 'department_id');
    }

    /**
     * 紐付いている部署コードマスタ
     */
    public function sectionCd()
    {
        return $this->hasOneThrough(
            SectionCd::class,
            DepartmentSectionCd::class,
            'department_id',
            'section_cd_id',
            'department_id',
            'section_cd_id'
        );
    }
}
