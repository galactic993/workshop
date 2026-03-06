/**
 * サイドメニュー構造定義
 *
 * 最大3階層の階層構造を持つメニュー項目を定義します。
 * この定義はサイドメニューとブレッドクラムで共有されます。
 */

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  permissionPrefix?: string; // 権限判定用（空の場合は全員表示）
  children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  {
    id: 'portal',
    label: 'ポータル',
    href: '/',
    // permissionPrefix なし = 全員表示
  },
  {
    id: 'sales',
    label: '売上管理',
    href: '/sales',
    permissionPrefix: 'sales.',
    children: [
      {
        id: 'sales-quotes',
        label: '見積',
        href: '/sales/quotes',
        permissionPrefix: 'sales.quotes.',
        children: [
          {
            id: 'sales-quotes-create',
            label: '見積書作成',
            href: '/sales/quotes/create',
            permissionPrefix: 'sales.quotes.create',
          },
          {
            id: 'sales-quotes-approve',
            label: '見積書承認',
            href: '/sales/quotes/approve',
            permissionPrefix: 'sales.quotes.approve',
          },
          {
            id: 'sales-quotes-issue',
            label: '見積書発行',
            href: '/sales/quotes/issue',
            permissionPrefix: 'sales.quotes.issue',
          },
        ],
      },
      {
        id: 'sales-orders',
        label: '受注',
        href: '/sales/orders',
        permissionPrefix: 'sales.orders.',
        children: [
          {
            id: 'sales-orders-create',
            label: '受注情報登録',
            href: '/sales/orders/create',
            permissionPrefix: 'sales.orders.create',
          },
          {
            id: 'sales-orders-import',
            label: '受注情報取込',
            href: '/sales/orders/import',
            permissionPrefix: 'sales.orders.import',
          },
          {
            id: 'sales-orders-customer',
            label: '部署別得意先メンテナンス',
            href: '/sales/orders/customer',
            permissionPrefix: 'sales.orders.customer',
          },
          {
            id: 'sales-orders-customer-report',
            label: '受注週報(得意先別)',
            href: '/sales/orders/customer-report',
            permissionPrefix: 'sales.orders.customer-report',
          },
          {
            id: 'sales-orders-section-report',
            label: '受注週報(部署別)',
            href: '/sales/orders/section-report',
            permissionPrefix: 'sales.orders.section-report',
          },
        ],
      },
      {
        id: 'sales-revenue',
        label: '売上',
        href: '/sales/revenue',
        permissionPrefix: 'sales.revenue.',
        children: [
          {
            id: 'sales-revenue-work-in-progress',
            label: '仕掛作業中工番一覧',
            href: '/sales/revenue/work-in-progress',
            permissionPrefix: 'sales.revenue.work-in-progress',
          },
          {
            id: 'sales-revenue-completed-work',
            label: '作業完了状況工番一覧',
            href: '/sales/revenue/completed-work',
            permissionPrefix: 'sales.revenue.completed-work',
          },
          {
            id: 'sales-revenue-internal-purchase',
            label: '社内仕入',
            href: '/sales/revenue/internal-purchase',
            permissionPrefix: 'sales.revenue.internal-purchase',
          },
          {
            id: 'sales-revenue-internal-purchase-cancel',
            label: '社内仕入取消',
            href: '/sales/revenue/internal-purchase-cancel',
            permissionPrefix: 'sales.revenue.internal-purchase-cancel',
          },
          {
            id: 'sales-revenue-posting',
            label: '売上計上',
            href: '/sales/revenue/posting',
            permissionPrefix: 'sales.revenue.posting',
          },
          {
            id: 'sales-revenue-customer-prices',
            label: '顧客売価明細・一覧',
            href: '/sales/revenue/customer-prices',
            permissionPrefix: 'sales.revenue.customer-prices',
          },
          {
            id: 'sales-revenue-forecast-statement',
            label: '見込生産売上収支表',
            href: '/sales/revenue/forecast-statement',
            permissionPrefix: 'sales.revenue.forecast-statement',
          },
          {
            id: 'sales-revenue-estimate-list',
            label: '概算売上一覧',
            href: '/sales/revenue/estimate-list',
            permissionPrefix: 'sales.revenue.estimate-list',
          },
        ],
      },
      {
        id: 'sales-monthly',
        label: '月次',
        href: '/sales/monthly',
        permissionPrefix: 'sales.monthly.',
        children: [
          {
            id: 'sales-monthly-shipping-costs',
            label: '得意先別発送費',
            href: '/sales/monthly/shipping-costs',
            permissionPrefix: 'sales.monthly.shipping-costs',
          },
          {
            id: 'sales-monthly-inventory-amount',
            label: '製品在庫金額',
            href: '/sales/monthly/inventory-amount',
            permissionPrefix: 'sales.monthly.inventory-amount',
          },
          {
            id: 'sales-monthly-import-budgets',
            label: '計画値取込',
            href: '/sales/monthly/import-budgets',
            permissionPrefix: 'sales.monthly.import-budgets',
          },
          {
            id: 'sales-monthly-aggregate',
            label: '月次資料集計',
            href: '/sales/monthly/aggregate',
            permissionPrefix: 'sales.monthly.aggregate',
          },
        ],
      },
    ],
  },
  {
    id: 'editorial',
    label: '編集管理',
    href: '/editorial',
    permissionPrefix: 'editorial.',
    children: [
      {
        id: 'editorial-prod-quote',
        label: '制作見積',
        href: '/editorial/prod-quote',
        permissionPrefix: 'editorial.prod-quote.',
        children: [
          {
            id: 'editorial-prod-quote-create',
            label: '制作見積書作成',
            href: '/editorial/prod-quote/create',
            permissionPrefix: 'editorial.prod-quote.create',
          },
          {
            id: 'editorial-prod-quote-approve',
            label: '制作見積書承認',
            href: '/editorial/prod-quote/approve',
            permissionPrefix: 'editorial.prod-quote.approve',
          },
          {
            id: 'editorial-prod-quote-issue',
            label: '制作見積書発行',
            href: '/editorial/prod-quote/issue',
            permissionPrefix: 'editorial.prod-quote.issue',
          },
        ],
      },
      {
        id: 'editorial-work-request',
        label: '作業受付',
        href: '/editorial/work-request',
        permissionPrefix: 'editorial.work-request.receipt',
      },
      {
        id: 'editorial-work-plan',
        label: '作業計画',
        href: '/editorial/work-plan',
        permissionPrefix: 'editorial.work-plan.',
        children: [
          {
            id: 'editorial-work-plan-assign',
            label: '作業振分',
            href: '/editorial/work-plan/assign',
            permissionPrefix: 'editorial.work-plan.assign',
          },
          {
            id: 'editorial-work-plan-operation',
            label: '作業設計<作業項目>',
            href: '/editorial/work-plan/operation',
            permissionPrefix: 'editorial.work-plan.operation',
          },
          {
            id: 'editorial-work-plan-person',
            label: '作業設計<担当者>',
            href: '/editorial/work-plan/person',
            permissionPrefix: 'editorial.work-plan.person',
          },
          {
            id: 'editorial-work-plan-arrange',
            label: '作業手配',
            href: '/editorial/work-plan/arrange',
            permissionPrefix: 'editorial.work-plan.arrange',
          },
        ],
      },
      {
        id: 'editorial-work-report',
        label: '作業実績',
        href: '/editorial/work-report',
        permissionPrefix: 'editorial.work-report.work-report',
      },
      {
        id: 'editorial-work-complete',
        label: '作業完了',
        href: '/editorial/work-complete',
        permissionPrefix: 'editorial.work-complete.work-complete',
      },
      {
        id: 'editorial-monthly',
        label: '月次',
        href: '/editorial/monthly',
        permissionPrefix: 'editorial.monthly.',
        children: [
          {
            id: 'editorial-monthly-output',
            label: '生産高登録',
            href: '/editorial/monthly/output',
            permissionPrefix: 'editorial.monthly.output',
          },
          {
            id: 'editorial-monthly-form',
            label: '帳票',
            href: '/editorial/monthly/form',
            permissionPrefix: 'editorial.monthly.form',
          },
          {
            id: 'editorial-monthly-analysis',
            label: '分析',
            href: '/editorial/monthly/analysis',
            permissionPrefix: 'editorial.monthly.analysis',
          },
        ],
      },
      {
        id: 'editorial-master',
        label: 'マスタ管理',
        href: '/editorial/master',
        permissionPrefix: 'editorial.master.',
        children: [
          {
            id: 'editorial-master-rank-unit-cost',
            label: 'ランク単価メンテナンス',
            href: '/editorial/master/rank-unit-cost',
            permissionPrefix: 'editorial.master.rank-unit-cost',
          },
          {
            id: 'editorial-master-person-rank',
            label: '個人別ランク単価メンテナンス',
            href: '/editorial/master/person-rank',
            permissionPrefix: 'editorial.master.person-rank',
          },
          {
            id: 'editorial-master-cost',
            label: '原価単価メンテナンス',
            href: '/editorial/master/cost',
            permissionPrefix: 'editorial.master.cost',
          },
        ],
      },
    ],
  },
  {
    id: 'printing',
    label: '印刷管理',
    href: '/printing',
    permissionPrefix: 'printing.',
    children: [
      {
        id: 'printing-quotes',
        label: '印刷見積',
        href: '/printing/quotes',
        permissionPrefix: 'printing.quotes.quotes',
      },
      {
        id: 'printing-work-plan',
        label: '作業計画',
        href: '/printing/work-plan',
        permissionPrefix: 'printing.work-plan.',
        children: [
          {
            id: 'printing-work-plan-receipt',
            label: '作業受付',
            href: '/printing/work-plan/receipt',
            permissionPrefix: 'printing.work-plan.receipt',
          },
          {
            id: 'printing-work-plan-complete-schedule',
            label: '製品完了予定',
            href: '/printing/work-plan/complete-schedule',
            permissionPrefix: 'printing.work-plan.complete-schedule',
          },
        ],
      },
      {
        id: 'printing-work-report',
        label: '作業実績',
        href: '/printing/work-report',
        permissionPrefix: 'printing.work-report.work-report',
      },
      {
        id: 'printing-work-complete',
        label: '作業完了',
        href: '/printing/work-complete',
        permissionPrefix: 'printing.work-complete.work-complete',
      },
      {
        id: 'printing-monthly',
        label: '月次',
        href: '/printing/monthly',
        permissionPrefix: 'printing.monthly.',
        children: [
          {
            id: 'printing-monthly-order-info',
            label: '印刷受注工番情報一覧',
            href: '/printing/monthly/order-info',
            permissionPrefix: 'printing.monthly.order-info',
          },
          {
            id: 'printing-monthly-inventory-amount',
            label: '仕掛在庫金額一覧',
            href: '/printing/monthly/inventory-amount',
            permissionPrefix: 'printing.monthly.inventory-amount',
          },
          {
            id: 'printing-monthly-completed-work',
            label: '作業完了一覧',
            href: '/printing/monthly/completed-work',
            permissionPrefix: 'printing.monthly.completed-work',
          },
        ],
      },
    ],
  },
  {
    id: 'logistics',
    label: '物流・倉庫管理',
    href: '/logistics',
    permissionPrefix: 'logistics.',
    children: [
      {
        id: 'logistics-receiving',
        label: '入荷',
        href: '/logistics/receiving',
        permissionPrefix: 'logistics.receiving.',
        children: [
          {
            id: 'logistics-receiving-schedule',
            label: '入荷予定',
            href: '/logistics/receiving/schedule',
            permissionPrefix: 'logistics.receiving.schedule',
          },
          {
            id: 'logistics-receiving-record',
            label: '入荷実績',
            href: '/logistics/receiving/record',
            permissionPrefix: 'logistics.receiving.record',
          },
        ],
      },
      {
        id: 'logistics-inventory',
        label: '在庫',
        href: '/logistics/inventory',
        permissionPrefix: 'logistics.inventory.',
        children: [
          {
            id: 'logistics-inventory-disporsal',
            label: '在庫廃棄',
            href: '/logistics/inventory/disporsal',
            permissionPrefix: 'logistics.inventory.disporsal',
          },
          {
            id: 'logistics-inventory-location',
            label: 'ロケーション番号登録',
            href: '/logistics/inventory/location',
            permissionPrefix: 'logistics.inventory.location',
          },
          {
            id: 'logistics-inventory-manage-form',
            label: '製品管理表',
            href: '/logistics/inventory/manage-form',
            permissionPrefix: 'logistics.inventory.manage-form',
          },
          {
            id: 'logistics-inventory-inventory-info',
            label: '在庫情報一覧',
            href: '/logistics/inventory/inventory-info',
            permissionPrefix: 'logistics.inventory.inventory-info',
          },
          {
            id: 'logistics-inventory-aged-inventory',
            label: '長期在庫',
            href: '/logistics/inventory/aged-inventory',
            permissionPrefix: 'logistics.inventory.aged-inventory',
          },
        ],
      },
      {
        id: 'logistics-stocktake',
        label: '棚卸',
        href: '/logistics/stocktake',
        permissionPrefix: 'logistics.stocktake.',
        children: [
          {
            id: 'logistics-stocktake-import',
            label: '棚卸結果取込',
            href: '/logistics/stocktake/import',
            permissionPrefix: 'logistics.stocktake.import',
          },
          {
            id: 'logistics-stocktake-result',
            label: '棚卸結果一覧',
            href: '/logistics/stocktake/result',
            permissionPrefix: 'logistics.stocktake.result',
          },
        ],
      },
      {
        id: 'logistics-shipping',
        label: '出荷',
        href: '/logistics/shipping',
        permissionPrefix: 'logistics.shipping.',
        children: [
          {
            id: 'logistics-shipping-order',
            label: '出荷指示',
            href: '/logistics/shipping/order',
            permissionPrefix: 'logistics.shipping.order',
          },
          {
            id: 'logistics-shipping-arrange',
            label: '出荷手配',
            href: '/logistics/shipping/arrange',
            permissionPrefix: 'logistics.shipping.arrange',
          },
          {
            id: 'logistics-shipping-operation',
            label: '出荷作業',
            href: '/logistics/shipping/operation',
            permissionPrefix: 'logistics.shipping.operation',
          },
          {
            id: 'logistics-shipping-record',
            label: '出荷実績',
            href: '/logistics/shipping/record',
            permissionPrefix: 'logistics.shipping.record',
          },
        ],
      },
      {
        id: 'logistics-master',
        label: 'マスタ管理',
        href: '/logistics/master',
        permissionPrefix: 'logistics.master.',
        children: [
          {
            id: 'logistics-master-destination',
            label: '宛先マスタメンテナンス',
            href: '/logistics/master/destination',
            permissionPrefix: 'logistics.master.destination',
          },
          {
            id: 'logistics-master-carrier',
            label: '配送業者マスタメンテナンス',
            href: '/logistics/master/carrier',
            permissionPrefix: 'logistics.master.carrier',
          },
          {
            id: 'logistics-master-shipping-rate',
            label: '運賃・梱包費マスタメンテナンス',
            href: '/logistics/master/shipping-rate',
            permissionPrefix: 'logistics.master.shipping-rate',
          },
          {
            id: 'logistics-master-location',
            label: 'ロケーション番号マスタメンテナンス',
            href: '/logistics/master/location',
            permissionPrefix: 'logistics.master.location',
          },
        ],
      },
      {
        id: 'logistics-monthly',
        label: '月次',
        href: '/logistics/monthly',
        permissionPrefix: 'logistics.monthly.',
        children: [
          {
            id: 'logistics-monthly-carrier-summary',
            label: '配送業者別集計一覧',
            href: '/logistics/monthly/carrier-summary',
            permissionPrefix: 'logistics.monthly.carrier-summary',
          },
          {
            id: 'logistics-monthly-shipping-cost',
            label: '発送費・梱包費情報一覧',
            href: '/logistics/monthly/shipping-cost',
            permissionPrefix: 'logistics.monthly.shipping-cost',
          },
          {
            id: 'logistics-monthly-warehouse-fee',
            label: '倉庫料情報一覧',
            href: '/logistics/monthly/warehouse-fee',
            permissionPrefix: 'logistics.monthly.warehouse-fee',
          },
        ],
      },
    ],
  },
  {
    id: 'it-assets',
    label: 'IT資産管理',
    href: '/it-assets',
    permissionPrefix: 'it-assets.',
    children: [
      {
        id: 'it-assets-hardware',
        label: 'ハードウェア管理',
        href: '/it-assets/it-assets/hardware',
        permissionPrefix: 'it-assets.it-assets.hardware',
      },
      {
        id: 'it-assets-software',
        label: 'ソフトウェア管理',
        href: '/it-assets/it-assets/software',
        permissionPrefix: 'it-assets.it-assets.software',
      },
      {
        id: 'it-assets-peripheral',
        label: '周辺機器管理',
        href: '/it-assets/it-assets/peripheral',
        permissionPrefix: 'it-assets.it-assets.peripheral',
      },
    ],
  },
];

/**
 * メニュー構造からパス→ラベルのマップを生成
 * ブレッドクラムで使用
 */
export const buildPathLabels = (
  items: MenuItem[] = menuItems,
  labels: Record<string, string> = {}
): Record<string, string> => {
  items.forEach((item) => {
    // hrefをそのままキーとして登録
    if (!labels[item.href]) {
      labels[item.href] = item.label;
    }

    // 子要素があれば再帰的に処理
    if (item.children) {
      buildPathLabels(item.children, labels);
    }
  });
  return labels;
};

/**
 * パスラベルマップ（事前生成済み）
 */
export const pathLabels: Record<string, string> = buildPathLabels();

/**
 * 動的ルートのラベル定義
 * キー: 親パス（動的セグメントの直前まで）
 * 値: 動的セグメント（new または ID）に表示するラベル
 */
export const dynamicPathLabels: Record<string, string> = {
  '/sales/quotes': '登録・更新',
};
