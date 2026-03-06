<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProdQuotReturnLog extends Model
{
    /**
     * テーブル名
     */
    protected $table = 'prod_quot_return_log';

    /**
     * プライマリキー
     */
    protected $primaryKey = 'prod_quot_return_log_id';

    /**
     * 複数代入可能な属性
     */
    protected $fillable = [
        'prod_quot_id',
        'previous_version',
        'next_version',
        'remand_reason',
    ];

    /**
     * 属性のキャスト
     */
    protected $casts = [
        'previous_version' => 'integer',
        'next_version' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * 制作見積とのリレーション
     */
    public function prodQuot(): BelongsTo
    {
        return $this->belongsTo(ProdQuot::class, 'prod_quot_id', 'prod_quot_id');
    }
}
