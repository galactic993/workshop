# 作業部門別制作見積テーブル (prod_quot_operations)

## 概要

**テーブル物理名**: `prod_quot_operations`

**テーブル論理名**: 作業部門別制作見積テーブル

**用途**:
- 各センターから上がってきた制作見積詳細を作業部門ごとに合算した結果を管理
- 主管センターが制作見積のステータスを「発行済(40)」に変更する際に作成
- 営業側への見積金額計算の基礎データ

## テーブル定義

| No. | 論理名 | 物理名 | データ型 | 桁数 | Not Null | PK | UK | FK | Default | 備考 |
|-----|--------|--------|----------|------|----------|----|----|----|---------| ----- |
| 1 | 作業部門別制作見積id | prod_quot_operation_id | BIGSERIAL | - | ● | ● | ● | - | - | 自動採番 |
| 2 | 制作見積id | prod_quot_id | BIGINT | - | ● | - | - | ● | - | 制作見積.prod_quot_id FK制約restrict |
| 3 | 作業部門id | operation_id | BIGINT | - | ● | - | - | ● | - | 作業部門マスタ.operation_id FK制約restrict |
| 4 | 見積基準価格 | prod_quot_cost | DECIMAL(12,0) | 12 | ● | - | - | - | - | 12桁以内,少数なし |
| 5 | 作成日 | created_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |
| 6 | 更新日 | updated_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |

## インデックス

| インデックス名 | カラム | 種類 | 備考 |
|--------------|--------|------|------|
| prod_quot_operations_pkey | prod_quot_operation_id | PRIMARY KEY | 主キー |
| prod_quot_operations_prod_quot_operation_id_unique | prod_quot_operation_id | UNIQUE | 作業部門別制作見積ID一意制約 |

## 外部キー制約

| 制約名 | カラム | 参照先テーブル | 参照先カラム | ON DELETE | ON UPDATE |
|--------|--------|---------------|--------------|-----------|-----------|
| prod_quot_operations_prod_quot_id_foreign | prod_quot_id | prod_quots | prod_quot_id | RESTRICT | RESTRICT |
| prod_quot_operations_operation_id_foreign | operation_id | operations | operation_id | RESTRICT | RESTRICT |

## 業務フロー

```
1. 各制作センターの制作見積依頼がすべて「承認済(20)」になる

2. 主管センターが制作見積のステータスを「受取済(30)」に変更

3. 主管センターが制作見積書アップロード先、関連資料を入力

4. ステータスを「発行済(40)」に変更
   ↓
   この時点で以下が実行される：
   a. 各制作見積詳細の金額を合算 → 基準金額(cost)に格納
   b. 制作見積詳細を作業部門（proces_cdの先頭3桁）ごとに合算
      → 作業部門別制作見積レコードを作成
```

## 合算ロジック

制作見積詳細(prod_quot_details)の加工品内容コード(proces_cd)の先頭3桁を作業部門コード(operation_cd)として、同一制作見積に紐づく詳細の金額を作業部門ごとに合算する。

```
制作見積詳細1: proces_cd=10000010 (刷版)    → operation_cd=100 (印刷) → 50,000円
制作見積詳細2: proces_cd=10000020 (印刷)    → operation_cd=100 (印刷) → 80,000円
制作見積詳細3: proces_cd=20000010 (デザイン) → operation_cd=200 (編集) → 100,000円

↓ 作業部門ごとに合算

作業部門別制作見積1: operation_id=1 (印刷) → 130,000円
作業部門別制作見積2: operation_id=2 (編集) → 100,000円
```

## リレーション

```
作業部門別制作見積 (prod_quot_operations)
├── 制作見積 → 制作見積 (prod_quots)
└── 作業部門 → 作業部門マスタ (operations)
```

## Eloquentモデル

- ファイル: `backend/app/Models/ProdQuotOperation.php`
- リレーション:
  - `prodQuot()`: 制作見積
  - `operation()`: 作業部門

## 関連テーブル

- [制作見積テーブル (prod_quots)](18-prod_quots.md)
- [作業部門マスタ (operations)](20-operations.md)
- [制作見積詳細テーブル (prod_quot_details)](22-prod_quot_details.md)

## 更新履歴

- 2025-12-24: 初版作成
- 2026-01-12: prod_quot_cost論理名変更（見積基準金額→見積基準価格）、テーブル定義フォーマット統一
