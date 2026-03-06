# Sidebar（サイドメニュー）

**ファイルパス**: `frontend/src/components/layout/Sidebar.tsx`

## 概要

認証済みユーザーに対して表示される、最大3階層のナビゲーションメニューです。ユーザーの権限に応じてメニュー項目を動的に表示・非表示します。

## 仕様

| 項目 | 値 |
|------|-----|
| **幅** | 256px (`w-64`) |
| **最小高さ** | `calc(100vh - 120px)` |
| **背景色** | グレー100 (`bg-gray-100`) |
| **ボーダー** | 右側 1px (`border-r border-gray-200`) |
| **表示条件** | 認証済みの場合のみ |

---

## メニュー階層構造

サイドメニューは最大3階層の構造を持ちます。

```
第1階層（モジュール）
├── 第2階層（カテゴリ）
│   └── 第3階層（機能）
```

## 第1階層メニュー項目

| No | ラベル | リンク先 | 表示条件 |
|----|--------|----------|----------|
| 1 | ポータル | `/` | 全員（権限不要） |
| 2 | 売上管理 | `/sales` | `sales.*` 権限を持つ場合 |
| 3 | 編集管理 | `/editorial` | `editorial.*` 権限を持つ場合 |
| 4 | 印刷管理 | `/printing` | `printing.*` 権限を持つ場合 |
| 5 | 物流・倉庫管理 | `/logistics` | `logistics.*` 権限を持つ場合 |
| 6 | IT資産管理 | `/it-assets` | `it-assets.*` 権限を持つ場合 |

---

## 売上管理メニュー構造

### 第2階層

| ラベル | リンク先 | 表示条件 | 配下 |
|--------|----------|----------|------|
| 見積 | `/sales/quotes` | `sales.quotes.*` | あり（3件） |
| 受注 | `/sales/orders` | `sales.orders.*` | あり（5件） |
| 売上 | `/sales/revenue` | `sales.revenue.*` | あり（8件） |
| 月次 | `/sales/monthly` | `sales.monthly.*` | あり（4件） |

### 第3階層（見積配下）

| ラベル | リンク先 | 表示条件 |
|--------|----------|----------|
| 見積書作成 | `/sales/quotes/create` | `sales.quotes.create` |
| 見積書承認 | `/sales/quotes/approve` | `sales.quotes.approve` |
| 見積書発行 | `/sales/quotes/issue` | `sales.quotes.issue` |

### 第3階層（受注配下）

| ラベル | リンク先 | 表示条件 |
|--------|----------|----------|
| 受注情報登録 | `/sales/orders/create` | `sales.orders.create` |
| 受注情報取込 | `/sales/orders/import` | `sales.orders.import` |
| 部署別得意先メンテナンス | `/sales/orders/customer` | `sales.orders.customer` |
| 受注週報(得意先別) | `/sales/orders/customer-report` | `sales.orders.customer-report` |
| 受注週報(部署別) | `/sales/orders/section-report` | `sales.orders.section-report` |

### 第3階層（売上配下）

| ラベル | リンク先 | 表示条件 |
|--------|----------|----------|
| 仕掛作業中工番一覧 | `/sales/revenue/work-in-progress` | `sales.revenue.work-in-progress` |
| 作業完了状況工番一覧 | `/sales/revenue/completed-work` | `sales.revenue.completed-work` |
| 社内仕入 | `/sales/revenue/internal-purchase` | `sales.revenue.internal-purchase` |
| 社内仕入取消 | `/sales/revenue/internal-purchase-cancel` | `sales.revenue.internal-purchase-cancel` |
| 売上計上 | `/sales/revenue/posting` | `sales.revenue.posting` |
| 顧客売価明細・一覧 | `/sales/revenue/customer-prices` | `sales.revenue.customer-prices` |
| 見込生産売上収支表 | `/sales/revenue/forecast-statement` | `sales.revenue.forecast-statement` |
| 概算売上一覧 | `/sales/revenue/estimate-list` | `sales.revenue.estimate-list` |

### 第3階層（月次配下）

| ラベル | リンク先 | 表示条件 |
|--------|----------|----------|
| 得意先別発送費 | `/sales/monthly/shipping-costs` | `sales.monthly.shipping-costs` |
| 製品在庫金額 | `/sales/monthly/inventory-amount` | `sales.monthly.inventory-amount` |
| 計画値取込 | `/sales/monthly/import-budgets` | `sales.monthly.import-budgets` |
| 月次資料集計 | `/sales/monthly/aggregate` | `sales.monthly.aggregate` |

