# shared-agent-skills

研修で作成したエージェントスキルと、画面設計書チェックの動作検証用ワークスペースをまとめた公開用リポジトリです。

## 構成

| パス | 内容 |
|------|------|
| `skills/` | **すべてのスキルをフラット配置**。第一回講義は `a1-event-number-sequence` のように **番号＋スラッグ**、Session 1.5 系は **`s1.5-` プレフィックス**。詳細は [`skills/README.md`](skills/README.md) |
| `scripts/run-all-check.sh` | **必須引数 2 つ**（画面設計書・テーブル定義書）で、第一回＋ s1.5 個別スキルを **`claude -p` 並列実行**。ログは `session1-claude-runs/` |
| `scripts/validate_design_table_pair.sh` | ファイル存在と **プレフィックス一致**（共/売/編など）の検証 |
| `workshop/session1-prompts-all/` | 第一回講義プロンプト一括用 `SKILL.md` と `references/` |

## スキルの使い方（Claude / Claude Code）

`skills/a1-*` / `skills/s1.5-*` を `~/.claude/skills/` にコピーまたはシンボリックリンクしてください。単体で使うときはスキルフォルダ名（例: `a1-event-number-sequence`）を指定し、**チェック・レポートのみ**とし、画面設計書・テーブル定義書の**編集・上書きは行わない**こと。

## 一括実行（推奨）

```bash
cd /path/to/shared-agent-skills
./scripts/run-all-check.sh /path/to/画面設計書.xlsx /path/to/テーブル定義書.xlsx
```

- D1（統合 Markdown）も含める: `WITH_MARKDOWN=1 ./scripts/run-all-check.sh ...`

詳細は [`skills/README.md`](skills/README.md) を参照してください。

## design-check-verify

`s1.5-*` を最小フィクスチャで試す手順は [`skills/s1.5-design-check-verify/SKILL.md`](skills/s1.5-design-check-verify/SKILL.md) を参照してください。

## ライセンス・帰属

その他ファイルの利用条件は利用者の組織方針に合わせてください。
