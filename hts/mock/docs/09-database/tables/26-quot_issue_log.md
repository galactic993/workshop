# 見積書発行履歴テーブル (quot_issue_log)

## 概要

**テーブル物理名**: `quot_issue_log`

**テーブル論理名**: 見積書発行履歴テーブル

**用途**:
- 見積書の発行履歴を管理
- 見積書が発行されるたびにレコードが追加
- 再発行時の履歴追跡に使用

## テーブル定義

| No. | 論理名 | 物理名 | データ型 | 桁数 | Not Null | PK | UK | FK | Default | 備考 |
|-----|--------|--------|----------|------|----------|----|----|----|---------| ----- |
| 1 | 見積書発行履歴id | quot_issue_log_id | BIGSERIAL | - | ● | ● | ● | - | - | 自動採番 |
| 2 | 見積id | quot_id | BIGINT | - | ● | - | - | ● | - | 見積.quot_id FK制約restrict |
| 3 | 発行日時 | issued_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |
| 4 | 発行者id | issued_by | BIGINT | - | ● | - | - | ● | - | 社員マスタ.employee_id FK制約restrict |
| 5 | ファイル名 | file_name | VARCHAR(255) | 255 | ● | - | - | - | - | 255桁以内 |
| 6 | 作成日 | created_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |

## インデックス

| インデックス名 | カラム | 種類 | 備考 |
|--------------|--------|------|------|
| quot_issue_log_pkey | quot_issue_log_id | PRIMARY KEY | 主キー |
| quot_issue_log_quot_issue_log_id_unique | quot_issue_log_id | UNIQUE | 見積書発行履歴ID一意制約 |
| quot_issue_log_quot_id_index | quot_id | INDEX | 見積ID検索用 |

## 外部キー制約

| 制約名 | カラム | 参照先テーブル | 参照先カラム | ON DELETE | ON UPDATE |
|--------|--------|---------------|--------------|-----------|-----------|
| quot_issue_log_quot_id_foreign | quot_id | quots | quot_id | RESTRICT | RESTRICT |
| quot_issue_log_issued_by_foreign | issued_by | employees | employee_id | RESTRICT | RESTRICT |

## リレーション

```
見積書発行履歴 (quot_issue_log)
├── 見積 → 見積 (quots)
└── 発行者 → 社員 (employees)
```

- 1つの見積に対して複数の発行履歴が存在可能（再発行のため）

## Eloquentモデル

- ファイル: `backend/app/Models/QuotIssueLog.php`
- リレーション:
  - `quot()`: 見積
  - `issuedBy()`: 発行者

## 関連テーブル

- [見積テーブル (quots)](17-quots.md)
- [社員マスタ (employees)](02-employees.md)

## 関連API

- `POST /api/quotes/{id}/issue` - 見積発行時に履歴追加
- `POST /api/quotes/{id}/reissue` - 見積再発行時に履歴追加

## 更新履歴

- 2025-12-24: テーブル作成（見積書発行機能実装）
- 2025-12-25: ドキュメント作成
- 2026-01-12: updated_atカラム削除、テーブル定義フォーマット統一
