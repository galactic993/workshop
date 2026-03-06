<?php

namespace App\Traits;

use App\Http\Responses\QuotResponse;
use App\Models\Quot;
use App\Services\QuotService;
use Illuminate\Http\JsonResponse;

trait ChecksQuotAccess
{
    /**
     * アクセス可能な部署コードIDの情報を取得
     */
    protected function getAccessInfo(?int $employeeId = null, ?string $accessType = null): array
    {
        $employeeId = $employeeId ?? session('employee_id');
        $accessType = $accessType ?? session('access_type');

        return $this->getQuotService()->getAccessibleSectionCdIds($employeeId, $accessType);
    }

    /**
     * 見積に対するアクセス権限があるかチェック
     */
    protected function hasQuotAccess(Quot $quot, ?array $accessInfo = null): bool
    {
        $accessInfo = $accessInfo ?? $this->getAccessInfo();

        if ($accessInfo['is_unlimited']) {
            return true;
        }

        return in_array($quot->section_cd_id, $accessInfo['section_cd_ids']);
    }

    /**
     * 見積に対するアクセス権限チェックを行い、権限がない場合はエラーレスポンスを返す
     */
    protected function requireQuotAccess(Quot $quot, string $action = '操作', ?array $accessInfo = null): ?JsonResponse
    {
        if (! $this->hasQuotAccess($quot, $accessInfo)) {
            return QuotResponse::forbidden("この見積を{$action}する権限がありません");
        }

        return null;
    }

    /**
     * QuotServiceを取得
     */
    abstract protected function getQuotService(): QuotService;
}
