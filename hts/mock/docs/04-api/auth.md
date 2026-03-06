# 認証API

## 概要

認証関連のAPIを定義します。

**コントローラー**: `backend/app/Http/Controllers/Api/AuthController.php`

詳細な認証仕様は [認証仕様書](../06-authentication/authentication.md) を参照してください。

---

## ログイン

部署コードと社員コードによるパスワードレス認証を行います。

### リクエスト

```
POST /api/login
```

### リクエストボディ

```json
{
  "section_cd": "262000",
  "employee_cd": "000001"
}
```

### レスポンス（成功時）

```json
{
  "success": true,
  "user": {
    "employee_id": 1,
    "employee_cd": "000001",
    "employee_name": "山田太郎",
    "access_type": "00",
    "center_name": "東京営業所",
    "team_name": "営業1課",
    "roles": ["admin"],
    "permissions": ["sales.quotes.create", "sales.orders.create"]
  }
}
```

### エラーレスポンス

**認証失敗時**:
```json
{
  "success": false,
  "message": "部署コードまたは社員コードが正しくありません"
}
```

### バリデーション

| フィールド | ルール |
|-----------|--------|
| section_cd | 必須、6桁の半角数字 |
| employee_cd | 必須、6桁の半角数字 |

---

## ログアウト

現在のセッションを終了します。

### リクエスト

```
POST /api/logout
```

**認証**: 不要（ミドルウェア対象外）

### レスポンス（成功時）

```json
{
  "success": true,
  "message": "ログアウトしました"
}
```

---

## 認証状態確認

現在の認証状態とユーザー情報を取得します。

### リクエスト

```
GET /api/auth/check
```

### レスポンス（認証済み）

```json
{
  "success": true,
  "authenticated": true,
  "user": {
    "employee_id": 1,
    "employee_cd": "000001",
    "employee_name": "山田太郎",
    "access_type": "00",
    "center_name": "東京営業所",
    "team_name": "営業1課",
    "roles": ["admin"],
    "permissions": ["sales.quotes.create", "sales.orders.create"]
  }
}
```

### レスポンス（未認証）

```json
{
  "authenticated": false
}
```

---

## 関連ドキュメント

- [認証仕様書](../06-authentication/authentication.md)
- [アクセス区分](../../backend/app/Enums/AccessType.php)

---

## 更新履歴

- 2025-12-25: 初版作成（認証ドキュメントから分離）
- 2026-01-28: ログアウトエンドポイントの認証要件を更新（ミドルウェア対象外に変更）
