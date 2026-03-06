<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProdQuot extends Model
{
    use HasFactory;

    /**
     * テーブル名
     */
    protected $table = 'prod_quots';

    /**
     * プライマリキー
     */
    protected $primaryKey = 'prod_quot_id';

    /**
     * 複数代入可能な属性
     */
    protected $fillable = [
        'quot_id',
        'cost',
        'quot_doc_path',
        'reference_doc_path',
        'submission_on',
        'prod_quot_status',
        'version',
    ];

    /**
     * 属性のキャスト
     */
    protected $casts = [
        'cost' => 'decimal:0',
        'submission_on' => 'date',
        'version' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * ステータス定数
     */
    public const STATUS_NOT_STARTED = '00';      // 未着手

    public const STATUS_IN_PROGRESS = '10';      // 制作見積中

    public const STATUS_COMPLETED = '20';        // 制作見積済

    public const STATUS_RECEIVED = '30';         // 受取済

    public const STATUS_ISSUED = '40';           // 発行済

    public const STATUS_REJECTED = '50';         // 差戻

    /**
     * ステータスラベル
     */
    public const STATUS_LABELS = [
        self::STATUS_NOT_STARTED => '未着手',
        self::STATUS_IN_PROGRESS => '制作見積中',
        self::STATUS_COMPLETED => '制作見積済',
        self::STATUS_RECEIVED => '受取済',
        self::STATUS_ISSUED => '発行済',
        self::STATUS_REJECTED => '差戻',
    ];

    /**
     * 見積とのリレーション
     */
    public function quot(): BelongsTo
    {
        return $this->belongsTo(Quot::class, 'quot_id', 'quot_id');
    }

    /**
     * 制作見積依頼とのリレーション
     */
    public function prodQuotRequests(): HasMany
    {
        return $this->hasMany(ProdQuotRequest::class, 'prod_quot_id', 'prod_quot_id');
    }

    /**
     * 作業部門別制作見積とのリレーション
     */
    public function prodQuotOperations(): HasMany
    {
        return $this->hasMany(ProdQuotOperation::class, 'prod_quot_id', 'prod_quot_id');
    }

    /**
     * 制作見積差戻管理とのリレーション
     */
    public function prodQuotReturnLogs(): HasMany
    {
        return $this->hasMany(ProdQuotReturnLog::class, 'prod_quot_id', 'prod_quot_id');
    }

    /**
     * ステータスラベルを取得
     */
    public function getStatusLabelAttribute(): string
    {
        return self::STATUS_LABELS[$this->prod_quot_status] ?? '';
    }
}
