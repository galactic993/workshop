# 制作見積依頼テーブル (prod_quot_requests)

## 概要

**テーブル物理名**: `prod_quot_requests`

**テーブル論理名**: 制作見積依頼テーブル

**用途**:
- 制作センター間の制作見積依頼を管理
- 主管センターが各制作センター（自身を含む）に対して行う制作見積依頼のステータスを管理
- 設計者、承認者の情報を保持

## テーブル定義

| No. | 論理名 | 物理名 | データ型 | 桁数 | Not Null | PK | UK | FK | Default | 備考 |
|-----|--------|--------|----------|------|----------|----|----|----|---------| ----- |
| 1 | 制作見積依頼id | prod_quot_request_id | BIGSERIAL | - | ● | ● | ● | - | - | 自動採番 |
| 2 | 制作見積id | prod_quot_id | BIGINT | - | ● | - | - | ● | - | 制作見積.prod_quot_id FK制約restrict |
| 3 | 作業部署id | section_cd_id | BIGINT | - | ● | - | - | ● | - | 部署コードマスタ.section_cd_id FK制約restrict |
| 4 | 依頼者id | requested_by | BIGINT | - | ● | - | - | ● | - | 社員マスタ.employee_id FK制約restrict |
| 5 | 依頼概要 | request_summary | TEXT | - | - | - | - | - | - | - |
| 6 | 参考資料 | reference_doc_path | VARCHAR(255) | 255 | - | - | - | - | - | - |
| 7 | 根拠資料 | supporting_doc_path | VARCHAR(255) | 255 | - | - | - | - | - | - |
| 8 | 設計者id | designed_by | BIGINT | - | - | - | - | ● | - | 社員マスタ.employee_id FK制約restrict |
| 9 | 承認者id | approved_by | BIGINT | - | - | - | - | ● | - | 社員マスタ.employee_id FK制約restrict |
| 10 | 承認日時 | approved_at | TIMESTAMP(0) | - | - | - | - | - | - | - |
| 11 | ステータス | prod_quot_request_status | CHAR(2) | 2 | ● | - | - | - | 00 | 00:設計中, 10:設計済, 20:承認済, 30:承認取消 |
| 12 | 作成日 | created_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |
| 13 | 更新日 | updated_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |

## インデックス

| インデックス名 | カラム | 種類 | 備考 |
|--------------|--------|------|------|
| prod_quot_requests_pkey | prod_quot_request_id | PRIMARY KEY | 主キー |
| prod_quot_requests_prod_quot_request_id_unique | prod_quot_request_id | UNIQUE | 制作見積依頼ID一意制約 |

## 外部キー制約

| 制約名 | カラム | 参照先テーブル | 参照先カラム | ON DELETE | ON UPDATE |
|--------|--------|---------------|--------------|-----------|-----------|
| prod_quot_requests_prod_quot_id_foreign | prod_quot_id | prod_quots | prod_quot_id | RESTRICT | RESTRICT |
| prod_quot_requests_section_cd_id_foreign | section_cd_id | section_cds | section_cd_id | RESTRICT | RESTRICT |
| prod_quot_requests_requested_by_foreign | requested_by | employees | employee_id | RESTRICT | RESTRICT |
| prod_quot_requests_designed_by_foreign | designed_by | employees | employee_id | RESTRICT | RESTRICT |
| prod_quot_requests_approved_by_foreign | approved_by | employees | employee_id | RESTRICT | RESTRICT |

## ステータス区分

| コード | 名称 | 説明 |
|--------|------|------|
| 00 | 設計中 | 初期ステータス。主管センターから制作見積依頼がされ、各制作センターで設計中の状態 |
| 10 | 設計済 | 制作見積が完了し、承認待ちの状態。承認の場合は「承認済」へ、否認された場合は「設計中」へ戻る |
| 20 | 承認済 | 制作見積が承認された状態 |
| 30 | 承認取消 | 承認後、営業側からの差戻し等で再度制作見積を行う必要がある場合。「設計中」と同じ扱い |

## 業務フロー

```
営業 ─→ 主管センター ─→ 各制作センター（主管センター含む）
       [制作見積]      [制作見積依頼]
       prod_quots      prod_quot_requests

1. 営業が見積画面から主管センターに制作見積依頼を実施
   → 制作見積(prod_quots)レコードが作成される

2. 主管センターは制作見積依頼を受けて、自身を含む関連制作センターに制作見積依頼を行う
   → 制作見積依頼(prod_quot_requests)レコードが作成される

3. 各制作センターで設計・見積作成を行い、承認フローを経て完了
```

## リレーション

```
制作見積依頼 (prod_quot_requests)
├── 制作見積 → 制作見積 (prod_quots)
├── 作業部署 → 部署コード (section_cds)
├── 依頼者 → 社員 (employees)
├── 設計者 → 社員 (employees)
├── 承認者 → 社員 (employees)
└── 制作見積詳細 ← 制作見積詳細 (prod_quot_details) [1:N]
```

## Eloquentモデル

- ファイル: `backend/app/Models/ProdQuotRequest.php`
- リレーション:
  - `prodQuot()`: 制作見積
  - `sectionCd()`: 作業部署
  - `requester()`: 依頼者
  - `designer()`: 設計者
  - `approver()`: 承認者
  - `prodQuotDetails()`: 制作見積詳細（1:N）
- アクセサ:
  - `status_label`: ステータスの日本語ラベル

## 関連テーブル

- [制作見積テーブル (prod_quots)](18-prod_quots.md)
- [制作見積詳細テーブル (prod_quot_details)](22-prod_quot_details.md)
- [部署コードマスタ (section_cds)](01-section_cds.md)
- [社員マスタ (employees)](02-employees.md)

## 更新履歴

- 2025-12-24: 初版作成
- 2026-01-12: テーブル定義フォーマット統一
