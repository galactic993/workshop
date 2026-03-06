# 受注週報（部署別）API仕様書

## 概要

受注週報（部署別）機能に関するAPIエンドポイントの仕様書。部署別の受注データを集計し、PDF形式で出力する機能を提供します。

**機能権限**: `sales.orders.section-report`

**コントローラー**: `backend/app/Http/Controllers/Api/Sales/Orders/SectionReportController.php`

---

## エンドポイント一覧

| メソッド | URL | 説明 |
|---------|-----|------|
| POST | `/api/sales/orders/section-report/aggregate` | 受注週報（部署別）集計 |
| POST | `/api/sales/orders/section-report/export` | 受注週報（部署別）PDF出力 |

---

## 受注週報（部署別）集計API

部署別の受注データを集計し、集計結果を取得します。

### リクエスト

```
POST /api/sales/orders/section-report/aggregate
```

### 認証

- 必須（ミドルウェア）
- 権限: `sales.orders.section-report`

### リクエストボディ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| period_start | date | ○ | 集計期間開始日（yyyy-mm-dd） |
| period_end | date | ○ | 集計期間終了日（yyyy-mm-dd） |
| business_days | integer | ○ | 営業日数（1～月末日） |
| working_days | integer | ○ | 稼働日数（1～月末日） |
| include_aggregated | boolean | - | 集計済データを含める（デフォルト: false） |

### バリデーション

| フィールド | ルール |
|-----------|--------|
| period_start | 必須、日付形式、period_end以前の日付 |
| period_end | 必須、日付形式、period_start以降の日付 |
| business_days | 必須、整数、1～31の範囲 |
| working_days | 必須、整数、1～31の範囲 |
| include_aggregated | 真偽値 |

### レスポンス（成功時）

```json
{
  "success": true,
  "data": {
    "aggregation_id": 1,
    "period_start": "2025-01-01",
    "period_end": "2025-01-31",
    "business_days": 22,
    "working_days": 20,
    "sections": [
      {
        "section_cd": "262111",
        "section_name": "東京営業1課",
        "order_count": 45,
        "order_amount": 5000000,
        "orders_per_business_day": 2.05,
        "amount_per_business_day": 227272.73,
        "details": [
          {
            "order_id": 1,
            "order_no": "REC001",
            "customer_name": "株式会社A",
            "order_date": "2025-01-15",
            "amount": 100000
          }
        ]
      },
      {
        "section_cd": "262112",
        "section_name": "東京営業2課",
        "order_count": 32,
        "order_amount": 3200000,
        "orders_per_business_day": 1.45,
        "amount_per_business_day": 145454.55,
        "details": []
      }
    ],
    "summary": {
      "total_order_count": 77,
      "total_order_amount": 8200000,
      "average_orders_per_business_day": 3.50,
      "average_amount_per_business_day": 372727.28
    },
    "aggregated_at": "2025-01-28T10:30:00Z"
  },
  "message": "集計を完了しました"
}
```

### レスポンスフィールド

**ルートレベル:**

| フィールド | 型 | 説明 |
|-----------|-----|------|
| aggregation_id | integer | 集計ID（DB保存用） |
| period_start | date | 集計期間開始日 |
| period_end | date | 集計期間終了日 |
| business_days | integer | 営業日数 |
| working_days | integer | 稼働日数 |
| sections | array | 部署別集計結果 |
| summary | object | 全体集計結果 |
| aggregated_at | datetime | 集計実行日時 |

**sections配列要素:**

| フィールド | 型 | 説明 |
|-----------|-----|------|
| section_cd | string | 部署コード |
| section_name | string | 部署名 |
| order_count | integer | 受注件数 |
| order_amount | integer | 受注金額合計 |
| orders_per_business_day | number | 営業日当たりの受注件数 |
| amount_per_business_day | number | 営業日当たりの受注金額 |
| details | array | 受注詳細（フラット情報） |

**details配列要素:**

| フィールド | 型 | 説明 |
|-----------|-----|------|
| order_id | integer | 受注ID |
| order_no | string | 受注番号 |
| customer_name | string | 得意先名 |
| order_date | date | 受注日 |
| amount | integer | 受注金額 |

**summary:**

