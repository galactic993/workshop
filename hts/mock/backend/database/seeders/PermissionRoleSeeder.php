<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 権限をキーで取得できるようにマッピング
        $permissions = Permission::all()->keyBy('permission_key');

        // 役割別の権限割当データ
        $rolePermissions = [
            // 1. システム管理 - 権限割当なし
            // システムレベルのアクセス権限を持つため、個別の権限割当は不要

            // 2. 財務 - IT資産管理全般
            2 => [
                'it-assets.it-assets.hardware',
                'it-assets.it-assets.software',
                'it-assets.it-assets.peripheral',
            ],

            // 3. 管理 - 割当なし

            // 4. 品質保証 - 割当なし

            // 5. 総務
            5 => [
                'sales.orders.create',                  // 受注登録
                'sales.revenue.internal-purchase',      // 社内仕入
                'sales.revenue.posting',                // 売上計上
                'sales.revenue.work-in-progress',       // 仕掛作業中工番一覧
                'sales.revenue.completed-work',         // 作業完了状況工番一覧
                'sales.revenue.customer-prices',        // 顧客売価明細・一覧
                'sales.revenue.forecast-statement',     // 見込生産売上収支表
                'sales.revenue.estimate-list',          // 概算売上一覧
            ],

            // 6. 人事 - 編集管理月次分析 + 総務と同様
            6 => [
                'editorial.monthly.analysis',           // 編集管理月次分析
                'sales.orders.create',                  // 受注登録
                'sales.revenue.internal-purchase',      // 社内仕入
                'sales.revenue.posting',                // 売上計上
                'sales.revenue.work-in-progress',       // 仕掛作業中工番一覧
                'sales.revenue.completed-work',         // 作業完了状況工番一覧
                'sales.revenue.customer-prices',        // 顧客売価明細・一覧
                'sales.revenue.forecast-statement',     // 見込生産売上収支表
                'sales.revenue.estimate-list',          // 概算売上一覧
            ],

            // 7. 経営分析
            7 => [
                'sales.orders.create',                  // 受注登録
                'sales.orders.import',                  // 受注取込
                'sales.orders.section-report',          // 受注週報（部署別）
                'sales.revenue.internal-purchase',      // 社内仕入
                'sales.revenue.internal-purchase-cancel', // 社内仕入取消
                'sales.revenue.posting',                // 売上計上
                'sales.revenue.customer-prices',        // 顧客売価明細・一覧
                'sales.revenue.forecast-statement',     // 見込生産売上収支表
                'sales.revenue.estimate-list',          // 概算売上一覧
                'sales.revenue.work-in-progress',       // 仕掛作業中工番一覧
                'sales.revenue.completed-work',         // 作業完了状況工番一覧
                'sales.monthly.inventory-amount',       // 売上管理月次製品在庫金額
                'sales.monthly.import-budgets',         // 計画値取込
                'sales.monthly.aggregate',              // 売上管理月次月次資料集計
                'logistics.inventory.disporsal',        // 在庫廃棄
                'logistics.inventory.inventory-info',   // 在庫情報一覧
                'logistics.inventory.aged-inventory',   // 長期在庫
            ],

            // 8. IT管理 - IT資産管理全般
            8 => [
                'it-assets.it-assets.hardware',
                'it-assets.it-assets.software',
                'it-assets.it-assets.peripheral',
            ],

            // 9. 横浜管理
            9 => [
                'sales.orders.create',                  // 受注登録
                'editorial.monthly.form',               // 編集管理月次帳票
            ],

            // 10. 総務・経理（本社以外）
            10 => [
                'logistics.shipping.record',            // 物流倉庫管理出荷実績
                'logistics.monthly.shipping-cost',      // 物流倉庫月次発送費・梱包費情報一覧
            ],

            // 11. 営業所長
            11 => [
                'sales.quotes.create',                  // 見積書作成
                'sales.quotes.approve',                 // 見積書承認
                'sales.quotes.issue',                   // 見積書発行
                'sales.orders.create',                  // 受注登録
                'sales.orders.import',                  // 受注取込
                'sales.revenue.internal-purchase',      // 社内仕入
                'sales.revenue.posting',                // 売上計上
                'sales.revenue.customer-prices',        // 顧客売価明細・一覧
                'sales.revenue.forecast-statement',     // 見込生産売上収支表
                'sales.revenue.estimate-list',          // 概算売上一覧
                'sales.revenue.work-in-progress',       // 仕掛作業中工番一覧
                'sales.revenue.completed-work',         // 作業完了状況工番一覧
                'printing.quotes.quotes',               // 印刷管理印刷見積
                'logistics.receiving.schedule',         // 物流倉庫入荷予定
                'logistics.inventory.disporsal',        // 物流倉庫在庫廃棄
                'logistics.inventory.inventory-info',   // 物流倉庫在庫情報一覧
                'logistics.inventory.aged-inventory',   // 長期在庫
                'logistics.shipping.order',             // 出荷指示
                'logistics.shipping.record',            // 出荷実績
                'logistics.master.destination',         // 宛先マスタ
                'logistics.monthly.shipping-cost',      // 発送費・梱包費情報一覧
                'logistics.monthly.warehouse-fee',      // 倉庫料情報一覧
            ],

            // 12. 営業担当 - 営業所長から長期在庫、見積書承認を除いたもの
            12 => [
                'sales.quotes.create',                  // 見積書作成
                'sales.quotes.issue',                   // 見積書発行
                'sales.orders.create',                  // 受注登録
                'sales.orders.import',                  // 受注取込
                'sales.revenue.internal-purchase',      // 社内仕入
                'sales.revenue.posting',                // 売上計上
                'sales.revenue.customer-prices',        // 顧客売価明細・一覧
                'sales.revenue.forecast-statement',     // 見込生産売上収支表
                'sales.revenue.estimate-list',          // 概算売上一覧
                'sales.revenue.work-in-progress',       // 仕掛作業中工番一覧
                'sales.revenue.completed-work',         // 作業完了状況工番一覧
                'printing.quotes.quotes',               // 印刷管理印刷見積
                'logistics.receiving.schedule',         // 物流倉庫入荷予定
                'logistics.inventory.disporsal',        // 物流倉庫在庫廃棄
                'logistics.inventory.inventory-info',   // 物流倉庫在庫情報一覧
                // 長期在庫は除外
                'logistics.shipping.order',             // 出荷指示
                'logistics.shipping.record',            // 出荷実績
                'logistics.master.destination',         // 宛先マスタ
                'logistics.monthly.shipping-cost',      // 発送費・梱包費情報一覧
                'logistics.monthly.warehouse-fee',      // 倉庫料情報一覧
            ],

            // 13. 営業事務
            13 => [
                'sales.orders.customer',                // 部署別得意先
                'sales.orders.customer-report',         // 受注週報得意先別
                'sales.revenue.customer-prices',        // 顧客売価明細・一覧
                'sales.revenue.forecast-statement',     // 見込生産売上収支表
                'sales.revenue.estimate-list',          // 概算売上一覧
                'sales.revenue.work-in-progress',       // 仕掛作業中工番一覧
                'sales.revenue.completed-work',         // 作業完了状況工番一覧
                'sales.monthly.shipping-costs',         // 得意先別発送費
                'sales.monthly.inventory-amount',       // 売上管理月次製品在庫金額
                'sales.monthly.aggregate',              // 売上管理月次月次資料集計
                'logistics.monthly.shipping-cost',      // 物流倉庫月次発送費・梱包費情報一覧
                'logistics.monthly.warehouse-fee',      // 倉庫料情報一覧
            ],

            // 14. 編集所長 - 編集管理すべて
            14 => [
                'editorial.prod-quote.create',          // 制作見積書-登録
                'editorial.prod-quote.approve',         // 制作見積書-承認
                'editorial.prod-quote.issue',           // 制作見積書-発行
                'editorial.work-request.receipt',       // 作業受付-受付
                'editorial.work-plan.assign',           // 作業計画-作業割振
                'editorial.work-plan.operation',        // 作業計画-作業項目
                'editorial.work-plan.person',           // 作業計画-担当者
                'editorial.work-plan.arrange',          // 作業計画-作業手配
                'editorial.work-report.work-report',    // 作業実績-作業実績
                'editorial.work-complete.work-complete', // 作業完了-作業完了
                'editorial.monthly.output',             // 月次-生産高登録
                'editorial.monthly.form',               // 月次-帳票
                'editorial.monthly.analysis',           // 月次-分析
                'editorial.master.rank-unit-cost',      // マスタ管理-ランク単価
                'editorial.master.person-rank',         // マスタ管理-個人別ランク単価
                'editorial.master.cost',                // マスタ管理-原価単価
            ],

            // 15. 編集チームリーダー - 編集所長から制作見積書承認、作業完了、月次帳票を除いたもの
            15 => [
                'editorial.prod-quote.create',          // 制作見積書-登録
                // 制作見積書-承認は除外
                'editorial.prod-quote.issue',           // 制作見積書-発行
                'editorial.work-request.receipt',       // 作業受付-受付
                'editorial.work-plan.assign',           // 作業計画-作業割振
                'editorial.work-plan.operation',        // 作業計画-作業項目
                'editorial.work-plan.person',           // 作業計画-担当者
                'editorial.work-plan.arrange',          // 作業計画-作業手配
                'editorial.work-report.work-report',    // 作業実績-作業実績
                // 作業完了-作業完了は除外
                'editorial.monthly.output',             // 月次-生産高登録
                // 月次-帳票は除外
                'editorial.monthly.analysis',           // 月次-分析
                'editorial.master.rank-unit-cost',      // マスタ管理-ランク単価
                'editorial.master.person-rank',         // マスタ管理-個人別ランク単価
                'editorial.master.cost',                // マスタ管理-原価単価
            ],

            // 16. 編集マニュアルエディタ - 編集チームリーダーから月次分析、マスタ管理を除いたもの
            16 => [
                'editorial.prod-quote.create',          // 制作見積書-登録
                'editorial.prod-quote.issue',           // 制作見積書-発行
                'editorial.work-request.receipt',       // 作業受付-受付
                'editorial.work-plan.assign',           // 作業計画-作業割振
                'editorial.work-plan.operation',        // 作業計画-作業項目
                'editorial.work-plan.person',           // 作業計画-担当者
                'editorial.work-plan.arrange',          // 作業計画-作業手配
                'editorial.work-report.work-report',    // 作業実績-作業実績
                'editorial.monthly.output',             // 月次-生産高登録
                // 月次-分析は除外
                // マスタ管理（ランク単価、個人別ランク単価、原価単価）は除外
            ],

            // 17. 編集翻訳コーディネーター - 編集マニュアルエディタと同じ
            17 => [
                'editorial.prod-quote.create',          // 制作見積書-登録
                'editorial.prod-quote.issue',           // 制作見積書-発行
                'editorial.work-request.receipt',       // 作業受付-受付
                'editorial.work-plan.assign',           // 作業計画-作業割振
                'editorial.work-plan.operation',        // 作業計画-作業項目
                'editorial.work-plan.person',           // 作業計画-担当者
                'editorial.work-plan.arrange',          // 作業計画-作業手配
                'editorial.work-report.work-report',    // 作業実績-作業実績
                'editorial.monthly.output',             // 月次-生産高登録
            ],

            // 18. 編集担当 - 作業実績のみ
            18 => [
                'editorial.work-report.work-report',    // 作業実績-作業実績
            ],

            // 19. 編集以外所長 - 編集所長から作業計画担当者、作業実績、月次分析、マスタ管理を除いたもの
            19 => [
                'editorial.prod-quote.create',          // 制作見積書-登録
                'editorial.prod-quote.approve',         // 制作見積書-承認
                'editorial.prod-quote.issue',           // 制作見積書-発行
                'editorial.work-request.receipt',       // 作業受付-受付
                'editorial.work-plan.assign',           // 作業計画-作業割振
                'editorial.work-plan.operation',        // 作業計画-作業項目
                // 作業計画-担当者は除外
                'editorial.work-plan.arrange',          // 作業計画-作業手配
                // 作業実績-作業実績は除外
                'editorial.work-complete.work-complete', // 作業完了-作業完了
                'editorial.monthly.output',             // 月次-生産高登録
                'editorial.monthly.form',               // 月次-帳票
                // 月次-分析は除外
                // マスタ管理（ランク単価、個人別ランク単価、原価単価）は除外
            ],

            // 20. 編集以外チームリーダー - 編集以外所長から制作見積書承認、作業完了、月次帳票を除いたもの
            20 => [
                'editorial.prod-quote.create',          // 制作見積書-登録
                // 制作見積書-承認は除外
                'editorial.prod-quote.issue',           // 制作見積書-発行
                'editorial.work-request.receipt',       // 作業受付-受付
                'editorial.work-plan.assign',           // 作業計画-作業割振
                'editorial.work-plan.operation',        // 作業計画-作業項目
                'editorial.work-plan.arrange',          // 作業計画-作業手配
                // 作業完了-作業完了は除外
                'editorial.monthly.output',             // 月次-生産高登録
                // 月次-帳票は除外
            ],

            // 21. 編集以外システムエンジニア - 編集以外チームリーダーと同じ
            21 => [
                'editorial.prod-quote.create',          // 制作見積書-登録
                'editorial.prod-quote.issue',           // 制作見積書-発行
                'editorial.work-request.receipt',       // 作業受付-受付
                'editorial.work-plan.assign',           // 作業計画-作業割振
                'editorial.work-plan.operation',        // 作業計画-作業項目
                'editorial.work-plan.arrange',          // 作業計画-作業手配
                'editorial.monthly.output',             // 月次-生産高登録
            ],

            // 22. 編集以外ウェブディレクター - 編集以外チームリーダーと同じ
            22 => [
                'editorial.prod-quote.create',          // 制作見積書-登録
                'editorial.prod-quote.issue',           // 制作見積書-発行
                'editorial.work-request.receipt',       // 作業受付-受付
                'editorial.work-plan.assign',           // 作業計画-作業割振
                'editorial.work-plan.operation',        // 作業計画-作業項目
                'editorial.work-plan.arrange',          // 作業計画-作業手配
                'editorial.monthly.output',             // 月次-生産高登録
            ],

            // 23. 印刷千葉管理 - 割当なし

            // 24. 印刷印刷管理
            24 => [
                'printing.quotes.quotes',               // 印刷見積
                'printing.work-plan.receipt',           // 印刷作業計画受付
                'printing.work-plan.complete-schedule', // 製品完了予定
                'printing.work-report.work-report',     // 印刷作業実績
                'printing.work-complete.work-complete', // 印刷作業完了
                'printing.monthly.order-info',          // 印刷管理月次-印刷受注工番情報一覧
                'printing.monthly.inventory-amount',    // 印刷管理月次-仕掛在庫金額一覧
                'printing.monthly.completed-work',      // 印刷管理月次-完了作業一覧
            ],

            // 25. 印刷調達 - 割当なし

            // 26. 印刷IP - 印刷管理作業実績のみ
            26 => [
                'printing.work-report.work-report',     // 印刷作業実績
            ],

            // 27. 印刷刷版 - 印刷管理作業実績のみ
            27 => [
                'printing.work-report.work-report',     // 印刷作業実績
            ],

            // 28. 印刷印刷 - 印刷管理作業実績のみ
            28 => [
                'printing.work-report.work-report',     // 印刷作業実績
            ],

            // 29. 印刷製本 - 印刷管理作業実績のみ
            29 => [
                'printing.work-report.work-report',     // 印刷作業実績
            ],

            // 30. 配送
            30 => [
                'logistics.receiving.schedule',         // 物流倉庫入荷予定
                'logistics.receiving.record',           // 入荷実績
                'logistics.inventory.location',         // ロケーション番号登録
                'logistics.inventory.manage-form',      // 製品管理表
                'logistics.inventory.disporsal',        // 在庫廃棄
                'logistics.inventory.inventory-info',   // 在庫情報一覧
                'logistics.shipping.arrange',           // 出荷手配
                'logistics.shipping.operation',         // 出荷作業
                'logistics.shipping.record',            // 出荷実績
                'logistics.master.carrier',             // 配送業者マスタ
                'logistics.master.shipping-rate',       // 運賃・梱包費マスタ
                'logistics.master.location',            // ロケーション番号マスタ
                'logistics.monthly.carrier-summary',    // 物流倉庫管理月次-配送業者別集計一覧
                'logistics.monthly.shipping-cost',      // 物流倉庫管理月次-発送費・梱包費情報一覧
                'logistics.monthly.warehouse-fee',      // 物流倉庫管理月次-倉庫料情報一覧
            ],
        ];

        // 既存データを削除
        DB::table('permission_role')->truncate();
        $this->command->info('既存の権限割当データを削除しました。');

        $permissionRoleId = 1;
        $insertedCount = 0;

        foreach ($rolePermissions as $roleId => $permissionKeys) {
            foreach ($permissionKeys as $permissionKey) {
                if (! isset($permissions[$permissionKey])) {
                    $this->command->warn("警告: 権限キー '{$permissionKey}' が見つかりません");

                    continue;
                }

                DB::table('permission_role')->insert([
                    'permission_role_id' => $permissionRoleId++,
                    'role_id' => $roleId,
                    'permission_id' => $permissions[$permissionKey]->permission_id,
                    'updated_at' => now(),
                ]);

                $insertedCount++;
            }
        }

        $this->command->info("権限割当テーブルに {$insertedCount} 件のデータを投入しました。");
    }
}
