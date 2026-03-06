<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * テーブル名
     */
    protected $table = 'companies';

    /**
     * プライマリキー
     */
    protected $primaryKey = 'company_id';

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
        'company_id',
        'customer_group_id',
        'company_name',
    ];

    /**
     * 属性のキャスト
     */
    protected $casts = [
        'deleted_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * 得意先グループマスタとのリレーション
     */
    public function customerGroup(): BelongsTo
    {
        return $this->belongsTo(CustomerGroup::class, 'customer_group_id', 'customer_group_id');
    }

    /**
     * この会社団体に属する得意先を取得
     */
    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class, 'company_id', 'company_id');
    }
}
