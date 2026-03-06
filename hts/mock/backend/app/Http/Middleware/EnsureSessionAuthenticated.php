<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class EnsureSessionAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * セッションに employee_id が存在するかをチェックする
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! session()->has('employee_id')) {
            Log::warning('認証失敗: セッションに employee_id が存在しません', [
                'path' => $request->path(),
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'ログインしてください',
            ], 401);
        }

        return $next($request);
    }
}
