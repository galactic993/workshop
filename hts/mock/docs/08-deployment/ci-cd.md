# CI/CD パイプライン設計

## 概要

GitHub Actionsを使用したCI/CDパイプラインの設定ファイルと実装状況。

## 関連ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| [パイプライン概要](./pipeline-overview.md) | CI/CDの目的、パイプライン構成 |
| [VPS セットアップ](./vps-setup.md) | VPS初期設定、運用ガイド |
| [GitHub Secrets 設定](./github-secrets-setup.md) | Secrets設定手順 |

---

## GitHub Actions 設定ファイル

### ディレクトリ構成

```
.github/
└── workflows/
    ├── pr-check.yml          # PR 時の CI（未実装）
    ├── deploy-develop.yml    # develop デプロイ ✅ 実装済み
    └── deploy-production.yml # 本番デプロイ（未実装）
```

### 1. PR チェック（pr-check.yml）※未実装

以下は将来実装予定の設計です。

```yaml
name: PR Check

on:
  pull_request:
    branches:
      - develop
      - main

jobs:
  lint-and-test-frontend:
    name: Frontend Lint & Test
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci

      - name: Run ESLint
        working-directory: ./frontend
        run: npm run lint

      - name: Run Prettier check
        working-directory: ./frontend
        run: npm run format:check

      - name: Run tests
        working-directory: ./frontend
        run: npm run test

      - name: Build
        working-directory: ./frontend
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.DEV_API_URL }}

  lint-and-test-backend:
    name: Backend Lint & Test
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_DB: test_db
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          extensions: pgsql, pdo_pgsql
          coverage: xdebug

      - name: Install dependencies
        working-directory: ./backend
        run: composer install --prefer-dist --no-progress

      - name: Copy .env
        working-directory: ./backend
        run: cp .env.example .env

      - name: Generate key
        working-directory: ./backend
        run: php artisan key:generate

      - name: Run Pint
        working-directory: ./backend
        run: ./vendor/bin/pint --test

      - name: Run PHPStan
        working-directory: ./backend
        run: ./vendor/bin/phpstan analyse

      - name: Run tests
        working-directory: ./backend
        run: php artisan test
        env:
          DB_CONNECTION: pgsql
          DB_HOST: localhost
          DB_PORT: 5432
          DB_DATABASE: test_db
          DB_USERNAME: postgres
          DB_PASSWORD: postgres
```

### 2. 開発環境デプロイ（deploy-develop.yml）

**デプロイ先**: さくらVPS（Docker Compose使用）

**実装ファイル**: `.github/workflows/deploy-develop.yml`

```yaml
name: Deploy to Development

on:
  push:
    branches:
      - develop

jobs:
  test:
    name: Run Tests
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_DB: oa_dev_test
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      # Frontend Tests
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install frontend dependencies
        working-directory: frontend
        run: npm ci

      - name: Run frontend lint
        working-directory: frontend
        run: npm run lint

      - name: Run frontend tests
        working-directory: frontend
        run: npm test -- --passWithNoTests

      # Backend Tests
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          extensions: pdo, pdo_pgsql, redis
          coverage: none

      - name: Copy backend .env
        working-directory: backend
        run: cp .env.example .env

      - name: Install backend dependencies
        working-directory: backend
        run: composer install --prefer-dist --no-progress --no-interaction

      - name: Generate application key
        working-directory: backend
        run: php artisan key:generate

      - name: Run backend tests
        working-directory: backend
        env:
          DB_CONNECTION: pgsql
          DB_HOST: localhost
          DB_PORT: 5432
          DB_DATABASE: oa_dev_test
          DB_USERNAME: postgres
          DB_PASSWORD: postgres
          REDIS_HOST: localhost
          REDIS_PORT: 6379
        run: php artisan test

      - name: Run backend lint (Pint)
        working-directory: backend
        run: ./vendor/bin/pint --test

  deploy:
    name: Deploy to Sakura VPS
    runs-on: ubuntu-latest
    needs: test

    steps:
      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          key: ${{ secrets.VPS_SSH_KEY }}
          port: ${{ secrets.VPS_SSH_PORT }}
          script: |
            cd ${{ secrets.VPS_PROJECT_PATH }}

            # Git pull latest code
            git fetch origin
            git checkout develop
            git pull origin develop

            # Copy environment files if not exists
            if [ ! -f backend/.env ]; then
              cp backend/.env.example backend/.env
              echo "Please configure backend/.env manually"
            fi

            if [ ! -f frontend/.env.local ]; then
              cp frontend/.env.local.example frontend/.env.local
              echo "Please configure frontend/.env.local manually"
            fi

            # Build and restart containers
            docker-compose build --no-cache
            docker-compose up -d

            # Wait for containers to be healthy
            sleep 10

            # Run migrations
            docker-compose exec -T backend php artisan migrate --force

            # Clear cache
            docker-compose exec -T backend php artisan cache:clear
            docker-compose exec -T backend php artisan config:clear
            docker-compose exec -T backend php artisan route:clear

            # Check container status
            docker-compose ps

            echo "Deployment completed successfully!"

      - name: Health check
        run: |
          echo "Waiting for application to be ready..."
          sleep 5
          echo "Health check completed"

      - name: Notify deployment success
        if: success()
        run: |
          echo "✅ Deployment to development environment succeeded!"

      - name: Notify deployment failure
        if: failure()
        run: |
          echo "❌ Deployment to development environment failed!"
```

