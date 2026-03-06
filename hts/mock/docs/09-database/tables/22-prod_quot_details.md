# 制作見積詳細テーブル (prod_quot_details)

## 概要

**テーブル物理名**: `prod_quot_details`

**テーブル論理名**: 制作見積詳細テーブル

**用途**:
- 制作見積依頼に対して各センターの設計者が設計を行った内容を管理
- 必要な工程が複数ある場合には、制作見積依頼に対して工程数分のレコードが作成
- 数量、単価、金額などの詳細情報を保持

## テーブル定義

| No. | 論理名 | 物理名 | データ型 | 桁数 | Not Null | PK | UK | FK | Default | 備考 |
|-----|--------|--------|----------|------|----------|----|----|----|---------| ----- |
| 1 | 制作見積詳細id | prod_quot_detail_id | BIGSERIAL | - | ● | ● | ● | - | - | 自動採番 |
| 2 | 制作見積依頼id | prod_quot_request_id | BIGINT | - | ● | - | - | ● | - | 制作見積依頼.prod_quot_request_id FK制約restrict |
| 3 | 加工品内容id | proces_cd_id | BIGINT | - | ● | - | - | ● | - | 加工品内容コードマスタ.proces_cd_id FK制約restrict |
| 4 | 設計者id | employee_id | BIGINT | - | ● | - | - | ● | - | 社員マスタ.employee_id FK制約restrict |
| 5 | 数量 | quantity | INTEGER | - | ● | - | - | - | - | - |
| 6 | 単価 | unit_cost | DECIMAL(12,0) | 12 | ● | - | - | - | - | 12桁以内,少数なし |
| 7 | 金額 | cost | DECIMAL(12,0) | 12 | ● | - | - | - | - | 12桁以内,少数なし |
| 8 | 作成日 | created_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |
| 9 | 更新日 | updated_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |

## インデックス

| インデックス名 | カラム | 種類 | 備考 |
|--------------|--------|------|------|
| prod_quot_details_pkey | prod_quot_detail_id | PRIMARY KEY | 主キー |
| prod_quot_details_prod_quot_detail_id_unique | prod_quot_detail_id | UNIQUE | 制作見積詳細ID一意制約 |

## 外部キー制約

| 制約名 | カラム | 参照先テーブル | 参照先カラム | ON DELETE | ON UPDATE |
|--------|--------|---------------|--------------|-----------|-----------|
| prod_quot_details_prod_quot_request_id_foreign | prod_quot_request_id | prod_quot_requests | prod_quot_request_id | RESTRICT | RESTRICT |
| prod_quot_details_proces_cd_id_foreign | proces_cd_id | proces_cds | proces_cd_id | RESTRICT | RESTRICT |
| prod_quot_details_employee_id_foreign | employee_id | employees | employee_id | RESTRICT | RESTRICT |

## リレーション

```
制作見積詳細 (prod_quot_details)
├── 制作見積依頼 → 制作見積依頼 (prod_quot_requests)
├── 加工品内容 → 加工品内容コードマスタ (proces_cds)
└── 設計者 → 社員 (employees)
```

## Eloquentモデル

- ファイル: `backend/app/Models/ProdQuotDetail.php`
- リレーション:
  - `prodQuotRequest()`: 制作見積依頼
  - `procesCd()`: 加工品内容コード
  - `employee()`: 設計者

## 関連テーブル

- [制作見積依頼テーブル (prod_quot_requests)](19-prod_quot_requests.md)
- [加工品内容コードマスタ (proces_cds)](21-proces_cds.md)
- [社員マスタ (employees)](02-employees.md)

## 更新履歴

- 2025-12-24: 初版作成
- 2026-01-12: テーブル定義フォーマット統一
