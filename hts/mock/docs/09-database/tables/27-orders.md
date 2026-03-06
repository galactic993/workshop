# 受注テーブル (orders)

## 概要

**テーブル物理名**: `orders`

**テーブル論理名**: 受注テーブル

**用途**:
- 受注情報を管理
- 見積から受注への転換を記録
- 受注から納品・売上計上までのワークフローを制御
- センター・部署・得意先別の受注状況を追跡

## テーブル定義

| No. | 論理名 | 物理名 | データ型 | 桁数 | Not Null | PK | UK | FK | Default | 備考 |
|-----|--------|--------|----------|------|----------|----|----|----|---------| ----- |
| 1 | 受注id | order_id | BIGSERIAL | - | ● | ● | - | - | - | 自動採番 |
| 2 | 年号 | order_cd_year | CHAR(2) | 2 | ● | - | ● | - | - | 2桁　年号-通番で工番として使用 |
| 3 | 工番（通番） | order_cd | CHAR(5) | 5 | ● | - | ● | - | - | 5桁　年号-通番で工番として使用 |
| 4 | 見積id | quot_id | BIGINT | - | - | - | - | ● | - | 見積.quot_id FK制約restrict |
| 5 | 受注部署id | section_cd_id | BIGINT | - | ● | - | - | ● | - | 部署コードマスタ.section_cd_id FK制約restrict |
| 6 | 得意先id | customer_id | BIGINT | - | ● | - | - | ● | - | 得意先マスタ.customer_id FK制約restrict |
| 7 | 得意先名 | customer_name | VARCHAR(120) | 120 | - | - | - | - | - | 得意先コードが33900（諸口）のときのみ入力 |
| 8 | 担当者id | employee_id | BIGINT | - | ● | - | - | ● | - | 社員マスタ.employee_id FK制約restrict |
| 9 | 品名 | prod_name | VARCHAR(50) | 50 | ● | - | - | - | - | 50桁以内 |
| 10 | 正式品名 | official_prod_name | VARCHAR(255) | 255 | ● | - | - | - | - | 255桁以内 |
| 11 | 品名コード | prod_cd | VARCHAR(10) | 10 | - | - | - | - | - | 10桁以内 |
| 12 | サイズ | size | VARCHAR(10) | 10 | - | - | - | - | - | 10桁以内 |
| 13 | 数量 | quantity | INTEGER | - | ● | - | - | - | - | 正の整数 |
| 14 | 受注日 | order_on | DATE | - | ● | - | - | - | - | - |
| 15 | 版下納期 | bc_delivery_on | DATE | - | - | - | - | - | - | - |
| 16 | 製品納期 | delivery_on | DATE | - | - | - | - | - | - | - |
| 17 | 最終完了日 | completion_on | DATE | - | - | - | - | - | - | 社内仕入時に更新 |
| 18 | 受注区分 | orders_category | CHAR(2) | 2 | ● | - | - | - | 00 | 00:標準, 10:その他 |
| 19 | 売上区分 | sales_category | CHAR(2) | 2 | ● | - | - | - | 00 | 00:標準, 10:その他 |
| 20 | 売上状況 | sales_status | CHAR(2) | 2 | ● | - | - | - | 00 | 00:未売上, 10:売上計上済 |
| 21 | 発注書番号 | purchase_order_number | VARCHAR(20) | 20 | - | - | - | - | - | 20桁以内 |
| 22 | 発注書番号承認区分 | is_approved | BOOLEAN | - | ● | - | - | - | false | 承認フラグ |
| 23 | 承認者id | approved_by | BIGINT | - | - | - | - | ● | - | 社員マスタ.employee_id FK制約restrict |
| 24 | 承認日時 | approved_at | TIMESTAMP(0) | - | - | - | - | - | - | - |
| 25 | 品名（略称） | short_prod_name | VARCHAR(50) | 50 | ● | - | - | - | - | 50桁以内 |
| 26 | 初校納期 | first_proof_on | DATE | - | - | - | - | - | - | - |
| 27 | 再校納期 | second_proof_on | DATE | - | - | - | - | - | - | - |
| 28 | 三校納期 | third_proof_on | DATE | - | - | - | - | - | - | - |
| 29 | 原稿枚数 | manuscript_pages | INTEGER | - | - | - | - | - | - | - |
| 30 | 支給図面枚数 | drawing_count | INTEGER | - | - | - | - | - | - | - |
| 31 | 支給写真枚数 | provided_photos_count | INTEGER | - | - | - | - | - | - | - |
| 32 | 作業区分1有無 | is_work_category1 | BOOLEAN | - | ● | - | - | - | false | - |
| 33 | 作業区分2有無 | is_work_category2 | BOOLEAN | - | ● | - | - | - | false | - |
| 34 | 作業区分3有無 | is_work_category3 | BOOLEAN | - | ● | - | - | - | false | - |
| 35 | 作業区分4有無 | is_work_category4 | BOOLEAN | - | ● | - | - | - | false | - |
| 36 | 作業区分5有無 | is_work_category5 | BOOLEAN | - | ● | - | - | - | false | - |
| 37 | 作業区分6有無 | is_work_category6 | BOOLEAN | - | ● | - | - | - | false | - |
| 38 | 個人情報有無 | is_personal_data | BOOLEAN | - | ● | - | - | - | false | - |
| 39 | 機密情報有無 | is_confidential_data | BOOLEAN | - | ● | - | - | - | false | - |
| 40 | データ保管有無 | is_retention_required | BOOLEAN | - | ● | - | - | - | false | - |
| 41 | 主管センターid | center_section_cd_id | BIGINT | - | - | - | - | ● | - | 部署コードマスタ.section_cd_id FK制約restrict ※nullable |
| 42 | 主管担当者id | person_in_charge_id | BIGINT | - | - | - | - | ● | - | 社員マスタ.employee_id FK制約restrict ※nullable |
| 43 | 伝達事項 | communication_note | TEXT | - | - | - | - | - | - | - |
| 44 | 売上完了日 | sales_completion_on | DATE | - | - | - | - | - | - | 売上登録時に更新（売上完了時） |
| 45 | ステータス | order_status | CHAR(2) | 2 | ● | - | - | - | 00 | 00:工番発行済, 10:作業手配済, 20:作業受付済, 30:作業完了済, 40:社内仕入済 |
| 46 | 作成日 | created_at | TIMESTAMP | - | ● | - | - | - | CURRENT_TIMESTAMP | - |
| 47 | 更新日 | updated_at | TIMESTAMP | - | ● | - | - | - | CURRENT_TIMESTAMP | - |

