<?php

namespace Database\Seeders;

use App\Models\ProdQuot;
use App\Models\Quot;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProdQuotRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * 見積ステータスが「20:制作見積中」のレコードに対応する
     * 制作見積依頼レコードを作成する。
     *
     * 制作見積依頼ステータス:
     * - 00: 設計中（初期状態）
     * - 10: 設計済
     * - 20: 承認済
     * - 30: 承認取消
     *
     * センターと担当者:
     * - section_cd_id: 27 (第2ソフトウェア開発センター)
     *   - 所長: employee_id 23
     *   - 社員: 24, 25, 26, 27, 28, 29
     * - section_cd_id: 32 (第1UX編集センター)
     *   - 所長: employee_id 30
     *   - 社員: 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42
     */
    public function run(): void
    {
        // 既存データをクリア（開発環境のみ）
        if (app()->environment('local', 'development')) {
            DB::table('prod_quot_requests')->truncate();
        }

        // 見積番号からquot_idを取得するためのマッピング
        $quotIdMap = Quot::pluck('quot_id', 'quot_number')->toArray();

        // quot_idからprod_quot_idを取得するためのマッピング
        $prodQuotIdByQuotId = ProdQuot::pluck('prod_quot_id', 'quot_id')->toArray();

        // 見積番号からprod_quot_idへのマッピングを作成
        $prodQuotIdMap = [];
        foreach ($quotIdMap as $quotNumber => $quotId) {
            if (isset($prodQuotIdByQuotId[$quotId])) {
                $prodQuotIdMap[$quotNumber] = $prodQuotIdByQuotId[$quotId];
            }
        }

        // 見積ステータス「20:制作見積中」の制作見積に対する依頼
        // ProdQuotSeederでの登録順に基づくprod_quot_id:
        // - quot_number: 000032501001 (ECサイト構築)      center: 27 開発系
        // - quot_number: 000032501002 (CMS導入)          center: 27 開発系
        // - quot_number: 000072501001 (ポスターデザイン) center: 32 編集+印刷
        // - quot_number: 000032501004 (看板デザイン)     center: 32 編集系
        // - quot_number: 000012501006 (API開発)          center: 27 開発系
        // - quot_number: 000032501006 (バックアップ構築) center: 27 開発系

        $prodQuotRequests = [
            // ========================================
            // quot_number: 000032501001 (ECサイト構築) 主管: 開発センター(27)
            // → 自センター設計済、UX編集センターへデザイン依頼中
            // ========================================
            [
                'quot_number' => '000032501001',
                'section_cd_id' => 27,  // 第2ソフトウェア開発センター（主管）
                'requested_by' => 23,   // 開発所長
                'request_summary' => 'BtoC向けECサイトの新規構築。会員管理、決済機能、商品管理を含む。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => 24,    // 開発社員が設計完了
                'approved_by' => null,
                'approved_at' => null,
                'prod_quot_request_status' => '10',  // 設計済
            ],
            [
                'quot_number' => '000032501001',
                'section_cd_id' => 32,  // 第1UX編集センター（他センター依頼）
                'requested_by' => 23,   // 開発所長から依頼
                'request_summary' => 'ECサイトのUI/UXデザイン。トップページ、商品一覧、商品詳細、カート、マイページ。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => null,
                'approved_by' => null,
                'approved_at' => null,
                'prod_quot_request_status' => '00',  // 設計中
            ],

            // ========================================
            // quot_number: 000032501002 (CMS導入) 主管: 開発センター(27)
            // → 自センターのみ、設計中
            // ========================================
            [
                'quot_number' => '000032501002',
                'section_cd_id' => 27,
                'requested_by' => 23,
                'request_summary' => 'WordPressを使用したコーポレートサイトCMS化。既存コンテンツ移行含む。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => null,
                'approved_by' => null,
                'approved_at' => null,
                'prod_quot_request_status' => '00',  // 設計中
            ],

            // ========================================
            // quot_number: 000072501001 (ポスターデザイン) 主管: UX編集センター(32)
            // → 自センター設計済（デザイン・DTP）、開発センターへシステム依頼なし
            // ========================================
            [
                'quot_number' => '000072501001',
                'section_cd_id' => 32,  // 第1UX編集センター（主管）
                'requested_by' => 30,   // UX所長
                'request_summary' => 'イベント告知B1ポスター。デザイン・DTP・印刷手配。500枚。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => 31,    // UXリーダーが設計完了
                'approved_by' => null,
                'approved_at' => null,
                'prod_quot_request_status' => '10',  // 設計済
            ],

            // ========================================
            // quot_number: 000032501004 (看板デザイン) 主管: UX編集センター(32)
            // → 自センター設計中
            // ========================================
            [
                'quot_number' => '000032501004',
                'section_cd_id' => 32,
                'requested_by' => 30,
                'request_summary' => '新店舗の外看板デザイン・施工手配。正面看板1点、袖看板2点。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => null,
                'approved_by' => null,
                'approved_at' => null,
                'prod_quot_request_status' => '00',  // 設計中
            ],

            // ========================================
            // quot_number: 000012501006 (API開発) 主管: 開発センター(27)
            // → 自センター設計済
            // ========================================
            [
                'quot_number' => '000012501006',
                'section_cd_id' => 27,
                'requested_by' => 23,
                'request_summary' => '外部システム連携用REST API開発。認証、商品連携、在庫連携。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => 25,    // 開発社員が設計完了
                'approved_by' => null,
                'approved_at' => null,
                'prod_quot_request_status' => '10',  // 設計済
            ],

            // ========================================
            // quot_number: 000032501006 (バックアップ構築) 主管: 開発センター(27)
            // → 自センター設計中
            // ========================================
            [
                'quot_number' => '000032501006',
                'section_cd_id' => 27,
                'requested_by' => 23,
                'request_summary' => 'オンプレミスとクラウドのハイブリッドバックアップ環境構築。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => null,
                'approved_by' => null,
                'approved_at' => null,
                'prod_quot_request_status' => '00',  // 設計中
            ],

            // ========================================
            // 見積ステータス「30:制作見積済」
            // → 制作見積依頼ステータス「20:承認済」
            // ========================================

            // quot_number: 000012501002 (システム改修) 主管: 開発センター(27)
            [
                'quot_number' => '000012501002',
                'section_cd_id' => 27,
                'requested_by' => 23,
                'request_summary' => '基幹システムの機能追加改修。帳票出力機能追加。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => 24,
                'approved_by' => 23,
                'approved_at' => '2025-01-10 14:00:00',
                'prod_quot_request_status' => '20',  // 承認済
            ],

            // quot_number: 000042501002 (LP改修) 主管: UX編集センター(32)
            [
                'quot_number' => '000042501002',
                'section_cd_id' => 32,
                'requested_by' => 30,
                'request_summary' => '既存LPのデザインリニューアルとA/Bテスト機能追加。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => 31,
                'approved_by' => 30,
                'approved_at' => '2025-01-11 10:00:00',
                'prod_quot_request_status' => '20',  // 承認済
            ],

            // quot_number: 000082501001 (名刺デザイン) 主管: UX編集センター(32)
            [
                'quot_number' => '000082501001',
                'section_cd_id' => 32,
                'requested_by' => 30,
                'request_summary' => '役員名刺デザインリニューアル、500枚×10名分印刷。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => 32,
                'approved_by' => 30,
                'approved_at' => '2025-01-11 11:00:00',
                'prod_quot_request_status' => '20',  // 承認済
            ],

            // quot_number: 000042501004 (DM制作) 主管: UX編集センター(32)
            [
                'quot_number' => '000042501004',
                'section_cd_id' => 32,
                'requested_by' => 30,
                'request_summary' => 'ハガキサイズDM5000通分印刷・発送。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => 31,
                'approved_by' => 30,
                'approved_at' => '2025-01-12 09:00:00',
                'prod_quot_request_status' => '20',  // 承認済
            ],

            // quot_number: 000022501004 (データ分析基盤) 主管: 開発センター(27)
            [
                'quot_number' => '000022501004',
                'section_cd_id' => 27,
                'requested_by' => 23,
                'request_summary' => 'BIツール導入、データウェアハウス構築。Tableau連携。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => 25,
                'approved_by' => 23,
                'approved_at' => '2025-01-12 15:00:00',
                'prod_quot_request_status' => '20',  // 承認済
            ],

            // quot_number: 000042501006 (VPN構築) 主管: 開発センター(27)
            [
                'quot_number' => '000042501006',
                'section_cd_id' => 27,
                'requested_by' => 23,
                'request_summary' => '在宅勤務用VPN環境構築。200ユーザー対応。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => 24,
                'approved_by' => 23,
                'approved_at' => '2025-01-13 10:00:00',
                'prod_quot_request_status' => '20',  // 承認済
            ],

            // ========================================
            // 見積ステータス「40/50/60」（承認待ち以降）
            // → 制作見積ステータス「40:発行済」
            // → 制作見積依頼ステータス「20:承認済」
            // ========================================

            // quot_number: 000042501001 (アプリ開発) 主管: 開発センター(27)
            [
                'quot_number' => '000042501001',
                'section_cd_id' => 27,
                'requested_by' => 23,
                'request_summary' => '営業支援用スマートフォンアプリ開発。iOS/Android対応。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => 24,
                'approved_by' => 23,
                'approved_at' => '2025-01-03 14:00:00',
                'prod_quot_request_status' => '20',
            ],
            // quot_number: 000052501002 (Web保守契約) 主管: 開発センター(27)
            [
                'quot_number' => '000052501002',
                'section_cd_id' => 27,
                'requested_by' => 23,
                'request_summary' => 'Webサイトの年間保守契約。月次レポート含む。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => 25,
                'approved_by' => 23,
                'approved_at' => '2025-01-06 10:00:00',
                'prod_quot_request_status' => '20',
            ],
            // quot_number: 000042501003 (展示会ブース) 主管: UX編集センター(32)
            [
                'quot_number' => '000042501003',
                'section_cd_id' => 32,
                'requested_by' => 30,
                'request_summary' => '3m×3mブースデザイン・施工。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => 31,
                'approved_by' => 30,
                'approved_at' => '2025-01-05 11:00:00',
                'prod_quot_request_status' => '20',
            ],
            // quot_number: 000052501004 (カレンダー制作) 主管: UX編集センター(32)
            [
                'quot_number' => '000052501004',
                'section_cd_id' => 32,
                'requested_by' => 30,
                'request_summary' => '卓上カレンダー1000部制作。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => 32,
                'approved_by' => 30,
                'approved_at' => '2025-01-08 14:00:00',
                'prod_quot_request_status' => '20',
            ],
            // quot_number: 000032501005 (RPA導入支援) 主管: 開発センター(27)
            [
                'quot_number' => '000032501005',
                'section_cd_id' => 27,
                'requested_by' => 23,
                'request_summary' => '経理業務のRPA自動化。5業務対象。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => 25,
                'approved_by' => 23,
                'approved_at' => '2025-01-07 15:00:00',
                'prod_quot_request_status' => '20',
            ],
            // quot_number: 000052501006 (EDR導入) 主管: 開発センター(27)
            [
                'quot_number' => '000052501006',
                'section_cd_id' => 27,
                'requested_by' => 23,
                'request_summary' => 'EDRソリューション導入。300端末対応。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => 24,
                'approved_by' => 23,
                'approved_at' => '2025-01-10 10:00:00',
                'prod_quot_request_status' => '20',
            ],
            // quot_number: 000052501001 (Webシステム保守) 主管: 開発センター(27)
            [
                'quot_number' => '000052501001',
                'section_cd_id' => 27,
                'requested_by' => 23,
                'request_summary' => 'Webシステムの年間保守契約。24時間監視含む。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => 25,
                'approved_by' => 23,
                'approved_at' => '2025-01-02 11:00:00',
                'prod_quot_request_status' => '20',
            ],
            // quot_number: 000062501001 (システム連携) 主管: 開発センター(27)
            [
                'quot_number' => '000062501001',
                'section_cd_id' => 27,
                'requested_by' => 23,
                'request_summary' => '基幹システムとWebシステムの連携API開発。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => 24,
                'approved_by' => 23,
                'approved_at' => '2025-01-05 14:00:00',
                'prod_quot_request_status' => '20',
            ],
            // quot_number: 000052501003 (ロゴデザイン) 主管: UX編集センター(32)
            [
                'quot_number' => '000052501003',
                'section_cd_id' => 32,
                'requested_by' => 30,
                'request_summary' => '新ブランドのロゴデザイン。ガイドライン作成含む。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => 31,
                'approved_by' => 30,
                'approved_at' => '2025-01-04 10:00:00',
                'prod_quot_request_status' => '20',
            ],
            // quot_number: 000062501002 (封筒デザイン) 主管: UX編集センター(32)
            [
                'quot_number' => '000062501002',
                'section_cd_id' => 32,
                'requested_by' => 30,
                'request_summary' => '長3・角2封筒デザイン、各5000枚印刷。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => 32,
                'approved_by' => 30,
                'approved_at' => '2025-01-07 11:00:00',
                'prod_quot_request_status' => '20',
            ],
            // quot_number: 000062501003 (システム監視) 主管: 開発センター(27)
            [
                'quot_number' => '000062501003',
                'section_cd_id' => 27,
                'requested_by' => 23,
                'request_summary' => 'サーバー・ネットワーク24時間監視サービス。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => 25,
                'approved_by' => 23,
                'approved_at' => '2025-01-03 10:00:00',
                'prod_quot_request_status' => '20',
            ],
            // quot_number: 000062501004 (ファイルサーバー移行) 主管: 開発センター(27)
            [
                'quot_number' => '000062501004',
                'section_cd_id' => 27,
                'requested_by' => 23,
                'request_summary' => 'オンプレミスファイルサーバーのクラウド移行。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => 24,
                'approved_by' => 23,
                'approved_at' => '2025-01-09 14:00:00',
                'prod_quot_request_status' => '20',
            ],
            // quot_number: 000062412001 (ホームページ制作) 主管: UX編集センター(32)
            [
                'quot_number' => '000062412001',
                'section_cd_id' => 32,
                'requested_by' => 30,
                'request_summary' => '新規コーポレートサイト制作。10ページ構成。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => 31,
                'approved_by' => 30,
                'approved_at' => '2024-12-16 10:00:00',
                'prod_quot_request_status' => '20',
            ],
            // quot_number: 000072412001 (Webシステム開発) 主管: 開発センター(27)
            [
                'quot_number' => '000072412001',
                'section_cd_id' => 27,
                'requested_by' => 23,
                'request_summary' => '社内向けポータルサイトの新規構築。SSO対応。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => 24,
                'approved_by' => 23,
                'approved_at' => '2024-12-20 14:00:00',
                'prod_quot_request_status' => '20',
            ],
            // quot_number: 000062412002 (社内報制作) 主管: UX編集センター(32)
            [
                'quot_number' => '000062412002',
                'section_cd_id' => 32,
                'requested_by' => 30,
                'request_summary' => '月刊社内報の企画・編集・印刷。年間12号分。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => 31,
                'approved_by' => 30,
                'approved_at' => '2024-12-10 11:00:00',
                'prod_quot_request_status' => '20',
            ],
            // quot_number: 000072411001 (年賀状デザイン) 主管: UX編集センター(32)
            [
                'quot_number' => '000072411001',
                'section_cd_id' => 32,
                'requested_by' => 30,
                'request_summary' => '法人向け年賀状デザイン、2000枚印刷。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => 32,
                'approved_by' => 30,
                'approved_at' => '2024-11-13 10:00:00',
                'prod_quot_request_status' => '20',
            ],
            // quot_number: 000072412002 (グループウェア導入) 主管: 開発センター(27)
            [
                'quot_number' => '000072412002',
                'section_cd_id' => 27,
                'requested_by' => 23,
                'request_summary' => 'Microsoft365導入、データ移行、社員教育含む。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => 25,
                'approved_by' => 23,
                'approved_at' => '2024-12-06 14:00:00',
                'prod_quot_request_status' => '20',
            ],
            // quot_number: 000082412001 (PC入替支援) 主管: 開発センター(27)
            [
                'quot_number' => '000082412001',
                'section_cd_id' => 27,
                'requested_by' => 23,
                'request_summary' => '社内PC100台入替。データ移行含む。',
                'reference_doc_path' => null,
                'supporting_doc_path' => null,
                'designed_by' => 24,
                'approved_by' => 23,
                'approved_at' => '2024-12-13 10:00:00',
                'prod_quot_request_status' => '20',
            ],
        ];

        $insertedCount = 0;
        foreach ($prodQuotRequests as $request) {
            // quot_numberをprod_quot_idに変換
            $quotNumber = $request['quot_number'];
            unset($request['quot_number']);
            $prodQuotId = $prodQuotIdMap[$quotNumber] ?? null;

            if ($prodQuotId) {
                DB::table('prod_quot_requests')->insert(array_merge($request, [
                    'prod_quot_id' => $prodQuotId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]));
                $insertedCount++;
            }
        }

        $this->command->info('制作見積依頼テーブルに '.$insertedCount.' 件のデータを投入しました。');
    }
}
