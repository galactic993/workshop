<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    /**
     * テーブル名
     */
    protected $table = 'orders';

    /**
     * プライマリキー
     */
    protected $primaryKey = 'order_id';

    /**
     * 複数代入可能な属性
     */
    protected $fillable = [
        'order_cd_year',
        'order_cd',
        'quot_id',
        'section_cd_id',
        'customer_id',
        'customer_name',
        'employee_id',
        'prod_name',
        'official_prod_name',
        'prod_cd',
        'size',
        'quantity',
        'order_on',
        'bc_delivery_on',
        'delivery_on',
        'completion_on',
        'orders_category',
        'sales_category',
        'sales_status',
        'purchase_order_number',
        'is_approved',
        'approved_by',
        'approved_at',
        'short_prod_name',
        'first_proof_on',
        'second_proof_on',
        'third_proof_on',
        'manuscript_pages',
        'drawing_count',
        'provided_photos_count',
        'is_work_category1',
        'is_work_category2',
        'is_work_category3',
        'is_work_category4',
        'is_work_category5',
        'is_work_category6',
        'is_personal_data',
        'is_confidential_data',
        'is_retention_required',
        'center_section_cd_id',
        'person_in_charge_id',
        'communication_note',
        'sales_completion_on',
        'order_status',
    ];

    /**
     * 属性のキャスト
     */
    protected $casts = [
        'order_on' => 'date',
        'bc_delivery_on' => 'date',
        'delivery_on' => 'date',
        'completion_on' => 'date',
        'is_approved' => 'boolean',
        'approved_at' => 'datetime',
        'first_proof_on' => 'date',
        'second_proof_on' => 'date',
        'third_proof_on' => 'date',
        'is_work_category1' => 'boolean',
        'is_work_category2' => 'boolean',
        'is_work_category3' => 'boolean',
        'is_work_category4' => 'boolean',
        'is_work_category5' => 'boolean',
        'is_work_category6' => 'boolean',
        'is_personal_data' => 'boolean',
        'is_confidential_data' => 'boolean',
        'is_retention_required' => 'boolean',
        'sales_completion_on' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * 受注区分定数
     */
    public const ORDERS_CATEGORY_NORMAL = '00';      // 通常

    public const ORDERS_CATEGORY_FORECAST = '10';    // 見込

    public const ORDERS_CATEGORY_ADVANCE = '20';     // 事前生産

    public const ORDERS_CATEGORY_SET = '30';         // セット製品

    public const ORDERS_CATEGORY_SHIPPING = '40';    // 発送作業

    /**
     * 売上区分定数
     */
    public const SALES_CATEGORY_NORMAL = '00';       // 通常

    public const SALES_CATEGORY_FORECAST = '10';     // 見込

    public const SALES_CATEGORY_ESTIMATE = '20';     // 概算

    /**
     * 売上状況定数
     */
    public const SALES_STATUS_NONE = '00';           // 未売上

    public const SALES_STATUS_PARTIAL = '10';        // 一部売上済

    public const SALES_STATUS_COMPLETED = '20';      // 売上済

    /**
     * 受注ステータス定数
     */
    public const ORDER_STATUS_ISSUED = '00';         // 工番発行済

    public const ORDER_STATUS_ARRANGED = '10';       // 作業手配済

    public const ORDER_STATUS_ACCEPTED = '20';       // 作業受付済

    public const ORDER_STATUS_COMPLETED = '30';      // 作業完了済

    public const ORDER_STATUS_PURCHASED = '40';      // 社内仕入済

    /**
     * 見積とのリレーション
     */
    public function quot(): BelongsTo
    {
        return $this->belongsTo(Quot::class, 'quot_id', 'quot_id');
    }

    /**
     * 担当部署とのリレーション
     */
    public function sectionCd(): BelongsTo
    {
        return $this->belongsTo(SectionCd::class, 'section_cd_id', 'section_cd_id');
    }

    /**
     * 得意先とのリレーション
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'customer_id');
    }

    /**
     * 担当者とのリレーション
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'employee_id');
    }

    /**
     * 承認者とのリレーション
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'approved_by', 'employee_id');
    }

    /**
     * 主管センターとのリレーション
     */
    public function centerSectionCd(): BelongsTo
    {
        return $this->belongsTo(SectionCd::class, 'center_section_cd_id', 'section_cd_id');
    }

    /**
     * 主管担当者とのリレーション
     */
    public function personInCharge(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'person_in_charge_id', 'employee_id');
    }

    /**
     * 作業部門別受注金額とのリレーション
     */
    public function orderOperationAmounts(): HasMany
    {
        return $this->hasMany(OrderOperationAmount::class, 'order_id', 'order_id');
    }

    /**
     * 工番表示用フォーマット（年号-通番）
     */
    public function getOrderNumberAttribute(): string
    {
        return $this->order_cd_year.'-'.$this->order_cd;
    }
}