---

## 編集管理メニュー構造

### 第2階層

| ラベル | リンク先 | 表示条件 | 配下 |
|--------|----------|----------|------|
| 制作見積書 | `/editorial/prod-quote` | `editorial.prod-quote.*` | あり（3件） |
| 作業受付 | `/editorial/work-request` | `editorial.work-request.receipt` | なし（第2階層まで） |
| 作業計画 | `/editorial/work-plan` | `editorial.work-plan.*` | あり（4件） |
| 作業実績 | `/editorial/work-report` | `editorial.work-report.work-report` | なし（第2階層まで） |
| 作業完了 | `/editorial/work-complete` | `editorial.work-complete.work-complete` | なし（第2階層まで） |
| 月次 | `/editorial/monthly` | `editorial.monthly.*` | あり（3件） |
| マスタ管理 | `/editorial/master` | `editorial.master.*` | あり（3件） |

### 第3階層（制作見積書配下）

| ラベル | リンク先 | 表示条件 |
|--------|----------|----------|
| 制作見積書作成 | `/editorial/prod-quote/create` | `editorial.prod-quote.create` |
| 制作見積書承認 | `/editorial/prod-quote/approve` | `editorial.prod-quote.approve` |
| 制作見積書発行 | `/editorial/prod-quote/issue` | `editorial.prod-quote.issue` |

### 第3階層（作業計画配下）

| ラベル | リンク先 | 表示条件 |
|--------|----------|----------|
| 作業割振 | `/editorial/work-plan/assign` | `editorial.work-plan.assign` |
| 作業設計<作業項目> | `/editorial/work-plan/operation` | `editorial.work-plan.operation` |
| 作業設計<担当者> | `/editorial/work-plan/person` | `editorial.work-plan.person` |
| 作業手配 | `/editorial/work-plan/arrange` | `editorial.work-plan.arrange` |

### 第3階層（月次配下）

| ラベル | リンク先 | 表示条件 |
|--------|----------|----------|
| 生産高登録 | `/editorial/monthly/output` | `editorial.monthly.output` |
| 帳票 | `/editorial/monthly/form` | `editorial.monthly.form` |
| 分析 | `/editorial/monthly/analysis` | `editorial.monthly.analysis` |

### 第3階層（マスタ管理配下）

| ラベル | リンク先 | 表示条件 |
|--------|----------|----------|
| ランク単価メンテナンス | `/editorial/master/rank-unit-cost` | `editorial.master.rank-unit-cost` |
| 個人別ランク単価メンテナンス | `/editorial/master/person-rank` | `editorial.master.person-rank` |
| 原価単価メンテナンス | `/editorial/master/cost` | `editorial.master.cost` |

---

## 印刷管理メニュー構造

### 第2階層

| ラベル | リンク先 | 表示条件 | 配下 |
|--------|----------|----------|------|
| 印刷見積 | `/printing/quotes` | `printing.quotes.quotes` | なし（第2階層まで） |
| 作業計画 | `/printing/work-plan` | `printing.work-plan.*` | あり（2件） |
| 作業実績 | `/printing/work-report` | `printing.work-report.work-report` | なし（第2階層まで） |
| 作業完了 | `/printing/work-complete` | `printing.work-complete.work-complete` | なし（第2階層まで） |
| 月次 | `/printing/monthly` | `printing.monthly.*` | あり（3件） |

### 第3階層（作業計画配下）

| ラベル | リンク先 | 表示条件 |
|--------|----------|----------|
| 作業受付 | `/printing/work-plan/receipt` | `printing.work-plan.receipt` |
| 製品完了予定 | `/printing/work-plan/complete-schedule` | `printing.work-plan.complete-schedule` |

### 第3階層（月次配下）

| ラベル | リンク先 | 表示条件 |
|--------|----------|----------|
| 印刷受注工番情報一覧 | `/printing/monthly/order-info` | `printing.monthly.order-info` |
| 仕掛在庫金額一覧 | `/printing/monthly/inventory-amount` | `printing.monthly.inventory-amount` |
| 作業完了一覧 | `/printing/monthly/completed-work` | `printing.monthly.completed-work` |

---

## 物流・倉庫管理メニュー構造

