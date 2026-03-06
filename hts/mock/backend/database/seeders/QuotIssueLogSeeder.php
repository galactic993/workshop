<?php

namespace Database\Seeders;

use App\Models\Quot;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuotIssueLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * 見積書発行履歴のシーダー
     * ステータス60（発行済）の見積に対して発行履歴を作成
     */
    public function run(): void
    {
        // 既存データをクリア（開発環境のみ）
        if (app()->environment('local', 'development')) {
            DB::table('quot_issue_log')->truncate();
        }

        // 見積番号からIDを取得するためのマッピング
        $quotIdMap = Quot::pluck('quot_id', 'quot_number')->toArray();

        $quotIssueLogs = [
            // 000062412001 (ホームページ制作), issued_by: 8 (東京太郎)
            [
                'quot_number' => '000062412001',
                'issued_at' => '2024-12-18 14:00:00',
                'issued_by' => 8,
                'file_name' => '000062412001_20241218140000.xlsx',
            ],

            // 000072412001 (Webシステム開発), issued_by: 9 (東京花子)
            [
                'quot_number' => '000072412001',
                'issued_at' => '2024-12-22 15:00:00',
                'issued_by' => 9,
                'file_name' => '000072412001_20241222150000.xlsx',
            ],

            // 000062412002 (社内報制作), issued_by: 13 (第一太郎)
            [
                'quot_number' => '000062412002',
                'issued_at' => '2024-12-12 15:30:00',
                'issued_by' => 13,
                'file_name' => '000062412002_20241212153000.xlsx',
            ],

            // 000072411001 (年賀状デザイン), issued_by: 14 (第一花子)
            [
                'quot_number' => '000072411001',
                'issued_at' => '2024-11-15 14:00:00',
                'issued_by' => 14,
                'file_name' => '000072411001_20241115140000.xlsx',
            ],

            // 000072412002 (グループウェア導入), issued_by: 18 (第二太郎)
            [
                'quot_number' => '000072412002',
                'issued_at' => '2024-12-08 16:00:00',
                'issued_by' => 18,
                'file_name' => '000072412002_20241208160000.xlsx',
            ],

            // 000082412001 (PC入替支援), issued_by: 19 (第二花子)
            [
                'quot_number' => '000082412001',
                'issued_at' => '2024-12-15 10:00:00',
                'issued_by' => 19,
                'file_name' => '000082412001_20241215100000.xlsx',
            ],
        ];

        $insertedCount = 0;
        foreach ($quotIssueLogs as $log) {
            $quotNumber = $log['quot_number'];
            unset($log['quot_number']);
            $quotId = $quotIdMap[$quotNumber] ?? null;

            if ($quotId) {
                DB::table('quot_issue_log')->insert(array_merge($log, [
                    'quot_id' => $quotId,
                    'created_at' => now(),
                ]));
                $insertedCount++;
            }
        }

        // quotsテーブルのquot_doc_pathも更新
        $quotDocPaths = [
            '000062412001' => 'quotes/000062412001_20241218140000.xlsx',
            '000072412001' => 'quotes/000072412001_20241222150000.xlsx',
            '000062412002' => 'quotes/000062412002_20241212153000.xlsx',
            '000072411001' => 'quotes/000072411001_20241115140000.xlsx',
            '000072412002' => 'quotes/000072412002_20241208160000.xlsx',
            '000082412001' => 'quotes/000082412001_20241215100000.xlsx',
        ];

        foreach ($quotDocPaths as $quotNumber => $path) {
            $quotId = $quotIdMap[$quotNumber] ?? null;
            if ($quotId) {
                DB::table('quots')
                    ->where('quot_id', $quotId)
                    ->update(['quot_doc_path' => $path]);
            }
        }

        $this->command->info('見積書発行履歴テーブルに '.$insertedCount.' 件のデータを投入しました。');
        $this->command->info('見積テーブルの見積書ファイルパスを更新しました。');
    }
}