## インデックス

| インデックス名 | カラム | 種類 | 備考 |
|--------------|--------|------|------|
| orders_pkey | order_id | PRIMARY KEY | 主キー |
| orders_order_cd_year_order_cd_unique | (order_cd_year, order_cd) | UNIQUE | 工番複合一意制約 |
| orders_order_on_idx | order_on | INDEX | 受注日検索用 |
| orders_order_status_idx | order_status | INDEX | ステータス検索用 |
| orders_section_cd_id_idx | section_cd_id | INDEX | 受注部署検索用 |
| orders_customer_id_idx | customer_id | INDEX | 得意先検索用 |
| orders_employee_id_idx | employee_id | INDEX | 担当者検索用 |
| orders_center_section_cd_id_idx | center_section_cd_id | INDEX | 主管センター検索用 |
| orders_quot_id_idx | quot_id | INDEX | 見積検索用 |
| orders_delivery_on_idx | delivery_on | INDEX | 製品納期検索用 |
| orders_sales_status_idx | sales_status | INDEX | 売上状況検索用 |
| orders_section_cd_id_order_on_idx | (section_cd_id, order_on) | COMPOSITE INDEX | 部署別受注日検索用 |
| orders_section_cd_id_order_status_idx | (section_cd_id, order_status) | COMPOSITE INDEX | 部署別ステータス検索用 |
| orders_customer_id_order_on_idx | (customer_id, order_on) | COMPOSITE INDEX | 得意先別受注日検索用 |
| orders_center_section_cd_id_order_on_idx | (center_section_cd_id, order_on) | COMPOSITE INDEX | センター別受注日検索用 |

## 外部キー制約

| 制約名 | カラム | 参照先テーブル | 参照先カラム | ON DELETE | ON UPDATE |
|--------|--------|---------------|--------------|-----------|-----------|
| orders_quot_id_foreign | quot_id | quots | quot_id | RESTRICT | RESTRICT |
| orders_section_cd_id_foreign | section_cd_id | section_cds | section_cd_id | RESTRICT | RESTRICT |
| orders_customer_id_foreign | customer_id | customers | customer_id | RESTRICT | RESTRICT |
| orders_employee_id_foreign | employee_id | employees | employee_id | RESTRICT | RESTRICT |
| orders_approved_by_foreign | approved_by | employees | employee_id | RESTRICT | RESTRICT |
| orders_center_section_cd_id_foreign | center_section_cd_id | section_cds | section_cd_id | RESTRICT | RESTRICT |
| orders_person_in_charge_id_foreign | person_in_charge_id | employees | employee_id | RESTRICT | RESTRICT |

## 受注区分 (orders_category)

| コード | 名称 | 説明 |
|--------|------|------|
| 00 | 通常 | 通常の受注 |
| 10 | 見込 | 見込受注 |
| 20 | 事前生産 | 事前生産 |
| 30 | セット製品 | セット製品 |
| 40 | 発送作業 | 発送作業 |

## 売上区分 (sales_category)

| コード | 名称 | 説明 |
|--------|------|------|
| 00 | 通常 | 通常売上 |
| 10 | 見込 | 見込売上 |
| 20 | 概算 | 概算売上 |

## 売上状況 (sales_status)

| コード | 名称 | 説明 |
|--------|------|------|
| 00 | 未売上 | 売上未計上 |
| 10 | 一部売上済 | 一部売上計上済み |
| 20 | 売上済 | 全て売上計上済み |

