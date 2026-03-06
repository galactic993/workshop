<?php

namespace App\Services;

use App\Enums\AccessType;

/**
 * 権限管理サービス
 *
 * ユーザーの権限チェックを一元管理
 */
class PermissionService
{
    /**
     * 部署別得意先メンテナンス画面へのアクセス権限をチェック
     */
    public function canAccessSectionCustomer(): bool
    {
        $accessType = AccessType::tryFrom(session('access_type', ''));
        $permissions = session('permissions', []);

        // アクセス区分00（全て）は全てアクセス可能
        if ($accessType?->hasUnlimitedAccess()) {
            return true;
        }

        // sales.orders.customer権限を持っているかチェック
        return in_array('sales.orders.customer', $permissions);
    }

    /**
     * 指定された権限を持っているかチェック
     */
    public function hasPermission(string $permission): bool
    {
        $accessType = AccessType::tryFrom(session('access_type', ''));
        $permissions = session('permissions', []);

        // アクセス区分00（全て）は全てアクセス可能
        if ($accessType?->hasUnlimitedAccess()) {
            return true;
        }

        // 指定された権限を持っているかチェック
        return in_array($permission, $permissions);
    }

    /**
     * 無制限アクセス権限を持つかチェック
     */
    public function hasUnlimitedAccess(): bool
    {
        $accessType = AccessType::tryFrom(session('access_type', ''));

        return $accessType?->hasUnlimitedAccess() ?? false;
    }
}
