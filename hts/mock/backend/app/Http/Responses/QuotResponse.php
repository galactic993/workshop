<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;

class QuotResponse
{
    /**
     * 認証エラーレスポンス (401)
     */
    public static function unauthorized(string $message = 'ログインしてください'): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], 401);
    }

    /**
     * 権限エラーレスポンス (403)
     */
    public static function forbidden(string $message = '権限がありません'): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], 403);
    }

    /**
     * 見つからないエラーレスポンス (404)
     */
    public static function notFound(string $message = '見積が見つかりません'): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], 404);
    }

    /**
     * 不正リクエストエラーレスポンス (400)
     */
    public static function badRequest(string $message): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], 400);
    }

    /**
     * バリデーションエラーレスポンス (422)
     */
    public static function validationError(string $message, array $errors = []): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], 422);
    }

    /**
     * サーバーエラーレスポンス (500)
     */
    public static function serverError(string $message = '処理に失敗しました'): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], 500);
    }

    /**
     * 成功レスポンス
     */
    public static function success(string $message, array $data = []): JsonResponse
    {
        return response()->json(array_merge([
            'success' => true,
            'message' => $message,
        ], $data));
    }
}
