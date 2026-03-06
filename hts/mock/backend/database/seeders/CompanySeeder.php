<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 既存データをクリア（開発環境のみ）
        if (app()->environment('local', 'development')) {
            DB::table('companies')->truncate();
        }

        // 会社団体マスタデータ
        // 得意先グループに属する会社団体
        // customer_group_id: 得意先グループマスタのID
        $companies = [
            // あおぞら工業グループ (customer_group_id: 1)
            ['company_id' => 1, 'customer_group_id' => 1, 'company_name' => 'あおぞら工業株式会社'],
            ['company_id' => 2, 'customer_group_id' => 1, 'company_name' => 'あおぞら部品株式会社'],
            ['company_id' => 3, 'customer_group_id' => 1, 'company_name' => 'あおぞらテクノ株式会社'],

            // さくら電子グループ (customer_group_id: 2)
            ['company_id' => 4, 'customer_group_id' => 2, 'company_name' => 'さくら電子株式会社'],
            ['company_id' => 5, 'customer_group_id' => 2, 'company_name' => 'さくらデバイス株式会社'],

            // ひまわり機械グループ (customer_group_id: 3)
            ['company_id' => 6, 'customer_group_id' => 3, 'company_name' => 'ひまわり機械株式会社'],
            ['company_id' => 7, 'customer_group_id' => 3, 'company_name' => 'ひまわり精機株式会社'],

            // つばさITグループ (customer_group_id: 4)
            ['company_id' => 8, 'customer_group_id' => 4, 'company_name' => 'つばさIT株式会社'],
            ['company_id' => 9, 'customer_group_id' => 4, 'company_name' => 'つばさソリューション株式会社'],
            ['company_id' => 10, 'customer_group_id' => 4, 'company_name' => 'つばさクラウド株式会社'],

            // みらいネットグループ (customer_group_id: 5)
            ['company_id' => 11, 'customer_group_id' => 5, 'company_name' => 'みらいネット株式会社'],
            ['company_id' => 12, 'customer_group_id' => 5, 'company_name' => 'みらいコミュニケーションズ株式会社'],

            // はなまる商事グループ (customer_group_id: 6)
            ['company_id' => 13, 'customer_group_id' => 6, 'company_name' => 'はなまる商事株式会社'],
            ['company_id' => 14, 'customer_group_id' => 6, 'company_name' => 'はなまる貿易株式会社'],

            // こだま物産グループ (customer_group_id: 7)
            ['company_id' => 15, 'customer_group_id' => 7, 'company_name' => 'こだま物産株式会社'],

            // なないろストアグループ (customer_group_id: 8)
            ['company_id' => 16, 'customer_group_id' => 8, 'company_name' => 'なないろストア株式会社'],
            ['company_id' => 17, 'customer_group_id' => 8, 'company_name' => 'なないろマーケット株式会社'],

            // ほしぞらマートグループ (customer_group_id: 9)
            ['company_id' => 18, 'customer_group_id' => 9, 'company_name' => 'ほしぞらマート株式会社'],

            // あかつき信金グループ (customer_group_id: 10)
            ['company_id' => 19, 'customer_group_id' => 10, 'company_name' => 'あかつき信用金庫'],
            ['company_id' => 20, 'customer_group_id' => 10, 'company_name' => 'あかつきリース株式会社'],

            // やまびこ保険グループ (customer_group_id: 11)
            ['company_id' => 21, 'customer_group_id' => 11, 'company_name' => 'やまびこ損害保険株式会社'],
            ['company_id' => 22, 'customer_group_id' => 11, 'company_name' => 'やまびこ生命保険株式会社'],

            // にじいろサービスグループ (customer_group_id: 12)
            ['company_id' => 23, 'customer_group_id' => 12, 'company_name' => 'にじいろサービス株式会社'],
            ['company_id' => 24, 'customer_group_id' => 12, 'company_name' => 'にじいろコンサルティング株式会社'],

            // 官公庁A (customer_group_id: 13)
            ['company_id' => 25, 'customer_group_id' => 13, 'company_name' => '経済産業省'],
            ['company_id' => 26, 'customer_group_id' => 13, 'company_name' => '国土交通省'],

            // 自治体B (customer_group_id: 14)
            ['company_id' => 27, 'customer_group_id' => 14, 'company_name' => '東京都'],
            ['company_id' => 28, 'customer_group_id' => 14, 'company_name' => '神奈川県'],
            ['company_id' => 29, 'customer_group_id' => 14, 'company_name' => '横浜市'],

            // その他グループ (customer_group_id: 15)
            ['company_id' => 30, 'customer_group_id' => 15, 'company_name' => 'その他団体A'],

            // 諸口用（マスタ未登録得意先用）
            ['company_id' => 31, 'customer_group_id' => 15, 'company_name' => '諸口'],
        ];

        foreach ($companies as $company) {
            DB::table('companies')->insert([
                'company_id' => $company['company_id'],
                'customer_group_id' => $company['customer_group_id'],
                'company_name' => $company['company_name'],
                'updated_at' => now(),
            ]);
        }

        $this->command->info('会社団体マスタに '.count($companies).' 件のデータを投入しました。');
    }
}
