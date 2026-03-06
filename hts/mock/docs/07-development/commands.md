# 開発コマンド一覧

## Docker操作

```bash
# 起動
docker compose up -d

# 停止
docker compose down

# 再起動
docker compose restart backend
docker compose restart frontend

# ログ確認
docker compose logs -f backend
docker compose logs -f frontend
```

## バックエンド（Laravel）

```bash
# コンテナ内でコマンド実行
docker compose exec backend php artisan migrate
docker compose exec backend php artisan db:seed
docker compose exec backend php artisan tinker

# コードスタイル修正
docker compose exec backend ./vendor/bin/pint

# テスト実行
docker compose exec backend php artisan test
docker compose exec backend php artisan test --filter=QuotApiTest

# テスト用データベース作成（初回のみ）
docker compose exec postgres psql -U postgres -c "CREATE DATABASE oa_dev_test;"
```

> **Note**: テストは専用のデータベース（`oa_dev_test`）を使用するため、開発データ（`oa_dev`）は影響を受けません。

## フロントエンド（Next.js）

```bash
# コンテナ内でコマンド実行
docker compose exec frontend npm run lint
docker compose exec frontend npm run build

# クリーンビルド（キャッシュ削除 + ビルド、推奨）
bash scripts/build-frontend.sh

# テスト実行
docker compose exec frontend npm test
docker compose exec frontend npm run test:watch
```

## よく使うコマンドの組み合わせ

```bash
# マイグレーション + シード（初期セットアップ）
docker compose exec backend php artisan migrate:fresh --seed

# Lint + ビルド確認（コミット前）
docker compose exec frontend npm run lint && docker compose exec frontend npm run build

# バックエンドコード整形 + テスト
docker compose exec backend ./vendor/bin/pint && docker compose exec backend php artisan test
```
