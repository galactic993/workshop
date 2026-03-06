<?php

namespace Database\Seeders;

use App\Models\EmployeeSectionCd;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmployeeSectionCdSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 既存データをクリア（開発環境のみ）
        if (app()->environment('local', 'development')) {
            DB::table('employee_section_cd')->truncate();
        }

        $employeeSections = [
            // システム管理者 → その他
            [
                'section_cd_id' => 1,
                'employee_id' => 1,
                'section_cd' => '000000',
                'employee_cd' => '000001',
            ],
            // 本社系 → 経営スタッフ
            [
                'section_cd_id' => 3,
                'employee_id' => 2,
                'section_cd' => '110000',
                'employee_cd' => '000002',
            ],
            [
                'section_cd_id' => 3,
                'employee_id' => 3,
                'section_cd' => '110000',
                'employee_cd' => '000003',
            ],
            [
                'section_cd_id' => 3,
                'employee_id' => 4,
                'section_cd' => '110000',
                'employee_cd' => '000004',
            ],
            // 営業事務 → 営業グループ
            [
                'section_cd_id' => 7,
                'employee_id' => 5,
                'section_cd' => '262000',
                'employee_cd' => '000005',
            ],
            [
                'section_cd_id' => 7,
                'employee_id' => 6,
                'section_cd' => '262000',
                'employee_cd' => '000006',
            ],
            // 東京営業センター
            // 所長 → 東京営業センター
            [
                'section_cd_id' => 7,
                'employee_id' => 7,
                'section_cd' => '262000',
                'employee_cd' => '000007',
            ],
            // 営業担当 → 各担当者の部署コード
            [
                'section_cd_id' => 9,
                'employee_id' => 8,
                'section_cd' => '262111',
                'employee_cd' => '000008',
            ],
            [
                'section_cd_id' => 10,
                'employee_id' => 9,
                'section_cd' => '262112',
                'employee_cd' => '000009',
            ],
            [
                'section_cd_id' => 11,
                'employee_id' => 10,
                'section_cd' => '262113',
                'employee_cd' => '000010',
            ],
            [
                'section_cd_id' => 12,
                'employee_id' => 11,
                'section_cd' => '262114',
                'employee_cd' => '000011',
            ],
            // 第1営業センター
            // 所長 → 第1営業センター
            [
                'section_cd_id' => 13,
                'employee_id' => 12,
                'section_cd' => '281000',
                'employee_cd' => '000012',
            ],
            // 営業担当 → 各担当者の部署コード
            [
                'section_cd_id' => 15,
                'employee_id' => 13,
                'section_cd' => '281111',
                'employee_cd' => '000013',
            ],
            [
                'section_cd_id' => 16,
                'employee_id' => 14,
                'section_cd' => '281112',
                'employee_cd' => '000014',
            ],
            [
                'section_cd_id' => 17,
                'employee_id' => 15,
                'section_cd' => '281113',
                'employee_cd' => '000015',
            ],
            [
                'section_cd_id' => 18,
                'employee_id' => 16,
                'section_cd' => '281114',
                'employee_cd' => '000016',
            ],
            // 第2営業センター
            // 所長 → 第2営業センター
            [
                'section_cd_id' => 19,
                'employee_id' => 17,
                'section_cd' => '282000',
                'employee_cd' => '000017',
            ],
            // 営業担当 → 各担当者の部署コード
            [
                'section_cd_id' => 21,
                'employee_id' => 18,
                'section_cd' => '282111',
                'employee_cd' => '000018',
            ],
            [
                'section_cd_id' => 22,
                'employee_id' => 19,
                'section_cd' => '282112',
                'employee_cd' => '000019',
            ],
            [
                'section_cd_id' => 23,
                'employee_id' => 20,
                'section_cd' => '282113',
                'employee_cd' => '000020',
            ],
            [
                'section_cd_id' => 24,
                'employee_id' => 21,
                'section_cd' => '282114',
                'employee_cd' => '000021',
            ],
            // 大阪営業チーム
            [
                'section_cd_id' => 26,
                'employee_id' => 22,
                'section_cd' => '282611',
                'employee_cd' => '000022',
            ],
            // 第2ソフトウェア開発センター
            // 所長 → 第2ソフトウェア開発センター
            [
                'section_cd_id' => 27,
                'employee_id' => 23,
                'section_cd' => '331300',
                'employee_cd' => '000023',
            ],
            // 社内
            [
                'section_cd_id' => 29,
                'employee_id' => 24,
                'section_cd' => '331311',
                'employee_cd' => '000024',
            ],
            [
                'section_cd_id' => 29,
                'employee_id' => 25,
                'section_cd' => '331311',
                'employee_cd' => '000025',
            ],
            // 常駐外注
            [
                'section_cd_id' => 30,
                'employee_id' => 26,
                'section_cd' => '331315',
                'employee_cd' => '000026',
            ],
            [
                'section_cd_id' => 30,
                'employee_id' => 27,
                'section_cd' => '331315',
                'employee_cd' => '000027',
            ],
            // 社外外注発注
            [
                'section_cd_id' => 31,
                'employee_id' => 28,
                'section_cd' => '331319',
                'employee_cd' => '000028',
            ],
            [
                'section_cd_id' => 31,
                'employee_id' => 29,
                'section_cd' => '331319',
                'employee_cd' => '000029',
            ],
            // 第1UX編集センター
            // 所長 → 第1UX編集センター
            [
                'section_cd_id' => 32,
                'employee_id' => 30,
                'section_cd' => '331400',
                'employee_cd' => '000030',
            ],
            // 第1チーム 社内
            [
                'section_cd_id' => 34,
                'employee_id' => 31,
                'section_cd' => '331411',
                'employee_cd' => '000031',
            ],
            [
                'section_cd_id' => 34,
                'employee_id' => 32,
                'section_cd' => '331411',
                'employee_cd' => '000032',
            ],
            // 第1チーム 常駐外注
            [
                'section_cd_id' => 35,
                'employee_id' => 33,
                'section_cd' => '331415',
                'employee_cd' => '000033',
            ],
            [
                'section_cd_id' => 35,
                'employee_id' => 34,
                'section_cd' => '331415',
                'employee_cd' => '000034',
            ],
            // 第1チーム 社外外注発注
            [
                'section_cd_id' => 36,
                'employee_id' => 35,
                'section_cd' => '331419',
                'employee_cd' => '000035',
            ],
            [
                'section_cd_id' => 36,
                'employee_id' => 36,
                'section_cd' => '331419',
                'employee_cd' => '000036',
            ],
            // 第2チーム 社内
            [
                'section_cd_id' => 38,
                'employee_id' => 37,
                'section_cd' => '331421',
                'employee_cd' => '000037',
            ],
            [
                'section_cd_id' => 38,
                'employee_id' => 38,
                'section_cd' => '331421',
                'employee_cd' => '000038',
            ],
            // 第2チーム 常駐外注
            [
                'section_cd_id' => 39,
                'employee_id' => 39,
                'section_cd' => '331425',
                'employee_cd' => '000039',
            ],
            [
                'section_cd_id' => 39,
                'employee_id' => 40,
                'section_cd' => '331425',
                'employee_cd' => '000040',
            ],
            // 第2チーム 社外外注発注
            [
                'section_cd_id' => 40,
                'employee_id' => 41,
                'section_cd' => '331429',
                'employee_cd' => '000041',
            ],
            [
                'section_cd_id' => 40,
                'employee_id' => 42,
                'section_cd' => '331429',
                'employee_cd' => '000042',
            ],
        ];

        foreach ($employeeSections as $employeeSection) {
            EmployeeSectionCd::create($employeeSection);
        }

        $this->command->info('社員別部署コードに '.count($employeeSections).' 件のデータを投入しました。');
    }
}
