# VPS セットアップ・運用ガイド

## 概要

さくらVPS開発環境のセットアップ手順と運用ガイド。

## 関連ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| [CI/CD パイプライン概要](./pipeline-overview.md) | パイプライン設計 |
| [CI/CD パイプライン設計](./ci-cd.md) | GitHub Actions設定 |
| [GitHub Secrets 設定](./github-secrets-setup.md) | Secrets設定手順 |

---

## さくらVPS セットアップ手順

### 1. VPS初期セットアップ

プロジェクトに含まれる`scripts/setup-vps.sh`を使用して初期セットアップを行います。

```bash
# VPSにSSH接続
ssh user@your-vps-host

# セットアップスクリプトをダウンロード
curl -O https://raw.githubusercontent.com/your-org/oa_dev/main/scripts/setup-vps.sh

# 実行権限を付与
chmod +x setup-vps.sh

# セットアップ実行
./setup-vps.sh
```

**セットアップ内容**:
- システムアップデート
- Docker & Docker Compose のインストール
- ファイアウォール設定
- プロジェクトディレクトリ作成

### 2. プロジェクトのクローン

```bash
# プロジェクトディレクトリに移動
cd ~/oa_dev

# Gitリポジトリをクローン（SSH推奨）
git clone git@github.com:your-org/oa_dev.git .

# developブランチに切り替え
git checkout develop
```

### 3. 環境変数の設定

```bash
# バックエンド環境変数
cp backend/.env.example backend/.env
vim backend/.env  # 必要な値を設定

# フロントエンド環境変数
cp frontend/.env.local.example frontend/.env.local
vim frontend/.env.local  # 必要な値を設定
```

**backend/.env の主な設定項目**:
```ini
APP_NAME="管理会計システム"
APP_ENV=development
APP_DEBUG=true
APP_URL=http://your-vps-host:8000

DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=oa_dev
DB_USERNAME=postgres
DB_PASSWORD=secure_password_here

REDIS_HOST=redis
REDIS_PORT=6379
```

**frontend/.env.local の主な設定項目**:
```ini
NEXT_PUBLIC_API_URL=http://your-vps-host:8000
NEXT_PUBLIC_APP_ENV=development
```

### 4. 初回デプロイ

```bash
# コンテナをビルドして起動
docker compose up -d --build

# コンテナが起動するまで待機
sleep 10

# バックエンド依存関係インストール
docker compose exec backend composer install

# マイグレーション実行
docker compose exec backend php artisan migrate --force

# シーダー実行
docker compose exec backend php artisan db:seed --force

# キャッシュクリア
docker compose exec backend php artisan cache:clear
docker compose exec backend php artisan config:clear
```

> **Note**: 2回目以降のデプロイはGitHub Actionsで自動化されています。
> developブランチへのpushで自動デプロイが実行されます。

### 5. GitHub Secretsの設定

GitHub Actionsから自動デプロイできるよう、Secretsを設定します。

1. GitHubリポジトリ → `Settings` → `Secrets and variables` → `Actions`
2. 以下のSecretsを追加:

| Secret名 | 値の例 | 説明 |
|---------|-------|------|
| VPS_HOST | 123.456.789.012 | VPSのIPアドレス |
| VPS_USERNAME | ubuntu | SSH接続ユーザー名 |
| VPS_SSH_KEY | -----BEGIN OPENSSH... | SSH秘密鍵全体 |
| VPS_SSH_PORT | 22 | SSHポート番号 |
| VPS_PROJECT_PATH | /home/ubuntu/oa_dev | プロジェクトパス |

詳細は [GitHub Secrets 設定](./github-secrets-setup.md) を参照してください。

### 6. 動作確認

```bash
# コンテナの状態確認
docker compose ps

# ログ確認
docker compose logs -f

# ブラウザでアクセス
# フロントエンド: http://your-vps-host:3000
# バックエンド: http://your-vps-host:8000
```

### 7. GitHub Actionsの動作確認

```bash
# ローカルで変更を加えてプッシュ
git checkout develop
git pull origin develop

# 変更を加える
echo "# Test" >> README.md

# コミット&プッシュ
git add .
git commit -m "test: CI/CD動作確認"
git push origin develop

# GitHub Actionsのログを確認
# リポジトリページ → Actions タブ
```

---

## 運用上の注意事項

### セキュリティ

1. **SSH鍵の管理**
   - GitHub Secretsに登録した秘密鍵は外部に漏らさない
   - VPS上の公開鍵は定期的に更新

2. **ファイアウォール設定**
   - 必要なポートのみ開放
   - 可能であればSSHポートを変更（22以外）

