# WORKFLOW

## リポジトリの性質

- `workshop` は単一アプリ repo ではありません。
- 主に以下の 3 系統があります。
  - `ssol/` : 研修資料・スライド
  - `hts/workshop/` : Excel 設計書チェック用 Python スクリプト
  - `hts/mock/` : 管理会計システムのモック環境（Next.js + Laravel + PostgreSQL + Redis）
- 直下で統一の `npm run dev` は存在しません。対象を決めてから入ること。

## 起動方法

### `ssol/` 研修資料

- 基本的に起動不要です。Markdown / スライド資料を編集します。
- 必要なら `ssol/slides/generate-pptx.js` でスライド生成フローを確認します。

### `hts/workshop/` Excel チェック

1. `cd /Users/izutanikazuki/symphony-workspaces/workshop/hts/workshop`
2. `python3 -m venv venv`
3. `source venv/bin/activate`
4. `pip install pandas openpyxl`
5. `python3 check_excel_cross_reference.py`

### `hts/mock/` 管理会計システム

1. `cd /Users/izutanikazuki/symphony-workspaces/workshop/hts/mock`
2. env 準備
   - `cp .env.example .env`
   - `cp backend/.env.example backend/.env`
   - `cp frontend/.env.example frontend/.env.local`
3. Docker 起動
   - `docker compose up -d --build`
4. 初回セットアップ
   - `docker compose exec frontend npm install`
   - `docker compose exec backend composer install`
   - `docker compose exec backend php artisan key:generate`
   - `docker compose exec backend php artisan migrate`
   - `docker compose exec backend php artisan db:seed`
5. アクセス
   - Nginx 経由: `http://localhost`

## 検証

### `hts/workshop/`

- スクリプト実行結果: `check_result.md`
- 追加確認: `README_CHECK_SCRIPT.md`, `SCRIPT_DOCUMENTATION.md`

### `hts/mock/`

- frontend lint: `docker compose exec frontend npm run lint`
- frontend test: `docker compose exec frontend npm test`
- backend test: `docker compose exec backend php artisan test`

## 注意点

- `hts/workshop` 配下の一部資料と Python スクリプトは、今も `/Users/izutanikazuki/kzp/fileMaker/training/...` の旧絶対パスを参照しています
- そのまま動く前提で読むとハマるので、現 repo パスに合わせて読み替えるか修正してから実行すること
- `ssol`, `hts/workshop`, `hts/mock` は目的が別物です。混ぜて考えると作業指示が壊れます
