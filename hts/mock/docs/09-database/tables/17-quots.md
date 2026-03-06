# 見積テーブル (quots)

## 概要

**テーブル物理名**: `quots`

**テーブル論理名**: 見積テーブル

**用途**:
- 見積情報を管理
- 見積の作成から発行までのワークフローを制御
- 得意先、担当者、承認者などの関連情報を保持

## テーブル定義

| No. | 論理名 | 物理名 | データ型 | 桁数 | Not Null | PK | UK | FK | Default | 備考 |
|-----|--------|--------|----------|------|----------|----|----|----|---------| ----- |
| 1 | 見積id | quot_id | BIGSERIAL | - | ● | ● | ● | - | - | 自動採番 |
| 2 | 担当部署id | section_cd_id | BIGINT | - | ● | - | - | ● | - | 部署コードマスタ.section_cd_id FK制約restrict |
| 3 | 担当者id | employee_id | BIGINT | - | ● | - | - | ● | - | 社員マスタ.employee_id FK制約restrict |
| 4 | 流用元見積id | base_quot_id | BIGINT | - | - | - | - | ● | - | 見積.quot_id FK制約restrict |
| 5 | 見積書No | quot_number | CHAR(12) | 12 | ● | - | ● | - | - | 12桁 自動採番 得意先コード+yymm+連番(年月ごと) 例:479042601001 |
| 6 | 品名 | prod_name | VARCHAR(50) | 50 | - | - | - | - | - | 50桁以内 |
| 7 | 得意先id | customer_id | BIGINT | - | ● | - | - | ● | - | 得意先マスタ.customer_id FK制約restrict |
| 8 | 得意先名 | customer_name | VARCHAR(120) | 120 | - | - | - | - | - | 得意先コードが33900（諸口）の時のみ入力 |
| 9 | 見積件名 | quot_subject | VARCHAR(50) | 50 | - | - | - | - | - | 50桁以内 |
| 10 | 見積概要 | quot_summary | TEXT | - | - | - | - | - | - | - |
| 11 | 参考資料 | reference_doc_path | VARCHAR(255) | 255 | - | - | - | - | - | 255桁以内 |
| 12 | 主管センターid | center_section_cd_id | BIGINT | - | - | - | - | ● | - | 部署コードマスタ.section_cd_id FK制約restrict |
| 13 | 承認者id | approved_by | BIGINT | - | - | - | - | ● | - | 社員マスタ.employee_id FK制約restrict |
| 14 | 承認日時 | approved_at | TIMESTAMP(0) | - | - | - | - | - | - | - |
| 15 | 見積ステータス | quot_status | CHAR(2) | 2 | ● | - | - | - | 00 | 00:作成中, 10:承認待ち, 20:承認済, 30:発行済 |
| 16 | 制作見積ステータス | prod_quot_status | CHAR(2) | 2 | ● | - | - | - | 00 | 00:制作見積依頼前, 10:制作見積依頼済, 20:制作見積済, 30:制作見積受取済 |
| 17 | 見積金額 | quot_amount | DECIMAL(12,0) | 12 | - | - | - | - | - | 12桁以内, 小数なし |
| 18 | 提出方法 | submission_method | CHAR(2) | 2 | ● | - | - | - | 00 | 00:未定, 10:メール, 20:郵送, 30:持参 |
| 19 | 見積日 | quot_on | DATE | - | - | - | - | - | - | - |
| 20 | 見積書ファイルパス | quot_doc_path | VARCHAR(255) | 255 | - | - | - | - | - | 発行済見積書のファイルパス |
| 21 | 見積結果 | quot_result | CHAR(2) | 2 | ● | - | - | - | 00 | 00:未確定, 10:受注, 20:失注 |
| 22 | 失注理由 | lost_reason | TEXT | - | - | - | - | - | - | - |
| 23 | 伝達事項 | message | TEXT | - | - | - | - | - | - | - |
| 24 | 作成日 | created_at | TIMESTAMP | - | ● | - | - | - | CURRENT_TIMESTAMP | - |
| 25 | 更新日 | updated_at | TIMESTAMP | - | ● | - | - | - | CURRENT_TIMESTAMP | - |

## インデックス

| インデックス名 | カラム | 種類 | 備考 |
|--------------|--------|------|------|
| quots_pkey | quot_id | PRIMARY KEY | 主キー |
| quots_quot_id_unique | quot_id | UNIQUE | 見積ID一意制約 |
| quots_quot_number_unique | quot_number | UNIQUE | 見積書No一意制約 |

## 外部キー制約

| 制約名 | カラム | 参照先テーブル | 参照先カラム | ON DELETE | ON UPDATE |
|--------|--------|---------------|--------------|-----------|-----------|
| quots_section_cd_id_foreign | section_cd_id | section_cds | section_cd_id | RESTRICT | RESTRICT |
| quots_employee_id_foreign | employee_id | employees | employee_id | RESTRICT | RESTRICT |
| quots_base_quot_id_foreign | base_quot_id | quots | quot_id | RESTRICT | RESTRICT |
| quots_customer_id_foreign | customer_id | customers | customer_id | RESTRICT | RESTRICT |
| quots_center_section_cd_id_foreign | center_section_cd_id | section_cds | section_cd_id | RESTRICT | RESTRICT |
| quots_approved_by_foreign | approved_by | employees | employee_id | RESTRICT | RESTRICT |

