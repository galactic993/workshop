<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderOperationAmount extends Model
{
    use HasFactory;

    /**
     * テーブル名
     */
    protected $table = 'order_operation_amounts';

    /**
     * プライマリキー
     */
    protected $primaryKey = 'order_operation_amount_id';

    /**
     * 複数代入可能な属性
     */
    protected $fillable = [
        'order_id',
        'operation_id',
        'cost',
        'order_amount',
        'first_cost',
        'first_order_amount',
    ];

    /**
     * 属性のキャスト
     */
    protected $casts = [
        'cost' => 'decimal:0',
        'order_amount' => 'decimal:0',
        'first_cost' => 'decimal:0',
        'first_order_amount' => 'decimal:0',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * 受注とのリレーション
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'order_id', 'order_id');
    }

    /**
     * 作業部門とのリレーション
     */
    public function operation(): BelongsTo
    {
        return $this->belongsTo(Operation::class, 'operation_id', 'operation_id');
    }
}
