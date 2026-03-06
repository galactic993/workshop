<?php

namespace Database\Seeders;

use App\Models\Employee;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 既存データをクリア（開発環境のみ）
        if (app()->environment('local', 'development')) {
            DB::table('employees')->truncate();
        }

        $employees = [
            // システム管理者
            [
                'employee_id' => 1,
                'employee_cd' => '000001',
                'employee_name' => '管理太郎',
                'email' => '000001@example.com',
                'access_type' => '00',
            ],
            // 本社系
            [
                'employee_id' => 2,
                'employee_cd' => '000002',
                'employee_name' => '経営分析太郎',
                'email' => '000002@example.com',
                'access_type' => '10',
            ],
            [
                'employee_id' => 3,
                'employee_cd' => '000003',
                'employee_name' => '総務太郎',
                'email' => '000003@example.com',
                'access_type' => '40',
            ],
            [
                'employee_id' => 4,
                'employee_cd' => '000004',
                'employee_name' => '人事太郎',
                'email' => '000004@example.com',
                'access_type' => '40',
            ],
            // 営業事務
            [
                'employee_id' => 5,
                'employee_cd' => '000005',
                'employee_name' => '事務太郎',
                'email' => '000005@example.com',
                'access_type' => '40',
            ],
            [
                'employee_id' => 6,
                'employee_cd' => '000006',
                'employee_name' => '事務花子',
                'email' => '000006@example.com',
                'access_type' => '40',
            ],
            // 東京営業センター
            // 営業所長
            [
                'employee_id' => 7,
                'employee_cd' => '000007',
                'employee_name' => '東京所長太郎',
                'email' => '000007@example.com',
                'access_type' => '20',
            ],
            // 営業担当
            [
                'employee_id' => 8,
                'employee_cd' => '000008',
                'employee_name' => '東京太郎',
                'email' => '000008@example.com',
                'access_type' => '40',
            ],
            [
                'employee_id' => 9,
                'employee_cd' => '000009',
                'employee_name' => '東京花子',
                'email' => '000009@example.com',
                'access_type' => '40',
            ],
            [
                'employee_id' => 10,
                'employee_cd' => '000010',
                'employee_name' => '東京三郎',
                'email' => '000010@example.com',
                'access_type' => '40',
            ],
            [
                'employee_id' => 11,
                'employee_cd' => '000011',
                'employee_name' => '東京四郎',
                'email' => '000011@example.com',
                'access_type' => '40',
            ],
            // 第1営業センター
            // 営業所長
            [
                'employee_id' => 12,
                'employee_cd' => '000012',
                'employee_name' => '第一所長太郎',
                'email' => '000012@example.com',
                'access_type' => '20',
            ],
            // 営業担当
            [
                'employee_id' => 13,
                'employee_cd' => '000013',
                'employee_name' => '第一太郎',
                'email' => '000013@example.com',
                'access_type' => '40',
            ],
            [
                'employee_id' => 14,
                'employee_cd' => '000014',
                'employee_name' => '第一花子',
                'email' => '000014@example.com',
                'access_type' => '40',
            ],
            [
                'employee_id' => 15,
                'employee_cd' => '000015',
                'employee_name' => '第一三郎',
                'email' => '000015@example.com',
                'access_type' => '40',
            ],
            [
                'employee_id' => 16,
                'employee_cd' => '000016',
                'employee_name' => '第一四郎',
                'email' => '000016@example.com',
                'access_type' => '40',
            ],
            // 第2営業センター
            // 営業所長
            [
                'employee_id' => 17,
                'employee_cd' => '000017',
                'employee_name' => '第二所長太郎',
                'email' => '000017@example.com',
                'access_type' => '20',
            ],
            // 営業担当
            [
                'employee_id' => 18,
                'employee_cd' => '000018',
                'employee_name' => '第二太郎',
                'email' => '000018@example.com',
                'access_type' => '40',
            ],
            [
                'employee_id' => 19,
                'employee_cd' => '000019',
                'employee_name' => '第二花子',
                'email' => '000019@example.com',
                'access_type' => '40',
            ],
            [
                'employee_id' => 20,
                'employee_cd' => '000020',
                'employee_name' => '第二三郎',
                'email' => '000020@example.com',
                'access_type' => '40',
            ],
            [
                'employee_id' => 21,
                'employee_cd' => '000021',
                'employee_name' => '第二四郎',
                'email' => '000021@example.com',
                'access_type' => '40',
            ],
            // 大阪営業チーム
            [
                'employee_id' => 22,
                'employee_cd' => '000022',
                'employee_name' => '第二大阪太郎',
                'email' => '000022@example.com',
                'access_type' => '40',
            ],
            // 第2ソフトウェア開発センター
            // 所長
            [
                'employee_id' => 23,
                'employee_cd' => '000023',
                'employee_name' => '第二開発所長太郎',
                'email' => '000023@example.com',
                'access_type' => '20',
            ],
            // 一般社員
            [
                'employee_id' => 24,
                'employee_cd' => '000024',
                'employee_name' => '第二開発社内太郎',
                'email' => '000024@example.com',
                'access_type' => '40',
            ],
            [
                'employee_id' => 25,
                'employee_cd' => '000025',
                'employee_name' => '第二開発社内花子',
                'email' => '000025@example.com',
                'access_type' => '40',
            ],
            [
                'employee_id' => 26,
                'employee_cd' => '000026',
                'employee_name' => '第二開発常駐外注三郎',
                'email' => '000026@example.com',
                'access_type' => '40',
            ],
            [
                'employee_id' => 27,
                'employee_cd' => '000027',
                'employee_name' => '第二開発常駐外注四郎',
                'email' => '000027@example.com',
                'access_type' => '40',
            ],
            [
                'employee_id' => 28,
                'employee_cd' => '000028',
                'employee_name' => '第二開発社外外注発注五郎',
                'email' => '000028@example.com',
                'access_type' => '40',
            ],
            [
                'employee_id' => 29,
                'employee_cd' => '000029',
                'employee_name' => '第二開発社外外注発注六郎',
                'email' => '000029@example.com',
                'access_type' => '40',
            ],
            // 第1UX編集センター
            // 所長
            [
                'employee_id' => 30,
                'employee_cd' => '000030',
                'employee_name' => '第一UX所長太郎',
                'email' => '000030@example.com',
                'access_type' => '20',
            ],
            // 一般
            [
                'employee_id' => 31,
                'employee_cd' => '000031',
                'employee_name' => '第一UX第一社内リーダー太郎',
                'email' => '000031@example.com',
                'access_type' => '30',
            ],
            [
                'employee_id' => 32,
                'employee_cd' => '000032',
                'employee_name' => '第一UX第一社内太郎',
                'email' => '000032@example.com',
                'access_type' => '40',
            ],
            [
                'employee_id' => 33,
                'employee_cd' => '000033',
                'employee_name' => '第一UX第一常駐外注太郎',
                'email' => '000033@example.com',
                'access_type' => '40',
            ],
            [
                'employee_id' => 34,
                'employee_cd' => '000034',
                'employee_name' => '第一UX第一常駐外注花子',
                'email' => '000034@example.com',
                'access_type' => '40',
            ],
            [
                'employee_id' => 35,
                'employee_cd' => '000035',
                'employee_name' => '第一UX第一社外外注発注太郎',
                'email' => '000035@example.com',
                'access_type' => '40',
            ],
            [
                'employee_id' => 36,
                'employee_cd' => '000036',
                'employee_name' => '第一UX第一社外外注発注花子',
                'email' => '000036@example.com',
                'access_type' => '40',
            ],
            [
                'employee_id' => 37,
                'employee_cd' => '000037',
                'employee_name' => '第一UX第二社内リーダー太郎',
                'email' => '000037@example.com',
                'access_type' => '30',
            ],
            [
                'employee_id' => 38,
                'employee_cd' => '000038',
                'employee_name' => '第一UX第二社内太郎',
                'email' => '000038@example.com',
                'access_type' => '40',
            ],
            [
                'employee_id' => 39,
                'employee_cd' => '000039',
                'employee_name' => '第一UX第二常駐外注太郎',
                'email' => '000039@example.com',
                'access_type' => '40',
            ],
            [
                'employee_id' => 40,
                'employee_cd' => '000040',
                'employee_name' => '第一UX第二常駐外注花子',
                'email' => '000040@example.com',
                'access_type' => '40',
            ],
            [
                'employee_id' => 41,
                'employee_cd' => '000041',
                'employee_name' => '第一UX第二社外外注発注太郎',
                'email' => '000041@example.com',
                'access_type' => '40',
            ],
            [
                'employee_id' => 42,
                'employee_cd' => '000042',
                'employee_name' => '第一UX第二社外外注発注花子',
                'email' => '000042@example.com',
                'access_type' => '40',
            ],
        ];

        foreach ($employees as $employee) {
            Employee::create($employee);
        }

        $this->command->info('社員マスタに '.count($employees).' 件のデータを投入しました。');
    }
}
