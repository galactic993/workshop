# プロジェクトドキュメント

このディレクトリには、プロジェクト全体のドキュメントが含まれています。

## ドキュメント構成

### 01. プロジェクト概要
- [プロジェクト概要](./01-project-overview/overview.md) - プロジェクトの目的、スコープ、目標
- [要件定義](./01-project-overview/requirements.md) - 機能要件・非機能要件

### 02. アーキテクチャ
- [システム概要](./02-architecture/system-overview.md) - システム全体の構成図

### 03. 技術スタック
- [フロントエンド技術](./03-tech-stack/frontend.md) - Next.js関連ライブラリ
- [バックエンド技術](./03-tech-stack/backend.md) - Laravel関連パッケージ
- [選定理由](./03-tech-stack/rationale.md) - 技術選定の理由と比較

### 04. API仕様
- [API概要](./04-api/README.md) - API共通仕様、エンドポイント一覧
- [認証API](./04-api/auth.md) - ログイン、ログアウト、認証状態確認
- [センターAPI](./04-api/centers.md) - センター一覧取得
- [得意先API](./04-api/customers.md) - 得意先検索、部署別得意先管理
- [見積API](./04-api/quotes.md) - 見積CRUD、承認・発行アクション

### 05. フロントエンド仕様
- [フロントエンド概要](./05-frontend/README.md) - 設計原則、ファイル構成
- **コンポーネント**
  - [レイアウトコンポーネント](./05-frontend/components/layout.md) - Header, Breadcrumb, PageFooter
  - [Sidebar](./05-frontend/components/sidebar.md) - サイドメニュー詳細仕様
  - [UIコンポーネント](./05-frontend/components/ui.md) - ErrorBoundary, ConfirmDialog, Pagination, MessageDialog
  - [フォームコンポーネント](./05-frontend/components/forms.md) - CustomerSelectDialog
- **ページ仕様**
  - [見積ページ](./05-frontend/pages/quotes.md) - 見積検索・一覧
  - [見積ダイアログ](./05-frontend/pages/quotes-dialogs.md) - 詳細モーダル、確認ダイアログ
  - [見積登録・更新](./05-frontend/pages/quotes-registration.md) - 新規登録・詳細・更新画面
  - [売上管理ページ](./05-frontend/pages/sales.md) - 売上管理、部署別得意先メンテナンス
- **スキーマ**
  - [見積スキーマ](./05-frontend/schemas/quot-schemas.md) - Zodスキーマ、型定義
- [カスタムフック](./05-frontend/hooks.md) - useDebounce, useAuthGuard, useQuotDialogs
- [デザインシステム](./05-frontend/design-system.md) - カラー、フォント、レイアウト規則
- [レイアウト仕様](./05-frontend/layout.md) - 全体レイアウト構造
- [バリデーション仕様](./05-frontend/validation.md) - バリデーション共通仕様

### 06. 認証・認可システム
- [認証機能仕様](./06-authentication/authentication.md) - パスワードレス認証（部署コード+社員コード）
- Laravel Sanctum SPA認証
- セッションベース認証（Redis使用）
- RBAC（役割ベースアクセス制御）

### 07. 開発ガイド
- [環境クイックスタート](./07-development/setup.md) - 開発環境のセットアップ手順
- [Docker環境](./07-development/docker-setup.md) - Docker環境の詳細、pgAdmin
- [Git ワークフロー](./07-development/git-workflow.md) - ブランチ戦略とワークフロー
- [テスト方針](./07-development/testing.md) - フロントエンド・バックエンドのテスト方針
- [コーディングガイドライン](./07-development/coding-guidelines.md) - コンポーネント設計、命名規則、API呼び出しパターン

### 08. デプロイメント
- [パイプライン概要](./08-deployment/pipeline-overview.md) - CI/CDの目的、パイプライン構成
- [CI/CD パイプライン](./08-deployment/ci-cd.md) - GitHub Actions ワークフロー設定
- [VPS セットアップ](./08-deployment/vps-setup.md) - さくらVPS初期設定、運用ガイド
- [GitHub Secrets 設定](./08-deployment/github-secrets-setup.md) - デプロイに必要な設定

### 09. データベース
- [テーブル仕様](./09-database/tables.md) - データベーステーブル定義
- [個別テーブル定義](./09-database/tables/) - 各テーブルの詳細仕様

### 10. テスト仕様
- [テスト仕様書](./10-testing/README.md) - テスト概要、ディレクトリ構成、方針
- **フロントエンド**
  - [フロントエンドテスト概要](./10-testing/frontend/README.md) - Vitest + React Testing Library
  - [ユーティリティ・フックテスト](./10-testing/frontend/utils.md) - permissions, utils, apiHelpers, useDebounce
  - [スキーマテスト](./10-testing/frontend/schemas.md) - Zodバリデーションスキーマ
  - [ストアテスト](./10-testing/frontend/stores.md) - Zustandストア
  - [コンポーネントテスト](./10-testing/frontend/components.md) - UIコンポーネント
- **バックエンド**
  - [バックエンドテスト概要](./10-testing/backend/README.md) - PHPUnit
  - [認証APIテスト](./10-testing/backend/auth.md) - ログイン、認証チェック
  - [センターAPIテスト](./10-testing/backend/centers.md) - センター一覧
  - [得意先APIテスト](./10-testing/backend/customers.md) - 得意先検索・管理
  - [見積APIテスト](./10-testing/backend/quotes.md) - 見積CRUD、承認、発行
  - [サービステスト](./10-testing/backend/services.md) - QuotActionService

## ドキュメント更新ルール

1. **常に最新を保つ** - 実装前にドキュメントを更新し、実装後に検証する
2. **具体的に記述** - 抽象的な表現を避け、コード例を含める
3. **変更履歴を残す** - 重要な変更はGitコミットメッセージに記載
4. **レビューを実施** - ドキュメント変更もコードレビューの対象とする

## ドキュメント作成日

- 初版作成: 2025-12-08
- 最終更新: 2026-01-12（ドキュメント再構成・分割最適化）