## 見積ステータス区分 (quot_status)

| コード | 名称 | 説明 |
|--------|------|------|
| 00 | 作成中 | 見積を作成中の状態 |
| 10 | 承認待ち | 上長の承認待ち状態 |
| 20 | 承認済 | 上長が承認した状態 |
| 30 | 発行済 | 見積書を発行した状態 |

## 制作見積ステータス区分 (prod_quot_status)

| コード | 名称 | 説明 |
|--------|------|------|
| 00 | 制作見積依頼前 | 制作部門への見積依頼前の状態 |
| 10 | 制作見積依頼済 | 制作部門に見積依頼を送信した状態 |
| 20 | 制作見積済 | 制作部門が見積を完了した状態 |
| 30 | 制作見積受取済 | 営業が制作見積を受け取った状態 |

## 提出方法区分

| コード | 名称 |
|--------|------|
| 00 | 未定 |
| 10 | メール |
| 20 | 郵送 |
| 30 | 持参 |

## 見積結果区分

| コード | 名称 |
|--------|------|
| 00 | 未確定 |
| 10 | 受注 |
| 20 | 失注 |

## 見積書No採番ルール

- 形式: `CCCCCYYMMNNN` (12桁固定)
- CCCCC: 得意先コード (5桁)
- YY: 西暦下2桁 (例: 26)
- MM: 月 (01-12)
- NNN: 得意先コード+年月ごとの連番 (001から開始)
- 例: `479042601001` = 得意先コード47904 + 2026年01月 + 連番001

## リレーション

```
見積 (quots)
├── 担当部署 → 部署コード (section_cds)
├── 担当者 → 社員 (employees)
├── 流用元見積 → 見積 (quots) [自己参照]
├── 得意先 → 得意先 (customers)
├── 主管センター → 部署コード (section_cds)
├── 承認者 → 社員 (employees)
├── 制作見積 ← 制作見積 (prod_quots) [1:N]
├── 作業部門別見積 ← 作業部門別見積 (quot_operations) [1:N]
└── 受注 ← 受注 (orders) [1:N]
```

## Eloquentモデル

- ファイル: `backend/app/Models/Quot.php`
- リレーション:
  - `sectionCd()`: 担当部署
  - `employee()`: 担当者
  - `baseQuot()`: 流用元見積
  - `customer()`: 得意先
  - `centerSectionCd()`: 主管センター
  - `approver()`: 承認者
  - `prodQuots()`: 制作見積（1:N）
  - `quotOperations()`: 作業部門別見積（1:N）
- アクセサ:
  - `status_label`: 見積ステータスの日本語ラベル
  - `prod_quot_status_label`: 制作見積ステータスの日本語ラベル
  - `submission_method_label`: 提出方法の日本語ラベル
  - `quot_result_label`: 見積結果の日本語ラベル

## 関連テーブル

- [制作見積テーブル (prod_quots)](18-prod_quots.md)
- [作業部門別見積テーブル (quot_operations)](25-quot_operations.md)
- [受注テーブル (orders)](27-orders.md)

## 諸口対応

得意先マスタに登録されていない得意先に対して見積を作成する場合、「諸口」(得意先コード: 33900)を選択し、`customer_name`カラムに実際の得意先名を入力する。

- 諸口の得意先コード: `33900`
- 諸口選択時は`customer_name`の入力が必須
- 一覧・詳細表示では`customer_name`があれば優先的に表示

## 更新履歴

- 2025-12-08: 初版作成
- 2025-12-13: Eloquentモデルファイル名を修正（Quote.php → Quot.php）
- 2025-12-22: カラム名変更（status → quot_status, quot_date → quot_on）、参考資料カラム追加
- 2025-12-24: 制作見積テーブルへのリレーション、customer_nameカラム（諸口対応）を追加
- 2025-12-24: submission_methodを登録時必須に変更
- 2026-01-12: prod_name, quot_subject, quot_summary, center_section_cd_idをnullable化
- 2026-01-12: submission_methodの値変更（00:未定追加、コード体系変更）、デフォルト値追加
- 2026-01-12: テーブル定義フォーマット統一
- 2026-01-18: base_quot_id（流用元見積）カラム追加
- 2026-01-18: quot_numberを11桁に変更、採番ルール変更（得意先コード+年月+連番）
- 2026-01-18: prod_quot_status（制作見積ステータス）カラム追加
- 2026-01-18: quot_statusのステータス体系変更（7種類→4種類、制作見積ステータスを分離）
- 2026-01-18: quot_doc_path（見積書ファイルパス）カラム追加
- 2026-01-19: message（伝達事項）カラム追加
