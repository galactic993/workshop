# 制作見積差戻管理テーブル (prod_quot_return_log)

## 概要

**テーブル物理名**: `prod_quot_return_log`

**テーブル論理名**: 制作見積差戻管理テーブル

**用途**:
- 制作見積の差戻履歴を管理
- 営業側から制作見積が差戻された際に、バージョン情報と差戻理由を記録
- 差戻前後のバージョン追跡に使用

## テーブル定義

| No. | 論理名 | 物理名 | データ型 | 桁数 | Not Null | PK | UK | FK | Default | 備考 |
|-----|--------|--------|----------|------|----------|----|----|----|---------| ----- |
| 1 | 制作見積差戻管理id | prod_quot_return_log_id | BIGSERIAL | - | ● | ● | ● | - | - | 自動採番 |
| 2 | 制作見積id | prod_quot_id | BIGINT | - | ● | - | - | ● | - | 制作見積.prod_quot_id FK制約restrict |
| 3 | 差戻前バージョン | previous_version | SMALLINT | - | ● | - | - | - | - | - |
| 4 | 差戻後バージョン | next_version | SMALLINT | - | ● | - | - | - | - | - |
| 5 | 差戻理由 | remand_reason | TEXT | - | - | - | - | - | - | - |
| 6 | 作成日 | created_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |
| 7 | 更新日 | updated_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |

## インデックス

| インデックス名 | カラム | 種類 | 備考 |
|--------------|--------|------|------|
| prod_quot_return_log_pkey | prod_quot_return_log_id | PRIMARY KEY | 主キー |
| prod_quot_return_log_prod_quot_return_log_id_unique | prod_quot_return_log_id | UNIQUE | 制作見積差戻管理ID一意制約 |

## 外部キー制約

| 制約名 | カラム | 参照先テーブル | 参照先カラム | ON DELETE | ON UPDATE |
|--------|--------|---------------|--------------|-----------|-----------|
| prod_quot_return_log_prod_quot_id_foreign | prod_quot_id | prod_quots | prod_quot_id | RESTRICT | RESTRICT |

## 業務フロー

```
1. 制作見積のステータスが「発行済(40)」の状態で営業側に提出

2. 営業側が制作見積を確認し、差戻が必要と判断

3. 差戻処理を実行
   ↓
   以下が実行される：
   a. 制作見積のステータスを「差戻(50)」に変更
   b. 制作見積のバージョンをインクリメント
   c. 制作見積差戻管理レコードを作成
      - previous_version: 差戻前のバージョン
      - next_version: 差戻後のバージョン（インクリメント後）
      - remand_reason: 差戻理由

4. 制作側で再見積作業を実施
```

## バージョン管理

制作見積の差戻が発生するたびにバージョンがインクリメントされる。

```
初回発行: version = 1
1回目の差戻: version = 2 (previous_version=1, next_version=2)
2回目の差戻: version = 3 (previous_version=2, next_version=3)
```

## リレーション

```
制作見積差戻管理 (prod_quot_return_log)
└── 制作見積 → 制作見積 (prod_quots)
```

## Eloquentモデル

- ファイル: `backend/app/Models/ProdQuotReturnLog.php`
- リレーション:
  - `prodQuot()`: 制作見積

## 関連テーブル

- [制作見積テーブル (prod_quots)](18-prod_quots.md)

## 更新履歴

- 2025-12-24: 初版作成
- 2026-01-12: テーブル定義フォーマット統一
