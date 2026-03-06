<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeSectionCd extends Model
{
    use HasFactory;

    /**
     * テーブル名
     */
    protected $table = 'employee_section_cd';

    /**
     * プライマリキー
     */
    protected $primaryKey = 'employee_section_cd_id';

    /**
     * created_at を使用しない（updated_at のみ使用）
     */
    const CREATED_AT = null;

    /**
     * 複数代入可能な属性
     */
    protected $fillable = [
        'section_cd_id',
        'employee_id',
        'section_cd',
        'employee_cd',
    ];

    /**
     * 属性のキャスト
     */
    protected $casts = [
        'updated_at' => 'datetime',
    ];

    /**
     * 部署コードマスタとのリレーション
     */
    public function sectionCd()
    {
        return $this->belongsTo(SectionCd::class, 'section_cd_id', 'section_cd_id');
    }

    /**
     * 社員マスタとのリレーション
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'employee_id');
    }
}
