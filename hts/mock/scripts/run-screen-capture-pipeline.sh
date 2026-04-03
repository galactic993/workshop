#!/usr/bin/env bash
# Mock を起動し、見積画面の PNG を取得してから画面設計書 xlsx を生成する。
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! docker info >/dev/null 2>&1; then
  echo "Docker デーモンが起動していません。Docker Desktop を起動してから再実行してください。"
  exit 1
fi

echo "==> docker compose up -d"
docker compose up -d

echo "==> http://localhost を待機..."
for _ in $(seq 1 90); do
  if curl -sf "http://localhost/" >/dev/null 2>&1; then
    echo "OK"
    break
  fi
  sleep 2
done

if ! curl -sf "http://localhost/" >/dev/null 2>&1; then
  echo "localhost に接続できませんでした。docker compose logs を確認してください。"
  exit 1
fi

cd "$ROOT/frontend"
export E2E_BASE_URL="${E2E_BASE_URL:-http://localhost}"
echo "==> Playwright (E2E_BASE_URL=$E2E_BASE_URL)"
npx playwright install chromium
npm run capture:screen-for-excel

cd "$ROOT"
echo "==> Excel 生成"
if ! python3 -c "import openpyxl, PIL" 2>/dev/null; then
  echo "openpyxl / Pillow をインストールしています..."
  python3 -m pip install -q -r scripts/requirements-screen-capture.txt || {
    echo "pip で入らない場合は venv を用意するか、手動で次を実行してください:"
    echo "  python3 -m pip install -r scripts/requirements-screen-capture.txt"
    exit 1
  }
fi
python3 scripts/build_screen_design_workbook.py

echo ""
echo "完了。次でキャプチャ突合を実行できます（shared-agent-skills の run-all-check に画面・テーブル両方を渡す）:"
echo "  cd /path/to/shared-agent-skills && ./scripts/run-all-check.sh \\"
echo "    $ROOT/screen-capture-test/Mock_Mock見積_画面設計書.xlsx \\"
echo "    /path/to/対応するテーブル定義書.xlsx"
