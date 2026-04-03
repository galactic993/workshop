# shared-agent-skills

研修で作成したエージェントスキルと、画面設計書チェックの動作検証用ワークスペースをまとめた公開用リポジトリです。

## 構成

| パス | 内容 |
|------|------|
| `skills/` | **すべてのスキルをフラット配置**。第一回講義は `a1-event-number-sequence` のように **番号＋スラッグ**、Session 1.5 系は **`s1.5-` プレフィックス**。詳細は [`skills/README.md`](skills/README.md) |
| `scripts/run-session1-claude-p.sh` | **必須引数 2 つ**（画面設計書・テーブル定義書）で、第一回＋ s1.5 個別スキルを **`claude -p` 並列実行**。任意で `RUN_S15_PYTHON=1` 時のみ Python 一括。ログは `session1-claude-runs/` |
| `scripts/validate_design_table_pair.py` | ファイル存在と **プレフィックス一致**（共/売/編など）の検証 |
| `workshop/session1-prompts-all/` | 第一回講義プロンプト一括用 `SKILL.md` と `references/` |

## スキルの使い方（Claude / Claude Code）

`skills/a1-*` / `skills/s1.5-*` を `~/.claude/skills/` にコピーまたはシンボリックリンクしてください。

## 一括実行（推奨）

```bash
cd /path/to/shared-agent-skills
./scripts/run-session1-claude-p.sh /path/to/画面設計書.xlsx /path/to/テーブル定義書.xlsx
```

- D1（統合 Markdown）も含める: `WITH_MARKDOWN=1 ./scripts/run-session1-claude-p.sh ...`
- Python 一括（`run_all_checks.py`）も最後に実行: `RUN_S15_PYTHON=1 ./scripts/run-session1-claude-p.sh ...`（`pip install openpyxl`）

詳細は [`skills/README.md`](skills/README.md) を参照してください。

## design-check-verify の実行例

```bash
cd /path/to/shared-agent-skills/skills/s1.5-design-check-verify
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python scripts/build_minimal_fixtures.py
.venv/bin/python ../s1.5-all-docs/scripts/run_all_checks.py "$(pwd)/fixtures" \
  --skills-dir "$(pwd)/.." --output check_all_result.xlsx
```

## ライセンス・帰属

その他ファイルの利用条件は利用者の組織方針に合わせてください。
