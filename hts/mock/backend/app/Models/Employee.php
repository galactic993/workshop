<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    /**
     * テーブル名
     */
    protected $table = 'employees';

    /**
     * プライマリキー
     */
    protected $primaryKey = 'employee_id';

    /**
     * created_at を使用しない（updated_at のみ使用）
     */
    const CREATED_AT = null;

    /**
     * 複数代入可能な属性
     */
    protected $fillable = [
        'employee_id',
        'employee_cd',
        'employee_name',
        'email',
        'access_type',
    ];

    /**
     * 属性のキャスト
     */
    protected $casts = [
        'updated_at' => 'datetime',
    ];

    /**
     * モデルの起動処理
     * 有効なレコードのみ取得するグローバルスコープを追加
     */
    protected static function booted(): void
    {
        static::addGlobalScope('active', function (Builder $query) {
            $query->where('deleted_flag', '0');
        });
    }

    /**
     * 無効化（論理削除）
     */
    public function deactivate(): bool
    {
        return $this->update(['deleted_flag' => '1']);
    }

    /**
     * 有効化
     */
    public function activate(): bool
    {
        return $this->update(['deleted_flag' => '0']);
    }

    /**
     * 所属組織（中間テーブル経由）
     */
    public function departmentEmployee()
    {
        return $this->hasOne(DepartmentEmployee::class, 'employee_id', 'employee_id');
    }

    /**
     * 所属組織を直接取得
     */
    public function department()
    {
        return $this->hasOneThrough(
            Department::class,
            DepartmentEmployee::class,
            'employee_id',      // department_employee の外部キー
            'department_id',    // departments の主キー
            'employee_id',      // employees の主キー
            'department_id'     // department_employee の参照先
        );
    }

    /**
     * この社員が持つ役割を取得
     */
    public function roles()
    {
        return $this->belongsToMany(
            Role::class,
            'employee_role',
            'employee_id',
            'role_id',
            'employee_id',
            'role_id'
        );
    }

    /**
     * 参照可能組織
     */
    public function visibleDepartments()
    {
        return $this->hasMany(VisibleDepartment::class, 'employee_id', 'employee_id');
    }

    /**
     * 参照可能な組織を直接取得
     */
    public function visibleDepartmentsList()
    {
        return $this->belongsToMany(
            Department::class,
            'visible_departments',
            'employee_id',
            'department_id',
            'employee_id',
            'department_id'
        );
    }
}
