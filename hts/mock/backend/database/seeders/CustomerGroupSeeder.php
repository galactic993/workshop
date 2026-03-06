<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CustomerGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 既存データをクリア（開発環境のみ）
        if (app()->environment('local', 'development')) {
            DB::table('customer_groups')->truncate();
        }

        // 得意先グループマスタデータ
        // 会社団体をグループ化するために使用
        // industry_id: 業種マスタのID
        //   1=製造業, 2=情報通信業, 3=卸売業, 4=小売業, 5=金融・保険業,
        //   6=不動産業, 7=運輸・郵便業, 8=建設業, 9=サービス業, 10=医療・福祉,
        //   11=教育・学習支援業, 12=官公庁・団体, 13=その他
        $customerGroups = [
            // 製造業
            ['customer_group_id' => 1, 'industry_id' => 1, 'customer_group_name' => 'あおぞら工業グループ'],
            ['customer_group_id' => 2, 'industry_id' => 1, 'customer_group_name' => 'さくら電子グループ'],
            ['customer_group_id' => 3, 'industry_id' => 1, 'customer_group_name' => 'ひまわり機械グループ'],

            // 情報通信業
            ['customer_group_id' => 4, 'industry_id' => 2, 'customer_group_name' => 'つばさITグループ'],
            ['customer_group_id' => 5, 'industry_id' => 2, 'customer_group_name' => 'みらいネットグループ'],

            // 卸売業
            ['customer_group_id' => 6, 'industry_id' => 3, 'customer_group_name' => 'はなまる商事グループ'],
            ['customer_group_id' => 7, 'industry_id' => 3, 'customer_group_name' => 'こだま物産グループ'],

            // 小売業
            ['customer_group_id' => 8, 'industry_id' => 4, 'customer_group_name' => 'なないろストアグループ'],
            ['customer_group_id' => 9, 'industry_id' => 4, 'customer_group_name' => 'ほしぞらマートグループ'],

            // 金融・保険業
            ['customer_group_id' => 10, 'industry_id' => 5, 'customer_group_name' => 'あかつき信金グループ'],
            ['customer_group_id' => 11, 'industry_id' => 5, 'customer_group_name' => 'やまびこ保険グループ'],

            // サービス業
            ['customer_group_id' => 12, 'industry_id' => 9, 'customer_group_name' => 'にじいろサービスグループ'],

            // 官公庁・団体
            ['customer_group_id' => 13, 'industry_id' => 12, 'customer_group_name' => '官公庁A'],
            ['customer_group_id' => 14, 'industry_id' => 12, 'customer_group_name' => '自治体B'],

            // その他
            ['customer_group_id' => 15, 'industry_id' => 13, 'customer_group_name' => 'その他グループ'],
        ];

        foreach ($customerGroups as $group) {
            DB::table('customer_groups')->insert([
                'customer_group_id' => $group['customer_group_id'],
                'industry_id' => $group['industry_id'],
                'customer_group_name' => $group['customer_group_name'],
                'updated_at' => now(),
            ]);
        }

        $this->command->info('得意先グループマスタに '.count($customerGroups).' 件のデータを投入しました。');
    }
}
