# センターAPI

## 概要

センター（営業所）情報を取得するAPIを定義します。

**コントローラー**: `backend/app/Http/Controllers/Api/CenterController.php`

---

## アクセス可能なセンター一覧取得

ログインユーザーがアクセス可能なセンター一覧を取得します。

### リクエスト

```
GET /api/centers
```

### レスポンス（成功時）

```json
{
  "success": true,
  "centers": [
    {
      "department_id": 1,
      "department_name": "東京営業所"
    },
    {
      "department_id": 2,
      "department_name": "大阪営業所"
    }
  ]
}
```

### アクセス制御

- **アクセス区分「00」**: 全センターを返却
- **その他**: ユーザーのvisible_departmentsに紐づくセンターのみ返却

---

## 全センター一覧取得

全てのセンター一覧を取得します（管理者向け）。

### リクエスト

```
GET /api/centers/all
```

### レスポンス（成功時）

```json
{
  "success": true,
  "centers": [
    {
      "department_id": 1,
      "department_name": "東京営業所"
    },
    {
      "department_id": 2,
      "department_name": "大阪営業所"
    },
    {
      "department_id": 3,
      "department_name": "名古屋営業所"
    }
  ]
}
```

---

## 見積用センター一覧取得

見積機能で使用するセンター一覧を取得します。

### リクエスト

```
GET /api/centers/quot
```

### レスポンス（成功時）

```json
{
  "success": true,
  "centers": [
    {
      "department_id": 1,
      "department_name": "東京営業所"
    }
  ]
}
```

### アクセス制御

- ユーザーの権限に基づいてフィルタリング
- 見積作成権限を持つセンターのみ返却

---

## 関連ドキュメント

- [認証仕様](../06-authentication/authentication.md)
- [権限判定](../05-frontend/README.md)

---

## 更新履歴

- 2025-12-25: 初版作成
