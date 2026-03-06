<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\CustomerSectionCd;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CustomerSectionCdSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 既存データをクリア（開発環境のみ）
        if (app()->environment('local', 'development')) {
            DB::table('customer_section_cd')->truncate();
        }

        // 得意先コードからIDを取得するためのマッピング
        $customerIdMap = Customer::pluck('customer_id', 'customer_cd')->toArray();

        // 部署別得意先データ
        // 受注データ登録時に得意先の選択肢を絞り込むための紐付け
        // section_cd_id: センター部署id（部署コードマスタへのFK）
        // customer_cd: 得意先コード（customer_idに変換して使用）
        $customerSectionCds = [
            // 第1営業センター (section_cd_id: 13) の担当得意先
            // → あおぞら工業 営業本部 (customer_cd: 00001)
            // → あおぞら工業 技術開発部 (customer_cd: 00002)
            ['section_cd_id' => 13, 'customer_cd' => '00001'],
            ['section_cd_id' => 13, 'customer_cd' => '00002'],

            // 第2営業センター (section_cd_id: 19) の担当得意先
            // → さくら電子 購買部 (customer_cd: 00003)
            // → はなまる商事 本社 (customer_cd: 00006)
            ['section_cd_id' => 19, 'customer_cd' => '00003'],
            ['section_cd_id' => 19, 'customer_cd' => '00006'],

            // 東京営業センター (section_cd_id: 7) の担当得意先
            // → つばさIT システム開発事業部 (customer_cd: 00004)
            // → つばさIT クラウド事業部 (customer_cd: 00005)
            // → 東京都 総務局 (customer_cd: 00007)
            // → 東京都 産業労働局 (customer_cd: 00008)
            ['section_cd_id' => 7, 'customer_cd' => '00004'],
            ['section_cd_id' => 7, 'customer_cd' => '00005'],
            ['section_cd_id' => 7, 'customer_cd' => '00007'],
            ['section_cd_id' => 7, 'customer_cd' => '00008'],

            // 諸口 (customer_cd: 33900) は全営業センターで選択可能
            // マスタ未登録得意先用の特殊得意先
            ['section_cd_id' => 7, 'customer_cd' => '33900'],   // 東京営業センター
            ['section_cd_id' => 13, 'customer_cd' => '33900'],  // 第1営業センター
            ['section_cd_id' => 19, 'customer_cd' => '33900'],  // 第2営業センター
        ];

        $insertedCount = 0;
        foreach ($customerSectionCds as $data) {
            $customerId = $customerIdMap[$data['customer_cd']] ?? null;
            if ($customerId) {
                CustomerSectionCd::create([
                    'section_cd_id' => $data['section_cd_id'],
                    'customer_id' => $customerId,
                ]);
                $insertedCount++;
            }
        }

        $this->command->info('部署別得意先に '.$insertedCount.' 件のデータを投入しました。');
    }
}
