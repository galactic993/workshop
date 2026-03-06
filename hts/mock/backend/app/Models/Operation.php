<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Operation extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * テーブル名
     */
    protected $table = 'operations';

    /**
     * プライマリキー
     */
    protected $primaryKey = 'operation_id';

    /**
     * created_at を使用しない（updated_at のみ使用）
     */
    const CREATED_AT = null;

    /**
     * 複数代入可能な属性
     */
    protected $fillable = [
        'operation_cd',
        'operation_name',
    ];

    /**
     * 属性のキャスト
     */
    protected $casts = [
        'deleted_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * 作業部門別制作見積とのリレーション
     */
    public function prodQuotOperations(): HasMany
    {
        return $this->hasMany(ProdQuotOperation::class, 'operation_id', 'operation_id');
    }

    /**
     * 作業部門別見積とのリレーション
     */
    public function quotOperations(): HasMany
    {
        return $this->hasMany(QuotOperation::class, 'operation_id', 'operation_id');
    }
}
