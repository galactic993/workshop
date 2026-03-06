<?php

namespace Database\Seeders;

use App\Models\ProcesCd;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProcesCdSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * 加工品内容コードマスタのシーダー
     * 加工品内容コードの先頭3桁で作業部門にグループ化される
     * - 100: 印刷
     * - 200: 編集
     * - 300: 開発
     */
    public function run(): void
    {
        // 既存データをクリア（開発環境のみ）
        if (app()->environment('local', 'development')) {
            DB::table('proces_cds')->truncate();
        }

        $procesCds = [
            // ========================================
            // 100: 印刷
            // ========================================
            [
                'proces_cd' => '10000010',
                'proces_content' => '刷版',
                'proces_cost' => 50000,
            ],
            [
                'proces_cd' => '10000020',
                'proces_content' => '印刷',
                'proces_cost' => 80000,
            ],
            [
                'proces_cd' => '10000030',
                'proces_content' => '製本',
                'proces_cost' => 30000,
            ],
            [
                'proces_cd' => '10000040',
                'proces_content' => '断裁',
                'proces_cost' => 15000,
            ],
            [
                'proces_cd' => '10000050',
                'proces_content' => '折り加工',
                'proces_cost' => 20000,
            ],

            // ========================================
            // 200: 編集
            // ========================================
            [
                'proces_cd' => '20000010',
                'proces_content' => 'デザイン',
                'proces_cost' => 100000,
            ],
            [
                'proces_cd' => '20000020',
                'proces_content' => 'DTP',
                'proces_cost' => 60000,
            ],
            [
                'proces_cd' => '20000030',
                'proces_content' => '撮影',
                'proces_cost' => 150000,
            ],
            [
                'proces_cd' => '20000040',
                'proces_content' => 'イラスト制作',
                'proces_cost' => 80000,
            ],
            [
                'proces_cd' => '20000050',
                'proces_content' => 'コピーライティング',
                'proces_cost' => 50000,
            ],

            // ========================================
            // 300: 開発
            // ========================================
            [
                'proces_cd' => '30000010',
                'proces_content' => '要件定義',
                'proces_cost' => 200000,
            ],
            [
                'proces_cd' => '30000020',
                'proces_content' => '設計',
                'proces_cost' => 180000,
            ],
            [
                'proces_cd' => '30000030',
                'proces_content' => '開発',
                'proces_cost' => 250000,
            ],
            [
                'proces_cd' => '30000040',
                'proces_content' => 'テスト',
                'proces_cost' => 100000,
            ],
            [
                'proces_cd' => '30000050',
                'proces_content' => '保守',
                'proces_cost' => 80000,
            ],
        ];

        foreach ($procesCds as $procesCd) {
            ProcesCd::create($procesCd);
        }

        $this->command->info('加工品内容コードマスタに '.count($procesCds).' 件のデータを投入しました。');
    }
}