### 3. 本番環境デプロイ（deploy-production.yml）※未実装

本番環境へのデプロイワークフローは未実装です。
設計詳細は [パイプライン概要](./pipeline-overview.md) を参照してください。

---

## GitHub Secrets 設定

GitHub Secretsの設定方法は [GitHub Secrets 設定](./github-secrets-setup.md) を参照してください。

### 現在設定済みのSecrets（さくらVPS開発環境）

| Secret名 | 説明 |
|---------|------|
| VPS_HOST | VPSのIPアドレス |
| VPS_USERNAME | SSH接続ユーザー名 |
| VPS_SSH_KEY | SSH秘密鍵 |
| VPS_SSH_PORT | SSH接続ポート (22) |
| VPS_PROJECT_PATH | VPS上のプロジェクトパス |

---

## ロールバック手順

### 自動ロールバック（実装予定）

デプロイ失敗時に自動でロールバックする機能

```yaml
rollback:
  name: Rollback on Failure
  runs-on: ubuntu-latest
  if: failure()

  steps:
    - name: Restore from backup
      uses: appleboy/ssh-action@v1.0.0
      with:
        host: ${{ secrets.PROD_SERVER_HOST }}
        username: ${{ secrets.PROD_SERVER_USER }}
        key: ${{ secrets.PROD_SERVER_SSH_KEY }}
        script: |
          latest_backup=$(ls -t /var/www/backups/backend_*.tar.gz | head -1)
          tar -xzf $latest_backup -C /var/www/production
          sudo systemctl restart php8.2-fpm
          pm2 restart nextjs-production
```

### 手動ロールバック

```bash
# 1. サーバーにSSH接続
ssh user@production-server

# 2. バックアップから復元
cd /var/www/production
latest_backup=$(ls -t /var/www/backups/backend_*.tar.gz | head -1)
tar -xzf $latest_backup -C /var/www/production

# 3. データベース復元（必要な場合）
latest_db=$(ls -t /var/www/backups/db_*.sql | head -1)
psql -U postgres database_name < $latest_db

# 4. サービス再起動
sudo systemctl restart php8.2-fpm
pm2 restart nextjs-production

# 5. 動作確認
curl http://localhost:3000
curl http://localhost:8000/api/health
```

---

## モニタリング・ログ

### デプロイログの確認

**GitHub Actions**
1. リポジトリの `Actions` タブ
2. 該当のワークフロー実行を選択
3. 各ジョブの詳細ログを確認

### アプリケーションログ

**フロントエンド（PM2）**
```bash
pm2 logs nextjs-production
pm2 logs nextjs-production --lines 100
```

**バックエンド（Laravel）**
```bash
tail -f /var/www/production/backend/storage/logs/laravel.log
```

---

## トラブルシューティング

### デプロイが失敗する

**原因と対処**
1. **テスト失敗**: ログを確認して修正
2. **ビルド失敗**: 依存関係や環境変数を確認
3. **SSH接続失敗**: Secrets の SSH キーを確認
4. **ディスク容量不足**: サーバーの容量を確認

### ヘルスチェックが失敗する

**確認事項**
1. アプリケーションが起動しているか
2. ポートが正しく開いているか
3. 環境変数が正しく設定されているか
4. データベース接続は正常か

---

## 実装状況

### ✅ 完了した項目

#### develop ブランチ向け CI/CD パイプライン

**実装日**: 2025-12-08

**ワークフローファイル**: `.github/workflows/deploy-develop.yml`

**機能**:
- ✅ フロントエンドのLintチェック (ESLint)
- ✅ フロントエンドのビルドテスト
- ✅ バックエンドのテスト (PHPUnit)
- ✅ バックエンドのコード整形チェック (Pint)
- ✅ さくらVPS開発環境への自動デプロイ
- ✅ SSH鍵のbase64エンコード方式による安全な認証
- ✅ Docker Compose v2 対応

**デプロイ対象環境**:
- VPS: さくらVPS (Ubuntu 24.04)
- フロントエンド: http://153.120.4.173:3000
- バックエンド: http://153.120.4.173:8000

**動作確認**: ✅ 完了 (2025-12-08)

### 🚧 未実装の項目

#### main ブランチ向け本番環境デプロイ

- [ ] 本番環境サーバーの準備
- [ ] 本番環境向けCI/CDワークフローの作成
- [ ] 本番環境用GitHub Secretsの設定
- [ ] 本番環境のドメイン設定
- [ ] SSL証明書の設定

#### Pull Request 向けテストパイプライン

- [ ] PR作成時の自動テスト実行
- [ ] テストカバレッジレポート
- [ ] PR用のプレビュー環境

#### セキュリティスキャン

- [ ] 依存関係の脆弱性チェック
- [ ] コードセキュリティスキャン
- [ ] Dockerイメージのスキャン

---

## 更新履歴

- 2025-12-08: 初版作成
- 2025-12-08: さくらVPS開発環境デプロイの実装を追加
- 2025-12-08: Docker Compose v2対応、SSH鍵base64エンコード方式の実装
- 2025-12-08: 実装状況セクションを追加
- 2025-12-10: 未実装ワークフロー（pr-check.yml, deploy-production.yml）を明確化
- 2026-01-12: ドキュメント分割（パイプライン概要、VPSセットアップを分離）
