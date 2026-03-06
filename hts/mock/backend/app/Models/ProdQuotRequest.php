<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProdQuotRequest extends Model
{
    /**
     * テーブル名
     */
    protected $table = 'prod_quot_requests';

    /**
     * プライマリキー
     */
    protected $primaryKey = 'prod_quot_request_id';

    /**
     * 複数代入可能な属性
     */
    protected $fillable = [
        'prod_quot_id',
        'section_cd_id',
        'requested_by',
        'request_summary',
        'reference_doc_path',
        'supporting_doc_path',
        'designed_by',
        'approved_by',
        'approved_at',
        'prod_quot_request_status',
    ];

    /**
     * 属性のキャスト
     */
    protected $casts = [
        'approved_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * ステータス定数
     */
    public const STATUS_DESIGNING = '00';       // 設計中

    public const STATUS_DESIGNED = '10';        // 設計済

    public const STATUS_APPROVED = '20';        // 承認済

    public const STATUS_CANCELLED = '30';       // 承認取消

    /**
     * ステータスラベル
     */
    public const STATUS_LABELS = [
        self::STATUS_DESIGNING => '設計中',
        self::STATUS_DESIGNED => '設計済',
        self::STATUS_APPROVED => '承認済',
        self::STATUS_CANCELLED => '承認取消',
    ];

    /**
     * 制作見積とのリレーション
     */
    public function prodQuot(): BelongsTo
    {
        return $this->belongsTo(ProdQuot::class, 'prod_quot_id', 'prod_quot_id');
    }

    /**
     * 作業部署とのリレーション
     */
    public function sectionCd(): BelongsTo
    {
        return $this->belongsTo(SectionCd::class, 'section_cd_id', 'section_cd_id');
    }

    /**
     * 依頼者とのリレーション
     */
    public function requester(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'requested_by', 'employee_id');
    }

    /**
     * 設計者とのリレーション
     */
    public function designer(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'designed_by', 'employee_id');
    }

    /**
     * 承認者とのリレーション
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'approved_by', 'employee_id');
    }

    /**
     * 制作見積詳細とのリレーション
     */
    public function prodQuotDetails(): HasMany
    {
        return $this->hasMany(ProdQuotDetail::class, 'prod_quot_request_id', 'prod_quot_request_id');
    }

    /**
     * ステータスラベルを取得
     */
    public function getStatusLabelAttribute(): string
    {
        return self::STATUS_LABELS[$this->prod_quot_request_status] ?? '';
    }
}
