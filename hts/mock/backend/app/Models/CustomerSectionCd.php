<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerSectionCd extends Model
{
    /**
     * テーブル名
     */
    protected $table = 'customer_section_cd';

    /**
     * プライマリキー
     */
    protected $primaryKey = 'customer_section_cd_id';

    /**
     * created_at を使用しない（updated_at のみ使用）
     */
    const CREATED_AT = null;

    /**
     * 複数代入可能な属性
     */
    protected $fillable = [
        'section_cd_id',
        'customer_id',
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
    public function sectionCd(): BelongsTo
    {
        return $this->belongsTo(SectionCd::class, 'section_cd_id', 'section_cd_id');
    }

    /**
     * 得意先マスタとのリレーション
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'customer_id');
    }
}
