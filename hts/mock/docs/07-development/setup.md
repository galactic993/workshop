# 開発環境クイックスタート

## 概要

管理会計システムの開発環境を最速でセットアップするためのガイドです。
Docker詳細設定やトラブルシューティングは [Docker セットアップガイド](./docker-setup.md) を参照してください。

---

## 前提条件

- **Docker Desktop** (最新版) - [Windows](https://docs.docker.com/desktop/install/windows-install/) / [Mac](https://docs.docker.com/desktop/install/mac-install/)
- **Git** - `git --version` で確認
- **メモリ**: 8GB以上（推奨16GB）、ディスク空き: 20GB以上

---

## セットアップ手順（5ステップ）

### 1. リポジトリのクローン

```bash
git clone git@github.com:eclat-sakae/oa_dev.git
cd oa_dev
git checkout develop
```

### 2. 環境変数ファイルの作成

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

### 3. Docker コンテナの起動

```bash
docker-compose up -d --build
docker-compose ps  # 起動確認
```

### 4. 依存関係とデータベースの初期化

```bash
# フロントエンド
docker-compose exec frontend npm install

# バックエンド
docker-compose exec backend composer install
docker-compose exec backend php artisan key:generate
docker-compose exec backend php artisan migrate
docker-compose exec backend php artisan db:seed
```

### 5. 動作確認

- **アプリケーション**: http://localhost
- **API**: http://localhost/api
- **pgAdmin**: http://localhost/pgadmin/ (admin@example.com / admin)

---

## テストログイン

| ロール | 部署コード | 社員コード |
|--------|-----------|-----------|
| 管理者 | 000000 | 000000 |
| 営業担当 | 281111 | 000001 |
| 営業所長 | 281000 | 000002 |

---

## 開発ワークフロー

### 新機能開発

```bash
# 最新化してブランチ作成
git checkout develop && git pull origin develop
git checkout -b feature/機能名

# コンテナ起動
docker-compose up -d
```

### コミット

```bash
git add .
git commit -m "feat(scope): 変更内容"  # Conventional Commits規約
git push origin feature/機能名
```

---

## 日常コマンド早見表

| 操作 | コマンド |
|------|---------|
| コンテナ起動 | `docker-compose up -d` |
| コンテナ停止 | `docker-compose down` |
| ログ確認 | `docker-compose logs -f` |
| マイグレーション | `docker-compose exec backend php artisan migrate` |
| データリセット | `docker-compose exec backend php artisan migrate:fresh --seed` |
| フロントテスト | `docker-compose exec frontend npm test` |
| バックエンドテスト | `docker-compose exec backend php artisan test` |
| Lint (frontend) | `docker-compose exec frontend npm run lint` |
| Lint (backend) | `docker-compose exec backend ./vendor/bin/pint --test` |

詳細なコマンドとオプションは [Docker セットアップガイド](./docker-setup.md#よく使うコマンド) を参照。

---

## VS Code 推奨設定

### 拡張機能

- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)
- Docker (`ms-azuretools.vscode-docker`)
- PHP Intelephense (`bmewburn.vscode-intelephense-client`)

### settings.json

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[php]": {
    "editor.defaultFormatter": "bmewburn.vscode-intelephense-client"
  }
}
```

---

## トラブル？

よくある問題と解決策は [Docker セットアップガイド - トラブルシューティング](./docker-setup.md#トラブルシューティング) を参照。

---

## 関連ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| [Docker セットアップガイド](./docker-setup.md) | Docker構成詳細、pgAdmin、パフォーマンス最適化 |
| [Git ワークフロー](./git-workflow.md) | ブランチ戦略、コミット規約 |
| [コーディング規約](./coding-guidelines.md) | コード規約 |
| [テスト方針](./testing.md) | テスト戦略 |

---

## 更新履歴

- 2025-12-08: 初版作成
- 2025-12-10: リバースプロキシ構成に対応
- 2026-01-12: クイックスタート形式にリファクタリング（詳細をdocker-setup.mdに移行）
