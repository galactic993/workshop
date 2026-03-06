<?php

namespace Database\Seeders;

use App\Models\SectionCd;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SectionCdSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 既存データをクリア（開発環境のみ）
        if (app()->environment('local', 'development')) {
            DB::table('section_cds')->truncate();
        }

        $sections = [
            // その他
            [
                'section_cd_id' => 1,
                'section_cd' => '000000',
                'section_name' => 'その他',
                'expense_category' => '60',
            ],
            // 経営管理グループ
            [
                'section_cd_id' => 2,
                'section_cd' => '100000',
                'section_name' => '経営管理グループ',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 3,
                'section_cd' => '110000',
                'section_name' => '経営スタッフ',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 4,
                'section_cd' => '120000',
                'section_name' => '新入社員',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 5,
                'section_cd' => '130000',
                'section_name' => '品質保証センター',
                'expense_category' => '60',
            ],
            // 営業グループ
            [
                'section_cd_id' => 6,
                'section_cd' => '200000',
                'section_name' => '営業グループ',
                'expense_category' => '60',
            ],
            // 営業グループ - 東京営業センター
            [
                'section_cd_id' => 7,
                'section_cd' => '262000',
                'section_name' => '東京営業センター',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 8,
                'section_cd' => '262110',
                'section_name' => '東京営業センター　営業',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 9,
                'section_cd' => '262111',
                'section_name' => '東京太郎',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 10,
                'section_cd' => '262112',
                'section_name' => '東京花子',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 11,
                'section_cd' => '262113',
                'section_name' => '東京三郎',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 12,
                'section_cd' => '262114',
                'section_name' => '東京四郎',
                'expense_category' => '60',
            ],
            // 営業グループ - 第1営業センター
            [
                'section_cd_id' => 13,
                'section_cd' => '281000',
                'section_name' => '第1営業センター',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 14,
                'section_cd' => '281110',
                'section_name' => '第1営業センター　営業',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 15,
                'section_cd' => '281111',
                'section_name' => '第一太郎',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 16,
                'section_cd' => '281112',
                'section_name' => '第一花子',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 17,
                'section_cd' => '281113',
                'section_name' => '第一三郎',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 18,
                'section_cd' => '281114',
                'section_name' => '第一四郎',
                'expense_category' => '60',
            ],
            // 営業グループ - 第2営業センター
            [
                'section_cd_id' => 19,
                'section_cd' => '282000',
                'section_name' => '第2営業センター',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 20,
                'section_cd' => '282110',
                'section_name' => '第2営業センター　営業',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 21,
                'section_cd' => '282111',
                'section_name' => '第二太郎',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 22,
                'section_cd' => '282112',
                'section_name' => '第二花子',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 23,
                'section_cd' => '282113',
                'section_name' => '第二三郎',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 24,
                'section_cd' => '282114',
                'section_name' => '第二四郎',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 25,
                'section_cd' => '282600',
                'section_name' => '大阪営業チーム',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 26,
                'section_cd' => '282611',
                'section_name' => '第二大阪太郎',
                'expense_category' => '60',
            ],
            // 編集・ソフトウエア事業グループ
            // 第2ソフトウェア開発センター
            [
                'section_cd_id' => 27,
                'section_cd' => '331300',
                'section_name' => '第2ソフトウェア開発センター',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 28,
                'section_cd' => '331310',
                'section_name' => '第2ソフトウェア開発センター　集計',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 29,
                'section_cd' => '331311',
                'section_name' => '第2ソフトウェア開発センター　社内',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 30,
                'section_cd' => '331315',
                'section_name' => '第2ソフトウェア開発センター　常駐外注',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 31,
                'section_cd' => '331319',
                'section_name' => '第2ソフトウェア開発センター　社外外注発注',
                'expense_category' => '60',
            ],
            // 第1UX編集センター
            [
                'section_cd_id' => 32,
                'section_cd' => '331400',
                'section_name' => '第1UX編集センター',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 33,
                'section_cd' => '331410',
                'section_name' => '第1チーム',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 34,
                'section_cd' => '331411',
                'section_name' => '第1チーム　社内',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 35,
                'section_cd' => '331415',
                'section_name' => '第1チーム　常駐外注',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 36,
                'section_cd' => '331419',
                'section_name' => '第1チーム　社外外注発注',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 37,
                'section_cd' => '331420',
                'section_name' => '第2チーム',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 38,
                'section_cd' => '331421',
                'section_name' => '第2チーム　社内',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 39,
                'section_cd' => '331425',
                'section_name' => '第2チーム　常駐外注',
                'expense_category' => '60',
            ],
            [
                'section_cd_id' => 40,
                'section_cd' => '331429',
                'section_name' => '第2チーム　社外外注発注',
                'expense_category' => '60',
            ],
        ];

        foreach ($sections as $section) {
            SectionCd::create($section);
        }

        $this->command->info('部署コードマスタに '.count($sections).' 件のデータを投入しました。');
    }
}
