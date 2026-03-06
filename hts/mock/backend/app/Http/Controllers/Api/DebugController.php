<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DebugController extends Controller
{
    /**
     * テーブル一覧を取得
     */
    public function tables(): JsonResponse
    {
        $tables = Schema::getTableListing();

        // システムテーブルを除外
        $excludeTables = [
            'migrations',
            'password_reset_tokens',
            'personal_access_tokens',
            'failed_jobs',
            'jobs',
            'job_batches',
            'cache',
            'cache_locks',
            'sessions',
        ];

        $tables = array_values(array_filter($tables, function ($table) use ($excludeTables) {
            return ! in_array($table, $excludeTables);
        }));

        return response()->json([
            'tables' => $tables,
        ]);
    }

    /**
     * 指定テーブルのレコードを全件取得
     */
    public function records(Request $request): JsonResponse
    {
        $tableName = $request->query('table');

        if (! $tableName) {
            return response()->json([
                'error' => 'テーブル名を指定してください',
            ], 400);
        }

        // テーブルの存在確認
        if (! Schema::hasTable($tableName)) {
            return response()->json([
                'error' => '指定されたテーブルは存在しません',
            ], 404);
        }

        // カラム情報を取得
        $columns = Schema::getColumnListing($tableName);

        // レコードを取得
        $records = DB::table($tableName)->get();

        return response()->json([
            'table' => $tableName,
            'columns' => $columns,
            'records' => $records,
            'count' => $records->count(),
        ]);
    }
}
