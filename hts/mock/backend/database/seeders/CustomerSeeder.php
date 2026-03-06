<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 既存データをクリア（開発環境のみ）
        if (app()->environment('local', 'development')) {
            DB::table('customers')->truncate();
        }

        // 得意先マスタデータ
        // 会社団体に存在する事業部などを管理
        // company_id: 会社団体マスタのID
        $customers = [
            // あおぞら工業株式会社 (company_id: 1) の事業部
            [
                'customer_cd' => '00001',
                'customer_name' => 'あおぞら工業 営業本部',
                'customer_name_kana' => 'アオゾラコウギョウ エイギョウホンブ',
                'company_id' => 1,
                'postal_cd' => '1000001',
                'address1' => '東京都千代田区千代田1-1-1',
                'address2' => 'あおぞらビル5F',
                'representative_name' => '青空太郎',
                'phone_number' => '03-1234-5678',
                'fax_number' => '03-1234-5679',
                'email' => 'eigyo@aozora.example.com',
                'is_inspection' => true,
                'inspection_term_months' => '1',
                'inspection_date' => '20',
                'payment_term_months' => '2',
                'payment_date' => '25',
                'payment_type' => '00',
                'tax_rounded_type' => '1',
                'fee_beare_type' => '0',
                'credit_limit' => 50000000,
                'order_limit' => 10000000,
                'discount_flag' => '1',
            ],
            [
                'customer_cd' => '00002',
                'customer_name' => 'あおぞら工業 技術開発部',
                'customer_name_kana' => 'アオゾラコウギョウ ギジュツカイハツブ',
                'company_id' => 1,
                'postal_cd' => '1000001',
                'address1' => '東京都千代田区千代田1-1-1',
                'address2' => 'あおぞらビル3F',
                'representative_name' => '青空次郎',
                'phone_number' => '03-1234-5680',
                'fax_number' => '03-1234-5681',
                'email' => 'gijutsu@aozora.example.com',
                'is_inspection' => false,
                'inspection_term_months' => null,
                'inspection_date' => null,
                'payment_term_months' => '1',
                'payment_date' => '31',
                'payment_type' => '00',
                'tax_rounded_type' => '1',
                'fee_beare_type' => '0',
                'credit_limit' => 30000000,
                'order_limit' => 5000000,
                'discount_flag' => null,
            ],

            // さくら電子株式会社 (company_id: 4) の事業部
            [
                'customer_cd' => '00003',
                'customer_name' => 'さくら電子 購買部',
                'customer_name_kana' => 'サクラデンシ コウバイブ',
                'company_id' => 4,
                'postal_cd' => '2200012',
                'address1' => '神奈川県横浜市西区みなとみらい2-2-2',
                'address2' => 'さくらタワー10F',
                'representative_name' => '桜田花子',
                'phone_number' => '045-123-4567',
                'fax_number' => '045-123-4568',
                'email' => 'koubai@sakura.example.com',
                'is_inspection' => true,
                'inspection_term_months' => '2',
                'inspection_date' => '15',
                'payment_term_months' => '2',
                'payment_date' => '20',
                'payment_type' => '10',
                'tax_rounded_type' => '0',
                'fee_beare_type' => '1',
                'credit_limit' => 100000000,
                'order_limit' => 20000000,
                'discount_flag' => '1',
            ],

            // つばさIT株式会社 (company_id: 8) の事業部
            [
                'customer_cd' => '00004',
                'customer_name' => 'つばさIT システム開発事業部',
                'customer_name_kana' => 'ツバサアイティー システムカイハツジギョウブ',
                'company_id' => 8,
                'postal_cd' => '1500002',
                'address1' => '東京都渋谷区渋谷3-3-3',
                'address2' => 'つばさスクエア8F',
                'representative_name' => '翼一郎',
                'phone_number' => '03-9876-5432',
                'fax_number' => null,
                'email' => 'sysdev@tsubasa.example.com',
                'is_inspection' => false,
                'inspection_term_months' => null,
                'inspection_date' => null,
                'payment_term_months' => '1',
                'payment_date' => '31',
                'payment_type' => '00',
                'tax_rounded_type' => '1',
                'fee_beare_type' => '0',
                'credit_limit' => 80000000,
                'order_limit' => 15000000,
                'discount_flag' => null,
            ],
            [
                'customer_cd' => '00005',
                'customer_name' => 'つばさIT クラウド事業部',
                'customer_name_kana' => 'ツバサアイティー クラウドジギョウブ',
                'company_id' => 8,
                'postal_cd' => '1500002',
                'address1' => '東京都渋谷区渋谷3-3-3',
                'address2' => 'つばさスクエア9F',
                'representative_name' => '翼二郎',
                'phone_number' => '03-9876-5433',
                'fax_number' => null,
                'email' => 'cloud@tsubasa.example.com',
                'is_inspection' => true,
                'inspection_term_months' => '1',
                'inspection_date' => '25',
                'payment_term_months' => '2',
                'payment_date' => '10',
                'payment_type' => '00',
                'tax_rounded_type' => '1',
                'fee_beare_type' => '0',
                'credit_limit' => 60000000,
                'order_limit' => 10000000,
                'discount_flag' => '1',
            ],

            // はなまる商事株式会社 (company_id: 13) の事業部
            [
                'customer_cd' => '00006',
                'customer_name' => 'はなまる商事 本社',
                'customer_name_kana' => 'ハナマルショウジ ホンシャ',
                'company_id' => 13,
                'postal_cd' => '5300001',
                'address1' => '大阪府大阪市北区梅田4-4-4',
                'address2' => 'はなまるビル12F',
                'representative_name' => '花丸三郎',
                'phone_number' => '06-1111-2222',
                'fax_number' => '06-1111-2223',
                'email' => 'honsha@hanamaru.example.com',
                'is_inspection' => false,
                'inspection_term_months' => null,
                'inspection_date' => null,
                'payment_term_months' => '1',
                'payment_date' => '25',
                'payment_type' => '20',
                'tax_rounded_type' => '1',
                'fee_beare_type' => '0',
                'credit_limit' => 200000000,
                'order_limit' => 50000000,
                'discount_flag' => '1',
            ],

            // 東京都 (company_id: 27) の部門
            [
                'customer_cd' => '00007',
                'customer_name' => '東京都 総務局',
                'customer_name_kana' => 'トウキョウト ソウムキョク',
                'company_id' => 27,
                'postal_cd' => '1638001',
                'address1' => '東京都新宿区西新宿2-8-1',
                'address2' => '東京都庁第一本庁舎',
                'representative_name' => '都庁太郎',
                'phone_number' => '03-5321-1111',
                'fax_number' => '03-5388-1234',
                'email' => 'soumu@metro.tokyo.example.jp',
                'is_inspection' => true,
                'inspection_term_months' => '1',
                'inspection_date' => '31',
                'payment_term_months' => '3',
                'payment_date' => '15',
                'payment_type' => '00',
                'tax_rounded_type' => '0',
                'fee_beare_type' => '1',
                'credit_limit' => 500000000,
                'order_limit' => 100000000,
                'discount_flag' => null,
            ],
            [
                'customer_cd' => '00008',
                'customer_name' => '東京都 産業労働局',
                'customer_name_kana' => 'トウキョウト サンギョウロウドウキョク',
                'company_id' => 27,
                'postal_cd' => '1638001',
                'address1' => '東京都新宿区西新宿2-8-1',
                'address2' => '東京都庁第一本庁舎',
                'representative_name' => '産業次郎',
                'phone_number' => '03-5321-2222',
                'fax_number' => '03-5388-2345',
                'email' => 'sangyo@metro.tokyo.example.jp',
                'is_inspection' => true,
                'inspection_term_months' => '1',
                'inspection_date' => '31',
                'payment_term_months' => '3',
                'payment_date' => '15',
                'payment_type' => '00',
                'tax_rounded_type' => '0',
                'fee_beare_type' => '1',
                'credit_limit' => 300000000,
                'order_limit' => 80000000,
                'discount_flag' => null,
            ],

            // 諸口（マスタ未登録得意先用の特殊得意先）
            // 見積や受注入力時に未登録の得意先を選択する際に使用
            [
                'customer_cd' => '33900',
                'customer_name' => '諸口',
                'customer_name_kana' => 'ショクチ',
                'company_id' => 31,  // 諸口用会社
                'postal_cd' => null,
                'address1' => null,
                'address2' => null,
                'representative_name' => '-',
                'phone_number' => '-',
                'fax_number' => null,
                'email' => null,
                'is_inspection' => false,
                'inspection_term_months' => null,
                'inspection_date' => null,
                'payment_term_months' => '1',
                'payment_date' => '31',
                'payment_type' => '00',
                'tax_rounded_type' => '1',
                'fee_beare_type' => '0',
                'credit_limit' => 0,
                'order_limit' => 0,
                'discount_flag' => null,
            ],
        ];

        foreach ($customers as $customer) {
            DB::table('customers')->insert(array_merge($customer, [
                'updated_at' => now(),
            ]));
        }

        $this->command->info('得意先マスタに '.count($customers).' 件のデータを投入しました。');
    }
}
