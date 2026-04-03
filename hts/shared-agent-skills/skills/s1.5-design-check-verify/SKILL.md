---
name: s1.5-design-check-verify
description: 画面設計書チェック（s1.5-event-no 等）の動作検証。fixtures を生成し s1.5-all-docs を実行する。
---

# s1.5-design-check-verify

## 目的

`shared-agent-skills/skills/` 直下の `s1.5-*` Python スクリプトが、最小限の Excel 設計書で実行可能か検証する。

## 手順

1. 依存関係（このディレクトリで仮想環境を推奨）:

```bash
cd skills/s1.5-design-check-verify
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
```

2. フィクスチャ生成:

```bash
.venv/bin/python scripts/build_minimal_fixtures.py
```

3. 一括チェック（`--skills-dir` に `shared-agent-skills/skills` を指定）:

```bash
# Claude に skills を入れている場合（デフォルトの ~/.claude/skills を参照）
.venv/bin/python ~/.claude/skills/s1.5-all-docs/scripts/run_all_checks.py "$(pwd)/fixtures" --output check_all_result.xlsx

# 本リポジトリの skills を直接使う場合（shared-agent-skills ルートで）
cd /path/to/shared-agent-skills
python skills/s1.5-all-docs/scripts/run_all_checks.py \
  "$(pwd)/skills/s1.5-design-check-verify/fixtures" \
  --skills-dir "$(pwd)/skills" \
  --output "$(pwd)/skills/s1.5-design-check-verify/check_all_result.xlsx"
```

`design-check-verify` ディレクトリ内から相対パスで実行する場合:

```bash
.venv/bin/python ../s1.5-all-docs/scripts/run_all_checks.py "$(pwd)/fixtures" \
  --skills-dir "$(pwd)/.." --output check_all_result.xlsx
```

## 前提

- Python 3 + `openpyxl`（`requirements.txt` 参照）
- `s1.5-doc-format-pattern` … `s1.5-screen-capture` が `~/.claude/skills/` または **`shared-agent-skills/skills/`**（リポジトリ内の `skills` ルート）に揃っていること

## 検証結果（実機実行）

最小フィクスチャに対し、`s1.5-event-no` / `s1.5-message-format` / `s1.5-validation-consistency` / `s1.5-reference-spec` / `s1.5-doc-format-pattern` はレポート出力まで問題なく完了した。`s1.5-screen-capture` は埋め込み画像と Claude CLI に依存するため、同条件では WARN となり一括実行の終了コードが 1 になる（**実現は可能だが、画像解析環境のセットアップが別途必要**）。

## 注意

- `s1.5-screen-capture` は Claude CLI と埋め込み画像がないと WARN/SKIP になりやすい（環境依存）。