| フィールド | 型 | 説明 |
|-----------|-----|------|
| total_order_count | integer | 全部署の合計受注件数 |
| total_order_amount | integer | 全部署の合計受注金額 |
| average_orders_per_business_day | number | 営業日当たりの平均受注件数 |
| average_amount_per_business_day | number | 営業日当たりの平均受注金額 |

### エラーレスポンス

| HTTPステータス | メッセージ | 条件 |
|---------------|-----------|------|
| 401 | ログインしてください | 未認証（ミドルウェア） |
| 403 | 権限がありません | `sales.orders.section-report` 権限なし |
| 422 | バリデーションエラー | 入力値不正 |
| 500 | 集計に失敗しました | サーバーエラー |

### 使用例

```bash
curl -X POST http://localhost:8000/api/sales/orders/section-report/aggregate \
  -H "Content-Type: application/json" \
  -H "X-XSRF-TOKEN: {CSRF Token}" \
  -d '{
    "period_start": "2025-01-01",
    "period_end": "2025-01-31",
    "business_days": 22,
    "working_days": 20,
    "include_aggregated": false
  }'
```

---

## 受注週報（部署別）PDF出力API

集計結果をPDF形式で出力します。

### リクエスト

```
POST /api/sales/orders/section-report/export
```

### 認証

- 必須（ミドルウェア）
- 権限: `sales.orders.section-report`

### リクエストボディ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| aggregation_id | integer | ○ | 集計ID（集計API実行後に取得） |
| export_format | string | - | エクスポート形式（pdf, excel）、デフォルト: pdf |
| include_details | boolean | - | 受注詳細を含める（デフォルト: true） |

### バリデーション

| フィールド | ルール |
|-----------|--------|
| aggregation_id | 必須、整数、1以上、存在するレコード |
| export_format | 文字列、'pdf' または 'excel' |
| include_details | 真偽値 |

### レスポンス（成功時）

```json
{
  "success": true,
  "data": {
    "file_path": "/storage/reports/section-reports/2025-01-28_section_report.pdf",
    "file_name": "2025-01-28_section_report.pdf",
    "file_size": 102400,
    "generated_at": "2025-01-28T10:35:00Z"
  },
  "message": "出力しました"
}
```

### レスポンスフィールド

| フィールド | 型 | 説明 |
|-----------|-----|------|
| file_path | string | 生成ファイルの保存パス |
| file_name | string | ファイル名 |
| file_size | integer | ファイルサイズ（バイト） |
| generated_at | datetime | ファイル生成日時 |

### PDFレイアウト

**表紙:**
- タイトル: 「受注週報（部署別）」
- 集計期間: 期間開始日～期間終了日
- 営業日数、稼働日数
- 生成日時

**本体:**
1. 全体集計表
   - 全部署合計受注件数、受注金額
   - 営業日当たりの平均値

2. 部署別集計表（1部署 = 1ページまたは複数ページ）
   - 部署名、部署コード
   - 受注件数、受注金額
   - 営業日当たりの値
   - （include_details=true時）受注詳細一覧

### エラーレスポンス

| HTTPステータス | メッセージ | 条件 |
|---------------|-----------|------|
| 401 | ログインしてください | 未認証（ミドルウェア） |
| 403 | 権限がありません | `sales.orders.section-report` 権限なし |
| 404 | 集計データが見つかりません | aggregation_idが存在しない |
| 422 | バリデーションエラー | 入力値不正 |
| 500 | 出力に失敗しました | ファイル生成エラー |

### 使用例

```bash
curl -X POST http://localhost:8000/api/sales/orders/section-report/export \
  -H "Content-Type: application/json" \
  -H "X-XSRF-TOKEN: {CSRF Token}" \
  -d '{
    "aggregation_id": 1,
    "export_format": "pdf",
    "include_details": true
  }'
```

---

## フロントエンド画面仕様

### ページパス

```
/sales/orders/section-report
```

### ページ名

受注週報（部署別）

### 入力項目

| 項目 | 型 | 入力方式 | 必須 | 備考 |
|------|-----|---------|------|------|
| 累計期間開始日 | date | ラベル表示 | ○ | 前月1日をデフォルト表示 |
| 累計期間終了日 | date | 日付入力 | ○ | 前月末日をデフォルト入力 |
| 営業日数 | number | 数値入力 | ○ | スピナーコントロール、1～31の範囲 |
| 稼働日数 | number | 数値入力 | ○ | スピナーコントロール、1～31の範囲 |
| 集計済データ出力 | checkbox | チェックボックス | - | デフォルト: チェック無し |

