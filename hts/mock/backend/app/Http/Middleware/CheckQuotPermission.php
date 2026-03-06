<?php

namespace App\Http\Middleware;

use App\Enums\AccessType;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckQuotPermission
{
    /**
     * Handle an incoming request.
     *
     * 見積関連APIへのアクセス権限をチェック
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 権限チェック
        if (! $this->canAccessQuotes()) {
            return response()->json([
                'success' => false,
                'message' => 'アクセス権限がありません',
            ], 403);
        }

        return $next($request);
    }

    /**
     * 見積ページへのアクセス権限チェック
     */
    private function canAccessQuotes(): bool
    {
        $accessType = AccessType::tryFrom(session('access_type', ''));
        $permissions = session('permissions', []);

        // アクセス区分00（全て）は全てアクセス可能
        if ($accessType?->hasUnlimitedAccess()) {
            return true;
        }

        // sales.quotes.*権限のいずれかを持っているかチェック
        foreach ($permissions as $permission) {
            if (str_starts_with($permission, 'sales.quotes.')) {
                return true;
            }
        }

        return false;
    }
}
