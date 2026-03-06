# バックエンドテスト仕様

## 概要

バックエンドのテストは PHPUnit + Laravel Testing Helpers で実装されています。
APIエンドポイントの機能テストとサービスクラスのユニットテストを対象としています。

## テストフレームワーク

- **PHPUnit**: テストフレームワーク
- **Laravel Testing Helpers**: HTTPテスト、データベーステスト

## テストファイル構成

```
backend/tests/
├── Feature/
│   ├── AuthApiTest.php              # 認証API
│   ├── CenterApiTest.php            # センターAPI
│   ├── CustomerSearchApiTest.php    # 見積用得意先検索API
│   ├── SectionCustomerApiTest.php   # 部署別得意先API
│   ├── QuotApiTest.php              # 見積API
│   ├── QuotIssueApiTest.php         # 見積発行API
│   ├── SectionReportApiTest.php     # 受注週報（部署別）API
│   ├── CustomerReportApiTest.php    # 受注週報（得意先別）API
│   └── OrderImportApiTest.php       # 受注情報取込API
└── Unit/
    └── Services/
        └── QuotActionServiceTest.php # 見積アクションサービス
```

## テストカテゴリ

| カテゴリ | ドキュメント | 説明 |
|---------|------------|------|
| 認証API | [auth.md](./auth.md) | ログイン、ログアウト、認証チェック |
| センターAPI | [centers.md](./centers.md) | センター一覧取得 |
| 得意先API | [customers.md](./customers.md) | 得意先検索、部署別得意先管理 |
| 見積API | [quotes.md](./quotes.md) | 見積CRUD、承認、発行 |
| 受注API | 受注情報取込、受注週報（部署別・得意先別） |
| サービス | [services.md](./services.md) | QuotActionService |

## テスト実行

```bash
# 全テスト実行
docker compose exec backend php artisan test

# 特定テストクラスのみ
docker compose exec backend php artisan test --filter=QuotApiTest

# 詳細出力
docker compose exec backend php artisan test --verbose
```

## テストパターン

### セッション認証

```php
$this->withSession([
    'employee_id' => 1,
    'access_type' => '00', // 全て（管理者）
    'permissions' => [],
])->getJson('/api/quotes');
```

### HTTPステータス検証

- **401**: 未認証（ログインしてください）
- **403**: 権限不足（アクセス権限がありません）
- **404**: リソース不存在
- **409**: 競合（既に登録済みなど）
- **422**: バリデーションエラー
- **429**: レート制限

### JSON構造検証

```php
$response->assertJsonStructure([
    'success',
    'data' => [
        '*' => ['id', 'name'],
    ],
]);
```
