<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VisibleDepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 既存データをクリア（開発環境のみ）
        if (app()->environment('local', 'development')) {
            DB::table('visible_departments')->truncate();
        }

        // 参照可能組織データ
        // employee_id: 社員マスタのID
        // department_id: 組織マスタのID
        //   9=東京営業センター, 10=第1営業センター, 11=第2営業センター
        //
        // 営業事務は東京営業センター所属
        // 自身の所属センター以外の営業センターを参照可能として設定
        // （所属センターはデフォルトで参照可能のため設定不要）
        //
        // 事務太郎（employee_id: 5）→ 第1営業、第2営業を参照可能
        // 事務花子（employee_id: 6）→ 追加の参照権限なし（所属センターのみ）
        $visibleDepartments = [
            ['employee_id' => 5, 'department_id' => 10, 'employee_cd' => '000005', 'remarks' => '第1営業'],
            ['employee_id' => 5, 'department_id' => 11, 'employee_cd' => '000005', 'remarks' => '第2営業'],
        ];

        $visibleDepartmentId = 1;

        foreach ($visibleDepartments as $data) {
            DB::table('visible_departments')->insert([
                'visible_department_id' => $visibleDepartmentId++,
                'employee_id' => $data['employee_id'],
                'department_id' => $data['department_id'],
                'employee_cd' => $data['employee_cd'],
                'remarks' => $data['remarks'],
                'updated_at' => now(),
            ]);
        }

        $this->command->info('参照可能組織に '.count($visibleDepartments).' 件のデータを投入しました。');
    }
}
