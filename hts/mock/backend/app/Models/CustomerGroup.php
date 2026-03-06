<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomerGroup extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * テーブル名
     */
    protected $table = 'customer_groups';

    /**
     * プライマリキー
     */
    protected $primaryKey = 'customer_group_id';

    /**
     * 自動採番なし
     */
    public $incrementing = false;

    /**
     * created_at を使用しない（updated_at のみ使用）
     */
    const CREATED_AT = null;

    /**
     * 複数代入可能な属性
     */
    protected $fillable = [
        'customer_group_id',
        'industry_id',
        'customer_group_name',
    ];

    /**
     * 属性のキャスト
     */
    protected $casts = [
        'deleted_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * 業種マスタとのリレーション
     */
    public function industry(): BelongsTo
    {
        return $this->belongsTo(Industry::class, 'industry_id', 'industry_id');
    }

    /**
     * このグループに属する会社団体を取得
     */
    public function companies(): HasMany
    {
        return $this->hasMany(Company::class, 'customer_group_id', 'customer_group_id');
    }
}
