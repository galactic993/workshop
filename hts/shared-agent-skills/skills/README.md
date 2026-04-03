# `skills/` 直下の構成

すべてのエージェントスキルと Excel チェック用 **`s1.5-*` スキル**を **`shared-agent-skills/skills/` にフラット配置**しています。

| 種別 | ディレクトリ名の例 |
|------|---------------------|
| 第一回講義（プロンプト系） | `a1-event-number-sequence` … `d1-unified-design-to-markdown` |
| Session 1.5（プロンプト） | `s1.5-event-no` など（`scripts/run-all-check.sh` が **プロンプトで並列実行**）。`s1.5-all-docs` は **一括実行の案内**（個別スキルと同じ `run-all-check.sh` を参照） |
| Session 1.5（補助・検証・Cowork） | `s1.5-design-check-verify` / `s1.5-cowork-screen-capture-review` |

各プロンプトは **講義 ID（`a1` / `b1` …）＋説明スラッグ**（`name`・フォルダ名）で保持しています。元テキストは `workshop/session1-prompts-all/references/` と対応します。`claude -p` での **実行順**は `scripts/run-all-check.sh` 内の配列で定義されています。

## 講義 ID とスキル名の対応（第一回）

| 講義 ID | スキル名（`name` / ディレクトリ名） |
|---------|--------------------------------------|
| A1 | `a1-event-number-sequence` |
| A2 | `a2-event-number-cross-sheet` |
| A3 | `a3-control-type-event-mismatch` |
| A4 | `a4-control-type-validation-mismatch` |
| A6 | `a6-item-number-sequence` |
| A7 | `a7-message-number-sequence` |
| B1 | `b1-db-registration-field-exists` |
| B2 | `b2-ref-spec-table-column-exists` |
| C1 | `c1-fk-reference-target-exists` |
| C2 | `c2-pk-definition-check` |
| C3 | `c3-not-null-without-default` |
| D1 | `d1-unified-design-to-markdown`（`WITH_MARKDOWN=1` のとき） |

## 一括実行（`run-all-check.sh`）

**必須引数**で画面設計書・テーブル定義書を渡します（環境変数 `SCREEN_XLSX` / `TABLE_XLSX` は不要）。

```bash
cd /path/to/shared-agent-skills
./scripts/run-all-check.sh /path/to/画面設計書.xlsx /path/to/テーブル定義書.xlsx
```

- ファイル存在と **ファイル名プレフィックス（共/売/編など）の一致**を検証（[`scripts/validate_design_table_pair.sh`](../scripts/validate_design_table_pair.sh)）
- 第一回スキル（a1–c3）＋任意で D1（`WITH_MARKDOWN=1`）＋ **s1.5 個別スキル 6 本**を **`claude -p` で並列**実行（`MAX_PARALLEL`、既定 4）
- 終了後に **サマリ**を表示。任意で **コピー作成＋修正用 `claude -p`**（対話）

主な環境変数:

| 変数 | 意味 |
|------|------|
| `WITH_MARKDOWN=1` | D1 を含める |
| `MAX_PARALLEL` | 同時実行数（既定 4） |
| `SKIP_S15_PROMPTS=1` | s1.5 プロンプト 6 本をスキップ |
| `INTERACTIVE_FIX=0` | 修正確認プロンプトを出さない |
| `OUT_DIR` | ログ出力先 |

ログは `session1-claude-runs/<日時>/`（`.gitignore` 対象）。

## 再生成（`references` から SKILL を書き戻す）

`workshop/session1-prompts-all/references/` の内容と突き合わせて、`skills/a1-*` などの `SKILL.md` を手で更新してください。

## 依存

- `claude` CLI（`claude -p`）
- `bash`（検証スクリプト）
- `s1.5-screen-capture`: 画像突合時は環境依存で WARN になりやすい
