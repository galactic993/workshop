# データベーステーブル仕様書

## 概要

管理会計システムで使用するデータベーステーブルの詳細仕様を定義します。

各テーブルの詳細は個別ファイルを参照してください。

---

## テーブル一覧

### マスタテーブル

| No. | テーブル名 | 論理名 | 説明 |
|-----|-----------|--------|------|
| 1 | [section_cds](tables/01-section_cds.md) | 部署コードマスタ | 集計単位となる部署コードを管理 |
| 2 | [employees](tables/02-employees.md) | 社員マスタ | 社員情報を管理 |
| 3 | [employee_section_cd](tables/03-employee_section_cd.md) | 社員別部署コード | 社員と部署コードの紐付け（認証用） |
| 4 | [departments](tables/04-departments.md) | 組織マスタ | センター・チームの組織構造を管理 |
| 5 | [department_employee](tables/05-department_employee.md) | 所属組織 | 社員と組織の紐付け |
| 6 | [department_section_cd](tables/06-department_section_cd.md) | 組織別部署コード | 組織と部署コードの紐付け |
| 7 | [permissions](tables/07-permissions.md) | 権限マスタ | システム権限を管理 |
| 8 | [roles](tables/08-roles.md) | 役割マスタ | 役割（ロール）を管理 |

### 中間テーブル

| No. | テーブル名 | 論理名 | 説明 |
|-----|-----------|--------|------|
| 9 | [permission_role](tables/09-permission_role.md) | 権限割当 | 役割と権限の多対多リレーション |
| 10 | [employee_role](tables/10-employee_role.md) | 役割割当 | 社員と役割の多対多リレーション |
| 11 | [visible_departments](tables/11-visible_departments.md) | 参照可能組織 | 社員が参照可能な組織を管理 |

### 得意先関連テーブル

| No. | テーブル名 | 論理名 | 説明 |
|-----|-----------|--------|------|
| 12 | [industries](tables/12-industries.md) | 業種マスタ | 業種分類を管理 |
| 13 | [customer_groups](tables/13-customer_groups.md) | 得意先グループマスタ | 得意先のグループを管理 |
| 14 | [companies](tables/14-companies.md) | 会社団体マスタ | 会社・団体情報を管理 |
| 15 | [customers](tables/15-customers.md) | 得意先マスタ | 得意先（事業部等）を管理 |
| 16 | [customer_section_cd](tables/16-customer_section_cd.md) | 部署別得意先 | 部署コードと得意先の紐付け |

### 見積関連テーブル

| No. | テーブル名 | 論理名 | 説明 |
|-----|-----------|--------|------|
| 17 | [quots](tables/17-quots.md) | 見積 | 見積情報を管理 |
| 18 | [prod_quots](tables/18-prod_quots.md) | 制作見積 | 制作見積情報を管理 |
| 19 | [prod_quot_requests](tables/19-prod_quot_requests.md) | 制作見積依頼 | 制作見積の依頼情報を管理 |
| 20 | [operations](tables/20-operations.md) | 作業部門マスタ | 作業部門を管理 |
| 21 | [proces_cds](tables/21-proces_cds.md) | 加工品内容コードマスタ | 加工品内容コードを管理 |
| 22 | [prod_quot_details](tables/22-prod_quot_details.md) | 制作見積詳細 | 制作見積の詳細情報を管理 |
| 23 | [prod_quot_operations](tables/23-prod_quot_operations.md) | 作業部門別制作見積 | 作業部門ごとの制作見積を管理 |
| 24 | [prod_quot_return_log](tables/24-prod_quot_return_log.md) | 制作見積差戻管理 | 制作見積の差戻履歴を管理 |
| 25 | [quot_operations](tables/25-quot_operations.md) | 作業部門別見積 | 作業部門ごとの見積を管理 |
| 26 | [quot_issue_log](tables/26-quot_issue_log.md) | 見積書発行履歴 | 見積書の発行履歴を管理 |

### 受注関連テーブル

