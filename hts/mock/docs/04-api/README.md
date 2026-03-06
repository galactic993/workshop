# API仕様書

## 概要

管理会計システムのバックエンドAPI仕様を定義します。

---

## ドキュメント構成

```
docs/04-api/
├── README.md           # 本ファイル（概要、共通仕様）
├── auth.md             # 認証API
├── centers.md          # センターAPI
├── customers.md        # 得意先API
├── quotes.md           # 見積API
├── orders-import.md    # 受注情報取込API
├── section-report.md   # 受注週報（部署別）API
└── customer-report.md  # 受注週報（得意先別）API
```

---

## 共通仕様

### ベースURL

```
/api
```

### 認証

**ミドルウェアベースの統一認証チェック:**
- `EnsureSessionAuthenticated` ミドルウェア（`authenticated` エイリアス）をルートグループに適用
- ルートグループ配下の全エンドポイントで自動的に認証チェック実施
- 未認証時は統一されたエラーメッセージを返却

**アクセス要件:**
- ログイン前: `/api/login`, `/api/auth/check` のみアクセス可能
- ログイン後: 全APIにアクセス可能（権限による制限あり）

**認証失敗時（401）:**
```json
{
  "success": false,
  "message": "ログインしてください"
}
```

### リクエストヘッダー

```
Content-Type: application/json
Accept: application/json
X-XSRF-TOKEN: {CSRF Token}
```

### レスポンス形式

**成功時**:
```json
{
  "success": true,
  "data": { ... },
  "message": "操作が完了しました"
}
```

**エラー時**:
```json
{
  "success": false,
  "message": "エラーメッセージ",
  "errors": {
    "field": ["バリデーションエラー"]
  }
}
```

### HTTPステータスコード

| コード | 説明 |
|--------|------|
| 200 | 成功 |
| 201 | 作成成功 |
| 400 | リクエスト不正 |
| 401 | 未認証 |
| 403 | アクセス拒否 |
| 404 | リソース不存在 |
| 422 | バリデーションエラー |
| 500 | サーバーエラー |

---

## API一覧

### 認証API（→ [auth.md](./auth.md)）

| メソッド | エンドポイント | 説明 |
|----------|----------------|------|
| POST | `/api/login` | ログイン |
| POST | `/api/logout` | ログアウト |
| GET | `/api/auth/check` | 認証状態確認 |

### センターAPI（→ [centers.md](./centers.md)）

| メソッド | エンドポイント | 説明 |
|----------|----------------|------|
| GET | `/api/centers` | アクセス可能なセンター一覧取得 |
| GET | `/api/centers/all` | 全センター一覧取得 |
| GET | `/api/centers/quot` | 見積用センター一覧取得 |

### 得意先API（→ [customers.md](./customers.md)）

| メソッド | エンドポイント | 説明 |
|----------|----------------|------|
| GET | `/api/customers/suggest` | 得意先サジェスト検索 |
| GET | `/api/customers/section-customers` | 部署別得意先一覧取得 |
| POST | `/api/customers/section-customers` | 部署別得意先追加 |
| DELETE | `/api/customers/section-customers` | 部署別得意先削除 |

### 見積API（→ [quotes.md](./quotes.md)）

| メソッド | エンドポイント | 説明 |
|----------|----------------|------|
| GET | `/api/quotes` | 見積一覧取得 |
| POST | `/api/quotes` | 見積新規登録 |
| GET | `/api/quotes/{id}` | 見積詳細取得 |
| PUT | `/api/quotes/{id}` | 見積更新 |
| POST | `/api/quotes/{id}/approve` | 見積承認 |
| POST | `/api/quotes/{id}/cancel-approve` | 見積承認取消 |
| POST | `/api/quotes/{id}/request-production` | 制作見積依頼 |
| POST | `/api/quotes/{id}/reject` | 見積差戻し |
| POST | `/api/quotes/{id}/register` | 見積登録 |
| POST | `/api/quotes/{id}/cancel-register` | 見積登録取消 |
| POST | `/api/quotes/{id}/update-amounts` | 見積金額更新 |
| POST | `/api/quotes/{id}/issue` | 見積発行（Excel） |
| POST | `/api/quotes/{id}/reissue` | 見積再発行 |
| POST | `/api/quotes/{id}/update-status60` | ステータス60更新 |

### 受注情報取込API（→ [orders-import.md](./orders-import.md)）

| メソッド | エンドポイント | 説明 |
|----------|----------------|------|
| POST | `/api/orders/import` | 受注情報取込バリデーション |

### 受注週報（部署別）API（→ [section-report.md](./section-report.md)）

| メソッド | エンドポイント | 説明 |
|----------|----------------|------|
| POST | `/api/sales/orders/section-report/aggregate` | 受注週報（部署別）集計 |
| POST | `/api/sales/orders/section-report/export` | 受注週報（部署別）PDF出力 |

### 受注週報（得意先別）API（→ [customer-report.md](./customer-report.md)）

| メソッド | エンドポイント | 説明 |
|----------|----------------|------|
| POST | `/api/sales/orders/customer-report/export` | 受注週報（得意先別）PDF出力 |

※ 得意先別では部署別の共通集計結果を参照するため、aggregate エンドポイントはなし

---

## 更新履歴

- 2025-12-25: 初版作成（APIドキュメント分割・整理）
- 2026-01-28: 認証セクションを更新（ミドルウェアベースの認証チェック説明、エラーレスポンス例を追加）
- 2026-01-28: 受注週報（部署別）APIドキュメントを追加
- 2026-01-28: 受注週報（得意先別）APIドキュメントを追加
- 2026-01-30: 受注情報取込APIドキュメントを追加
- 2026-01-30: 受注週報（得意先別）APIの aggregate エンドポイント説明を修正（集計は部署別の共通テーブル参照）
