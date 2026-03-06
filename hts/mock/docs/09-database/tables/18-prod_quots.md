# 制作見積テーブル (prod_quots)

## 概要

**テーブル物理名**: `prod_quots`

**テーブル論理名**: 制作見積テーブル

**用途**:
- 営業側から制作側に対して行った制作見積依頼全体のステータスを管理
- 見積に紐付く制作見積の進捗状況を追跡
- 制作見積依頼、作業部門別制作見積、差戻管理の親テーブル

## テーブル定義

| No. | 論理名 | 物理名 | データ型 | 桁数 | Not Null | PK | UK | FK | Default | 備考 |
|-----|--------|--------|----------|------|----------|----|----|----|---------| ----- |
| 1 | 制作見積id | prod_quot_id | BIGSERIAL | - | ● | ● | ● | - | - | 自動採番 |
| 2 | 見積id | quot_id | BIGINT | - | ● | - | - | ● | - | 見積.quot_id FK制約cascade |
| 3 | 基準価格 | cost | DECIMAL(12,0) | 12 | ● | - | - | - | - | 12桁以内, 小数なし |
| 4 | 制作見積書アップロード先 | quot_doc_path | VARCHAR(255) | 255 | - | - | - | - | - | - |
| 5 | 関連資料 | reference_doc_path | VARCHAR(255) | 255 | - | - | - | - | - | - |
| 6 | 営業提出日 | submission_on | DATE | - | - | - | - | - | - | - |
| 7 | ステータス | prod_quot_status | CHAR(2) | 2 | ● | - | - | - | 00 | 00:未着手, 10:制作見積中, 20:制作見積済, 30:受取済, 40:発行済, 50:差戻 |
| 8 | バージョン | version | SMALLINT | - | ● | - | - | - | 1 | - |
| 9 | 作成日 | created_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |
| 10 | 更新日 | updated_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |

## インデックス

| インデックス名 | カラム | 種類 | 備考 |
|--------------|--------|------|------|
| prod_quots_pkey | prod_quot_id | PRIMARY KEY | 主キー |
| prod_quots_prod_quot_id_unique | prod_quot_id | UNIQUE | 制作見積ID一意制約 |

## 外部キー制約

| 制約名 | カラム | 参照先テーブル | 参照先カラム | ON DELETE | ON UPDATE |
|--------|--------|---------------|--------------|-----------|-----------|
| prod_quots_quot_id_foreign | quot_id | quots | quot_id | CASCADE | RESTRICT |

## ステータス区分

| コード | 名称 | 説明 |
|--------|------|------|
| 00 | 未着手 | 初期ステータス。営業側で見積情報が登録（初回登録）され、主管センターに対して制作見積依頼を行った状態 |
| 10 | 制作見積中 | 主管センターから各制作センターへ制作見積依頼がされ、各制作センターが制作見積中の状態 |
| 20 | 制作見積済 | 主管センター含む各制作センターの制作見積が全て完了（関連する制作見積依頼レコードのステータスが全て承認済）した状態 |
| 30 | 受取済 | 承認された各制作センターの制作見積を主管センターが受け取った状態。以降は承認の取消含むデータの編集は不可（差戻しは除く） |
| 40 | 発行済 | 主管センター含む各制作センターの制作見積を集約し発行、営業側へ提出した状態 |
| 50 | 差戻 | 営業側へ提出した制作見積が差戻された状態。制作見積済（20）と同じ扱い |

## リレーション

```
制作見積 (prod_quots)
├── 見積 → 見積 (quots)
├── 制作見積依頼 ← 制作見積依頼 (prod_quot_requests) [1:N]
├── 作業部門別制作見積 ← 作業部門別制作見積 (prod_quot_operations) [1:N]
└── 制作見積差戻管理 ← 制作見積差戻管理 (prod_quot_return_log) [1:N]
```

## Eloquentモデル

- ファイル: `backend/app/Models/ProdQuot.php`
- リレーション:
  - `quot()`: 見積
  - `prodQuotRequests()`: 制作見積依頼（1:N）
  - `prodQuotOperations()`: 作業部門別制作見積（1:N）
  - `prodQuotReturnLogs()`: 制作見積差戻管理（1:N）
- アクセサ:
  - `status_label`: ステータスの日本語ラベル

## 関連テーブル

- [見積テーブル (quots)](17-quots.md)
- [制作見積依頼テーブル (prod_quot_requests)](19-prod_quot_requests.md)
- [作業部門別制作見積テーブル (prod_quot_operations)](23-prod_quot_operations.md)
- [制作見積差戻管理テーブル (prod_quot_return_log)](24-prod_quot_return_log.md)

## 更新履歴

- 2025-12-24: 初版作成
- 2026-01-12: cost論理名変更（基準金額→基準価格）、テーブル定義フォーマット統一
