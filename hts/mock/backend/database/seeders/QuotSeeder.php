<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 既存データをクリア（開発環境のみ）
        if (app()->environment('local', 'development')) {
            DB::table('quots')->truncate();
        }

        // 得意先コードからIDを取得するためのマッピング
        $customerIdMap = Customer::pluck('customer_id', 'customer_cd')->toArray();

        // quot_status: 00:作成中, 10:承認待ち, 20:承認済, 30:発行済
        // prod_quot_status: 00:制作見積依頼前, 10:制作見積依頼済, 20:制作見積済, 30:制作見積受取済
        // 営業担当者ごとに全ステータスを網羅
        //
        // 社員別部署コード（employee_section_cd）を使用:
        // 東京営業センター: 東京太郎(employee_id:8, section_cd_id:9), 東京花子(employee_id:9, section_cd_id:10)
        // 第1営業センター: 第一太郎(employee_id:13, section_cd_id:15), 第一花子(employee_id:14, section_cd_id:16)
        // 第2営業センター: 第二太郎(employee_id:18, section_cd_id:21), 第二花子(employee_id:19, section_cd_id:22)

        $quotes = [
            // ========================================
            // 東京営業センター 東京太郎 (employee_id: 8, section_cd_id: 9)
            // ========================================
            [
                'section_cd_id' => 9,
                'employee_id' => 8,
                'quot_number' => '000012501001',
                'prod_name' => 'Webサイトリニューアル',
                'customer_cd' => '00001',
                'quot_subject' => 'コーポレートサイトリニューアル',
                'quot_summary' => 'コーポレートサイトのフルリニューアル。レスポンシブ対応、CMS導入含む。',
                'center_section_cd_id' => 27,
                'approved_by' => null,
                'approved_at' => null,
                'quot_status' => '00',  // 作成中

                'prod_quot_status' => '00',  // 制作見積依頼前
                'quot_amount' => null,
                'submission_method' => '00',  // メール
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 9,
                'employee_id' => 8,
                'quot_number' => '000022501001',
                'prod_name' => 'LP制作',
                'customer_cd' => '00002',
                'quot_subject' => 'キャンペーンLP制作',
                'quot_summary' => '新商品キャンペーン用ランディングページ制作。',
                'center_section_cd_id' => 32,
                'approved_by' => null,
                'approved_at' => null,
                'quot_status' => '00',  // 作成中

                'prod_quot_status' => '10',  // 制作見積依頼済
                'quot_amount' => null,
                'submission_method' => '00',  // メール
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 9,
                'employee_id' => 8,
                'quot_number' => '000032501001',
                'prod_name' => 'ECサイト構築',
                'customer_cd' => '00003',
                'quot_subject' => 'BtoC向けECサイト構築',
                'quot_summary' => 'BtoC向けECサイトの新規構築。会員管理、決済機能を含む。',
                'center_section_cd_id' => 27,
                'approved_by' => null,
                'approved_at' => null,
                'quot_status' => '00',  // 作成中

                'prod_quot_status' => '10',  // 制作見積依頼済
                'quot_amount' => null,
                'submission_method' => '10',  // 郵送
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 9,
                'employee_id' => 8,
                'quot_number' => '000012501002',
                'prod_name' => 'システム改修',
                'customer_cd' => '00001',
                'quot_subject' => '基幹システム改修',
                'quot_summary' => '既存基幹システムの機能追加改修。',
                'center_section_cd_id' => 27,
                'approved_by' => null,
                'approved_at' => null,
                'quot_status' => '00',  // 作成中

                'prod_quot_status' => '20',  // 制作見積済
                'quot_amount' => null,
                'submission_method' => '00',  // メール
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 9,
                'employee_id' => 8,
                'quot_number' => '000042501001',
                'prod_name' => 'アプリ開発',
                'customer_cd' => '00004',
                'quot_subject' => '業務用スマホアプリ開発',
                'quot_summary' => '営業支援用スマートフォンアプリ開発。iOS/Android対応。',
                'center_section_cd_id' => 27,
                'approved_by' => null,
                'approved_at' => null,
                'quot_status' => '10',  // 承認待ち

                'prod_quot_status' => '30',  // 制作見積受取済
                'quot_amount' => 5500000,
                'submission_method' => '20',  // 持参
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 9,
                'employee_id' => 8,
                'quot_number' => '000052501001',
                'prod_name' => 'Webシステム保守',
                'customer_cd' => '00005',
                'quot_subject' => 'Webシステム年間保守契約',
                'quot_summary' => 'Webシステムの年間保守契約。24時間監視含む。',
                'center_section_cd_id' => 27,
                'approved_by' => 7,
                'approved_at' => '2025-01-06 10:30:00',
                'quot_status' => '20',  // 承認済

                'prod_quot_status' => '30',  // 制作見積受取済
                'quot_amount' => 1800000,
                'submission_method' => '00',  // メール
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 9,
                'employee_id' => 8,
                'quot_number' => '000062412001',
                'prod_name' => 'ホームページ制作',
                'customer_cd' => '00006',
                'quot_subject' => 'コーポレートサイト新規制作',
                'quot_summary' => '新規コーポレートサイト制作。10ページ構成。',
                'center_section_cd_id' => 32,
                'approved_by' => 7,
                'approved_at' => '2024-12-20 14:00:00',
                'quot_status' => '30',  // 発行済

                'prod_quot_status' => '30',  // 制作見積受取済
                'quot_amount' => 980000,
                'submission_method' => '00',
                'quot_on' => '2024-12-18',
                'quot_result' => '10',  // 受注
                'lost_reason' => null,
            ],

            // ========================================
            // 東京営業センター 東京花子 (employee_id: 9, section_cd_id: 10)
            // ========================================
            [
                'section_cd_id' => 10,
                'employee_id' => 9,
                'quot_number' => '000012501003',
                'prod_name' => 'モバイルアプリUI設計',
                'customer_cd' => '00001',
                'quot_subject' => 'アプリUIデザイン',
                'quot_summary' => 'スマホアプリのUI/UXデザイン。ワイヤーフレーム含む。',
                'center_section_cd_id' => 32,
                'approved_by' => null,
                'approved_at' => null,
                'quot_status' => '00',  // 作成中

                'prod_quot_status' => '00',  // 制作見積依頼前
                'quot_amount' => null,
                'submission_method' => '00',  // メール
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 10,
                'employee_id' => 9,
                'quot_number' => '000022501002',
                'prod_name' => 'ECサイト改修',
                'customer_cd' => '00002',
                'quot_subject' => '既存ECサイト機能追加',
                'quot_summary' => '既存ECサイトへのポイント機能追加。',
                'center_section_cd_id' => 27,
                'approved_by' => null,
                'approved_at' => null,
                'quot_status' => '00',  // 作成中

                'prod_quot_status' => '10',  // 制作見積依頼済
                'quot_amount' => null,
                'submission_method' => '10',  // 郵送
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 10,
                'employee_id' => 9,
                'quot_number' => '000032501002',
                'prod_name' => 'CMS導入',
                'customer_cd' => '00003',
                'quot_subject' => 'WordPress導入支援',
                'quot_summary' => 'WordPressを使用したコーポレートサイトCMS化。',
                'center_section_cd_id' => 27,
                'approved_by' => null,
                'approved_at' => null,
                'quot_status' => '00',  // 作成中

                'prod_quot_status' => '10',  // 制作見積依頼済
                'quot_amount' => null,
                'submission_method' => '00',  // メール
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 10,
                'employee_id' => 9,
                'quot_number' => '000042501002',
                'prod_name' => 'LP改修',
                'customer_cd' => '00004',
                'quot_subject' => 'キャンペーンLP改修',
                'quot_summary' => '既存LPのデザインリニューアルとA/Bテスト機能追加。',
                'center_section_cd_id' => 32,
                'approved_by' => null,
                'approved_at' => null,
                'quot_status' => '00',  // 作成中

                'prod_quot_status' => '20',  // 制作見積済
                'quot_amount' => null,
                'submission_method' => '00',  // メール
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 10,
                'employee_id' => 9,
                'quot_number' => '000052501002',
                'prod_name' => 'Web保守契約',
                'customer_cd' => '00005',
                'quot_subject' => 'Webサイト年間保守',
                'quot_summary' => 'Webサイトの年間保守契約。月次レポート含む。',
                'center_section_cd_id' => 27,
                'approved_by' => null,
                'approved_at' => null,
                'quot_status' => '10',  // 承認待ち

                'prod_quot_status' => '30',  // 制作見積受取済
                'quot_amount' => 1200000,
                'submission_method' => '00',  // メール
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 10,
                'employee_id' => 9,
                'quot_number' => '000062501001',
                'prod_name' => 'システム連携',
                'customer_cd' => '00006',
                'quot_subject' => '基幹システム連携開発',
                'quot_summary' => '基幹システムとWebシステムの連携API開発。',
                'center_section_cd_id' => 27,
                'approved_by' => 7,
                'approved_at' => '2025-01-09 10:00:00',
                'quot_status' => '20',  // 承認済

                'prod_quot_status' => '30',  // 制作見積受取済
                'quot_amount' => 2800000,
                'submission_method' => '20',  // 持参
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 10,
                'employee_id' => 9,
                'quot_number' => '000072412001',
                'prod_name' => 'Webシステム開発',
                'customer_cd' => '00007',
                'quot_subject' => '社内ポータルサイト構築',
                'quot_summary' => '社内向けポータルサイトの新規構築。SSO対応。',
                'center_section_cd_id' => 27,
                'approved_by' => 7,
                'approved_at' => '2024-12-25 15:00:00',
                'quot_status' => '30',  // 発行済

                'prod_quot_status' => '30',  // 制作見積受取済
                'quot_amount' => 4500000,
                'submission_method' => '00',
                'quot_on' => '2024-12-22',
                'quot_result' => '10',  // 受注
                'lost_reason' => null,
            ],

            // ========================================
            // 第1営業センター 第一太郎 (employee_id: 13, section_cd_id: 15)
            // ========================================
            [
                'section_cd_id' => 15,
                'employee_id' => 13,
                'quot_number' => '000032501003',
                'prod_name' => '会社案内パンフレット',
                'customer_cd' => '00003',
                'quot_subject' => '2025年度版会社案内制作',
                'quot_summary' => 'A4サイズ16ページ、5000部印刷。撮影含む。',
                'center_section_cd_id' => 32,
                'approved_by' => null,
                'approved_at' => null,
                'quot_status' => '00',  // 作成中

                'prod_quot_status' => '00',  // 制作見積依頼前
                'quot_amount' => null,
                'submission_method' => '10',  // 郵送
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 15,
                'employee_id' => 13,
                'quot_number' => '000012501004',
                'prod_name' => '製品カタログ',
                'customer_cd' => '00001',
                'quot_subject' => '製品総合カタログ制作',
                'quot_summary' => 'A4サイズ48ページ、10000部印刷。',
                'center_section_cd_id' => 32,
                'approved_by' => null,
                'approved_at' => null,
                'quot_status' => '00',  // 作成中

                'prod_quot_status' => '10',  // 制作見積依頼済
                'quot_amount' => null,
                'submission_method' => '00',  // メール
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 15,
                'employee_id' => 13,
                'quot_number' => '000072501001',
                'prod_name' => 'ポスターデザイン',
                'customer_cd' => '00007',
                'quot_subject' => 'イベント告知ポスター制作',
                'quot_summary' => 'B1サイズポスター500枚制作。',
                'center_section_cd_id' => 32,
                'approved_by' => null,
                'approved_at' => null,
                'quot_status' => '00',  // 作成中

                'prod_quot_status' => '10',  // 制作見積依頼済
                'quot_amount' => null,
                'submission_method' => '20',  // 持参
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 15,
                'employee_id' => 13,
                'quot_number' => '000082501001',
                'prod_name' => '名刺デザイン',
                'customer_cd' => '00008',
                'quot_subject' => '役員名刺リニューアル',
                'quot_summary' => '役員名刺デザインリニューアル、500枚×10名分印刷。',
                'center_section_cd_id' => 32,
                'approved_by' => null,
                'approved_at' => null,
                'quot_status' => '00',  // 作成中

                'prod_quot_status' => '20',  // 制作見積済
                'quot_amount' => null,
                'submission_method' => '00',  // メール
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 15,
                'employee_id' => 13,
                'quot_number' => '000042501003',
                'prod_name' => '展示会ブース',
                'customer_cd' => '00004',
                'quot_subject' => '産業展示会ブースデザイン',
                'quot_summary' => '3m×3mブースデザイン・施工。',
                'center_section_cd_id' => 32,
                'approved_by' => null,
                'approved_at' => null,
                'quot_status' => '10',  // 承認待ち

                'prod_quot_status' => '30',  // 制作見積受取済
                'quot_amount' => 2200000,
                'submission_method' => '20',  // 持参
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 15,
                'employee_id' => 13,
                'quot_number' => '000052501003',
                'prod_name' => 'ロゴデザイン',
                'customer_cd' => '00005',
                'quot_subject' => '新ブランドロゴデザイン',
                'quot_summary' => '新ブランドのロゴデザイン。ガイドライン作成含む。',
                'center_section_cd_id' => 32,
                'approved_by' => 12,
                'approved_at' => '2025-01-08 11:00:00',
                'quot_status' => '20',  // 承認済

                'prod_quot_status' => '30',  // 制作見積受取済
                'quot_amount' => 550000,
                'submission_method' => '00',  // メール
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 15,
                'employee_id' => 13,
                'quot_number' => '000062412002',
                'prod_name' => '社内報制作',
                'customer_cd' => '00006',
                'quot_subject' => '社内報年間制作契約',
                'quot_summary' => '月刊社内報の企画・編集・印刷。年間12号分。',
                'center_section_cd_id' => 32,
                'approved_by' => 12,
                'approved_at' => '2024-12-15 15:30:00',
                'quot_status' => '30',  // 発行済

                'prod_quot_status' => '30',  // 制作見積受取済
                'quot_amount' => 3600000,
                'submission_method' => '10',
                'quot_on' => '2024-12-12',
                'quot_result' => '10',  // 受注
                'lost_reason' => null,
            ],

            // ========================================
            // 第1営業センター 第一花子 (employee_id: 14, section_cd_id: 16)
            // ========================================
            [
                'section_cd_id' => 16,
                'employee_id' => 14,
                'quot_number' => '000012501005',
                'prod_name' => '採用パンフレット',
                'customer_cd' => '00001',
                'quot_subject' => '2025年度採用パンフレット',
                'quot_summary' => 'A4サイズ8ページ、3000部印刷。',
                'center_section_cd_id' => 32,
                'approved_by' => null,
                'approved_at' => null,
                'quot_status' => '00',  // 作成中

                'prod_quot_status' => '00',  // 制作見積依頼前
                'quot_amount' => null,
                'submission_method' => '00',  // メール
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 16,
                'employee_id' => 14,
                'quot_number' => '000022501003',
                'prod_name' => '商品チラシ',
                'customer_cd' => '00002',
                'quot_subject' => '新商品チラシ制作',
                'quot_summary' => 'A3二つ折りチラシ10000部印刷。',
                'center_section_cd_id' => 32,
                'approved_by' => null,
                'approved_at' => null,
                'quot_status' => '00',  // 作成中

                'prod_quot_status' => '10',  // 制作見積依頼済
                'quot_amount' => null,
                'submission_method' => '10',  // 郵送
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 16,
                'employee_id' => 14,
                'quot_number' => '000032501004',
                'prod_name' => '看板デザイン',
                'customer_cd' => '00003',
                'quot_subject' => '店舗看板デザイン',
                'quot_summary' => '新店舗の外看板デザイン・施工。',
                'center_section_cd_id' => 32,
                'approved_by' => null,
                'approved_at' => null,
                'quot_status' => '00',  // 作成中

                'prod_quot_status' => '10',  // 制作見積依頼済
                'quot_amount' => null,
                'submission_method' => '00',  // メール
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 16,
                'employee_id' => 14,
                'quot_number' => '000042501004',
                'prod_name' => 'DM制作',
                'customer_cd' => '00004',
                'quot_subject' => 'キャンペーンDM制作',
                'quot_summary' => 'ハガキサイズDM5000通分印刷・発送。',
                'center_section_cd_id' => 32,
                'approved_by' => null,
                'approved_at' => null,
                'quot_status' => '00',  // 作成中

                'prod_quot_status' => '20',  // 制作見積済
                'quot_amount' => null,
                'submission_method' => '00',  // メール
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 16,
                'employee_id' => 14,
                'quot_number' => '000052501004',
                'prod_name' => 'カレンダー制作',
                'customer_cd' => '00005',
                'quot_subject' => '2026年度卓上カレンダー',
                'quot_summary' => '卓上カレンダー1000部制作。',
                'center_section_cd_id' => 32,
                'approved_by' => null,
                'approved_at' => null,
                'quot_status' => '10',  // 承認待ち

                'prod_quot_status' => '30',  // 制作見積受取済
                'quot_amount' => 450000,
                'submission_method' => '10',  // 郵送
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 16,
                'employee_id' => 14,
                'quot_number' => '000062501002',
                'prod_name' => '封筒デザイン',
                'customer_cd' => '00006',
                'quot_subject' => '社用封筒リニューアル',
                'quot_summary' => '長3・角2封筒デザイン、各5000枚印刷。',
                'center_section_cd_id' => 32,
                'approved_by' => 12,
                'approved_at' => '2025-01-11 09:30:00',
                'quot_status' => '20',  // 承認済

                'prod_quot_status' => '30',  // 制作見積受取済
                'quot_amount' => 280000,
                'submission_method' => '00',  // メール
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 16,
                'employee_id' => 14,
                'quot_number' => '000072411001',
                'prod_name' => '年賀状デザイン',
                'customer_cd' => '00007',
                'quot_subject' => '2025年年賀状制作',
                'quot_summary' => '法人向け年賀状デザイン、2000枚印刷。',
                'center_section_cd_id' => 32,
                'approved_by' => 12,
                'approved_at' => '2024-11-20 14:00:00',
                'quot_status' => '30',  // 発行済

                'prod_quot_status' => '30',  // 制作見積受取済
                'quot_amount' => 180000,
                'submission_method' => '00',
                'quot_on' => '2024-11-15',
                'quot_result' => '10',  // 受注
                'lost_reason' => null,
            ],

            // ========================================
            // 第2営業センター 第二太郎 (employee_id: 18, section_cd_id: 21)
            // ========================================
            [
                'section_cd_id' => 21,
                'employee_id' => 18,
                'quot_number' => '000042501005',
                'prod_name' => 'クラウド移行支援',
                'customer_cd' => '00004',
                'quot_subject' => 'オンプレミスからAWS移行',
                'quot_summary' => '既存オンプレミス環境のAWS移行。設計、移行、テスト含む。',
                'center_section_cd_id' => 27,
                'approved_by' => null,
                'approved_at' => null,
                'quot_status' => '00',  // 作成中

                'prod_quot_status' => '00',  // 制作見積依頼前
                'quot_amount' => null,
                'submission_method' => '00',  // メール
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 21,
                'employee_id' => 18,
                'quot_number' => '000052501005',
                'prod_name' => 'セキュリティ診断',
                'customer_cd' => '00005',
                'quot_subject' => 'Webアプリケーション脆弱性診断',
                'quot_summary' => 'Webアプリケーションの脆弱性診断。レポート作成含む。',
                'center_section_cd_id' => 27,
                'approved_by' => null,
                'approved_at' => null,
                'quot_status' => '00',  // 作成中

                'prod_quot_status' => '10',  // 制作見積依頼済
                'quot_amount' => null,
                'submission_method' => '00',  // メール
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 21,
                'employee_id' => 18,
                'quot_number' => '000012501006',
                'prod_name' => 'API開発',
                'customer_cd' => '00001',
                'quot_subject' => '外部連携API開発',
                'quot_summary' => '外部システム連携用REST API開発。',
                'center_section_cd_id' => 27,
                'approved_by' => null,
                'approved_at' => null,
                'quot_status' => '00',  // 作成中

                'prod_quot_status' => '10',  // 制作見積依頼済
                'quot_amount' => null,
                'submission_method' => '00',  // メール
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 21,
                'employee_id' => 18,
                'quot_number' => '000022501004',
                'prod_name' => 'データ分析基盤',
                'customer_cd' => '00002',
                'quot_subject' => 'データ分析基盤構築',
                'quot_summary' => 'BIツール導入、データウェアハウス構築。',
                'center_section_cd_id' => 27,
                'approved_by' => null,
                'approved_at' => null,
                'quot_status' => '00',  // 作成中

                'prod_quot_status' => '20',  // 制作見積済
                'quot_amount' => null,
                'submission_method' => '20',  // 持参
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 21,
                'employee_id' => 18,
                'quot_number' => '000032501005',
                'prod_name' => 'RPA導入支援',
                'customer_cd' => '00003',
                'quot_subject' => '業務自動化RPA導入',
                'quot_summary' => '経理業務のRPA自動化。5業務対象。',
                'center_section_cd_id' => 27,
                'approved_by' => null,
                'approved_at' => null,
                'quot_status' => '10',  // 承認待ち

                'prod_quot_status' => '30',  // 制作見積受取済
                'quot_amount' => 3200000,
                'submission_method' => '00',  // メール
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 21,
                'employee_id' => 18,
                'quot_number' => '000062501003',
                'prod_name' => 'システム監視',
                'customer_cd' => '00006',
                'quot_subject' => 'インフラ監視サービス',
                'quot_summary' => 'サーバー・ネットワーク24時間監視サービス。',
                'center_section_cd_id' => 27,
                'approved_by' => 17,
                'approved_at' => '2025-01-07 09:00:00',
                'quot_status' => '20',  // 承認済

                'prod_quot_status' => '30',  // 制作見積受取済
                'quot_amount' => 1200000,
                'submission_method' => '00',  // メール
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 21,
                'employee_id' => 18,
                'quot_number' => '000072412002',
                'prod_name' => 'グループウェア導入',
                'customer_cd' => '00007',
                'quot_subject' => 'Microsoft365導入支援',
                'quot_summary' => 'Microsoft365導入、データ移行、社員教育含む。',
                'center_section_cd_id' => 27,
                'approved_by' => 17,
                'approved_at' => '2024-12-10 16:00:00',
                'quot_status' => '30',  // 発行済

                'prod_quot_status' => '30',  // 制作見積受取済
                'quot_amount' => 2500000,
                'submission_method' => '20',
                'quot_on' => '2024-12-08',
                'quot_result' => '10',  // 受注
                'lost_reason' => null,
            ],

            // ========================================
            // 第2営業センター 第二花子 (employee_id: 19, section_cd_id: 22)
            // ========================================
            [
                'section_cd_id' => 22,
                'employee_id' => 19,
                'quot_number' => '000012501007',
                'prod_name' => 'サーバー構築',
                'customer_cd' => '00001',
                'quot_subject' => 'Webサーバー構築',
                'quot_summary' => 'Linux Webサーバー構築。冗長化対応。',
                'center_section_cd_id' => 27,
                'approved_by' => null,
                'approved_at' => null,
                'quot_status' => '00',  // 作成中

                'prod_quot_status' => '00',  // 制作見積依頼前
                'quot_amount' => null,
                'submission_method' => '00',  // メール
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 22,
                'employee_id' => 19,
                'quot_number' => '000022501005',
                'prod_name' => 'ネットワーク設計',
                'customer_cd' => '00002',
                'quot_subject' => '社内ネットワーク再設計',
                'quot_summary' => '社内LAN再設計。無線LAN追加。',
                'center_section_cd_id' => 27,
                'approved_by' => null,
                'approved_at' => null,
                'quot_status' => '00',  // 作成中

                'prod_quot_status' => '10',  // 制作見積依頼済
                'quot_amount' => null,
                'submission_method' => '00',  // メール
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 22,
                'employee_id' => 19,
                'quot_number' => '000032501006',
                'prod_name' => 'バックアップ構築',
                'customer_cd' => '00003',
                'quot_subject' => 'データバックアップ環境構築',
                'quot_summary' => 'オンプレミスとクラウドのハイブリッドバックアップ。',
                'center_section_cd_id' => 27,
                'approved_by' => null,
                'approved_at' => null,
                'quot_status' => '00',  // 作成中

                'prod_quot_status' => '10',  // 制作見積依頼済
                'quot_amount' => null,
                'submission_method' => '10',  // 郵送
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 22,
                'employee_id' => 19,
                'quot_number' => '000042501006',
                'prod_name' => 'VPN構築',
                'customer_cd' => '00004',
                'quot_subject' => 'リモートアクセスVPN構築',
                'quot_summary' => '在宅勤務用VPN環境構築。200ユーザー対応。',
                'center_section_cd_id' => 27,
                'approved_by' => null,
                'approved_at' => null,
                'quot_status' => '00',  // 作成中

                'prod_quot_status' => '20',  // 制作見積済
                'quot_amount' => null,
                'submission_method' => '00',  // メール
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 22,
                'employee_id' => 19,
                'quot_number' => '000052501006',
                'prod_name' => 'EDR導入',
                'customer_cd' => '00005',
                'quot_subject' => 'エンドポイントセキュリティ導入',
                'quot_summary' => 'EDRソリューション導入。300端末対応。',
                'center_section_cd_id' => 27,
                'approved_by' => null,
                'approved_at' => null,
                'quot_status' => '10',  // 承認待ち

                'prod_quot_status' => '30',  // 制作見積受取済
                'quot_amount' => 1800000,
                'submission_method' => '00',  // メール
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 22,
                'employee_id' => 19,
                'quot_number' => '000062501004',
                'prod_name' => 'ファイルサーバー移行',
                'customer_cd' => '00006',
                'quot_subject' => 'ファイルサーバークラウド移行',
                'quot_summary' => 'オンプレミスファイルサーバーのクラウド移行。',
                'center_section_cd_id' => 27,
                'approved_by' => 17,
                'approved_at' => '2025-01-13 11:00:00',
                'quot_status' => '20',  // 承認済

                'prod_quot_status' => '30',  // 制作見積受取済
                'quot_amount' => 950000,
                'submission_method' => '20',  // 持参
                'quot_on' => null,
                'quot_result' => '00',
                'lost_reason' => null,
            ],
            [
                'section_cd_id' => 22,
                'employee_id' => 19,
                'quot_number' => '000082412001',
                'prod_name' => 'PC入替支援',
                'customer_cd' => '00008',
                'quot_subject' => '社内PC入替作業',
                'quot_summary' => '社内PC100台入替。データ移行含む。',
                'center_section_cd_id' => 27,
                'approved_by' => 17,
                'approved_at' => '2024-12-18 10:00:00',
                'quot_status' => '30',  // 発行済

                'prod_quot_status' => '30',  // 制作見積受取済
                'quot_amount' => 2200000,
                'submission_method' => '10',
                'quot_on' => '2024-12-15',
                'quot_result' => '10',  // 受注
                'lost_reason' => null,
            ],
        ];

        $insertedCount = 0;
        foreach ($quotes as $quote) {
            // customer_cdをcustomer_idに変換
            $customerCd = $quote['customer_cd'];
            unset($quote['customer_cd']);
            $customerId = $customerIdMap[$customerCd] ?? null;

            if ($customerId) {
                DB::table('quots')->insert(array_merge($quote, [
                    'customer_id' => $customerId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]));
                $insertedCount++;
            }
        }

        $this->command->info('見積テーブルに '.$insertedCount.' 件のデータを投入しました。');
    }
}
