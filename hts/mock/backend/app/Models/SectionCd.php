<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class SectionCd extends Model
{
    use HasFactory;

    /**
     * テーブル名
     */
    protected $table = 'section_cds';

    /**
     * プライマリキー
     */
    protected $primaryKey = 'section_cd_id';

    /**
     * created_at を使用しない（updated_at のみ使用）
     */
    const CREATED_AT = null;

    /**
     * 複数代入可能な属性
     */
    protected $fillable = [
        'section_cd_id',
        'section_cd',
        'section_name',
        'expense_category',
    ];

    /**
     * 属性のキャスト
     */
    protected $casts = [
        'updated_at' => 'datetime',
    ];

    /**
     * モデルの起動処理
     * 有効なレコードのみ取得するグローバルスコープを追加
     */
    protected static function booted(): void
    {
        static::addGlobalScope('active', function (Builder $query) {
            $query->where('deleted_flag', '0');
        });
    }

    /**
     * 無効化（論理削除）
     */
    public function deactivate(): bool
    {
        return $this->update(['deleted_flag' => '1']);
    }

    /**
     * 有効化
     */
    public function activate(): bool
    {
        return $this->update(['deleted_flag' => '0']);
    }

    /**
     * この部署コードに紐付いている得意先を取得
     */
    public function customers(): BelongsToMany
    {
        return $this->belongsToMany(
            Customer::class,
            'customer_section_cd',
            'section_cd_id',
            'customer_id',
            'section_cd_id',
            'customer_id'
        );
    }
}
