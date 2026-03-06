<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProdQuotOperation extends Model
{
    use HasFactory;

    /**
     * テーブル名
     */
    protected $table = 'prod_quot_operations';

    /**
     * プライマリキー
     */
    protected $primaryKey = 'prod_quot_operation_id';

    /**
     * 複数代入可能な属性
     */
    protected $fillable = [
        'prod_quot_id',
        'operation_id',
        'prod_quot_cost',
    ];

    /**
     * 属性のキャスト
     */
    protected $casts = [
        'prod_quot_cost' => 'decimal:0',
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

    /**
     * 作業部門とのリレーション
     */
    public function operation(): BelongsTo
    {
        return $this->belongsTo(Operation::class, 'operation_id', 'operation_id');
    }
}
