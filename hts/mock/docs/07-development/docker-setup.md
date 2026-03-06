# Docker 開発環境セットアップ

## 概要

本プロジェクトでは、Docker と Docker Compose を使用して開発環境を構築します。
これにより、チーム全体で統一された開発環境を簡単に構築できます。

> **クイックスタート**: 初回セットアップは [開発環境クイックスタート](./setup.md) を参照してください。
> 本ドキュメントはDockerの詳細設定とリファレンスです。

## Docker 構成

### コンテナ構成

```
┌────────────────────────────────────────────────────────────┐
│ Docker Compose 環境                                         │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                Nginx (Reverse Proxy)                   │ │
│  │                      Port: 80                          │ │
│  │  /api/*, /sanctum/* → Backend                          │ │
│  │  /pgadmin/* → pgAdmin4                                 │ │
│  │  その他 → Frontend                                     │ │
│  └───────────────────────────────────────────────────────┘ │
│         │                │                  │               │
│         ▼                ▼                  ▼               │
│  ┌────────────┐   ┌────────────┐    ┌────────────┐        │
│  │ Frontend   │   │ Backend    │    │ pgAdmin4   │        │
│  │ Next.js    │   │ Laravel    │    │ DB管理     │        │
│  │ Node 20    │   │ PHP 8.2    │    │ (内部80)   │        │
│  │ (内部3000) │   │ (内部9000) │    └────────────┘        │
│  └────────────┘   └────────────┘           │               │
│                          │                  │               │
│                   ┌──────▼──────────────────▼─────┐        │
│                   │          PostgreSQL            │        │
│                   │          Port: 5432            │        │
│                   └────────────────────────────────┘        │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### サービス一覧

| サービス名 | 説明 | 公開ポート | イメージ |
|-----------|------|----------|---------|
| nginx | リバースプロキシ | 80 | nginx:alpine |
| frontend | Next.js フロントエンド | (内部のみ) | node:20-alpine |
| backend | Laravel バックエンド (PHP-FPM) | (内部のみ) | php:8.2-fpm-alpine |
| postgres | PostgreSQL データベース | 5432 | postgres:15-alpine |
| redis | キャッシュ | 6379 | redis:7-alpine |
| pgadmin | PostgreSQL管理ツール | 5050 | dpage/pgadmin4:latest |

### リバースプロキシ構成

Nginxがリバースプロキシとして動作し、パスに応じてリクエストを振り分けます：

| パス | 振り分け先 | 説明 |
|------|-----------|------|
| `/api/*` | Laravel | API エンドポイント |
| `/sanctum/*` | Laravel | 認証（CSRF Cookie） |
| `/pgadmin/*` | pgAdmin4 | PostgreSQL管理ツール |
| `/` (その他) | Next.js | フロントエンド |

この構成により、フロントエンドとバックエンドが同一オリジンで動作し、CORSの問題を回避できます。

## 前提条件

### 必要なソフトウェア

- **Docker Desktop**: 最新版
  - Windows: https://docs.docker.com/desktop/install/windows-install/
  - Mac: https://docs.docker.com/desktop/install/mac-install/

- **Git**: インストール済み

### システム要件

- メモリ: 最低 8GB（推奨 16GB）
- ディスク空き容量: 20GB以上

## ディレクトリ構成

```
oa_dev/
├── docker/                    # Docker関連ファイル
│   ├── nginx/
│   │   ├── default.conf      # Nginx設定（ローカル用）
│   │   └── default.prod.conf # Nginx設定（VPS用、Basic認証あり）
│   ├── pgadmin/
│   │   └── servers.json      # pgAdmin接続設定
│   ├── php/
│   │   └── Dockerfile        # PHP（Laravel）用Dockerfile
│   └── postgres/
│       └── init.sql          # 初期SQL（オプション）
├── frontend/                  # Next.jsプロジェクト
│   ├── Dockerfile
│   ├── .dockerignore
│   └── ...
├── backend/                   # Laravelプロジェクト
│   ├── Dockerfile
│   ├── .dockerignore
│   └── ...
├── docker-compose.yml        # Docker Compose設定
├── .env.example              # 環境変数テンプレート
└── Makefile                  # 便利コマンド（オプション）
```

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone git@github.com:eclat-sakae/oa_dev.git
cd oa_dev
```

### 2. 環境変数ファイルの作成

```bash
# ルートディレクトリの環境変数
cp .env.example .env

# バックエンドの環境変数
cp backend/.env.example backend/.env
```

### 3. Dockerコンテナのビルドと起動

```bash
# コンテナをビルドして起動
docker-compose up -d --build

# ログを確認
docker-compose logs -f
```

### 4. 依存関係のインストール

```bash
# フロントエンド
docker-compose exec frontend npm install

# バックエンド
docker-compose exec backend composer install
```

### 5. Laravelの初期設定

```bash
# アプリケーションキーの生成
docker-compose exec backend php artisan key:generate

# データベースマイグレーション
docker-compose exec backend php artisan migrate

# シーダー実行（必要に応じて）
docker-compose exec backend php artisan db:seed
```

### 6. 動作確認

- **アプリケーション**: http://localhost（Nginx経由でフロントエンド・バックエンド両方にアクセス）
- **pgAdmin4**: http://localhost/pgadmin/（PostgreSQL管理ツール）
- **データベース**: localhost:5432

## よく使うコマンド

### Docker Compose

```bash
# コンテナ起動
docker-compose up -d

# コンテナ停止
docker-compose down

# コンテナ再起動
docker-compose restart

# ログ確認
docker-compose logs -f [service-name]

# コンテナに入る
docker-compose exec [service-name] sh

# 全コンテナ削除（データも削除）
docker-compose down -v
```

### フロントエンド（Next.js）

```bash
# 開発サーバー起動（自動起動済み）
docker compose exec frontend npm run dev

# ビルド
docker compose exec frontend npm run build

# クリーンビルド（キャッシュ削除 + ビルド、推奨）
bash scripts/build-frontend.sh

# Lint
docker compose exec frontend npm run lint

# テスト
docker compose exec frontend npm test
```

> **Note**: ビルドエラーが発生した場合は、`scripts/build-frontend.sh` でクリーンビルドを実行してください。

### バックエンド（Laravel）

```bash
# Artisanコマンド
docker-compose exec backend php artisan [command]

# マイグレーション
docker-compose exec backend php artisan migrate

# マイグレーションロールバック
docker-compose exec backend php artisan migrate:rollback

# シーダー実行
docker-compose exec backend php artisan db:seed

# キャッシュクリア
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan config:clear
docker-compose exec backend php artisan route:clear
docker-compose exec backend php artisan view:clear

# Composer
docker-compose exec backend composer install
docker-compose exec backend composer update

# テスト
docker-compose exec backend php artisan test
```

### データベース

```bash
# PostgreSQLに接続
docker-compose exec postgres psql -U postgres -d oa_dev

# データベースバックアップ
docker-compose exec postgres pg_dump -U postgres oa_dev > backup.sql

# データベースリストア
docker-compose exec -T postgres psql -U postgres oa_dev < backup.sql
```

### pgAdmin4（PostgreSQL管理ツール）

#### アクセス方法

- **URL**: http://localhost/pgadmin/
- **ログイン情報**:
  - Email: `admin@example.com`
  - Password: `admin`

#### PostgreSQL接続

初回アクセス時、左側ツリーの「OA Dev PostgreSQL」をクリックして接続します。

- パスワード入力: `postgres`
- 「パスワードを保存」にチェックを入れると次回から不要

#### テーブル・レコードの確認

1. ツリーを展開: `OA Dev PostgreSQL → データベース → oa_dev → スキーマ → public → テーブル`
2. テーブル名を右クリック → **データを表示** → **すべての行**

#### SQLクエリの実行

1. 上部メニュー **ツール → クエリツール**
2. SQLを入力して **▶（実行）** ボタン

```sql
-- 例: テーブル一覧
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- 例: 従業員テーブルを確認
SELECT * FROM employees LIMIT 10;
```

#### 設定変更（環境変数）

`docker-compose.yml` で以下の環境変数を変更できます：

| 環境変数 | デフォルト値 | 説明 |
|----------|-------------|------|
| `PGADMIN_EMAIL` | admin@example.com | ログインメールアドレス |
| `PGADMIN_PASSWORD` | admin | ログインパスワード |
| `PGADMIN_PORT` | 5050 | 直接アクセス時のポート |

## トラブルシューティング

### ポートが既に使用されている

**エラー**: `Bind for 0.0.0.0:3000 failed: port is already allocated`

**解決策**:
```bash
# 使用中のポートを確認
netstat -ano | findstr :3000  # Windows
lsof -i :3000                  # Mac/Linux

# 該当プロセスを終了するか、docker-compose.ymlでポート番号を変更
```

### コンテナが起動しない

**確認事項**:
1. Docker Desktop が起動しているか
2. メモリ不足ではないか
3. ログを確認: `docker-compose logs`

**解決策**:
```bash
# コンテナを完全に削除して再ビルド
docker-compose down -v
docker-compose up -d --build
```

### データベース接続エラー

**エラー**: `SQLSTATE[HY000] [2002] Connection refused`

**解決策**:
```bash
# データベースコンテナが起動しているか確認
docker-compose ps

# .env の DB_HOST が正しいか確認
# Docker環境では DB_HOST=postgres とする
```

### パーミッションエラー

**エラー**: `Permission denied` または `EACCES`

**解決策**:
```bash
# Linuxの場合、ストレージディレクトリのパーミッション変更
docker-compose exec backend chmod -R 777 storage bootstrap/cache
```

### npm install / composer install が遅い

**解決策**:
```bash
# ボリュームマウントの代わりに名前付きボリュームを使用
# docker-compose.yml で node_modules と vendor を除外
```

## 本番環境との違い

| 項目 | 開発環境 | 本番環境 |
|------|---------|---------|
| Dockerイメージ | development | production |
| ホットリロード | 有効 | 無効 |
| デバッグモード | 有効 | 無効 |
| ログレベル | debug | error |
| キャッシュ | 無効 | 有効 |
| ソースマップ | 生成 | 生成しない |

## パフォーマンス最適化

### Windows での高速化

Docker Desktop on Windows では、ファイルシステムのマウントが遅い場合があります。

**対策**:
1. **WSL 2 を使用**
   - Docker Desktop の設定で WSL 2 エンジンを有効化
   - プロジェクトを WSL 2 内に配置

2. **Named Volumes を使用**
   - `node_modules` と `vendor` を名前付きボリュームにする

```yaml
volumes:
  - ./frontend:/app
  - node_modules:/app/node_modules  # 名前付きボリューム
```

### ビルドキャッシュの活用

```bash
# キャッシュを使ってビルド
docker-compose build

# キャッシュを使わずビルド
docker-compose build --no-cache
```

## セキュリティ

### 開発環境での注意点

1. **本番用の秘密鍵は使わない**
   - `.env` に本番の認証情報を入れない

2. **ポート公開の制限**
   - 必要なポートのみ公開
   - 本番環境では適切なファイアウォール設定

3. **定期的なイメージ更新**
   ```bash
   docker-compose pull
   docker-compose up -d --build
   ```

## 参考資料

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js with Docker](https://nextjs.org/docs/deployment#docker-image)
- [Laravel with Docker](https://laravel.com/docs/11.x/sail)

## 関連ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| [開発環境クイックスタート](./setup.md) | 初回セットアップ手順 |
| [Git ワークフロー](./git-workflow.md) | ブランチ戦略 |
| [VPS セットアップ](../08-deployment/vps-setup.md) | 本番環境のDocker構成 |

---

## 更新履歴

- 2025-12-08: 初版作成
- 2025-12-10: リバースプロキシ構成に変更（フロントエンド・バックエンドを同一オリジンで提供）
- 2026-01-09: pgAdmin4コンテナを追加
- 2026-01-12: setup.mdとの役割分担を明確化（詳細リファレンスとして整理）
