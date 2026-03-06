<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuotIssueLog extends Model
{
    use HasFactory;

    /**
     * テーブル名
     */
    protected $table = 'quot_issue_log';

    /**
     * プライマリキー
     */
    protected $primaryKey = 'quot_issue_log_id';

    /**
     * updated_at を使用しない（created_at のみ使用）
     */
    const UPDATED_AT = null;

    /**
     * 複数代入可能な属性
     */
    protected $fillable = [
        'quot_id',
        'issued_at',
        'issued_by',
        'file_name',
    ];

    /**
     * 属性のキャスト
     */
    protected $casts = [
        'issued_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    /**
     * 見積リレーション
     */
    public function quot(): BelongsTo
    {
        return $this->belongsTo(Quot::class, 'quot_id', 'quot_id');
    }

    /**
     * 発行者（社員）リレーション
     */
    public function issuedBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'issued_by', 'employee_id');
    }
}
