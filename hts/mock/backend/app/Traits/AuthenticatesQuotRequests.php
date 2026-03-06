<?php

namespace App\Traits;

use App\Enums\AccessType;
use App\Http\Responses\QuotResponse;
use Illuminate\Http\JsonResponse;

trait AuthenticatesQuotRequests
{
    /**
     * 現在のログインユーザーの社員IDを取得
     */
    protected function getEmployeeId(): ?int
    {
        return session('employee_id');
    }

    /**
     * 現在のログインユーザーのアクセス区分を取得
     */
    protected function getAccessType(): ?string
    {
        return session('access_type');
    }

    /**
     * 見積承認権限があるかチェック
     * アクセス区分 00（すべて）または 20（所長）の場合に承認可能
     */
    protected function canApproveQuot(): bool
    {
        $accessType = AccessType::tryFrom($this->getAccessType() ?? '');

        return $accessType?->hasUnlimitedAccess() || $accessType?->value === '20';
    }

    /**
     * 承認権限チェックを行い、権限がない場合はエラーレスポンスを返す
     */
    protected function requireApprovalPermission(): ?JsonResponse
    {
        if (! $this->canApproveQuot()) {
            return QuotResponse::forbidden('権限がありません');
        }

        return null;
    }
}
