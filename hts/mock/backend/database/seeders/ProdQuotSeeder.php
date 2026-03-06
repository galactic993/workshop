<?php

namespace Database\Seeders;

use App\Models\Quot;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProdQuotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * 見積ステータスに対応する制作見積レコードを作成する。
     *
     * 制作見積ステータス:
     * - 00: 未着手（初期状態）
     * - 10: 制作見積中
     * - 20: 制作見積済
     * - 30: 制作見積受取済
     * - 40: 発行済
     * - 50: 差戻
     */
    public function run(): void
    {
        // 既存データをクリア（開発環境のみ）
        if (app()->environment('local', 'development')) {
            DB::table('prod_quots')->truncate();
        }

        // 見積番号からIDを取得するためのマッピング
        $quotIdMap = Quot::pluck('quot_id', 'quot_number')->toArray();

        // 見積ステータスが「10:制作見積依頼済」以上のレコードに対応する制作見積を作成

        $prodQuots = [
            // ========================================
            // 見積ステータス「10:制作見積依頼済」
            // → 制作見積ステータス「10:制作見積依頼済」
            // ========================================

            // 25-00002 LP制作 (キャンペーンLP制作)
            [
                'quot_number' => '000022501001',
                'cost' => 0,
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => null,
                'prod_quot_status' => '10',  // 制作見積依頼済
                'version' => 1,
            ],
            // 25-00026 ECサイト改修 (既存ECサイト機能追加)
            [
                'quot_number' => '000022501002',
                'cost' => 0,
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => null,
                'prod_quot_status' => '10',  // 制作見積依頼済
                'version' => 1,
            ],
            // 25-00008 製品カタログ (製品総合カタログ制作)
            [
                'quot_number' => '000012501004',
                'cost' => 0,
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => null,
                'prod_quot_status' => '10',  // 制作見積依頼済
                'version' => 1,
            ],
            // 25-00032 商品チラシ (新商品チラシ制作)
            [
                'quot_number' => '000022501003',
                'cost' => 0,
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => null,
                'prod_quot_status' => '10',  // 制作見積依頼済
                'version' => 1,
            ],
            // 25-00014 セキュリティ診断 (Webアプリケーション脆弱性診断)
            [
                'quot_number' => '000052501005',
                'cost' => 0,
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => null,
                'prod_quot_status' => '10',  // 制作見積依頼済
                'version' => 1,
            ],
            // 25-00038 ネットワーク設計 (社内ネットワーク再設計)
            [
                'quot_number' => '000022501005',
                'cost' => 0,
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => null,
                'prod_quot_status' => '10',  // 制作見積依頼済
                'version' => 1,
            ],

            // ========================================
            // 見積ステータス「20:制作見積中」
            // → 制作見積ステータス「10:制作見積中」
            // ========================================

            // 25-00003 ECサイト構築 (BtoC向けECサイト構築)
            [
                'quot_number' => '000032501001',
                'cost' => 0,
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => null,
                'prod_quot_status' => '10',  // 制作見積中
                'version' => 1,
            ],
            // 25-00027 CMS導入 (WordPress導入支援)
            [
                'quot_number' => '000032501002',
                'cost' => 0,
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => null,
                'prod_quot_status' => '10',  // 制作見積中
                'version' => 1,
            ],
            // 25-00009 ポスターデザイン (イベント告知ポスター制作)
            [
                'quot_number' => '000072501001',
                'cost' => 0,
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => null,
                'prod_quot_status' => '10',  // 制作見積中
                'version' => 1,
            ],
            // 25-00033 看板デザイン (店舗看板デザイン)
            [
                'quot_number' => '000032501004',
                'cost' => 0,
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => null,
                'prod_quot_status' => '10',  // 制作見積中
                'version' => 1,
            ],
            // 25-00015 API開発 (外部連携API開発)
            [
                'quot_number' => '000012501006',
                'cost' => 0,
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => null,
                'prod_quot_status' => '10',  // 制作見積中
                'version' => 1,
            ],
            // 25-00039 バックアップ構築 (データバックアップ環境構築)
            [
                'quot_number' => '000032501006',
                'cost' => 0,
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => null,
                'prod_quot_status' => '10',  // 制作見積中
                'version' => 1,
            ],

            // ========================================
            // 見積ステータス「30:制作見積済」
            // → 制作見積ステータス「20:制作見積済」
            // 全ての制作見積依頼が承認済、costに集計金額設定
            // ========================================

            // 25-00004 システム改修 (基幹システム改修)
            [
                'quot_number' => '000012501002',
                'cost' => 2850000,  // 集計金額
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => null,
                'prod_quot_status' => '20',  // 制作見積済
                'version' => 1,
            ],
            // 25-00028 LP改修 (キャンペーンLP改修)
            [
                'quot_number' => '000042501002',
                'cost' => 380000,  // 集計金額
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => null,
                'prod_quot_status' => '20',  // 制作見積済
                'version' => 1,
            ],
            // 25-00010 名刺デザイン (役員名刺リニューアル)
            [
                'quot_number' => '000082501001',
                'cost' => 250000,  // 集計金額
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => null,
                'prod_quot_status' => '20',  // 制作見積済
                'version' => 1,
            ],
            // 25-00034 DM制作 (キャンペーンDM制作)
            [
                'quot_number' => '000042501004',
                'cost' => 420000,  // 集計金額
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => null,
                'prod_quot_status' => '20',  // 制作見積済
                'version' => 1,
            ],
            // 25-00016 データ分析基盤 (データ分析基盤構築)
            [
                'quot_number' => '000022501004',
                'cost' => 4200000,  // 集計金額
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => null,
                'prod_quot_status' => '20',  // 制作見積済
                'version' => 1,
            ],
            // 25-00040 VPN構築 (リモートアクセスVPN構築)
            [
                'quot_number' => '000042501006',
                'cost' => 1650000,  // 集計金額
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => null,
                'prod_quot_status' => '20',  // 制作見積済
                'version' => 1,
            ],

            // ========================================
            // 見積ステータス「40:承認待ち」「50:承認済」「60:発行済」
            // → 制作見積ステータス「30:制作見積受取済」または「40:発行済」
            // ========================================

            // 25-00005 アプリ開発 (業務用スマホアプリ開発)
            [
                'quot_number' => '000042501001',
                'cost' => 4400000,
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => '2025-01-04',
                'prod_quot_status' => '30',  // 制作見積受取済
                'version' => 1,
            ],
            // 25-00029 Web保守契約 (Webサイト年間保守)
            [
                'quot_number' => '000052501002',
                'cost' => 960000,
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => '2025-01-07',
                'prod_quot_status' => '30',  // 制作見積受取済
                'version' => 1,
            ],
            // 25-00011 展示会ブース (産業展示会ブースデザイン)
            [
                'quot_number' => '000042501003',
                'cost' => 1760000,
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => '2025-01-06',
                'prod_quot_status' => '30',  // 制作見積受取済
                'version' => 1,
            ],
            // 25-00035 カレンダー制作 (2026年度卓上カレンダー)
            [
                'quot_number' => '000052501004',
                'cost' => 360000,
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => '2025-01-09',
                'prod_quot_status' => '30',  // 制作見積受取済
                'version' => 1,
            ],
            // 25-00017 RPA導入支援 (業務自動化RPA導入)
            [
                'quot_number' => '000032501005',
                'cost' => 2560000,
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => '2025-01-08',
                'prod_quot_status' => '30',  // 制作見積受取済
                'version' => 1,
            ],
            // 25-00041 EDR導入 (エンドポイントセキュリティ導入)
            [
                'quot_number' => '000052501006',
                'cost' => 1440000,
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => '2025-01-11',
                'prod_quot_status' => '30',  // 制作見積受取済
                'version' => 1,
            ],
            // 25-00006 Webシステム保守 (年間保守契約)
            [
                'quot_number' => '000052501001',
                'cost' => 1440000,
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => '2025-01-03',
                'prod_quot_status' => '30',  // 制作見積受取済
                'version' => 1,
            ],
            // 25-00030 システム連携 (基幹システム連携開発)
            [
                'quot_number' => '000062501001',
                'cost' => 2240000,
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => '2025-01-06',
                'prod_quot_status' => '30',  // 制作見積受取済
                'version' => 1,
            ],
            // 25-00012 ロゴデザイン (新ブランドロゴデザイン)
            [
                'quot_number' => '000052501003',
                'cost' => 440000,
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => '2025-01-05',
                'prod_quot_status' => '30',  // 制作見積受取済
                'version' => 1,
            ],
            // 25-00036 封筒デザイン (社用封筒リニューアル)
            [
                'quot_number' => '000062501002',
                'cost' => 224000,
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => '2025-01-08',
                'prod_quot_status' => '30',  // 制作見積受取済
                'version' => 1,
            ],
            // 25-00018 システム監視 (インフラ監視サービス)
            [
                'quot_number' => '000062501003',
                'cost' => 960000,
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => '2025-01-04',
                'prod_quot_status' => '30',  // 制作見積受取済
                'version' => 1,
            ],
            // 25-00042 ファイルサーバー移行 (クラウド移行)
            [
                'quot_number' => '000062501004',
                'cost' => 760000,
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => '2025-01-10',
                'prod_quot_status' => '30',  // 制作見積受取済
                'version' => 1,
            ],
            // ホームページ制作 (コーポレートサイト新規制作)
            [
                'quot_number' => '000062412001',
                'cost' => 784000,
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => '2024-12-17',
                'prod_quot_status' => '30',  // 制作見積受取済
                'version' => 1,
            ],
            // Webシステム開発 (社内ポータルサイト構築)
            [
                'quot_number' => '000072412001',
                'cost' => 3600000,
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => '2024-12-21',
                'prod_quot_status' => '30',  // 制作見積受取済
                'version' => 1,
            ],
            // 社内報制作 (社内報年間制作契約)
            [
                'quot_number' => '000062412002',
                'cost' => 2880000,
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => '2024-12-11',
                'prod_quot_status' => '30',  // 制作見積受取済
                'version' => 1,
            ],
            // 年賀状デザイン (2025年年賀状制作)
            [
                'quot_number' => '000072411001',
                'cost' => 144000,
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => '2024-11-14',
                'prod_quot_status' => '30',  // 制作見積受取済
                'version' => 1,
            ],
            // グループウェア導入 (Microsoft365導入支援)
            [
                'quot_number' => '000072412002',
                'cost' => 2000000,
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => '2024-12-07',
                'prod_quot_status' => '30',  // 制作見積受取済
                'version' => 1,
            ],
            // PC入替支援 (社内PC100台入替)
            [
                'quot_number' => '000082412001',
                'cost' => 1760000,
                'quot_doc_path' => null,
                'reference_doc_path' => null,
                'submission_on' => '2024-12-14',
                'prod_quot_status' => '30',  // 制作見積受取済
                'version' => 1,
            ],
        ];

        $insertedCount = 0;
        foreach ($prodQuots as $prodQuot) {
            // quot_numberをquot_idに変換
            $quotNumber = $prodQuot['quot_number'];
            unset($prodQuot['quot_number']);
            $quotId = $quotIdMap[$quotNumber] ?? null;

            if ($quotId) {
                DB::table('prod_quots')->insert(array_merge($prodQuot, [
                    'quot_id' => $quotId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]));
                $insertedCount++;
            }
        }

        $this->command->info('制作見積テーブルに '.$insertedCount.' 件のデータを投入しました。');
    }
}
