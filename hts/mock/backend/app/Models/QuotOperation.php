<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuotOperation extends Model
{
    use HasFactory;

    /**
     * テーブル名
     */
    protected $table = 'quot_operations';

    /**
     * プライマリキー
     */
    protected $primaryKey = 'quot_operation_id';

    /**
     * created_atは使用しない
     */
    const CREATED_AT = null;

    /**
     * 複数代入可能な属性
     */
    protected $fillable = [
        'quot_id',
        'operation_id',
        'cost',
        'quot_amount',
    ];

    /**
     * 属性のキャスト
     */
    protected $casts = [
        'cost' => 'decimal:0',
        'quot_amount' => 'decimal:0',
        'updated_at' => 'datetime',
    ];

    /**
     * 見積とのリレーション
     */
    public function quot(): BelongsTo
    {
        return $this->belongsTo(Quot::class, 'quot_id', 'quot_id');
    }

    /**
     * 作業部門とのリレーション
     */
    public function operation(): BelongsTo
    {
        return $this->belongsTo(Operation::class, 'operation_id', 'operation_id');
    }
}