3. **環境変数**
   - `.env`ファイルは絶対にGitにコミットしない
   - 本番環境では強力なパスワードを使用

### バックアップ

定期的にデータベースとコードのバックアップを取得:

```bash
# データベースバックアップ
docker compose exec postgres pg_dump -U postgres oa_dev > backup_$(date +%Y%m%d).sql

# プロジェクト全体のバックアップ
tar -czf oa_dev_backup_$(date +%Y%m%d).tar.gz ~/oa_dev
```

### モニタリング

```bash
# Dockerコンテナの状態監視
docker compose ps
docker stats

# ディスク使用量確認
df -h

# メモリ使用量確認
free -h
```

---

## Basic認証の設定（VPS開発環境）

VPS開発環境へのアクセスを制限するため、Basic認証を設定できます。

> **現在の状態**: Basic認証は**無効**です（2026-01-09）
>
> 現在のVPS設定（`docker-compose.override.yml`）:
> ```yaml
> services:
>   nginx:
>     volumes:
>       - ./backend:/var/www
>       - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf
> ```

### 設定ファイル

- `docker/nginx/default.conf` - 認証なし（現在使用中）
- `docker/nginx/default.prod.conf` - Basic認証あり（必要時に使用）

### Basic認証を有効にする手順

#### 1. .htpasswdファイルの作成

VPSにSSH接続して、以下のコマンドを実行します：

```bash
# VPSにSSH接続
ssh user@your-vps-host

# プロジェクトディレクトリに移動
cd ~/oa_dev

# htpasswdコマンドでパスワードファイルを作成
# -c: 新規作成、-B: bcryptハッシュを使用
docker run --rm httpd:alpine htpasswd -nbB "ユーザー名" "パスワード" > docker/nginx/.htpasswd

# または、opensslを使用する場合
# echo "ユーザー名:$(openssl passwd -apr1 'パスワード')" > docker/nginx/.htpasswd

# ファイルの権限を設定
chmod 644 docker/nginx/.htpasswd
```

#### 2. Nginx設定をVPS用に切り替え

```bash
# VPS用の設定ファイルをコピー
cp docker/nginx/default.prod.conf docker/nginx/default.conf.bak
cp docker/nginx/default.prod.conf docker/nginx/default.conf

# Nginxコンテナを再起動
docker compose restart nginx
```

**注意**: `default.conf`を直接上書きすると、次回のgit pullで元に戻ります。
永続的に適用するには、以下のいずれかの方法を使用します：

**方法A: docker-compose.override.ymlを使用（推奨）**

```yaml
# docker-compose.override.yml（VPS上で作成、gitignore済み）
services:
  nginx:
    volumes:
      - ./backend:/var/www
      - ./docker/nginx/default.prod.conf:/etc/nginx/conf.d/default.conf
      - ./docker/nginx/.htpasswd:/etc/nginx/.htpasswd:ro
```

**方法B: シンボリックリンクを使用**

```bash
cd docker/nginx
mv default.conf default.local.conf
ln -s default.prod.conf default.conf
```

#### 3. 動作確認

```bash
# Nginxコンテナを再起動
docker compose restart nginx

# ブラウザでアクセスして認証ダイアログが表示されることを確認
# http://your-vps-host/
```

### 認証の仕組み（有効時）

- **フロントエンド（`/`）**: Basic認証が必要
- **API（`/api/`、`/sanctum/`）**: Basic認証をスキップ（内部通信のため）

これにより、ブラウザからのアクセスは認証が必要ですが、
フロントエンドからバックエンドAPIへの通信は影響を受けません。

### Basic認証を無効にする手順

VPSにSSH接続して、`docker-compose.override.yml`を以下のように変更します：

```yaml
services:
  nginx:
    volumes:
      - ./backend:/var/www
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf
```

変更後、コンテナを再作成します：

```bash
docker compose up -d nginx
```

### トラブルシューティング

#### 認証ダイアログが表示されない（有効にしたい場合）

- `.htpasswd`ファイルが正しい場所にあるか確認
- Nginxの設定が正しく読み込まれているか確認：`docker compose exec nginx nginx -t`

#### APIリクエストが失敗する

- `/api/`と`/sanctum/`のlocationブロックに`auth_basic off;`があるか確認

#### 設定変更が反映されない

- `docker compose restart nginx`ではなく`docker compose up -d nginx`を使用
- ボリュームマウントの変更はコンテナ再作成が必要

---

## 更新履歴

- 2025-12-08: 初版作成
- 2025-12-22: Basic認証の設定手順を追加
- 2026-01-09: Basic認証を無効化、無効化手順を追加
- 2026-01-12: ci-cd.mdから分離
