<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\OrderImportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class OrderImportController extends Controller
{
    public function __construct(
        private OrderImportService $orderImportService
    ) {}

    /**
     * 受注情報Excelファイルのバリデーションと登録
     *
     * バリデーションがOKの場合は登録処理を実行する
     */
    public function import(Request $request): JsonResponse
    {
        // ファイルの存在チェック
        if (! $request->hasFile('file')) {
            return response()->json([
                'success' => false,
                'errors' => ['ファイルを選択してください。'],
            ], 400);
        }

        $file = $request->file('file');

        // ファイル形式のチェック
        $allowedMimeTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
            'application/vnd.ms-excel', // xls
        ];

        $allowedExtensions = ['xlsx', 'xls'];
        $extension = strtolower($file->getClientOriginalExtension());

        if (! in_array($file->getMimeType(), $allowedMimeTypes) && ! in_array($extension, $allowedExtensions)) {
            return response()->json([
                'success' => false,
                'errors' => ['Excelファイル（.xlsx, .xls）を選択してください。'],
            ], 400);
        }

        // ファイルサイズのチェック（10MB上限）
        if ($file->getSize() > 10 * 1024 * 1024) {
            return response()->json([
                'success' => false,
                'errors' => ['ファイルサイズは10MB以下にしてください。'],
            ], 400);
        }

        $employeeId = session('employee_id');

        try {
            // バリデーション実行
            $validationResult = $this->orderImportService->validateExcelFile($file->getPathname(), $employeeId);

            // バリデーションエラーがあれば返却
            if (! $validationResult['success']) {
                return response()->json([
                    'success' => false,
                    'errors' => $validationResult['errors'],
                ]);
            }

            // バリデーションOKなら登録処理を実行
            $registerResult = $this->orderImportService->registerOrders($validationResult['data'], $employeeId);

            if ($registerResult['success']) {
                Log::info('受注情報取込成功', [
                    'employee_id' => $employeeId,
                    'first_order_cd' => $registerResult['data']['first_order_cd'],
                    'row_count' => $registerResult['data']['row_count'],
                ]);

                return response()->json([
                    'success' => true,
                    'data' => $registerResult['data'],
                ]);
            }

            return response()->json([
                'success' => false,
                'errors' => $registerResult['errors'],
            ]);
        } catch (\PhpOffice\PhpSpreadsheet\Reader\Exception $e) {
            Log::error('Excel読み込みエラー', [
                'error' => $e->getMessage(),
                'employee_id' => $employeeId,
            ]);

            return response()->json([
                'success' => false,
                'errors' => ['Excelファイルの読み込みに失敗しました。ファイル形式を確認してください。'],
            ], 400);
        } catch (\Exception $e) {
            Log::error('受注取込エラー', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'employee_id' => $employeeId,
            ]);

            return response()->json([
                'success' => false,
                'errors' => ['予期しないエラーが発生しました。'],
            ], 500);
        }
    }
}
