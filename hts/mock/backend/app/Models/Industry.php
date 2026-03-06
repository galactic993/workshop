<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Industry extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * テーブル名
     */
    protected $table = 'industries';

    /**
     * プライマリキー
     */
    protected $primaryKey = 'industry_id';

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
        'industry_id',
        'industry_name',
    ];

    /**
     * 属性のキャスト
     */
    protected $casts = [
        'deleted_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * この業種に属する得意先グループを取得
     */
    public function customerGroups(): HasMany
    {
        return $this->hasMany(CustomerGroup::class, 'industry_id', 'industry_id');
    }
}
