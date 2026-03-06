# 工番関連テーブル (work_number_relations)

## 概要

**テーブル物理名**: `work_number_relations`

**テーブル論理名**: 工番関連テーブル

**用途**:
- 複数の工番（受注）の関連性を管理
- 代表工番と関連工番の親子関係を定義
- 工番の統合、セット製品等で複数工番を一括管理するための関連付け
- 同じ受注案件から複数の工番が発行される場合の関連付け

## テーブル定義

| No. | 論理名 | 物理名 | データ型 | 桁数 | Not Null | PK | UK | FK | Default | 備考 |
|-----|--------|--------|----------|------|----------|----|----|----|---------| ----- |
| 1 | 工番関連id | work_number_relation_id | BIGSERIAL | - | ● | ● | - | - | - | 自動採番 |
| 2 | 代表工番受注id | parent_order_id | BIGINT | - | ● | - | - | ● | - | 受注.order_id FK制約cascade, 親となる工番 |
| 3 | 関連工番受注id | related_order_id | BIGINT | - | ● | - | - | ● | - | 受注.order_id FK制約cascade, 子となる関連工番 |

## インデックス

| インデックス名 | カラム | 種類 | 備考 |
|--------------|--------|------|------|
| work_number_relations_pkey | work_number_relation_id | PRIMARY KEY | 主キー |
| work_number_relations_parent_order_id_idx | parent_order_id | INDEX | 代表工番検索用 |
| work_number_relations_related_order_id_idx | related_order_id | INDEX | 関連工番検索用 |

## 外部キー制約

| 制約名 | カラム | 参照先テーブル | 参照先カラム | ON DELETE | ON UPDATE |
|--------|--------|---------------|--------------|-----------|-----------|
| work_number_relations_parent_order_id_foreign | parent_order_id | orders | order_id | CASCADE | CASCADE |
| work_number_relations_related_order_id_foreign | related_order_id | orders | order_id | CASCADE | CASCADE |

## 複合制約

| 制約名 | カラム | 種類 | 備考 |
|--------|--------|------|------|
| work_number_relations_parent_order_id_related_order_id_unique | (parent_order_id, related_order_id) | UNIQUE | 同一の親子関係は一意 |

## ビジネスロジック

### 関連性の定義

1. **代表工番 (parent_order_id)**
   - グループの代表となる工番
   - この工番を基準に関連工番を管理
   - 複数の関連工番を持つことができる

2. **関連工番 (related_order_id)**
   - 代表工番に紐付く子工番
   - 一つの関連工番は複数の代表工番を持つことはできない（一方向関係）
   - セット製品や分割製造の場合に使用

### 制約事項

- 同一の (parent_order_id, related_order_id) ペアは複数存在できない
- parent_order_id と related_order_id が同じレコードは禁止（自己参照禁止）
- 親子関係の逆向きリレーション（related → parent）は別途レコード必要

### 削除ルール

- 代表工番 (parent_order_id) の受注が削除される場合、関連レコードもすべて削除（CASCADE）
- 関連工番 (related_order_id) の受注が削除される場合、関連レコードも削除（CASCADE）

## 使用シーン

### 例1: セット製品の場合

```
代表工番: 26-00001 (セット製品)
├─ 関連工番: 26-00002 (部品A)
├─ 関連工番: 26-00003 (部品B)
└─ 関連工番: 26-00004 (組立）

代表工番の情報を確認すれば、すべての関連工番が参照可能
```

### 例2: 分割発注の場合

```
親オーダー: 26-00010 (大量注文)
├─ 関連工番: 26-00011 (前半分）
└─ 関連工番: 26-00012 (後半分）

大量注文を分割して製造する際に関連付け
```

## リレーション

```
工番関連 (work_number_relations)
├── 代表工番 → 受注 (orders)
└── 関連工番 → 受注 (orders)
```

## Eloquentモデル

- ファイル: `backend/app/Models/WorkNumberRelation.php`
- リレーション:
  - `parentOrder()`: 代表工番の受注（BelongsTo）
  - `relatedOrder()`: 関連工番の受注（BelongsTo）
  - `childRelations()`: この工番を代表とする関連工番一覧（HasMany）
  - `parentRelation()`: この工番が関連工番として属する代表工番（HasOne / BelongsTo through）

## 使用例

### 代表工番から関連工番を取得

```php
// 代表工番IDから関連工番を取得
$relations = WorkNumberRelation::where('parent_order_id', $parentOrderId)
    ->with(['relatedOrder'])
    ->get();

// 代表工番の受注情報と関連工番を一緒に取得
$parentOrder = Order::findOrFail($parentOrderId);
$relatedOrders = $parentOrder->childRelations()
    ->with(['relatedOrder'])
    ->get()
    ->pluck('relatedOrder');
```

### 関連工番から代表工番を取得

```php
// 関連工番IDから代表工番を取得
$relation = WorkNumberRelation::where('related_order_id', $relatedOrderId)
    ->with(['parentOrder'])
    ->first();

if ($relation) {
    $parentOrder = $relation->parentOrder;
}
```

## データ例

| work_number_relation_id | parent_order_id | related_order_id |
|-------------------------|-----------------|------------------|
| 1 | 1001 | 1002 |
| 2 | 1001 | 1003 |
| 3 | 1004 | 1005 |
| 4 | 1004 | 1006 |

## 関連テーブル

- [受注テーブル (orders)](27-orders.md)

## 注意事項

1. **循環参照の防止**
   - アプリケーションレベルで parent_order_id と related_order_id が同じレコードの作成を禁止
   - 循環参照検出ロジック（A→B→A）も必要に応じて実装

2. **双方向関係が必要な場合**
   - 異なる方向の関連付けが必要な場合は、別途レコードを作成
   - 例: A⇄B の関係を表す場合は、(A→B) と (B→A) の2レコード作成

3. **パフォーマンス考慮**
   - parent_order_id でのクエリが頻繁な場合、インデックス活用を確認
   - 深い関連階層がある場合は、クエリの N+1 問題に注意

## 更新履歴

- 2026-01-30: 初版作成

---

[戻る: テーブル一覧](../tables.md)
