# 作業部門別見積テーブル (quot_operations)

## 概要

**テーブル物理名**: `quot_operations`

**テーブル論理名**: 作業部門別見積テーブル

**用途**:
- 営業側が制作から受け取った基準価格に対して、顧客への売価を入力・管理
- 作業部門ごとの基準価格と最終見積金額を保持

## テーブル定義

| No. | 論理名 | 物理名 | データ型 | 桁数 | Not Null | PK | UK | FK | Default | 備考 |
|-----|--------|--------|----------|------|----------|----|----|----|---------| ----- |
| 1 | 作業部門別見積id | quot_operation_id | BIGSERIAL | - | ● | ● | ● | - | - | 自動採番 |
| 2 | 見積id | quot_id | BIGINT | - | ● | - | - | ● | - | 見積.quot_id FK制約cascade |
| 3 | 作業部門id | operation_id | BIGINT | - | ● | - | - | ● | - | 作業部門マスタ.operation_id FK制約restrict |
| 4 | 基準価格 | cost | DECIMAL(12,0) | 12 | ● | - | - | - | - | 12桁以内,小数なし |
| 5 | 見積金額 | quot_amount | DECIMAL(12,0) | 12 | ● | - | - | - | - | 12桁以内,小数なし |
| 6 | 更新日 | updated_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |

## インデックス

| インデックス名 | カラム | 種類 | 備考 |
|--------------|--------|------|------|
| quot_operations_pkey | quot_operation_id | PRIMARY KEY | 主キー |
| quot_operations_quot_operation_id_unique | quot_operation_id | UNIQUE | 作業部門別見積ID一意制約 |

## 外部キー制約

| 制約名 | カラム | 参照先テーブル | 参照先カラム | ON DELETE | ON UPDATE |
|--------|--------|---------------|--------------|-----------|-----------
| quot_operations_quot_id_foreign | quot_id | quots | quot_id | CASCADE | RESTRICT |
| quot_operations_operation_id_foreign | operation_id | operations | operation_id | RESTRICT | RESTRICT |

## 業務フロー

```
1. 制作側で制作見積が完了し、作業部門別制作見積（prod_quot_operations）が作成される

2. 制作見積が「発行済(40)」となり、営業側へ提出される

3. 営業側が制作見積を「受取済(30)」状態で受領

4. 営業担当者が作業部門別制作見積を参照し、
   顧客への売価（見積金額）を入力
   → 作業部門別見積レコードが作成される
   → 基準価格（cost）には制作見積の金額が設定される

5. 全作業部門の見積金額を集計し、見積書を作成
```

## 金額の関係

```
作業部門別見積（quot_operations）
├── cost: 基準価格（制作見積からコピー）
└── quot_amount: 顧客売価

粗利 = quot_amount - cost
```

## リレーション

```
作業部門別見積 (quot_operations)
├── 見積 → 見積 (quots)
└── 作業部門 → 作業部門マスタ (operations)
```

## Eloquentモデル

- ファイル: `backend/app/Models/QuotOperation.php`
- リレーション:
  - `quot()`: 見積
  - `operation()`: 作業部門マスタ

## 関連テーブル

- [見積テーブル (quots)](17-quots.md)
- [作業部門別制作見積テーブル (prod_quot_operations)](23-prod_quot_operations.md)
- [作業部門マスタテーブル (operations)](20-operations.md)

## 更新履歴

- 2025-12-24: 初版作成
- 2026-01-12: テーブル定義フォーマット統一
- 2026-01-19: prod_quot_operation_id削除、costカラム追加、created_at削除
