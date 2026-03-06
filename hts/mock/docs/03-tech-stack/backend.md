# バックエンド技術スタック

## フレームワーク

### Laravel
- **バージョン**: 11.x
- **用途**: PHPベースのWebアプリケーションフレームワーク
- **採用理由**:
  - 成熟したフレームワーク
  - 豊富なエコシステム
  - ドキュメントが充実
  - セキュリティ対策が標準装備
  - API開発に適している

## コア言語

### PHP
- **バージョン**: 8.2以上
- **用途**: サーバーサイドプログラミング言語
- **採用理由**:
  - Laravelの推奨バージョン
  - 最新の言語機能（Enum、Readonly propertiesなど）
  - パフォーマンス向上

## データベース

### PostgreSQL
- **バージョン**: 15.x以上
- **用途**: リレーショナルデータベース
- **採用理由**:
  - データ整合性が高い
  - 複雑なクエリに強い
  - JSON型のサポート
  - トランザクション処理が堅牢
  - 会計システムに適している

## 認証

### Laravel Sanctum
- **バージョン**: 4.x
- **用途**: API認証
- **機能**:
  - トークンベース認証
  - トークン有効期限管理
  - 複数デバイス対応
- **採用理由**:
  - Laravel公式パッケージ
  - シンプルで軽量
  - SPAに最適
  - トークン管理が容易

## API開発

### Laravel API Resources
- **用途**: APIレスポンスの整形
- **機能**:
  - データの変換・整形
  - 条件付きフィールド
  - リレーションの最適化
- **採用理由**:
  - Laravel標準機能
  - レスポンス形式の統一
  - セキュリティ（不要なフィールド除外）
  - 再利用性が高い

## バリデーション

### Laravel Form Request
- **用途**: リクエストバリデーション
- **採用理由**:
  - バリデーションロジックの分離
  - 再利用性
  - エラーメッセージのカスタマイズ

### Laravel Validation Rules
- **用途**: バリデーションルールの定義
- **機能**:
  - 豊富な標準ルール
  - カスタムルールの作成
  - 条件付きバリデーション

## データベースマイグレーション

### Laravel Migrations
- **用途**: データベーススキーマ管理
- **採用理由**:
  - バージョン管理が容易
  - チーム開発に適している
  - ロールバック可能

### Laravel Seeders
- **用途**: テストデータの投入
- **採用理由**:
  - 開発環境の構築が簡単
  - テストデータの共有

## ORM

### Laravel Eloquent
- **用途**: ORMマッパー
- **機能**:
  - モデルベースのデータ操作
  - リレーションの定義
  - クエリビルダー
- **採用理由**:
  - 直感的なAPI
  - リレーション管理が容易
  - N+1問題の解決機能

## キャッシュ

### Laravel Cache
- **ストレージ**: Redis（本番環境）/ File（開発環境）
- **用途**: データキャッシュ
- **採用理由**:
  - パフォーマンス向上
  - データベース負荷軽減

## ログ

### Laravel Logging
- **ドライバー**: Daily（日次ログローテーション）
- **用途**: アプリケーションログ、エラーログ
- **ログレベル**:
  - Emergency
  - Alert
  - Critical
  - Error
  - Warning
  - Notice
  - Info
  - Debug

## スケジューリング

### Laravel Task Scheduling
- **用途**: バッチ処理の定期実行
- **使用例**:
  - データバックアップ
  - レポート自動生成
  - ログクリーンアップ

## テスト

### PHPUnit
- **用途**: ユニットテスト・統合テスト
- **採用理由**:
  - Laravel標準のテストフレームワーク
  - 豊富なアサーション
  - テストデータベース対応

## コード品質

### PHP CS Fixer
- **用途**: コードスタイルの自動修正
- **採用理由**: コードの一貫性を保つ

### PHPStan / Larastan（導入予定）
- **用途**: 静的解析
- **採用理由**:
  - 型安全性の向上
  - バグの早期発見

### Laravel Pint
- **用途**: コードフォーマット（Laravel公式）
- **採用理由**:
  - Laravel推奨ツール
  - 設定不要で使える

## ディレクトリ構成

