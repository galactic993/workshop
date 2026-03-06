# 管理会計システム

見積・受注管理、工数管理、IT資産管理など、社内の業務全般を統合的に管理するWebベースの管理会計システム

## プロジェクト概要

- **フロントエンド**: Next.js 15.1 (App Router) + TypeScript 5.7
- **バックエンド**: Laravel 11.31 + PHP 8.2
- **データベース**: PostgreSQL 15
- **キャッシュ/セッション**: Redis 7
- **認証**: Laravel Sanctum (SPA認証/セッションベース)

## 対象ユーザー

全社員（30名規模）

## 開発フェーズ

### 第1フェーズ（MVP） - 実装完了
- ✅ ユーザー認証機能（部署コード + 社員コードによるパスワードレス認証）
- ✅ セッション管理（Redis使用）
- ✅ CSRF保護
- ✅ 役割ベースアクセス制御（RBAC）

### 第2フェーズ - 実装完了
- ✅ 見積管理機能（検索・一覧・詳細・新規登録・更新）
- ✅ 見積ワークフロー（承認・差戻し・登録・発行）
- ✅ 見積PDF発行機能
- ✅ 得意先管理（サジェスト検索・部署別得意先）
- ✅ センター管理

### 第3フェーズ以降 - 予定
- 制作見積連携機能
- 編集（制作）部門の工数管理機能
- IT資産管理機能
- レポート・集計機能

## クイックスタート

```bash
# リポジトリのクローン
git clone git@github.com:eclat-sakae/oa_dev.git
cd oa_dev

# 環境変数の準備
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# Docker起動
docker-compose up -d --build

# 依存関係のインストールとDB初期化
docker-compose exec frontend npm install
docker-compose exec backend composer install
docker-compose exec backend php artisan key:generate
docker-compose exec backend php artisan migrate
docker-compose exec backend php artisan db:seed
```

詳細は [開発環境クイックスタート](./docs/07-development/setup.md) を参照してください。

## ドキュメント

詳細なドキュメントは [docs](./docs) ディレクトリを参照してください。

| カテゴリ | ドキュメント |
|---------|-------------|
| 概要 | [プロジェクト概要](./docs/01-project-overview/overview.md)、[要件定義](./docs/01-project-overview/requirements.md) |
| 設計 | [システムアーキテクチャ](./docs/02-architecture/system-overview.md)、[技術スタック](./docs/03-tech-stack/) |
| API | [API仕様書](./docs/04-api/)（認証、センター、得意先、見積） |
| フロントエンド | [フロントエンド仕様](./docs/05-frontend/)、[ページ仕様](./docs/05-frontend/pages/) |
| 認証 | [認証機能仕様](./docs/06-authentication/authentication.md) |
| 開発 | [環境構築](./docs/07-development/setup.md)、[Docker詳細](./docs/07-development/docker-setup.md)、[Git ワークフロー](./docs/07-development/git-workflow.md) |
| デプロイ | [CI/CD](./docs/08-deployment/ci-cd.md)、[VPSセットアップ](./docs/08-deployment/vps-setup.md) |
| DB | [テーブル仕様](./docs/09-database/tables.md) |

## ブランチ戦略

本プロジェクトでは GitHub Flow ベースのブランチ戦略を採用しています。

- `main`: 本番環境（自動デプロイ予定）
- `develop`: 開発環境（GitHub Actions で自動デプロイ）
- `feature/*`: 機能開発ブランチ
- `hotfix/*`: 緊急修正ブランチ

詳細は [Git ワークフロー](./docs/07-development/git-workflow.md) を参照してください。

## テスト

```bash
# フロントエンドテスト
docker-compose exec frontend npm test

# バックエンドテスト
docker-compose exec backend php artisan test

# Lint
docker-compose exec frontend npm run lint
docker-compose exec backend ./vendor/bin/pint --test
```

## ライセンス

社内専用システム

## 更新履歴

- 2025-12-08: プロジェクト開始、認証機能実装完了
- 2025-12-25: 見積管理機能実装完了
- 2026-01-12: ドキュメント再構成・最適化
