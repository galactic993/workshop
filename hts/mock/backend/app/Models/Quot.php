<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quot extends Model
{
    use HasFactory;

    /**
     * テーブル名
     */
    protected $table = 'quots';

    /**
     * プライマリキー
     */
    protected $primaryKey = 'quot_id';

    /**
     * 諸口の得意先コード
     */
    public const MISC_CUSTOMER_CD = '33900';

    /**
     * 複数代入可能な属性
     */
    protected $fillable = [
        'section_cd_id',
        'employee_id',
        'base_quot_id',
        'quot_number',
        'prod_name',
        'customer_id',
        'customer_name',
        'quot_subject',
        'quot_summary',
        'reference_doc_path',
        'center_section_cd_id',
        'approved_by',
        'approved_at',
        'quot_status',
        'prod_quot_status',
        'quot_amount',
        'submission_method',
        'quot_on',
        'quot_doc_path',
        'quot_result',
        'lost_reason',
        'message',
    ];

    /**
     * 属性のキャスト
     */
    protected $casts = [
        'quot_amount' => 'decimal:0',
        'approved_at' => 'datetime',
        'quot_on' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * 見積ステータス定数
     */
    public const STATUS_DRAFT = '00';             // 作成中

    public const STATUS_PENDING_APPROVAL = '10';  // 承認待ち

    public const STATUS_APPROVED = '20';          // 承認済

    public const STATUS_ISSUED = '30';            // 発行済

    /**
     * 見積ステータスラベル
     */
    public const STATUS_LABELS = [
        self::STATUS_DRAFT => '作成中',
        self::STATUS_PENDING_APPROVAL => '承認待ち',
        self::STATUS_APPROVED => '承認済',
        self::STATUS_ISSUED => '発行済',
    ];

    /**
     * 制作見積ステータス定数
     */
    public const PROD_STATUS_BEFORE_REQUEST = '00';  // 制作見積依頼前

    public const PROD_STATUS_REQUESTED = '10';       // 制作見積依頼済

    public const PROD_STATUS_COMPLETED = '20';       // 制作見積済

    public const PROD_STATUS_RECEIVED = '30';        // 制作見積受取済

    /**
     * 制作見積ステータスラベル
     */
    public const PROD_STATUS_LABELS = [
        self::PROD_STATUS_BEFORE_REQUEST => '制作見積依頼前',
        self::PROD_STATUS_REQUESTED => '制作見積依頼済',
        self::PROD_STATUS_COMPLETED => '制作見積済',
        self::PROD_STATUS_RECEIVED => '制作見積受取済',
    ];

    /**
     * 提出方法定数
     */
    public const SUBMISSION_UNDECIDED = '00';  // 未定

    public const SUBMISSION_EMAIL = '10';      // メール

    public const SUBMISSION_POST = '20';       // 郵送

    public const SUBMISSION_HAND = '30';       // 持参

    /**
     * 提出方法ラベル
     */
    public const SUBMISSION_LABELS = [
        self::SUBMISSION_UNDECIDED => '未定',
        self::SUBMISSION_EMAIL => 'メール',
        self::SUBMISSION_POST => '郵送',
        self::SUBMISSION_HAND => '持参',
    ];

    /**
     * 見積結果定数
     */
    public const RESULT_UNDETERMINED = '00';  // 未確定

    public const RESULT_WON = '10';           // 受注

    public const RESULT_LOST = '20';          // 失注

    /**
     * 見積結果ラベル
     */
    public const RESULT_LABELS = [
        self::RESULT_UNDETERMINED => '未確定',
        self::RESULT_WON => '受注',
        self::RESULT_LOST => '失注',
    ];

    /**
     * 担当部署とのリレーション
     */
    public function sectionCd(): BelongsTo
    {
        return $this->belongsTo(SectionCd::class, 'section_cd_id', 'section_cd_id');
    }

    /**
     * 担当者とのリレーション
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'employee_id');
    }

    /**
     * 流用元見積とのリレーション
     */
    public function baseQuot(): BelongsTo
    {
        return $this->belongsTo(Quot::class, 'base_quot_id', 'quot_id');
    }

    /**
     * 得意先とのリレーション
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'customer_id');
    }

    /**
     * 主管センターとのリレーション
     */
    public function centerSectionCd(): BelongsTo
    {
        return $this->belongsTo(SectionCd::class, 'center_section_cd_id', 'section_cd_id');
    }

    /**
     * 承認者とのリレーション
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'approved_by', 'employee_id');
    }

    /**
     * 見積ステータスラベルを取得
     */
    public function getStatusLabelAttribute(): string
    {
        return self::STATUS_LABELS[$this->quot_status] ?? '';
    }

    /**
     * 制作見積ステータスラベルを取得
     */
    public function getProdQuotStatusLabelAttribute(): string
    {
        return self::PROD_STATUS_LABELS[$this->prod_quot_status] ?? '';
    }

    /**
     * 提出方法ラベルを取得
     */
    public function getSubmissionMethodLabelAttribute(): string
    {
        return self::SUBMISSION_LABELS[$this->submission_method] ?? '';
    }

    /**
     * 見積結果ラベルを取得
     */
    public function getQuotResultLabelAttribute(): string
    {
        return self::RESULT_LABELS[$this->quot_result] ?? '';
    }

    /**
     * 制作見積とのリレーション
     */
    public function prodQuots(): HasMany
    {
        return $this->hasMany(ProdQuot::class, 'quot_id', 'quot_id');
    }

    /**
     * 作業部門別見積とのリレーション
     */
    public function quotOperations(): HasMany
    {
        return $this->hasMany(QuotOperation::class, 'quot_id', 'quot_id');
    }
}
