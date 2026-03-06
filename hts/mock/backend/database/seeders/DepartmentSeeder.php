<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            // システム管理センター
            [
                'department_id' => 1,
                'department_name' => 'システム管理センター',
                'is_center' => true,
                'display_name' => 'システム',
                'display_order' => 1,
                'center_id' => null,
                'department_category' => '00', // スタッフ
                'updated_at' => now(),
            ],
            // 本社系
            [
                'department_id' => 2,
                'department_name' => '財務センター',
                'is_center' => true,
                'display_name' => '財務',
                'display_order' => 2,
                'center_id' => null,
                'department_category' => '00', // スタッフ
                'updated_at' => now(),
            ],
            [
                'department_id' => 3,
                'department_name' => '人事センター',
                'is_center' => true,
                'display_name' => '人事',
                'display_order' => 3,
                'center_id' => null,
                'department_category' => '00', // スタッフ
                'updated_at' => now(),
            ],
            [
                'department_id' => 4,
                'department_name' => '総務センター',
                'is_center' => true,
                'display_name' => '総務',
                'display_order' => 4,
                'center_id' => null,
                'department_category' => '00', // スタッフ
                'updated_at' => now(),
            ],
            [
                'department_id' => 5,
                'department_name' => '管理センター',
                'is_center' => true,
                'display_name' => '管理',
                'display_order' => 5,
                'center_id' => null,
                'department_category' => '00', // スタッフ
                'updated_at' => now(),
            ],
            [
                'department_id' => 6,
                'department_name' => '営業経理センター',
                'is_center' => true,
                'display_name' => '営業経理',
                'display_order' => 6,
                'center_id' => 2,
                'department_category' => '00', // スタッフ
                'updated_at' => now(),
            ],
            [
                'department_id' => 7,
                'department_name' => '経営分析センター',
                'is_center' => true,
                'display_name' => '経営分析',
                'display_order' => 7,
                'center_id' => null,
                'department_category' => '00', // スタッフ
                'updated_at' => now(),
            ],
            [
                'department_id' => 8,
                'department_name' => '品質保証センター',
                'is_center' => true,
                'display_name' => '品質保証',
                'display_order' => 8,
                'center_id' => null,
                'department_category' => '00', // スタッフ
                'updated_at' => now(),
            ],
            // 営業グループ
            [
                'department_id' => 9,
                'department_name' => '東京営業センター',
                'is_center' => true,
                'display_name' => '東京営業',
                'display_order' => 9,
                'center_id' => null,
                'department_category' => '10', // 営業
                'updated_at' => now(),
            ],
            [
                'department_id' => 10,
                'department_name' => '第1営業センター',
                'is_center' => true,
                'display_name' => '第1営業',
                'display_order' => 10,
                'center_id' => null,
                'department_category' => '10', // 営業
                'updated_at' => now(),
            ],
            [
                'department_id' => 11,
                'department_name' => '第2営業センター',
                'is_center' => true,
                'display_name' => '第2営業',
                'display_order' => 11,
                'center_id' => null,
                'department_category' => '10', // 営業
                'updated_at' => now(),
            ],
            [
                'department_id' => 12,
                'department_name' => '大阪営業チーム',
                'is_center' => false,
                'display_name' => null,
                'display_order' => null,
                'center_id' => 11,
                'department_category' => '10', // 営業
                'updated_at' => now(),
            ],
            // 編集・ソフトウエア事業グループ
            [
                'department_id' => 13,
                'department_name' => '第2ソフトウェア開発センター',
                'is_center' => true,
                'display_name' => '第2開発',
                'display_order' => 12,
                'center_id' => null,
                'department_category' => '20', // 制作
                'updated_at' => now(),
            ],
            [
                'department_id' => 14,
                'department_name' => '第1UX編集センター',
                'is_center' => true,
                'display_name' => '第1UX',
                'display_order' => 13,
                'center_id' => null,
                'department_category' => '20', // 制作
                'updated_at' => now(),
            ],
            [
                'department_id' => 15,
                'department_name' => '第1チーム',
                'is_center' => false,
                'display_name' => null,
                'display_order' => null,
                'center_id' => 14,
                'department_category' => '20', // 制作
                'updated_at' => now(),
            ],
            [
                'department_id' => 16,
                'department_name' => '第2チーム',
                'is_center' => false,
                'display_name' => null,
                'display_order' => null,
                'center_id' => 14,
                'department_category' => '20', // 制作
                'updated_at' => now(),
            ],
        ];

        DB::table('departments')->insert($departments);

        $this->command->info('組織マスタに '.count($departments).' 件のデータを投入しました。');
    }
}
