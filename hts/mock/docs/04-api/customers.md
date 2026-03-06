# 得意先API

## 概要

得意先情報を取得・管理するAPIを定義します。

**コントローラー**: `backend/app/Http/Controllers/Api/CustomerController.php`

---

## 得意先サジェスト検索

テキスト入力に基づいて得意先をサジェスト検索します。

### リクエスト

```
GET /api/customers/suggest
```

### クエリパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| query | string | ○ | 検索キーワード（得意先コードまたは得意先名） |
| center_id | integer | - | センターID（指定時はセンターに紐づく得意先のみ） |
| exclude_existing | boolean | - | 既に部署別得意先として登録済みの得意先を除外 |

### レスポンス（成功時）

```json
{
  "success": true,
  "customers": [
    {
      "customer_id": 1,
      "customer_cd": "00001",
      "customer_name": "株式会社テスト"
    },
    {
      "customer_id": 2,
      "customer_cd": "00002",
      "customer_name": "テスト工業株式会社"
    }
  ]
}
```

### 検索ロジック

- スペース区切りでAND検索
- 得意先コード（前方一致）または得意先名（部分一致）で検索
- 最大10件を返却

---

## 部署別得意先一覧取得

センターに紐づく部署別得意先の一覧を取得します。

### リクエスト

```
GET /api/customers/section-customers
```

### クエリパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| center_id | integer | ○ | センターID |
| page | integer | - | ページ番号（デフォルト: 1） |
| per_page | integer | - | 1ページの件数（デフォルト: 10） |
| sort_field | string | - | ソートフィールド（デフォルト: customer_cd） |
| sort_order | string | - | ソート順（asc/desc、デフォルト: asc） |

### レスポンス（成功時）

```json
{
  "success": true,
  "data": {
    "customers": [
      {
        "customer_section_cd_id": 1,
        "customer_id": 1,
        "customer_cd": "00001",
        "customer_name": "株式会社テスト"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 25,
      "last_page": 3
    }
  }
}
```

---

## 部署別得意先追加

センターに得意先を紐づけます。

### リクエスト

```
POST /api/customers/section-customers
```

### リクエストボディ

```json
{
  "center_id": 1,
  "customer_id": 5
}
```

### レスポンス（成功時）

```json
{
  "success": true,
  "message": "登録しました"
}
```

### エラーレスポンス

**既に登録済みの場合**:
```json
{
  "success": false,
  "message": "この得意先は既に登録されています"
}
```

---

## 部署別得意先削除

センターから得意先の紐づけを解除します。

### リクエスト

```
DELETE /api/customers/section-customers
```

### クエリパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| center_id | integer | ○ | センターID |
| customer_id | integer | ○ | 得意先ID |

### レスポンス（成功時）

```json
{
  "success": true,
  "message": "削除しました"
}
```

### エラーレスポンス

**紐づけが存在しない場合**:
```json
{
  "success": false,
  "message": "指定された部署別得意先が見つかりません"
}
```

---

## 関連ドキュメント

- [部署別得意先メンテナンスページ](../05-frontend/pages/sales.md)
- [得意先テーブル](../09-database/tables/15-customers.md)
- [部署別得意先テーブル](../09-database/tables/16-customer_section_cd.md)

---

## 更新履歴

- 2025-12-25: 初版作成
