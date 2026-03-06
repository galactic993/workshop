<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProdQuotDetail extends Model
{
    /**
     * テーブル名
     */
    protected $table = 'prod_quot_details';

    /**
     * プライマリキー
     */
    protected $primaryKey = 'prod_quot_detail_id';

    /**
     * 複数代入可能な属性
     */
    protected $fillable = [
        'prod_quot_request_id',
        'proces_cd_id',
        'employee_id',
        'quantity',
        'unit_cost',
        'cost',
    ];

    /**
     * 属性のキャスト
     */
    protected $casts = [
        'quantity' => 'integer',
        'unit_cost' => 'decimal:0',
        'cost' => 'decimal:0',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * 制作見積依頼とのリレーション
     */
    public function prodQuotRequest(): BelongsTo
    {
        return $this->belongsTo(ProdQuotRequest::class, 'prod_quot_request_id', 'prod_quot_request_id');
    }

    /**
     * 加工品内容コードとのリレーション
     */
    public function procesCd(): BelongsTo
    {
        return $this->belongsTo(ProcesCd::class, 'proces_cd_id', 'proces_cd_id');
    }

    /**
     * 設計者とのリレーション
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'employee_id');
    }
}
