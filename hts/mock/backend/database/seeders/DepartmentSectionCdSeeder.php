<?php

namespace Database\Seeders;

use App\Models\DepartmentSectionCd;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartmentSectionCdSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 既存データをクリア（開発環境のみ）
        if (app()->environment('local', 'development')) {
            DB::table('department_section_cd')->truncate();
        }

        // 組織別の部署コード紐付けデータ
        // [department_id => section_cd_id]
        //
        // department_id:
        //   1=システム管理センター, 2=財務センター, 3=人事センター, 4=総務センター
        //   5=管理センター, 6=営業経理センター, 7=経営分析センター, 8=品質保証センター
        //   9=東京営業センター, 10=第1営業センター, 11=第2営業センター, 12=大阪営業チーム
        //   13=第2ソフトウェア開発センター, 14=第1UX編集センター, 15=第1チーム, 16=第2チーム
        //
        // section_cd_id:
        //   1=その他(000000), 2=経営管理グループ(100000), 3=経営スタッフ(110000)
        //   4=新入社員(120000), 5=品質保証センター(130000), 6=営業グループ(200000)
        //   7=東京営業センター(262000), 13=第1営業センター(281000), 19=第2営業センター(282000)
        //   25=大阪営業チーム(282600), 27=第2ソフトウェア開発センター(331300)
        //   32=第1UX編集センター(331400), 33=第1チーム(331410), 37=第2チーム(331420)
        $departmentSectionCds = [
            // システム管理センター → その他
            1 => 1,

            // 本社系
            2 => 3,   // 財務センター → 経営スタッフ
            3 => 3,   // 人事センター → 経営スタッフ
            4 => 3,   // 総務センター → 経営スタッフ
            5 => 3,   // 管理センター → 経営スタッフ
            6 => 3,   // 営業経理センター → 経営スタッフ
            7 => 3,   // 経営分析センター → 経営スタッフ
            8 => 5,   // 品質保証センター → 品質保証センター

            // 営業グループ
            9 => 7,   // 東京営業センター → 東京営業センター
            10 => 13, // 第1営業センター → 第1営業センター
            11 => 19, // 第2営業センター → 第2営業センター
            12 => 25, // 大阪営業チーム → 大阪営業チーム

            // 編集・ソフトウエア事業グループ
            13 => 27, // 第2ソフトウェア開発センター → 第2ソフトウェア開発センター
            14 => 32, // 第1UX編集センター → 第1UX編集センター
            15 => 33, // 第1チーム → 第1チーム
            16 => 37, // 第2チーム → 第2チーム
        ];

        foreach ($departmentSectionCds as $departmentId => $sectionCdId) {
            DepartmentSectionCd::create([
                'department_id' => $departmentId,
                'section_cd_id' => $sectionCdId,
            ]);
        }

        $this->command->info('組織別部署コードに '.count($departmentSectionCds).' 件のデータを投入しました。');
    }
}
