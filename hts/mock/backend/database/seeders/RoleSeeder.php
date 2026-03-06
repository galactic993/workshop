<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'role_id' => 1,
                'role_name' => 'システム管理',
            ],
            [
                'role_id' => 2,
                'role_name' => '財務',
            ],
            [
                'role_id' => 3,
                'role_name' => '管理',
            ],
            [
                'role_id' => 4,
                'role_name' => '品質保証',
            ],
            [
                'role_id' => 5,
                'role_name' => '総務',
            ],
            [
                'role_id' => 6,
                'role_name' => '人事',
            ],
            [
                'role_id' => 7,
                'role_name' => '経営分析',
            ],
            [
                'role_id' => 8,
                'role_name' => 'IT管理',
            ],
            [
                'role_id' => 9,
                'role_name' => '横浜管理',
            ],
            [
                'role_id' => 10,
                'role_name' => '総務・経理(本社以外)',
            ],
            [
                'role_id' => 11,
                'role_name' => '営業所長',
            ],
            [
                'role_id' => 12,
                'role_name' => '営業担当',
            ],
            [
                'role_id' => 13,
                'role_name' => '営業事務',
            ],
            [
                'role_id' => 14,
                'role_name' => '編集所長',
            ],
            [
                'role_id' => 15,
                'role_name' => '編集チームリーダー',
            ],
            [
                'role_id' => 16,
                'role_name' => '編集マニュアルエディタ',
            ],
            [
                'role_id' => 17,
                'role_name' => '編集翻訳コーディネーター',
            ],
            [
                'role_id' => 18,
                'role_name' => '編集担当',
            ],
            [
                'role_id' => 19,
                'role_name' => '編集以外所長',
            ],
            [
                'role_id' => 20,
                'role_name' => '編集以外チームリーダー',
            ],
            [
                'role_id' => 21,
                'role_name' => '編集以外システムエンジニア',
            ],
            [
                'role_id' => 22,
                'role_name' => '編集以外ウェブディレクター',
            ],
            [
                'role_id' => 23,
                'role_name' => '印刷千葉管理',
            ],
            [
                'role_id' => 24,
                'role_name' => '印刷印刷管理',
            ],
            [
                'role_id' => 25,
                'role_name' => '印刷調達',
            ],
            [
                'role_id' => 26,
                'role_name' => '印刷IP',
            ],
            [
                'role_id' => 27,
                'role_name' => '印刷刷版',
            ],
            [
                'role_id' => 28,
                'role_name' => '印刷印刷',
            ],
            [
                'role_id' => 29,
                'role_name' => '印刷製本',
            ],
            [
                'role_id' => 30,
                'role_name' => '配送',
            ],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }

        $this->command->info('役割マスタに '.count($roles).' 件のデータを投入しました。');
    }
}