| No. | テーブル名 | 論理名 | 説明 |
|-----|-----------|--------|------|
| 27 | [orders](tables/27-orders.md) | 受注テーブル | 受注情報を管理、見積から受注への転換を記録 |
| 28 | [order_operation_amounts](tables/28-order_operation_amounts.md) | 作業部門別受注金額テーブル | 受注の金額を作業部門ごとに分割して管理 |
| 29 | [work_number_relations](tables/29-work_number_relations.md) | 工番関連テーブル | 複数工番の関連性（親子関係）を管理 |

---

## データ階層

### 組織・権限系

```
社員 (employees)
├── 社員別部署コード (employee_section_cd) → 部署コード (section_cds)
├── 所属組織 (department_employee) → 組織 (departments)
├── 役割割当 (employee_role) → 役割 (roles) → 権限割当 (permission_role) → 権限 (permissions)
└── 参照可能組織 (visible_departments) → 組織 (departments)

組織 (departments)
└── 組織別部署コード (department_section_cd) → 部署コード (section_cds)
```

### 得意先系

```
業種 (industries)
└── 得意先グループ (customer_groups)
    └── 会社団体 (companies)
        └── 得意先 (customers)
            ├── 部署別得意先 (customer_section_cd) → 部署コード (section_cds)
            ├── 見積 (quots)
            │   └── 受注 (orders)
            └── 受注 (orders)
```

### 受注系

```
見積 (quots)
└── 受注 (orders)
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

---

## 共通仕様

### タイムスタンプ

- すべてのテーブルは `updated_at` カラムを持つ
- `created_at` は使用しない（モデルで `const CREATED_AT = null;` を設定）

### ソフトデリート

- マスタテーブルは `deleted_at` カラムによるソフトデリートを使用
- 中間テーブルは物理削除を使用

### 外部キー制約

- マスタデータへの参照: `RESTRICT`（参照先の削除を防ぐ）
- 中間テーブルの参照: `CASCADE`（親削除時に自動削除）

---

## 更新履歴

- 2025-12-08: 初版作成（部署コードマスタ、社員マスタ、社員別部署コード）
- 2025-12-08: 組織マスタ、所属組織テーブルを追加
- 2025-12-09: 権限マスタテーブルを追加
- 2025-12-09: 役割マスタテーブルを追加
- 2025-12-09: 権限割当テーブル (permission_role) を追加
- 2025-12-09: 役割マスタを30件に更新（編集以外系4役割を追加）、権限割当Seederを追加（201件）
- 2025-12-09: 役割割当テーブル (employee_role) を追加、EmployeeRoleSeeder追加（9件）
- 2025-12-10: 組織別部署コードテーブル (department_section_cd) を追加
- 2025-12-10: 参照可能組織テーブル (visible_departments) を追加
- 2025-12-10: 業種マスタテーブル (industries) を追加
- 2025-12-10: 得意先グループマスタテーブル (customer_groups) を追加
- 2025-12-10: 会社団体マスタテーブル (companies) を追加
- 2025-12-10: 得意先マスタテーブル (customers) を追加
- 2025-12-10: 部署別得意先テーブル (customer_section_cd) を追加
- 2025-12-10: ドキュメントを目次形式に変更、テーブル詳細を個別ファイルに分割
- 2025-12-12: 見積テーブル (quots) を追加
- 2025-12-22: 得意先テーブル (customers) カラム修正（customer_name, payment_type等）
- 2025-12-22: 見積テーブル (quots) カラム修正（status→quot_status, quot_date→quot_on）
- 2025-12-24: 制作見積関連テーブル8個を追加（prod_quots, prod_quot_requests, operations, proces_cds, prod_quot_details, prod_quot_operations, prod_quot_return_log, quot_operations）
- 2025-12-24: 見積書発行履歴テーブル (quot_issue_log) を追加
- 2025-12-25: ドキュメント整理、テーブル一覧を26件に更新
- 2026-01-29: 受注テーブル (orders) を追加、テーブル一覧を27件に更新
- 2026-01-30: 作業部門別受注金額テーブル (order_operation_amounts) と工番関連テーブル (work_number_relations) を追加、テーブル一覧を29件に更新
