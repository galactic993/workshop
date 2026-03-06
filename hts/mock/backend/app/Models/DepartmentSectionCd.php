<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DepartmentSectionCd extends Model
{
    protected $table = 'department_section_cd';

    protected $primaryKey = 'department_section_cd_id';

    const CREATED_AT = null; // created_at は使用しない

    protected $fillable = [
        'section_cd_id',
        'department_id',
    ];

    /**
     * 部署コードマスタとのリレーション
     */
    public function sectionCd(): BelongsTo
    {
        return $this->belongsTo(SectionCd::class, 'section_cd_id', 'section_cd_id');
    }

    /**
     * 組織マスタとのリレーション
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'department_id', 'department_id');
    }
}
