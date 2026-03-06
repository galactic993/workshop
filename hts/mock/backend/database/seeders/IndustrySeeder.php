<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IndustrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 既存データをクリア（開発環境のみ）
        if (app()->environment('local', 'development')) {
            DB::table('industries')->truncate();
        }

        // 業種マスタデータ
        // 得意先グループの分類に使用
        $industries = [
            ['industry_id' => 1, 'industry_name' => '製造業'],
            ['industry_id' => 2, 'industry_name' => '情報通信業'],
            ['industry_id' => 3, 'industry_name' => '卸売業'],
            ['industry_id' => 4, 'industry_name' => '小売業'],
            ['industry_id' => 5, 'industry_name' => '金融・保険業'],
            ['industry_id' => 6, 'industry_name' => '不動産業'],
            ['industry_id' => 7, 'industry_name' => '運輸・郵便業'],
            ['industry_id' => 8, 'industry_name' => '建設業'],
            ['industry_id' => 9, 'industry_name' => 'サービス業'],
            ['industry_id' => 10, 'industry_name' => '医療・福祉'],
            ['industry_id' => 11, 'industry_name' => '教育・学習支援業'],
            ['industry_id' => 12, 'industry_name' => '官公庁・団体'],
            ['industry_id' => 13, 'industry_name' => 'その他'],
        ];

        foreach ($industries as $industry) {
            DB::table('industries')->insert([
                'industry_id' => $industry['industry_id'],
                'industry_name' => $industry['industry_name'],
                'updated_at' => now(),
            ]);
        }

        $this->command->info('業種マスタに '.count($industries).' 件のデータを投入しました。');
    }
}