```
backend/
├── app/
│   ├── Enums/                # Enum定義
│   │   └── AccessType.php    # アクセス区分
│   ├── Http/
│   │   ├── Controllers/      # コントローラー
│   │   │   └── Api/
│   │   │       ├── AuthController.php
│   │   │       ├── CenterController.php
│   │   │       ├── CustomerController.php
│   │   │       ├── QuotController.php    # ルーティングのみ
│   │   │       └── Quot/                 # ドメイン別分割
│   │   │           ├── BaseQuotController.php
│   │   │           ├── QuotListController.php
│   │   │           ├── QuotCreateController.php
│   │   │           ├── QuotCustomerController.php
│   │   │           ├── QuotWorkflowController.php
│   │   │           └── QuotIssueController.php
│   │   ├── Requests/         # フォームリクエスト
│   │   ├── Resources/        # API Resources
│   │   ├── Responses/        # レスポンスクラス
│   │   └── Middleware/       # ミドルウェア
│   ├── Models/               # Eloquentモデル
│   ├── Services/             # ビジネスロジック
│   │   ├── PermissionService.php  # 権限チェック
│   │   ├── QuotService.php   # アクセス制御
│   │   └── QuotActionService.php # アクション処理
│   └── Repositories/         # リポジトリパターン（必要に応じて）
├── database/
│   ├── migrations/           # マイグレーション
│   ├── seeders/             # シーダー
│   └── factories/           # ファクトリ
├── routes/
│   ├── api.php              # APIルート
│   └── web.php              # Webルート
├── tests/
│   ├── Feature/             # 機能テスト
│   │   └── QuotApiTest.php
│   └── Unit/                # ユニットテスト
│       └── Services/
│           └── QuotActionServiceTest.php
├── config/                   # 設定ファイル
└── storage/                  # ストレージ
    └── logs/                # ログファイル
```

## composer.json（主要パッケージ）

```json
{
  "require": {
    "php": "^8.2",
    "laravel/framework": "^11.31",
    "laravel/sanctum": "^4.0",
    "laravel/tinker": "^2.9"
  },
  "require-dev": {
    "laravel/pint": "^1.13",
    "phpunit/phpunit": "^11.0.1"
  }
}
```

※ `nunomaduro/larastan` は導入予定

## 環境変数（.env）

```env
# アプリケーション設定
APP_NAME="管理会計システム"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# データベース設定
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=accounting_db
DB_USERNAME=postgres
DB_PASSWORD=

# キャッシュ設定
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis

# Sanctum設定
SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DRIVER=cookie

# ログ設定
LOG_CHANNEL=daily
LOG_LEVEL=debug
```

## APIエンドポイント命名規則

### RESTful設計
```
GET    /api/users          # ユーザー一覧
GET    /api/users/{id}     # ユーザー詳細
POST   /api/users          # ユーザー作成
PUT    /api/users/{id}     # ユーザー更新
DELETE /api/users/{id}     # ユーザー削除
```

### 認証エンドポイント
```
POST   /api/login          # ログイン
POST   /api/logout         # ログアウト
POST   /api/register       # ユーザー登録
GET    /api/user           # 認証済みユーザー情報
```

### マスタデータエンドポイント
```
GET    /api/centers        # アクセス可能なセンター一覧
```

### 得意先エンドポイント
```
GET    /api/customers/suggest  # 得意先サジェスト検索
       クエリパラメータ:
         - center_id: センターID（必須）
         - query: 検索文字列（任意、スペース区切りでAND検索）
         - customer_cd: 得意先コード（任意、部分一致）
         - customer_name: 得意先名（任意、部分一致）
       除外条件: 指定センターに既に紐づいている得意先

GET    /api/customers/section-customers  # 部署別得意先一覧取得
       クエリパラメータ:
         - center_id: センターID（必須）
         - page: ページ番号（任意、デフォルト1）
         - per_page: 表示件数（任意、10/25/50/100）
         - sort_order: ソート順（任意、asc/desc）

POST   /api/customers/section-customers  # 部署別得意先追加
       リクエストボディ:
         - center_id: センターID（必須）
         - customer_id: 得意先ID（必須）
       権限: アクセス区分00 または sales.orders.customer

DELETE /api/customers/section-customers  # 部署別得意先削除
       リクエストボディ:
         - center_id: センターID（必須）
         - customer_id: 得意先ID（必須）
       権限: アクセス区分00 または sales.orders.customer
```

## セキュリティ対策

### 標準装備
- CSRF保護
- SQLインジェクション対策（Eloquent使用）
- XSS対策（Bladeテンプレート）
- パスワードハッシュ化（bcrypt）

### 追加実装
- レート制限（API）
- トークン有効期限管理
- アクセスログ記録
- HTTPSリダイレクト（本番環境）

## パフォーマンス最適化

### 実装予定
- Eagerロード（N+1問題対策）
- クエリ最適化
- インデックス設定
- キャッシュ活用
- ページネーション

## 更新履歴

- 2025-12-08: 初版作成
- 2025-12-10: センター取得API、得意先サジェストAPIを追加
- 2025-12-10: 部署別得意先一覧/追加/削除APIを追加
- 2026-01-11: ディレクトリ構成更新（QuotControllerドメイン別分割、QuotActionService追加）
- 2026-01-28: PermissionServiceを追加
