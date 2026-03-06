<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkNumberRelation extends Model
{
    use HasFactory;

    /**
     * テーブル名
     */
    protected $table = 'work_number_relations';

    /**
     * プライマリキー
     */
    protected $primaryKey = 'work_number_relation_id';

    /**
     * タイムスタンプを使用しない
     */
    public $timestamps = false;

    /**
     * 複数代入可能な属性
     */
    protected $fillable = [
        'parent_order_id',
        'related_order_id',
    ];

    /**
     * 代表工番（受注）とのリレーション
     */
    public function parentOrder(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'parent_order_id', 'order_id');
    }

    /**
     * 関連工番（受注）とのリレーション
     */
    public function relatedOrder(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'related_order_id', 'order_id');
    }
}
