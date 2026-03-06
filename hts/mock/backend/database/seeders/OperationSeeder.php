<?php

namespace Database\Seeders;

use App\Models\Operation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OperationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * 作業部門マスタのシーダー
     * 作業項目をグループ化するための部門コードを管理する
     */
    public function run(): void
    {
        // 既存データをクリア（開発環境のみ）
        if (app()->environment('local', 'development')) {
            DB::table('operations')->truncate();
        }

        $operations = [
            [
                'operation_id' => 1,
                'operation_cd' => '100',
                'operation_name' => '印刷',
            ],
            [
                'operation_id' => 2,
                'operation_cd' => '200',
                'operation_name' => '編集',
            ],
            [
                'operation_id' => 3,
                'operation_cd' => '300',
                'operation_name' => '開発',
            ],
        ];

        foreach ($operations as $operation) {
            Operation::create($operation);
        }

        $this->command->info('作業部門マスタに '.count($operations).' 件のデータを投入しました。');
    }
}