### 第2階層

| ラベル | リンク先 | 表示条件 | 配下 |
|--------|----------|----------|------|
| 入荷 | `/logistics/receiving` | `logistics.receiving.*` | あり（2件） |
| 在庫 | `/logistics/inventory` | `logistics.inventory.*` | あり（5件） |
| 棚卸 | `/logistics/stocktake` | `logistics.stocktake.*` | あり（2件） |
| 出荷 | `/logistics/shipping` | `logistics.shipping.*` | あり（4件） |
| マスタ管理 | `/logistics/master` | `logistics.master.*` | あり（4件） |
| 月次 | `/logistics/monthly` | `logistics.monthly.*` | あり（3件） |

### 第3階層（入荷配下）

| ラベル | リンク先 | 表示条件 |
|--------|----------|----------|
| 入荷予定 | `/logistics/receiving/schedule` | `logistics.receiving.schedule` |
| 入荷実績 | `/logistics/receiving/record` | `logistics.receiving.record` |

### 第3階層（在庫配下）

| ラベル | リンク先 | 表示条件 |
|--------|----------|----------|
| 在庫廃棄 | `/logistics/inventory/disporsal` | `logistics.inventory.disporsal` |
| ロケーション番号登録 | `/logistics/inventory/location` | `logistics.inventory.location` |
| 製品管理表 | `/logistics/inventory/manage-form` | `logistics.inventory.manage-form` |
| 在庫情報一覧 | `/logistics/inventory/inventory-info` | `logistics.inventory.inventory-info` |
| 長期在庫 | `/logistics/inventory/aged-inventory` | `logistics.inventory.aged-inventory` |

### 第3階層（棚卸配下）

| ラベル | リンク先 | 表示条件 |
|--------|----------|----------|
| 棚卸結果取込 | `/logistics/stocktake/import` | `logistics.stocktake.import` |
| 棚卸結果一覧 | `/logistics/stocktake/result` | `logistics.stocktake.result` |

### 第3階層（出荷配下）

| ラベル | リンク先 | 表示条件 |
|--------|----------|----------|
| 出荷指示 | `/logistics/shipping/order` | `logistics.shipping.order` |
| 出荷手配 | `/logistics/shipping/arrange` | `logistics.shipping.arrange` |
| 出荷作業 | `/logistics/shipping/operation` | `logistics.shipping.operation` |
| 出荷実績 | `/logistics/shipping/record` | `logistics.shipping.record` |

### 第3階層（マスタ管理配下）

| ラベル | リンク先 | 表示条件 |
|--------|----------|----------|
| 宛先マスタメンテナンス | `/logistics/master/destination` | `logistics.master.destination` |
| 配送業者マスタメンテナンス | `/logistics/master/carrier` | `logistics.master.carrier` |
| 運賃・梱包費マスタメンテナンス | `/logistics/master/shipping-rate` | `logistics.master.shipping-rate` |
| ロケーション番号マスタメンテナンス | `/logistics/master/location` | `logistics.master.location` |

### 第3階層（月次配下）

| ラベル | リンク先 | 表示条件 |
|--------|----------|----------|
| 配送業者別集計一覧 | `/logistics/monthly/carrier-summary` | `logistics.monthly.carrier-summary` |
| 発送費・梱包費情報一覧 | `/logistics/monthly/shipping-cost` | `logistics.monthly.shipping-cost` |
| 倉庫料情報一覧 | `/logistics/monthly/warehouse-fee` | `logistics.monthly.warehouse-fee` |

---

## IT資産管理メニュー構造

### 第2階層

| ラベル | リンク先 | 表示条件 | 配下 |
|--------|----------|----------|------|
| ハードウェア管理 | `/it-assets/it-assets/hardware` | `it-assets.it-assets.hardware` | なし（第2階層まで） |
| ソフトウェア管理 | `/it-assets/it-assets/software` | `it-assets.it-assets.software` | なし（第2階層まで） |
| 周辺機器管理 | `/it-assets/it-assets/peripheral` | `it-assets.it-assets.peripheral` | なし（第2階層まで） |

---

## 権限による表示制御

1. **アクセス区分「00（すべて）」の場合**
   - 権限識別子の判定なしですべてのメニュー項目を表示

2. **それ以外の場合**
   - ユーザーの権限識別子に基づいてメニュー項目を動的に表示
   - 権限のモジュール部分（`sales.*`, `editorial.*` など）で判定
   - 該当する権限がない場合、そのメニュー項目は非表示

