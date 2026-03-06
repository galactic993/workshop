<?php

namespace Database\Seeders;

use App\Models\ProcesCd;
use App\Models\ProdQuot;
use App\Models\ProdQuotRequest;
use App\Models\Quot;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProdQuotDetailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * 制作見積詳細のシーダー
     * 設計済（10）の制作見積依頼に対して詳細レコードを作成
     *
     * (quot_number, section_cd_id)でprod_quot_request_idを特定:
     * - (000032501001, 27): ECサイト開発部分 (開発センター, 設計済) → 開発系
     * - (000032501001, 32): ECサイトUI/UX (UX編集センター, 設計中) → 未作成
     * - (25-00027, 27): CMS導入 (開発センター, 設計中) → 未作成
     * - (000072501001, 32): ポスターデザイン (UX編集センター, 設計済) → 編集系
     * - (25-00033, 32): 看板デザイン (UX編集センター, 設計中) → 未作成
     * - (000012501006, 27): API開発 (開発センター, 設計済) → 開発系
     * - (25-00039, 27): バックアップ構築 (開発センター, 設計中) → 未作成
     *
     * proces_cd対応:
     * - 10000010-10000050: 印刷 (刷版, 印刷, 製本, 断裁, 折り加工)
     * - 20000010-20000050: 編集 (デザイン, DTP, 撮影, イラスト制作, コピーライティング)
     * - 30000010-30000050: 開発 (要件定義, 設計, 開発, テスト, 保守)
     */
    public function run(): void
    {
        // 既存データをクリア（開発環境のみ）
        if (app()->environment('local', 'development')) {
            DB::table('prod_quot_details')->truncate();
        }

        // 見積番号からprod_quot_idを取得するためのマッピング
        $quotIdMap = Quot::pluck('quot_id', 'quot_number')->toArray();
        $prodQuotIdByQuotId = ProdQuot::pluck('prod_quot_id', 'quot_id')->toArray();
        $prodQuotIdMap = [];
        foreach ($quotIdMap as $quotNumber => $quotId) {
            if (isset($prodQuotIdByQuotId[$quotId])) {
                $prodQuotIdMap[$quotNumber] = $prodQuotIdByQuotId[$quotId];
            }
        }

        // (quot_number, section_cd_id) -> prod_quot_request_id のマッピングを作成
        $prodQuotRequestIdMap = [];
        $prodQuotRequests = ProdQuotRequest::with(['prodQuot.quot'])->get();
        foreach ($prodQuotRequests as $request) {
            if ($request->prodQuot && $request->prodQuot->quot) {
                $key = $request->prodQuot->quot->quot_number.'_'.$request->section_cd_id;
                $prodQuotRequestIdMap[$key] = $request->prod_quot_request_id;
            }
        }

        // proces_cdからproces_cd_idを取得するためのマッピング
        $procesCdIdMap = ProcesCd::pluck('proces_cd_id', 'proces_cd')->toArray();

        $prodQuotDetails = [
            // ========================================
            // (000032501001, 27) ECサイト開発部分
            // 開発センター(27)、設計者: employee_id 24
            // ========================================
            [
                'quot_number' => '000032501001',
                'section_cd_id' => 27,
                'proces_cd' => '30000010',  // 要件定義
                'employee_id' => 24,
                'quantity' => 3,       // 3人日
                'unit_cost' => 200000,
                'cost' => 600000,
            ],
            [
                'quot_number' => '000032501001',
                'section_cd_id' => 27,
                'proces_cd' => '30000020',  // 設計
                'employee_id' => 24,
                'quantity' => 5,       // 5人日
                'unit_cost' => 180000,
                'cost' => 900000,
            ],
            [
                'quot_number' => '000032501001',
                'section_cd_id' => 27,
                'proces_cd' => '30000030',  // 開発
                'employee_id' => 25,
                'quantity' => 15,      // 15人日
                'unit_cost' => 250000,
                'cost' => 3750000,
            ],
            [
                'quot_number' => '000032501001',
                'section_cd_id' => 27,
                'proces_cd' => '30000040',  // テスト
                'employee_id' => 26,
                'quantity' => 5,       // 5人日
                'unit_cost' => 100000,
                'cost' => 500000,
            ],

            // ========================================
            // (000072501001, 32) ポスターデザイン
            // UX編集センター(32)、設計者: employee_id 31
            // ========================================
            [
                'quot_number' => '000072501001',
                'section_cd_id' => 32,
                'proces_cd' => '20000010',  // デザイン
                'employee_id' => 31,
                'quantity' => 2,       // 2人日
                'unit_cost' => 100000,
                'cost' => 200000,
            ],
            [
                'quot_number' => '000072501001',
                'section_cd_id' => 32,
                'proces_cd' => '20000020',  // DTP
                'employee_id' => 32,
                'quantity' => 1,       // 1人日
                'unit_cost' => 60000,
                'cost' => 60000,
            ],
            [
                'quot_number' => '000072501001',
                'section_cd_id' => 32,
                'proces_cd' => '20000040',  // イラスト制作
                'employee_id' => 33,
                'quantity' => 1,       // 1点
                'unit_cost' => 80000,
                'cost' => 80000,
            ],
            [
                'quot_number' => '000072501001',
                'section_cd_id' => 32,
                'proces_cd' => '10000010',  // 刷版（外注管理者として所長を設定）
                'employee_id' => 30,
                'quantity' => 1,
                'unit_cost' => 50000,
                'cost' => 50000,
            ],
            [
                'quot_number' => '000072501001',
                'section_cd_id' => 32,
                'proces_cd' => '10000020',  // 印刷（外注管理者として所長を設定）
                'employee_id' => 30,
                'quantity' => 1,
                'unit_cost' => 80000,
                'cost' => 80000,
            ],

            // ========================================
            // (000012501006, 27) API開発
            // 開発センター(27)、設計者: employee_id 25
            // ========================================
            [
                'quot_number' => '000012501006',
                'section_cd_id' => 27,
                'proces_cd' => '30000010',  // 要件定義
                'employee_id' => 25,
                'quantity' => 2,       // 2人日
                'unit_cost' => 200000,
                'cost' => 400000,
            ],
            [
                'quot_number' => '000012501006',
                'section_cd_id' => 27,
                'proces_cd' => '30000020',  // 設計
                'employee_id' => 25,
                'quantity' => 3,       // 3人日
                'unit_cost' => 180000,
                'cost' => 540000,
            ],
            [
                'quot_number' => '000012501006',
                'section_cd_id' => 27,
                'proces_cd' => '30000030',  // 開発
                'employee_id' => 24,
                'quantity' => 8,       // 8人日
                'unit_cost' => 250000,
                'cost' => 2000000,
            ],
            [
                'quot_number' => '000012501006',
                'section_cd_id' => 27,
                'proces_cd' => '30000040',  // テスト
                'employee_id' => 26,
                'quantity' => 3,       // 3人日
                'unit_cost' => 100000,
                'cost' => 300000,
            ],

            // ========================================
            // 見積ステータス「30:制作見積済」の制作見積依頼詳細
            // 全て承認済のため詳細レコードあり
            // ========================================

            // ========================================
            // (000012501002, 27) システム改修
            // 開発センター(27)、設計者: employee_id 24
            // 合計: 2,850,000円
            // ========================================
            [
                'quot_number' => '000012501002',
                'section_cd_id' => 27,
                'proces_cd' => '30000010',  // 要件定義
                'employee_id' => 24,
                'quantity' => 2,
                'unit_cost' => 200000,
                'cost' => 400000,
            ],
            [
                'quot_number' => '000012501002',
                'section_cd_id' => 27,
                'proces_cd' => '30000020',  // 設計
                'employee_id' => 24,
                'quantity' => 3,
                'unit_cost' => 180000,
                'cost' => 540000,
            ],
            [
                'quot_number' => '000012501002',
                'section_cd_id' => 27,
                'proces_cd' => '30000030',  // 開発
                'employee_id' => 25,
                'quantity' => 6,
                'unit_cost' => 250000,
                'cost' => 1500000,
            ],
            [
                'quot_number' => '000012501002',
                'section_cd_id' => 27,
                'proces_cd' => '30000040',  // テスト
                'employee_id' => 26,
                'quantity' => 3,
                'unit_cost' => 100000,
                'cost' => 300000,
            ],
            [
                'quot_number' => '000012501002',
                'section_cd_id' => 27,
                'proces_cd' => '30000050',  // 保守（初期設定）
                'employee_id' => 24,
                'quantity' => 1,
                'unit_cost' => 110000,
                'cost' => 110000,
            ],

            // ========================================
            // (000042501002, 32) LP改修
            // UX編集センター(32)、設計者: employee_id 31
            // 合計: 380,000円
            // ========================================
            [
                'quot_number' => '000042501002',
                'section_cd_id' => 32,
                'proces_cd' => '20000010',  // デザイン
                'employee_id' => 31,
                'quantity' => 2,
                'unit_cost' => 100000,
                'cost' => 200000,
            ],
            [
                'quot_number' => '000042501002',
                'section_cd_id' => 32,
                'proces_cd' => '20000020',  // DTP
                'employee_id' => 32,
                'quantity' => 1,
                'unit_cost' => 60000,
                'cost' => 60000,
            ],
            [
                'quot_number' => '000042501002',
                'section_cd_id' => 32,
                'proces_cd' => '20000050',  // コピーライティング
                'employee_id' => 33,
                'quantity' => 2,
                'unit_cost' => 60000,
                'cost' => 120000,
            ],

            // ========================================
            // (000082501001, 32) 名刺デザイン
            // UX編集センター(32)、設計者: employee_id 32
            // 合計: 250,000円
            // ========================================
            [
                'quot_number' => '000082501001',
                'section_cd_id' => 32,
                'proces_cd' => '20000010',  // デザイン
                'employee_id' => 32,
                'quantity' => 1,
                'unit_cost' => 100000,
                'cost' => 100000,
            ],
            [
                'quot_number' => '000082501001',
                'section_cd_id' => 32,
                'proces_cd' => '20000020',  // DTP
                'employee_id' => 32,
                'quantity' => 1,
                'unit_cost' => 60000,
                'cost' => 60000,
            ],
            [
                'quot_number' => '000082501001',
                'section_cd_id' => 32,
                'proces_cd' => '10000020',  // 印刷
                'employee_id' => 30,
                'quantity' => 1,
                'unit_cost' => 90000,
                'cost' => 90000,
            ],

            // ========================================
            // (000042501004, 32) DM制作
            // UX編集センター(32)、設計者: employee_id 31
            // 合計: 420,000円
            // ========================================
            [
                'quot_number' => '000042501004',
                'section_cd_id' => 32,
                'proces_cd' => '20000010',  // デザイン
                'employee_id' => 31,
                'quantity' => 1,
                'unit_cost' => 100000,
                'cost' => 100000,
            ],
            [
                'quot_number' => '000042501004',
                'section_cd_id' => 32,
                'proces_cd' => '20000020',  // DTP
                'employee_id' => 32,
                'quantity' => 1,
                'unit_cost' => 60000,
                'cost' => 60000,
            ],
            [
                'quot_number' => '000042501004',
                'section_cd_id' => 32,
                'proces_cd' => '20000050',  // コピーライティング
                'employee_id' => 33,
                'quantity' => 1,
                'unit_cost' => 50000,
                'cost' => 50000,
            ],
            [
                'quot_number' => '000042501004',
                'section_cd_id' => 32,
                'proces_cd' => '10000010',  // 刷版
                'employee_id' => 30,
                'quantity' => 1,
                'unit_cost' => 50000,
                'cost' => 50000,
            ],
            [
                'quot_number' => '000042501004',
                'section_cd_id' => 32,
                'proces_cd' => '10000020',  // 印刷
                'employee_id' => 30,
                'quantity' => 1,
                'unit_cost' => 80000,
                'cost' => 80000,
            ],
            [
                'quot_number' => '000042501004',
                'section_cd_id' => 32,
                'proces_cd' => '10000050',  // 折り加工
                'employee_id' => 30,
                'quantity' => 1,
                'unit_cost' => 80000,
                'cost' => 80000,
            ],

            // ========================================
            // (000022501004, 27) データ分析基盤
            // 開発センター(27)、設計者: employee_id 25
            // 合計: 4,200,000円
            // ========================================
            [
                'quot_number' => '000022501004',
                'section_cd_id' => 27,
                'proces_cd' => '30000010',  // 要件定義
                'employee_id' => 25,
                'quantity' => 5,
                'unit_cost' => 200000,
                'cost' => 1000000,
            ],
            [
                'quot_number' => '000022501004',
                'section_cd_id' => 27,
                'proces_cd' => '30000020',  // 設計
                'employee_id' => 25,
                'quantity' => 5,
                'unit_cost' => 180000,
                'cost' => 900000,
            ],
            [
                'quot_number' => '000022501004',
                'section_cd_id' => 27,
                'proces_cd' => '30000030',  // 開発
                'employee_id' => 24,
                'quantity' => 7,
                'unit_cost' => 250000,
                'cost' => 1750000,
            ],
            [
                'quot_number' => '000022501004',
                'section_cd_id' => 27,
                'proces_cd' => '30000040',  // テスト
                'employee_id' => 26,
                'quantity' => 4,
                'unit_cost' => 100000,
                'cost' => 400000,
            ],
            [
                'quot_number' => '000022501004',
                'section_cd_id' => 27,
                'proces_cd' => '30000050',  // 保守
                'employee_id' => 24,
                'quantity' => 2,
                'unit_cost' => 75000,
                'cost' => 150000,
            ],

            // ========================================
            // (000042501006, 27) VPN構築
            // 開発センター(27)、設計者: employee_id 24
            // 合計: 1,650,000円
            // ========================================
            [
                'quot_number' => '000042501006',
                'section_cd_id' => 27,
                'proces_cd' => '30000010',  // 要件定義
                'employee_id' => 24,
                'quantity' => 2,
                'unit_cost' => 200000,
                'cost' => 400000,
            ],
            [
                'quot_number' => '000042501006',
                'section_cd_id' => 27,
                'proces_cd' => '30000020',  // 設計
                'employee_id' => 24,
                'quantity' => 3,
                'unit_cost' => 180000,
                'cost' => 540000,
            ],
            [
                'quot_number' => '000042501006',
                'section_cd_id' => 27,
                'proces_cd' => '30000030',  // 開発（構築）
                'employee_id' => 25,
                'quantity' => 2,
                'unit_cost' => 250000,
                'cost' => 500000,
            ],
            [
                'quot_number' => '000042501006',
                'section_cd_id' => 27,
                'proces_cd' => '30000040',  // テスト
                'employee_id' => 26,
                'quantity' => 2,
                'unit_cost' => 100000,
                'cost' => 200000,
            ],
            [
                'quot_number' => '000042501006',
                'section_cd_id' => 27,
                'proces_cd' => '30000050',  // 保守（初期設定）
                'employee_id' => 24,
                'quantity' => 1,
                'unit_cost' => 10000,
                'cost' => 10000,
            ],

            // ========================================
            // 見積ステータス「40:承認待ち」「50:承認済」「60:発行済」
            // → 制作見積ステータス「40:発行済」
            // 全て承認済、発行済のため詳細レコード完備
            // ========================================

            // ========================================
            // (000042501001, 27) アプリ開発
            // 開発センター(27)、合計: 4,400,000円
            // ========================================
            [
                'quot_number' => '000042501001',
                'section_cd_id' => 27,
                'proces_cd' => '30000010',  // 要件定義
                'employee_id' => 24,
                'quantity' => 5,
                'unit_cost' => 200000,
                'cost' => 1000000,
            ],
            [
                'quot_number' => '000042501001',
                'section_cd_id' => 27,
                'proces_cd' => '30000020',  // 設計
                'employee_id' => 24,
                'quantity' => 5,
                'unit_cost' => 180000,
                'cost' => 900000,
            ],
            [
                'quot_number' => '000042501001',
                'section_cd_id' => 27,
                'proces_cd' => '30000030',  // 開発
                'employee_id' => 25,
                'quantity' => 8,
                'unit_cost' => 250000,
                'cost' => 2000000,
            ],
            [
                'quot_number' => '000042501001',
                'section_cd_id' => 27,
                'proces_cd' => '30000040',  // テスト
                'employee_id' => 26,
                'quantity' => 5,
                'unit_cost' => 100000,
                'cost' => 500000,
            ],

            // ========================================
            // (000052501002, 27) Web保守契約
            // 開発センター(27)、合計: 960,000円
            // ========================================
            [
                'quot_number' => '000052501002',
                'section_cd_id' => 27,
                'proces_cd' => '30000050',  // 保守
                'employee_id' => 24,
                'quantity' => 12,
                'unit_cost' => 80000,
                'cost' => 960000,
            ],

            // ========================================
            // (000042501003, 32) 展示会ブース
            // UX編集センター(32)、合計: 1,760,000円
            // ========================================
            [
                'quot_number' => '000042501003',
                'section_cd_id' => 32,
                'proces_cd' => '20000010',  // デザイン
                'employee_id' => 31,
                'quantity' => 5,
                'unit_cost' => 100000,
                'cost' => 500000,
            ],
            [
                'quot_number' => '000042501003',
                'section_cd_id' => 32,
                'proces_cd' => '20000020',  // DTP
                'employee_id' => 32,
                'quantity' => 3,
                'unit_cost' => 60000,
                'cost' => 180000,
            ],
            [
                'quot_number' => '000042501003',
                'section_cd_id' => 32,
                'proces_cd' => '20000040',  // イラスト制作
                'employee_id' => 33,
                'quantity' => 4,
                'unit_cost' => 80000,
                'cost' => 320000,
            ],
            [
                'quot_number' => '000042501003',
                'section_cd_id' => 32,
                'proces_cd' => '10000010',  // 刷版
                'employee_id' => 30,
                'quantity' => 2,
                'unit_cost' => 60000,
                'cost' => 120000,
            ],
            [
                'quot_number' => '000042501003',
                'section_cd_id' => 32,
                'proces_cd' => '10000020',  // 印刷
                'employee_id' => 30,
                'quantity' => 4,
                'unit_cost' => 160000,
                'cost' => 640000,
            ],

            // ========================================
            // (000052501004, 32) カレンダー制作
            // UX編集センター(32)、合計: 360,000円
            // ========================================
            [
                'quot_number' => '000052501004',
                'section_cd_id' => 32,
                'proces_cd' => '20000010',  // デザイン
                'employee_id' => 31,
                'quantity' => 1,
                'unit_cost' => 80000,
                'cost' => 80000,
            ],
            [
                'quot_number' => '000052501004',
                'section_cd_id' => 32,
                'proces_cd' => '20000020',  // DTP
                'employee_id' => 32,
                'quantity' => 1,
                'unit_cost' => 40000,
                'cost' => 40000,
            ],
            [
                'quot_number' => '000052501004',
                'section_cd_id' => 32,
                'proces_cd' => '20000030',  // 撮影
                'employee_id' => 33,
                'quantity' => 1,
                'unit_cost' => 60000,
                'cost' => 60000,
            ],
            [
                'quot_number' => '000052501004',
                'section_cd_id' => 32,
                'proces_cd' => '10000020',  // 印刷
                'employee_id' => 30,
                'quantity' => 2,
                'unit_cost' => 90000,
                'cost' => 180000,
            ],

            // ========================================
            // (000032501005, 27) RPA導入支援
            // 開発センター(27)、合計: 2,560,000円
            // ========================================
            [
                'quot_number' => '000032501005',
                'section_cd_id' => 27,
                'proces_cd' => '30000010',  // 要件定義
                'employee_id' => 25,
                'quantity' => 4,
                'unit_cost' => 200000,
                'cost' => 800000,
            ],
            [
                'quot_number' => '000032501005',
                'section_cd_id' => 27,
                'proces_cd' => '30000020',  // 設計
                'employee_id' => 25,
                'quantity' => 4,
                'unit_cost' => 180000,
                'cost' => 720000,
            ],
            [
                'quot_number' => '000032501005',
                'section_cd_id' => 27,
                'proces_cd' => '30000030',  // 開発
                'employee_id' => 24,
                'quantity' => 3,
                'unit_cost' => 250000,
                'cost' => 750000,
            ],
            [
                'quot_number' => '000032501005',
                'section_cd_id' => 27,
                'proces_cd' => '30000040',  // テスト
                'employee_id' => 26,
                'quantity' => 2,
                'unit_cost' => 100000,
                'cost' => 200000,
            ],
            [
                'quot_number' => '000032501005',
                'section_cd_id' => 27,
                'proces_cd' => '30000050',  // 保守
                'employee_id' => 24,
                'quantity' => 1,
                'unit_cost' => 90000,
                'cost' => 90000,
            ],

            // ========================================
            // (000052501006, 27) EDR導入
            // 開発センター(27)、合計: 1,440,000円
            // ========================================
            [
                'quot_number' => '000052501006',
                'section_cd_id' => 27,
                'proces_cd' => '30000010',  // 要件定義
                'employee_id' => 24,
                'quantity' => 2,
                'unit_cost' => 200000,
                'cost' => 400000,
            ],
            [
                'quot_number' => '000052501006',
                'section_cd_id' => 27,
                'proces_cd' => '30000020',  // 設計
                'employee_id' => 24,
                'quantity' => 2,
                'unit_cost' => 180000,
                'cost' => 360000,
            ],
            [
                'quot_number' => '000052501006',
                'section_cd_id' => 27,
                'proces_cd' => '30000030',  // 開発（構築）
                'employee_id' => 25,
                'quantity' => 2,
                'unit_cost' => 250000,
                'cost' => 500000,
            ],
            [
                'quot_number' => '000052501006',
                'section_cd_id' => 27,
                'proces_cd' => '30000040',  // テスト
                'employee_id' => 26,
                'quantity' => 2,
                'unit_cost' => 90000,
                'cost' => 180000,
            ],

            // ========================================
            // (000052501001, 27) Webシステム保守
            // 開発センター(27)、合計: 1,440,000円
            // ========================================
            [
                'quot_number' => '000052501001',
                'section_cd_id' => 27,
                'proces_cd' => '30000050',  // 保守
                'employee_id' => 24,
                'quantity' => 12,
                'unit_cost' => 120000,
                'cost' => 1440000,
            ],

            // ========================================
            // (000062501001, 27) システム連携
            // 開発センター(27)、合計: 2,240,000円
            // ========================================
            [
                'quot_number' => '000062501001',
                'section_cd_id' => 27,
                'proces_cd' => '30000010',  // 要件定義
                'employee_id' => 25,
                'quantity' => 2,
                'unit_cost' => 200000,
                'cost' => 400000,
            ],
            [
                'quot_number' => '000062501001',
                'section_cd_id' => 27,
                'proces_cd' => '30000020',  // 設計
                'employee_id' => 25,
                'quantity' => 3,
                'unit_cost' => 180000,
                'cost' => 540000,
            ],
            [
                'quot_number' => '000062501001',
                'section_cd_id' => 27,
                'proces_cd' => '30000030',  // 開発
                'employee_id' => 24,
                'quantity' => 4,
                'unit_cost' => 250000,
                'cost' => 1000000,
            ],
            [
                'quot_number' => '000062501001',
                'section_cd_id' => 27,
                'proces_cd' => '30000040',  // テスト
                'employee_id' => 26,
                'quantity' => 3,
                'unit_cost' => 100000,
                'cost' => 300000,
            ],

            // ========================================
            // (000052501003, 32) ロゴデザイン
            // UX編集センター(32)、合計: 440,000円
            // ========================================
            [
                'quot_number' => '000052501003',
                'section_cd_id' => 32,
                'proces_cd' => '20000010',  // デザイン
                'employee_id' => 31,
                'quantity' => 3,
                'unit_cost' => 100000,
                'cost' => 300000,
            ],
            [
                'quot_number' => '000052501003',
                'section_cd_id' => 32,
                'proces_cd' => '20000020',  // DTP
                'employee_id' => 32,
                'quantity' => 1,
                'unit_cost' => 60000,
                'cost' => 60000,
            ],
            [
                'quot_number' => '000052501003',
                'section_cd_id' => 32,
                'proces_cd' => '20000040',  // イラスト制作
                'employee_id' => 33,
                'quantity' => 1,
                'unit_cost' => 80000,
                'cost' => 80000,
            ],

            // ========================================
            // (000062501002, 32) 封筒デザイン
            // UX編集センター(32)、合計: 224,000円
            // ========================================
            [
                'quot_number' => '000062501002',
                'section_cd_id' => 32,
                'proces_cd' => '20000010',  // デザイン
                'employee_id' => 31,
                'quantity' => 1,
                'unit_cost' => 60000,
                'cost' => 60000,
            ],
            [
                'quot_number' => '000062501002',
                'section_cd_id' => 32,
                'proces_cd' => '20000020',  // DTP
                'employee_id' => 32,
                'quantity' => 1,
                'unit_cost' => 40000,
                'cost' => 40000,
            ],
            [
                'quot_number' => '000062501002',
                'section_cd_id' => 32,
                'proces_cd' => '10000010',  // 刷版
                'employee_id' => 30,
                'quantity' => 1,
                'unit_cost' => 34000,
                'cost' => 34000,
            ],
            [
                'quot_number' => '000062501002',
                'section_cd_id' => 32,
                'proces_cd' => '10000020',  // 印刷
                'employee_id' => 30,
                'quantity' => 1,
                'unit_cost' => 90000,
                'cost' => 90000,
            ],

            // ========================================
            // (000062501003, 27) システム監視
            // 開発センター(27)、合計: 960,000円
            // ========================================
            [
                'quot_number' => '000062501003',
                'section_cd_id' => 27,
                'proces_cd' => '30000010',  // 要件定義
                'employee_id' => 24,
                'quantity' => 1,
                'unit_cost' => 150000,
                'cost' => 150000,
            ],
            [
                'quot_number' => '000062501003',
                'section_cd_id' => 27,
                'proces_cd' => '30000020',  // 設計
                'employee_id' => 24,
                'quantity' => 2,
                'unit_cost' => 150000,
                'cost' => 300000,
            ],
            [
                'quot_number' => '000062501003',
                'section_cd_id' => 27,
                'proces_cd' => '30000030',  // 開発（構築）
                'employee_id' => 25,
                'quantity' => 1,
                'unit_cost' => 200000,
                'cost' => 200000,
            ],
            [
                'quot_number' => '000062501003',
                'section_cd_id' => 27,
                'proces_cd' => '30000050',  // 保守
                'employee_id' => 24,
                'quantity' => 4,
                'unit_cost' => 77500,
                'cost' => 310000,
            ],

            // ========================================
            // (000062501004, 27) ファイルサーバー移行
            // 開発センター(27)、合計: 760,000円
            // ========================================
            [
                'quot_number' => '000062501004',
                'section_cd_id' => 27,
                'proces_cd' => '30000010',  // 要件定義
                'employee_id' => 25,
                'quantity' => 1,
                'unit_cost' => 200000,
                'cost' => 200000,
            ],
            [
                'quot_number' => '000062501004',
                'section_cd_id' => 27,
                'proces_cd' => '30000020',  // 設計
                'employee_id' => 25,
                'quantity' => 1,
                'unit_cost' => 180000,
                'cost' => 180000,
            ],
            [
                'quot_number' => '000062501004',
                'section_cd_id' => 27,
                'proces_cd' => '30000030',  // 開発（構築）
                'employee_id' => 24,
                'quantity' => 1,
                'unit_cost' => 200000,
                'cost' => 200000,
            ],
            [
                'quot_number' => '000062501004',
                'section_cd_id' => 27,
                'proces_cd' => '30000040',  // テスト
                'employee_id' => 26,
                'quantity' => 2,
                'unit_cost' => 90000,
                'cost' => 180000,
            ],

            // ========================================
            // (000062412001, 32) ホームページ制作
            // UX編集センター(32)、合計: 784,000円
            // ========================================
            [
                'quot_number' => '000062412001',
                'section_cd_id' => 32,
                'proces_cd' => '20000010',  // デザイン
                'employee_id' => 31,
                'quantity' => 3,
                'unit_cost' => 100000,
                'cost' => 300000,
            ],
            [
                'quot_number' => '000062412001',
                'section_cd_id' => 32,
                'proces_cd' => '20000020',  // DTP
                'employee_id' => 32,
                'quantity' => 2,
                'unit_cost' => 60000,
                'cost' => 120000,
            ],
            [
                'quot_number' => '000062412001',
                'section_cd_id' => 32,
                'proces_cd' => '20000050',  // コピーライティング
                'employee_id' => 33,
                'quantity' => 2,
                'unit_cost' => 62000,
                'cost' => 124000,
            ],
            [
                'quot_number' => '000062412001',
                'section_cd_id' => 32,
                'proces_cd' => '20000030',  // 撮影
                'employee_id' => 33,
                'quantity' => 2,
                'unit_cost' => 120000,
                'cost' => 240000,
            ],

            // ========================================
            // (000072412001, 27) Webシステム開発
            // 開発センター(27)、合計: 3,600,000円
            // ========================================
            [
                'quot_number' => '000072412001',
                'section_cd_id' => 27,
                'proces_cd' => '30000010',  // 要件定義
                'employee_id' => 24,
                'quantity' => 4,
                'unit_cost' => 200000,
                'cost' => 800000,
            ],
            [
                'quot_number' => '000072412001',
                'section_cd_id' => 27,
                'proces_cd' => '30000020',  // 設計
                'employee_id' => 24,
                'quantity' => 5,
                'unit_cost' => 180000,
                'cost' => 900000,
            ],
            [
                'quot_number' => '000072412001',
                'section_cd_id' => 27,
                'proces_cd' => '30000030',  // 開発
                'employee_id' => 25,
                'quantity' => 6,
                'unit_cost' => 250000,
                'cost' => 1500000,
            ],
            [
                'quot_number' => '000072412001',
                'section_cd_id' => 27,
                'proces_cd' => '30000040',  // テスト
                'employee_id' => 26,
                'quantity' => 4,
                'unit_cost' => 100000,
                'cost' => 400000,
            ],

            // ========================================
            // (000062412002, 32) 社内報制作
            // UX編集センター(32)、合計: 2,880,000円
            // ========================================
            [
                'quot_number' => '000062412002',
                'section_cd_id' => 32,
                'proces_cd' => '20000010',  // デザイン
                'employee_id' => 31,
                'quantity' => 12,
                'unit_cost' => 80000,
                'cost' => 960000,
            ],
            [
                'quot_number' => '000062412002',
                'section_cd_id' => 32,
                'proces_cd' => '20000020',  // DTP
                'employee_id' => 32,
                'quantity' => 12,
                'unit_cost' => 50000,
                'cost' => 600000,
            ],
            [
                'quot_number' => '000062412002',
                'section_cd_id' => 32,
                'proces_cd' => '20000050',  // コピーライティング
                'employee_id' => 33,
                'quantity' => 12,
                'unit_cost' => 40000,
                'cost' => 480000,
            ],
            [
                'quot_number' => '000062412002',
                'section_cd_id' => 32,
                'proces_cd' => '10000020',  // 印刷
                'employee_id' => 30,
                'quantity' => 12,
                'unit_cost' => 70000,
                'cost' => 840000,
            ],

            // ========================================
            // (000072411001, 32) 年賀状デザイン
            // UX編集センター(32)、合計: 144,000円
            // ========================================
            [
                'quot_number' => '000072411001',
                'section_cd_id' => 32,
                'proces_cd' => '20000010',  // デザイン
                'employee_id' => 31,
                'quantity' => 1,
                'unit_cost' => 50000,
                'cost' => 50000,
            ],
            [
                'quot_number' => '000072411001',
                'section_cd_id' => 32,
                'proces_cd' => '20000020',  // DTP
                'employee_id' => 32,
                'quantity' => 1,
                'unit_cost' => 30000,
                'cost' => 30000,
            ],
            [
                'quot_number' => '000072411001',
                'section_cd_id' => 32,
                'proces_cd' => '10000020',  // 印刷
                'employee_id' => 30,
                'quantity' => 1,
                'unit_cost' => 64000,
                'cost' => 64000,
            ],

            // ========================================
            // (000072412002, 27) グループウェア導入
            // 開発センター(27)、合計: 2,000,000円
            // ========================================
            [
                'quot_number' => '000072412002',
                'section_cd_id' => 27,
                'proces_cd' => '30000010',  // 要件定義
                'employee_id' => 25,
                'quantity' => 3,
                'unit_cost' => 200000,
                'cost' => 600000,
            ],
            [
                'quot_number' => '000072412002',
                'section_cd_id' => 27,
                'proces_cd' => '30000020',  // 設計
                'employee_id' => 25,
                'quantity' => 3,
                'unit_cost' => 180000,
                'cost' => 540000,
            ],
            [
                'quot_number' => '000072412002',
                'section_cd_id' => 27,
                'proces_cd' => '30000030',  // 開発（構築）
                'employee_id' => 24,
                'quantity' => 2,
                'unit_cost' => 250000,
                'cost' => 500000,
            ],
            [
                'quot_number' => '000072412002',
                'section_cd_id' => 27,
                'proces_cd' => '30000040',  // テスト
                'employee_id' => 26,
                'quantity' => 2,
                'unit_cost' => 80000,
                'cost' => 160000,
            ],
            [
                'quot_number' => '000072412002',
                'section_cd_id' => 27,
                'proces_cd' => '30000050',  // 保守
                'employee_id' => 24,
                'quantity' => 2,
                'unit_cost' => 100000,
                'cost' => 200000,
            ],

            // ========================================
            // (000082412001, 27) PC入替支援
            // 開発センター(27)、合計: 1,760,000円
            // ========================================
            [
                'quot_number' => '000082412001',
                'section_cd_id' => 27,
                'proces_cd' => '30000010',  // 要件定義
                'employee_id' => 24,
                'quantity' => 2,
                'unit_cost' => 200000,
                'cost' => 400000,
            ],
            [
                'quot_number' => '000082412001',
                'section_cd_id' => 27,
                'proces_cd' => '30000020',  // 設計
                'employee_id' => 24,
                'quantity' => 2,
                'unit_cost' => 180000,
                'cost' => 360000,
            ],
            [
                'quot_number' => '000082412001',
                'section_cd_id' => 27,
                'proces_cd' => '30000030',  // 開発（セットアップ）
                'employee_id' => 25,
                'quantity' => 3,
                'unit_cost' => 250000,
                'cost' => 750000,
            ],
            [
                'quot_number' => '000082412001',
                'section_cd_id' => 27,
                'proces_cd' => '30000040',  // テスト
                'employee_id' => 26,
                'quantity' => 3,
                'unit_cost' => 83333,
                'cost' => 250000,
            ],
        ];

        $insertedCount = 0;
        foreach ($prodQuotDetails as $detail) {
            // (quot_number, section_cd_id)をprod_quot_request_idに変換
            $quotNumber = $detail['quot_number'];
            $sectionCdId = $detail['section_cd_id'];
            $procesCd = $detail['proces_cd'];
            unset($detail['quot_number'], $detail['section_cd_id'], $detail['proces_cd']);

            $key = $quotNumber.'_'.$sectionCdId;
            $prodQuotRequestId = $prodQuotRequestIdMap[$key] ?? null;
            $procesCdId = $procesCdIdMap[$procesCd] ?? null;

            if ($prodQuotRequestId && $procesCdId) {
                DB::table('prod_quot_details')->insert(array_merge($detail, [
                    'prod_quot_request_id' => $prodQuotRequestId,
                    'proces_cd_id' => $procesCdId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]));
                $insertedCount++;
            }
        }

        $this->command->info('制作見積詳細テーブルに '.$insertedCount.' 件のデータを投入しました。');
    }
}
