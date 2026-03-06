# テスト仕様書

## 概要

このドキュメントでは、管理会計システムのテストケース仕様を定義します。
フロントエンド（Vitest + React Testing Library）とバックエンド（PHPUnit）で実装されたテストについて、
各テストケースの内容とチェック項目を記載しています。

## テスト実行コマンド

### フロントエンド

```bash
# 全テスト実行
docker compose exec frontend npm test

# ウォッチモード（開発時）
docker compose exec frontend npm run test:watch

# 特定ファイルのみ
docker compose exec frontend npm test -- src/schemas/quotSearchSchema.test.ts
```

### バックエンド

```bash
# 全テスト実行
docker compose exec backend php artisan test

# 特定テストクラスのみ
docker compose exec backend php artisan test --filter=QuotApiTest

# 詳細出力
docker compose exec backend php artisan test --verbose
```

## ディレクトリ構成

```
docs/10-testing/
├── README.md                    # 本ファイル（テスト仕様書の概要）
├── frontend/                    # フロントエンドテスト仕様
│   ├── README.md               # フロントエンドテスト概要
│   ├── utils.md                # ユーティリティ・フックテスト
│   ├── schemas.md              # Zodスキーマテスト
│   ├── stores.md               # Zustandストアテスト
│   └── components.md           # UIコンポーネントテスト
└── backend/                     # バックエンドテスト仕様
    ├── README.md               # バックエンドテスト概要
    ├── auth.md                 # 認証APIテスト
    ├── centers.md              # センターAPIテスト
    ├── customers.md            # 得意先APIテスト
    ├── quotes.md               # 見積APIテスト
    └── services.md             # ビジネスロジックテスト
```

## テスト分割方針

### フロントエンド

| カテゴリ | 対象 | テストファイル配置 |
|---------|------|------------------|
| ユーティリティ | lib/配下の関数 | `lib/*.test.ts` |
| カスタムフック | hooks/配下のフック | `hooks/*.test.ts` |
| スキーマ | Zodバリデーションスキーマ | `schemas/*.test.ts` |
| ストア | Zustandストア | `stores/*.test.ts` |
| コンポーネント | UI/フォームコンポーネント | `components/**/*.test.tsx` |

### バックエンド

| カテゴリ | 対象 | テストファイル配置 |
|---------|------|------------------|
| 機能テスト | APIエンドポイント | `tests/Feature/*ApiTest.php` |
| ユニットテスト | サービスクラス | `tests/Unit/Services/*Test.php` |

## テストカバレッジ方針

### 必須テスト対象

1. **認証・権限チェック**
   - 未認証ユーザーのアクセス拒否（401）
   - 権限不足ユーザーのアクセス拒否（403）
   - 正常な権限を持つユーザーのアクセス許可

2. **バリデーション**
   - 必須項目のチェック
   - 文字数・形式チェック
   - 条件付きバリデーション

3. **ビジネスロジック**
   - 正常系の動作確認
   - 異常系（ステータス不正等）のエラーハンドリング
   - 状態遷移の確認

4. **UIインタラクション**
   - 表示/非表示の切り替え
   - ユーザー操作（クリック、入力）
   - コールバック呼び出し

## テストケース一覧（サマリ）

### フロントエンド（12ファイル、約140テスト）

| ファイル | テスト数 | 説明 |
|---------|---------|------|
| `lib/permissions.test.ts` | 14 | 権限判定ユーティリティ |
| `lib/utils.test.ts` | 7 | 共通ユーティリティ関数 |
| `lib/apiHelpers.test.ts` | 12 | API呼び出しラッパー |
| `hooks/useDebounce.test.ts` | 5 | デバウンスフック |
| `schemas/quotCreateSchema.test.ts` | 27 | 見積作成フォームスキーマ |
| `schemas/quotSearchSchema.test.ts` | 27 | 見積検索フォームスキーマ |
| `schemas/sectionCustomerSchema.test.ts` | 13 | 部署別得意先フォームスキーマ |
| `components/ui/Pagination.test.tsx` | 17 | ページネーション |
| `components/ui/ErrorBoundary.test.tsx` | 11 | エラー境界 |
| `components/forms/CustomerSelectDialog.test.tsx` | 18 | 得意先選択ダイアログ |

### バックエンド（9ファイル、約100+テスト）

| ファイル | テスト数 | 説明 |
|---------|---------|------|
| `Feature/AuthApiTest.php` | 9 | 認証API |
| `Feature/CenterApiTest.php` | 8 | センターAPI |
| `Feature/CustomerSearchApiTest.php` | 16 | 見積用得意先検索API |
| `Feature/SectionCustomerApiTest.php` | 27 | 部署別得意先API |
| `Feature/QuotApiTest.php` | 50+ | 見積API（CRUD、承認、発行） |
| `Feature/QuotIssueApiTest.php` | テスト中 | 見積発行API |
| `Feature/SectionReportApiTest.php` | テスト中 | 受注週報（部署別）API |
| `Feature/CustomerReportApiTest.php` | テスト中 | 受注週報（得意先別）API |
| `Unit/Services/QuotActionServiceTest.php` | 18 | 見積アクションサービス |

## 詳細仕様

各テストの詳細は以下のドキュメントを参照してください。

- [フロントエンドテスト仕様](./frontend/README.md)
- [バックエンドテスト仕様](./backend/README.md)

## 更新履歴

- 2026-01-12: 初版作成（テストケース仕様書の新規作成）
- 2026-01-30: バックエンドテストファイル構成を更新（受注関連テスト追加）
