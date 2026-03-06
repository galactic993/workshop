<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            [
                'permission_key' => 'sales.quotes.create',
                'permission_name' => '売上管理-見積-見積書作成',
            ],
            [
                'permission_key' => 'sales.quotes.approve',
                'permission_name' => '売上管理-見積-見積書承認',
            ],
            [
                'permission_key' => 'sales.quotes.issue',
                'permission_name' => '売上管理-見積-見積書発行',
            ],
            [
                'permission_key' => 'sales.orders.create',
                'permission_name' => '売上管理-受注-登録',
            ],
            [
                'permission_key' => 'sales.orders.import',
                'permission_name' => '売上管理-受注-取込',
            ],
            [
                'permission_key' => 'sales.orders.customer',
                'permission_name' => '売上管理-受注-部署別得意先',
            ],
            [
                'permission_key' => 'sales.orders.customer-report',
                'permission_name' => '売上管理-受注-受注週報(得意先別)',
            ],
            [
                'permission_key' => 'sales.orders.section-report',
                'permission_name' => '売上管理-受注-受注週報(部署別)',
            ],
            [
                'permission_key' => 'sales.revenue.work-in-progress',
                'permission_name' => '売上管理-売上-仕掛作業中工番一覧',
            ],
            [
                'permission_key' => 'sales.revenue.completed-work',
                'permission_name' => '売上管理-売上-作業完了状況工番一覧',
            ],
            [
                'permission_key' => 'sales.revenue.internal-purchase',
                'permission_name' => '売上管理-売上-社内仕入',
            ],
            [
                'permission_key' => 'sales.revenue.internal-purchase-cancel',
                'permission_name' => '売上管理-売上-社内仕入取消',
            ],
            [
                'permission_key' => 'sales.revenue.posting',
                'permission_name' => '売上管理-売上-売上計上',
            ],
            [
                'permission_key' => 'sales.revenue.customer-prices',
                'permission_name' => '売上管理-売上-顧客売価明細・一覧',
            ],
            [
                'permission_key' => 'sales.revenue.forecast-statement',
                'permission_name' => '売上管理-売上-見込生産売上収支表',
            ],
            [
                'permission_key' => 'sales.revenue.estimate-list',
                'permission_name' => '売上管理-売上-概算売上一覧',
            ],
            [
                'permission_key' => 'sales.monthly.shipping-costs',
                'permission_name' => '売上管理-月次-得意先別発送費',
            ],
            [
                'permission_key' => 'sales.monthly.inventory-amount',
                'permission_name' => '売上管理-月次-製品在庫金額',
            ],
            [
                'permission_key' => 'sales.monthly.import-budgets',
                'permission_name' => '売上管理-月次-計画値取込',
            ],
            [
                'permission_key' => 'sales.monthly.aggregate',
                'permission_name' => '売上管理-月次-月次資料集計',
            ],
            [
                'permission_key' => 'editorial.prod-quote.create',
                'permission_name' => '編集管理-制作見積書-登録',
            ],
            [
                'permission_key' => 'editorial.prod-quote.approve',
                'permission_name' => '編集管理-制作見積書-承認',
            ],
            [
                'permission_key' => 'editorial.prod-quote.issue',
                'permission_name' => '編集管理-制作見積書-発行',
            ],
            [
                'permission_key' => 'editorial.work-request.receipt',
                'permission_name' => '編集管理-作業受付-受付',
            ],
            [
                'permission_key' => 'editorial.work-plan.assign',
                'permission_name' => '編集管理-作業計画-作業割振',
            ],
            [
                'permission_key' => 'editorial.work-plan.operation',
                'permission_name' => '編集管理-作業計画-作業項目',
            ],
            [
                'permission_key' => 'editorial.work-plan.person',
                'permission_name' => '編集管理-作業計画-担当者',
            ],
            [
                'permission_key' => 'editorial.work-plan.arrange',
                'permission_name' => '編集管理-作業計画-作業手配',
            ],
            [
                'permission_key' => 'editorial.work-report.work-report',
                'permission_name' => '編集管理-作業実績-作業実績',
            ],
            [
                'permission_key' => 'editorial.work-complete.work-complete',
                'permission_name' => '編集管理-作業完了-作業完了',
            ],
            [
                'permission_key' => 'editorial.monthly.output',
                'permission_name' => '編集管理-月次-生産高登録',
            ],
            [
                'permission_key' => 'editorial.monthly.form',
                'permission_name' => '編集管理-月次-帳票',
            ],
            [
                'permission_key' => 'editorial.monthly.analysis',
                'permission_name' => '編集管理-月次-分析',
            ],
            [
                'permission_key' => 'editorial.master.rank-unit-cost',
                'permission_name' => '編集管理-マスタ管理-ランク単価',
            ],
            [
                'permission_key' => 'editorial.master.person-rank',
                'permission_name' => '編集管理-マスタ管理-個人別ランク単価',
            ],
            [
                'permission_key' => 'editorial.master.cost',
                'permission_name' => '編集管理-マスタ管理-原価単価',
            ],
            [
                'permission_key' => 'printing.quotes.quotes',
                'permission_name' => '印刷管理-印刷見積-印刷見積',
            ],
            [
                'permission_key' => 'printing.work-plan.receipt',
                'permission_name' => '印刷管理-作業計画-受付',
            ],
            [
                'permission_key' => 'printing.work-plan.complete-schedule',
                'permission_name' => '印刷管理-作業計画-製品完了予定',
            ],
            [
                'permission_key' => 'printing.work-report.work-report',
                'permission_name' => '印刷管理-作業実績-作業実績',
            ],
            [
                'permission_key' => 'printing.work-complete.work-complete',
                'permission_name' => '印刷管理-作業完了-作業完了',
            ],
            [
                'permission_key' => 'printing.monthly.order-info',
                'permission_name' => '印刷管理-月次-印刷受注工番情報一覧',
            ],
            [
                'permission_key' => 'printing.monthly.inventory-amount',
                'permission_name' => '印刷管理-月次-仕掛在庫金額一覧',
            ],
            [
                'permission_key' => 'printing.monthly.completed-work',
                'permission_name' => '印刷管理-月次-作業完了一覧',
            ],
            [
                'permission_key' => 'logistics.receiving.schedule',
                'permission_name' => '物流・倉庫管理-入荷-入荷予定',
            ],
            [
                'permission_key' => 'logistics.receiving.record',
                'permission_name' => '物流・倉庫管理-入荷-入荷実績',
            ],
            [
                'permission_key' => 'logistics.inventory.disporsal',
                'permission_name' => '物流・倉庫管理-在庫-在庫廃棄',
            ],
            [
                'permission_key' => 'logistics.inventory.location',
                'permission_name' => '物流・倉庫管理-在庫-ロケーション番号登録',
            ],
            [
                'permission_key' => 'logistics.inventory.manage-form',
                'permission_name' => '物流・倉庫管理-在庫-製品管理表',
            ],
            [
                'permission_key' => 'logistics.inventory.inventory-info',
                'permission_name' => '物流・倉庫管理-在庫-在庫情報一覧',
            ],
            [
                'permission_key' => 'logistics.inventory.aged-inventory',
                'permission_name' => '物流・倉庫管理-在庫-長期在庫',
            ],
            [
                'permission_key' => 'logistics.stocktake.import',
                'permission_name' => '物流・倉庫管理-棚卸-棚卸結果取込',
            ],
            [
                'permission_key' => 'logistics.stocktake.result',
                'permission_name' => '物流・倉庫管理-棚卸-棚卸結果一覧',
            ],
            [
                'permission_key' => 'logistics.shipping.order',
                'permission_name' => '物流・倉庫管理-出荷-出荷指示',
            ],
            [
                'permission_key' => 'logistics.shipping.arrange',
                'permission_name' => '物流・倉庫管理-出荷-出荷手配',
            ],
            [
                'permission_key' => 'logistics.shipping.operation',
                'permission_name' => '物流・倉庫管理-出荷-出荷作業',
            ],
            [
                'permission_key' => 'logistics.shipping.record',
                'permission_name' => '物流・倉庫管理-出荷-出荷実績',
            ],
            [
                'permission_key' => 'logistics.master.destination',
                'permission_name' => '物流・倉庫管理-マスタ管理-宛先マスタ',
            ],
            [
                'permission_key' => 'logistics.master.carrier',
                'permission_name' => '物流・倉庫管理-マスタ管理-配送業者マスタ',
            ],
            [
                'permission_key' => 'logistics.master.shipping-rate',
                'permission_name' => '物流・倉庫管理-マスタ管理-運賃・梱包費マスタ',
            ],
            [
                'permission_key' => 'logistics.master.location',
                'permission_name' => '物流・倉庫管理-マスタ管理-ロケーション番号マスタ',
            ],
            [
                'permission_key' => 'logistics.monthly.carrier-summary',
                'permission_name' => '物流・倉庫管理-月次-配送業者別集計一覧',
            ],
            [
                'permission_key' => 'logistics.monthly.shipping-cost',
                'permission_name' => '物流・倉庫管理-月次-発送費・梱包費情報一覧',
            ],
            [
                'permission_key' => 'logistics.monthly.warehouse-fee',
                'permission_name' => '物流・倉庫管理-月次-倉庫料情報一覧',
            ],
            [
                'permission_key' => 'it-assets.it-assets.hardware',
                'permission_name' => 'IT資産管理-IT資産管理-ハードウェア管理',
            ],
            [
                'permission_key' => 'it-assets.it-assets.software',
                'permission_name' => 'IT資産管理-IT資産管理-ソフトウェア管理',
            ],
            [
                'permission_key' => 'it-assets.it-assets.peripheral',
                'permission_name' => 'IT資産管理-IT資産管理-周辺機器管理',
            ],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['permission_key' => $permission['permission_key']],
                ['permission_name' => $permission['permission_name']]
            );
        }

        $this->command->info('権限マスタに '.count($permissions).' 件のデータを投入/更新しました。');
    }
}