## ステータス区分 (order_status)

| コード | 名称 | 説明 |
|--------|------|------|
| 00 | 工番発行済 | 工番が発行された状態 |
| 10 | 作業手配済 | 作業手配が完了した状態 |
| 20 | 作業受付済 | 作業受付が完了した状態 |
| 30 | 作業完了済 | 作業が完了した状態 |
| 40 | 社内仕入済 | 社内仕入が完了した状態 |

## 工番採番ルール

- 形式: `YYCCCCC` (7桁固定)
  - YY: 受注年号（西暦下2桁、例: 26）
  - CCCCC: 工番通番（5桁、001から開始）
- 工番は年号ごとにリセットされる（2026年度は001から開始）

## リレーション

```
受注 (orders)
├── 見積 → 見積 (quots)
├── 受注部署 → 部署コード (section_cds)
├── 得意先 → 得意先 (customers)
├── 担当者 → 社員 (employees)
├── 承認者 → 社員 (employees)
├── 主管センター → 部署コード (section_cds)
├── 主管担当者 → 社員 (employees)
├── 作業部門別受注金額 (order_operation_amounts)
│   └── 作業部門 → 作業部門マスタ (operations)
└── 工番関連 (work_number_relations)
    ├── 代表工番 → 受注 (orders)
    └── 関連工番 → 受注 (orders)
```

## Eloquentモデル

**ファイルパス**: `backend/app/Models/Order.php`

**主要リレーション**:
- `quot()`: 見積（BelongsTo）
- `sectionCd()`: 受注部署（BelongsTo）
- `customer()`: 得意先（BelongsTo）
- `employee()`: 担当者（BelongsTo）
- `approver()`: 承認者（BelongsTo）
- `centerSectionCd()`: 主管センター（BelongsTo）
- `personInCharge()`: 主管担当者（BelongsTo）
- `operationAmounts()`: 作業部門別受注金額（HasMany）
- `childRelations()`: この工番を代表とする工番関連（HasMany）
- `parentRelation()`: この工番が関連工番として属する代表工番（HasOne / BelongsTo through）

**主要アクセサ**:
- `order_status_label`: ステータスの日本語ラベル
- `sales_status_label`: 売上状況の日本語ラベル
- `orders_category_label`: 受注区分の日本語ラベル
- `sales_category_label`: 売上区分の日本語ラベル

## 注意事項

1. **工番の生成**
   - order_cd_year + order_cd の複合一意制約で工番の一意性を保証
   - 西暦下2桁により年度管理が実現

2. **得意先名の上書き**
   - 諸口（得意先コード: 33900）選択時のみ customer_name に実際の得意先名を入力
   - その他の場合は customer_name は NULL

3. **承認機能**
   - is_approved = false の場合、approved_by と approved_at は NULL
   - 発注書番号の入力が完了した際に承認処理を実施

4. **ステータス遷移**
   - order_status は以下の遷移ルールに従う：
     - 00（工番発行済）→ 10（作業手配済）
     - 10（作業手配済）→ 20（作業受付済）
     - 20（作業受付済）→ 30（作業完了済）
     - 30（作業完了済）→ 40（社内仕入済）

5. **売上計上管理**
   - sales_status により売上計上状況を管理
   - sales_completion_on には売上計上日を記録

6. **データ区分フラグ**
   - is_personal_data: 個人情報を含むかどうか
   - is_confidential_data: 機密情報を含むかどうか
   - is_retention_required: データ保管が必要かどうか
   - これらは個人情報保護やセキュリティポリシー準拠に使用

7. **センター管理**
   - section_cd_id: 受注時の営業センター
   - center_section_cd_id: 主管センター（製造管理の責任部署）

8. **受注情報取込での登録仕様**
   - center_section_cd_id: ログインユーザーの所属センターから自動設定
   - person_in_charge_id: ログインユーザーの社員IDから自動設定
   - これらのフィールドは受注情報取込時に自動的に割り当てられ、後ほど受注登録画面で更新可能

## マイグレーションファイル

**ファイルパス**: `backend/database/migrations/[timestamp]_create_orders_table.php`

## 関連テーブル

- [見積テーブル (quots)](17-quots.md) - 見積から受注への転換元
- [部署コードマスタ (section_cds)](01-section_cds.md) - 受注部署・主管センター
- [得意先マスタ (customers)](15-customers.md) - 受注得意先
- [社員マスタ (employees)](02-employees.md) - 担当者・承認者・主管担当者
- [作業部門別受注金額テーブル (order_operation_amounts)](28-order_operation_amounts.md) - 受注の作業部門別金額管理
- [工番関連テーブル (work_number_relations)](29-work_number_relations.md) - 複数工番の関連性管理

## 更新履歴

- 2026-01-29: 初版作成（受注テーブル47カラム）
- 2026-01-30: リレーション情報追記（order_operation_amounts, work_number_relations）
- 2026-01-30: center_section_cd_id と person_in_charge_id が nullable に変更、受注情報取込での登録仕様を追記

---

[戻る: テーブル一覧](../tables.md)
