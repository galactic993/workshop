<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class ProcesCd extends Model
{
    /**
     * テーブル名
     */
    protected $table = 'proces_cds';

    /**
     * プライマリキー
     */
    protected $primaryKey = 'proces_cd_id';

    /**
     * created_at を使用しない（updated_at のみ使用）
     */
    const CREATED_AT = null;

    /**
     * 複数代入可能な属性
     */
    protected $fillable = [
        'proces_cd',
        'proces_content',
        'proces_cost',
        'proces_unit',
    ];

    /**
     * 属性のキャスト
     */
    protected $casts = [
        'proces_cost' => 'decimal:2',
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
     * 作業部門コードを取得（加工品内容コードの先頭3桁）
     */
    public function getOperationCdAttribute(): string
    {
        return substr($this->proces_cd, 0, 3);
    }
}