### ボタン

| ボタン | 機能 | 状態 |
|--------|------|------|
| 集計 | 集計APIを実行 | 入力値のバリデーション後に活性 |
| 出力 | PDF出力APIを実行 | 集計完了後に活性 |

### 画面の動作

1. **初期表示時**
   - 累計期間開始日: 前月1日をラベル表示
   - 累計期間終了日: 前月末日をセット
   - 営業日数: 22（可変）
   - 稼働日数: 20（可変）
   - 「集計」ボタン: 活性
   - 「出力」ボタン: 非活性

2. **「集計」ボタン押下時**
   - フロントエンドバリデーション実行
   - 集計APIを実行（`aggregate`）
   - 集計結果をテーブルで表示
   - 「出力」ボタンを活性化

3. **「出力」ボタン押下時**
   - PDF出力APIを実行（`export`）
   - ファイルをダウンロード

### フロントエンドバリデーション

| フィールド | ルール |
|-----------|--------|
| period_start | 表示用（バリデーション不要） |
| period_end | 必須、日付形式 |
| business_days | 必須、整数、1～31 |
| working_days | 必須、整数、1～31 |

### 集計結果の表示形式

**全体集計セクション:**

```
┌─────────────────────────────────────────────────────┐
│ 全体集計（集計期間: 2025-01-01 ～ 2025-01-31）    │
├─────────────────────────────────────────────────────┤
│ 受注件数: 77件                                      │
│ 受注金額: ¥8,200,000                               │
│ 営業日当たり平均受注件数: 3.50件                    │
│ 営業日当たり平均受注金額: ¥372,727                 │
└─────────────────────────────────────────────────────┘
```

**部署別集計テーブル:**

| 部署コード | 部署名 | 受注件数 | 受注金額 | 営業日当たり<br/>受注件数 | 営業日当たり<br/>受注金額 |
|-----------|--------|---------|---------|------------------------|------------------------|
| 262111 | 東京営業1課 | 45 | ¥5,000,000 | 2.05 | ¥227,273 |
| 262112 | 東京営業2課 | 32 | ¥3,200,000 | 1.45 | ¥145,455 |

**部署別詳細セクション（クリック展開）:**

選択した部署の受注詳細を折りたたみ可能なセクションで表示

| 受注番号 | 得意先名 | 受注日 | 金額 |
|---------|---------|-------|------|
| REC001 | 株式会社A | 2025-01-15 | ¥100,000 |
| REC002 | 株式会社B | 2025-01-20 | ¥150,000 |

---

## データ集計ロジック

### 集計対象データ

- テーブル: `orders`（受注テーブル）
- 条件: `order_date` が `period_start` ～ `period_end` の範囲内
- 部署: ユーザーの権限に基づいてフィルタリング

### 権限による集計対象の絞り込み

| アクセス区分 | 集計対象 |
|------------|---------|
| 一般（40） | 自身の部署に紐づく受注のみ |
| 所長（20） | 所属センター配下の全部署の受注 |
| 全て（00） | 全部署の受注 |

### 計算式

| 項目 | 式 |
|------|-----|
| 受注件数 | COUNT(order_id) |
| 受注金額合計 | SUM(amount) |
| 営業日当たり受注件数 | 受注件数 / business_days |
| 営業日当たり受注金額 | 受注金額合計 / business_days |

---

## アクセス制御

### 権限チェック

- **必須権限**: `sales.orders.section-report`
- **未認証**: 401エラーを返却
- **権限なし**: 403エラーを返却

### データアクセス制御

集計APIとPDF出力APIでは、ユーザーのアクセス区分に基づいて以下の制御を実施：

1. アクセス区分「一般（40）」
   - 自身の社員別部署コードに紐づく受注のみ集計

2. アクセス区分「所長（20）」
   - 所属センター配下の部署コードに紐づく受注を集計
   - 参照可能組織（センター）配下の受注も含める

3. アクセス区分「全て（00）」
   - 全部署の受注を集計

---

## 関連ドキュメント

- [認証仕様書](../06-authentication/authentication.md)
- [受注テーブル設計](../09-database/tables/orders.md)

---

## 更新履歴

- 2026-01-28: 初版作成
