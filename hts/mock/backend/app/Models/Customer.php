<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Customer extends Model
{
    use HasFactory;

    /**
     * テーブル名
     */
    protected $table = 'customers';

    /**
     * プライマリキー
     */
    protected $primaryKey = 'customer_id';

    /**
     * created_at を使用しない（updated_at のみ使用）
     */
    const CREATED_AT = null;

    /**
     * 複数代入可能な属性
     */
    protected $fillable = [
        'customer_cd',
        'customer_name',
        'customer_name_kana',
        'company_id',
        'postal_cd',
        'address1',
        'address2',
        'representative_name',
        'phone_number',
        'fax_number',
        'email',
        'is_inspection',
        'inspection_term_months',
        'inspection_date',
        'payment_term_months',
        'payment_date',
        'payment_type',
        'tax_rounded_type',
        'fee_beare_type',
        'credit_limit',
        'order_limit',
        'discount_flag',
    ];

    /**
     * 属性のキャスト
     */
    protected $casts = [
        'is_inspection' => 'boolean',
        'credit_limit' => 'decimal:0',
        'order_limit' => 'decimal:0',
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
     * 会社団体マスタとのリレーション
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'company_id', 'company_id');
    }

    /**
     * この得意先に紐付いている部署コードを取得
     */
    public function sectionCds(): BelongsToMany
    {
        return $this->belongsToMany(
            SectionCd::class,
            'customer_section_cd',
            'customer_id',
            'section_cd_id',
            'customer_id',
            'section_cd_id'
        );
    }
}