## 権限判定ロジック

```typescript
// ユーザーが特定のモジュールにアクセス可能かを判定
const hasModuleAccess = (
  user: User,
  permissions: Permission[],
  modulePrefix: string
): boolean => {
  // アクセス区分が「00（すべて）」の場合は常にtrue
  if (user.access_type === '00') {
    return true;
  }

  // 権限識別子でモジュールプレフィックスが一致するものがあるか確認
  return permissions.some(permission =>
    permission.permission_key.startsWith(modulePrefix)
  );
};

// 使用例
hasModuleAccess(user, permissions, 'sales.');      // 売上管理
hasModuleAccess(user, permissions, 'editorial.');  // 編集管理
hasModuleAccess(user, permissions, 'printing.');   // 印刷管理
hasModuleAccess(user, permissions, 'logistics.');  // 物流・倉庫管理
hasModuleAccess(user, permissions, 'it-assets.');  // IT資産管理
```

---

## メニュー構造定義

```typescript
interface MenuItem {
  id: string;
  label: string;
  href: string;
  permissionPrefix?: string;  // 権限判定用のプレフィックス（空の場合は全員表示）
  children?: MenuItem[];      // 第2階層以下
}

const menuItems: MenuItem[] = [
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
    children: [/* 第2階層... */],
  },
  // ...
];
```

---

## ドロップダウン動作

- 第1階層メニュー項目はリンクとして機能
- 第1階層メニュー項目をクリックまたはホバーで配下の階層を展開
- 展開状態は視覚的に区別（アイコン回転、背景色変更など）

## 表示例

```
┌──────────────────────────────────┐
│ サイドメニュー                   │
├──────────────────────────────────┤
│   ポータル                       │  ← 全員表示、/ へリンク
│ ▼ 売上管理                       │  ← sales.* 権限必要
│   │  見積                        │  ← 第2階層（配下なし）
│   ▼  受注                        │  ← 第2階層（配下あり）
│   │  ├─ 受注情報登録            │  ← 第3階層
│   │  ├─ 受注情報取込            │
│   │  ├─ 部署別得意先メンテナンス │
│   │  ├─ 受注週報(得意先別)      │
│   │  └─ 受注週報(部署別)        │
│   ▶  売上                        │  ← 第2階層（配下あり、折りたたみ）
│   ▶  月次                        │  ← 第2階層（配下あり、折りたたみ）
│ ▶ 編集管理                       │  ← editorial.* 権限必要
│ ▶ 印刷管理                       │  ← printing.* 権限必要
│ ▶ 物流・倉庫管理                 │  ← logistics.* 権限必要
│ ▶ IT資産管理                     │  ← it-assets.* 権限必要
└──────────────────────────────────┘
```

**アイコン凡例**:
- `▶`: 配下あり・折りたたみ状態
- `▼`: 配下あり・展開状態
- （アイコンなし）: 配下なし・直接リンク

---

## スタイル仕様

**第1階層**:
- パディング: 左右16px、上下12px
- フォントサイズ: 14px
- フォントウェイト: 500 (medium)
- テキスト色: `text-gray-700`
- ホバー時: `bg-gray-200`
- 選択時: `bg-blue-50 text-blue-700 border-l-4 border-blue-500`

**第2階層**:
- パディング: 左32px、右16px、上下10px
- フォントサイズ: 14px
- テキスト色: `text-gray-600`
- ホバー時: `bg-gray-200`

**第3階層**:
- パディング: 左48px、右16px、上下8px
- フォントサイズ: 13px
- テキスト色: `text-gray-500`
- ホバー時: `bg-gray-200`

---

## アクセシビリティ

- `<nav>` 要素を使用
- `aria-label="メインナビゲーション"` を設定
- 展開/折りたたみ状態を `aria-expanded` で表現
- キーボード操作対応（Tab、Enter、矢印キー）

---

## 実装ファイル

- `frontend/src/components/layout/Sidebar.tsx` - サイドメニューコンポーネント
- `frontend/src/config/menuItems.ts` - メニュー構造定義

---

## 更新履歴

- 2025-12-09: 初版作成（Sidebar仕様を追加）
- 2025-12-09: 権限ベースフィルタリング実装完了、menuItems.ts作成
- 2025-12-25: components.mdから分離
