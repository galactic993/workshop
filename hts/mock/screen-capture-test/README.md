# 画面キャプチャ突合テスト用ファイル

Mock（`mock/docker-compose.yml`）で起動した**実画面**のスクリーンショットを PNG で保存し、それを **画面設計書形式の Excel** に埋め込みます。`s1.5-screen-capture` スキルで突合テストできます。

## 前提

- Docker Desktop が動いていること
- 初回は `mock` ルートでマイグレーション・シード済みであること（`docs/07-development/setup.md` 参照）

## 一括実行（推奨）

```bash
cd mock
chmod +x scripts/run-screen-capture-pipeline.sh
./scripts/run-screen-capture-pipeline.sh
```

生成物:

- `screen-capture-test/screenshots/quotes-list.png` … Playwright で取得した見積一覧
- `screen-capture-test/Mock_Mock見積_画面設計書.xlsx` … 画面概要に PNG を埋め込んだ設計書

## 手動ステップ

1. Mock 起動: `docker compose up -d`（`mock` ルート）
2. スクリーンショットのみ:

```bash
cd mock/frontend
export E2E_BASE_URL=http://localhost
npx playwright install chromium
npm run capture:screen-for-excel
```

3. Excel 生成:

```bash
cd mock
pip3 install -r scripts/requirements-screen-capture.txt   # 初回のみ
python3 scripts/build_screen_design_workbook.py
```

## キャプチャ突合スキルの実行

`shared-agent-skills` の `scripts/run-all-check.sh` に、生成した画面設計書と対になるテーブル定義書（プレフィックス一致）を渡すと、`s1.5-screen-capture` を含むプロンプトが並列実行されます。

```bash
cd /path/to/shared-agent-skills
./scripts/run-all-check.sh \
  /path/to/mock/screen-capture-test/Mock_Mock見積_画面設計書.xlsx \
  /path/to/共-テーブル定義書_xxxx.xlsx
```

単体で試す場合は `skills/s1.5-screen-capture/SKILL.md` を `~/.claude/skills/` に置き、Claude で Excel を読み取れるように指示してください。

## 備考

- 項目記述書のラベルは `QuotSearchForm` の文言（部署コード・得意先・検索ボタン等）に合わせてあります。UI 変更時は `scripts/build_screen_design_workbook.py` の `labels` を編集してください。
