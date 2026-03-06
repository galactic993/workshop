#!/bin/bash

# フロントエンドのクリーンビルドスクリプト
# コンテナ停止 → キャッシュ削除 → 再起動 → ビルド

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "=== フロントエンドクリーンビルド ==="

echo "1. フロントエンドコンテナを停止中..."
docker compose stop frontend

echo "2. .nextキャッシュを削除中..."
rm -rf frontend/.next

echo "3. フロントエンドコンテナを起動中..."
docker compose start frontend

echo "4. コンテナの準備を待機中..."
sleep 5

echo "5. ビルドを実行中..."
docker compose exec -T frontend npm run build

echo ""
echo "=== ビルド完了 ==="
