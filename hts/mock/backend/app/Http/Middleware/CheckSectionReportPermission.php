<?php

namespace App\Http\Middleware;

use App\Enums\AccessType;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSectionReportPermission
{
    /**
     * Handle an incoming request.
     *
     * 受注週報（部署別）APIへのアクセス権限をチェック
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 権限チェック
        if (! $this->canAccessSectionReport()) {
            return response()->json([
                'success' => false,
                'message' => 'アクセス権限がありません',
            ], 403);
        }

        return $next($request);
    }

    /**
     * 受注週報（部署別）へのアクセス権限チェック
     */
    private function canAccessSectionReport(): bool
    {
        $accessType = AccessType::tryFrom(session('access_type', ''));
        $permissions = session('permissions', []);

        // アクセス区分00（全て）は全てアクセス可能
        if ($accessType?->hasUnlimitedAccess()) {
            return true;
        }

        // sales.orders.section-report権限を持っているかチェック
        return in_array('sales.orders.section-report', $permissions);
    }
}
