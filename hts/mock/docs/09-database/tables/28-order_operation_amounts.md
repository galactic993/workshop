# 作業部門別受注金額テーブル (order_operation_amounts)

## 概要

**テーブル物理名**: `order_operation_amounts`

**テーブル論理名**: 作業部門別受注金額テーブル

**用途**:
- 受注の金額を作業部門ごとに分割して管理
- 作業部門別の受注金額集計の基礎データ
- 基準価格と受注金額を分けて記録（値引き等に対応）
- 初回金額と最終金額の両方を保持して変更履歴を追跡

## テーブル定義

| No. | 論理名 | 物理名 | データ型 | 桁数 | Not Null | PK | UK | FK | Default | 備考 |
|-----|--------|--------|----------|------|----------|----|----|----|---------| ----- |
| 1 | 作業部門別受注金額id | order_operation_amount_id | BIGSERIAL | - | ● | ● | - | - | - | 自動採番 |
| 2 | 受注id | order_id | BIGINT | - | ● | - | - | ● | - | 受注.order_id FK制約cascade |
| 3 | 作業部門id | operation_id | BIGINT | - | ● | - | - | ● | - | 作業部門マスタ.operation_id FK制約restrict |
| 4 | 最終基準価格 | cost | DECIMAL(12,0) | 12 | ● | - | - | - | - | 12桁以内、少数なし |
| 5 | 最終受注金額 | order_amount | DECIMAL(12,0) | 12 | ● | - | - | - | - | 12桁以内、少数なし |
| 6 | 初回基準価格 | first_cost | DECIMAL(12,0) | 12 | ● | - | - | - | - | 12桁以内、少数なし |
| 7 | 初回受注金額 | first_order_amount | DECIMAL(12,0) | 12 | ● | - | - | - | - | 12桁以内、少数なし |
| 8 | 作成日 | created_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |
| 9 | 更新日 | updated_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |

## インデックス

| インデックス名 | カラム | 種類 | 備考 |
|--------------|--------|------|------|
| order_operation_amounts_pkey | order_operation_amount_id | PRIMARY KEY | 主キー |
| order_operation_amounts_order_id_idx | order_id | INDEX | 受注検索用 |
| order_operation_amounts_operation_id_idx | operation_id | INDEX | 作業部門検索用 |
| order_operation_amounts_order_id_operation_id_idx | (order_id, operation_id) | COMPOSITE INDEX | 受注・作業部門複合検索用 |

## 外部キー制約

| 制約名 | カラム | 参照先テーブル | 参照先カラム | ON DELETE | ON UPDATE |
|--------|--------|---------------|--------------|-----------|-----------|
| order_operation_amounts_order_id_foreign | order_id | orders | order_id | CASCADE | CASCADE |
| order_operation_amounts_operation_id_foreign | operation_id | operations | operation_id | RESTRICT | RESTRICT |

## 複合制約

| 制約名 | カラム | 種類 | 備考 |
|--------|--------|------|------|
| order_operation_amounts_order_id_operation_id_unique | (order_id, operation_id) | UNIQUE | 受注ごとに作業部門は一意 |

## ビジネスロジック

### 金額記録ルール

1. **初回金額の記録**
   - 受注が確定した時点で `first_cost` と `first_order_amount` に初回金額を記録
   - 以降は上書きしない

2. **最終金額の更新**
   - 受注確定後に値引き等の変更が発生した場合、`cost` と `order_amount` を更新
   - 初回金額との差分により値引き額を計算可能

3. **金額の整合性**
   - 複数作業部門の `cost` を合算すると、受注テーブルの総基準価格になる
   - 複数作業部門の `order_amount` を合算すると、受注テーブルの総受注金額になる

### データ保有期間

- 受注の CASCADE 削除により、関連レコードもすべて削除される
- 受注が取消された場合のデータ保全は別途考慮

## リレーション

```
作業部門別受注金額 (order_operation_amounts)
├── 受注 → 受注 (orders)
└── 作業部門 → 作業部門マスタ (operations)
```

## Eloquentモデル

- ファイル: `backend/app/Models/OrderOperationAmount.php`
- リレーション:
  - `order()`: 受注（BelongsTo）
  - `operation()`: 作業部門（BelongsTo）

## 使用例

### 受注ごとの金額を作業部門別に取得

```php
// 受注IDの全作業部門別金額を取得
$amounts = OrderOperationAmount::where('order_id', $orderId)
    ->with(['operation'])
    ->get();

// 結果
// order_id: 1001, operation_id: 1 (印刷), cost: 50000, order_amount: 45000
// order_id: 1001, operation_id: 2 (編集), cost: 30000, order_amount: 28000
// 合計: cost: 80000, order_amount: 73000
```

### 値引き額の計算

```php
$amount = OrderOperationAmount::find($id);
$discount = $amount->first_cost - $amount->cost;  // 初回と最終の差分
```

## 関連テーブル

- [受注テーブル (orders)](27-orders.md)
- [作業部門マスタ (operations)](20-operations.md)

## 更新履歴

- 2026-01-30: 初版作成

---

[戻る: テーブル一覧](../tables.md)
