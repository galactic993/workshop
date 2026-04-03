---
name: s1.5-all-docs
description: 全Excelチェック（s1.5-event-no, s1.5-message-format 等）をまとめて実行する案内。run-session1-claude-p.sh が s1.5 個別スキルを並列実行する。
---

# s1.5-all-docs スキル

## 概要

複数の画面設計書チェック観点（`s1.5-doc-format-pattern` から `s1.5-screen-capture` まで）を **まとめて実行**したい場合の案内です。本リポジトリでは **`scripts/run-session1-claude-p.sh`** に画面設計書・テーブル定義書を渡すと、次の **s1.5 個別スキル**が `claude -p` で並列実行されます。

## 実行方法

```bash
cd /path/to/shared-agent-skills
./scripts/run-session1-claude-p.sh /path/to/画面設計書.xlsx /path/to/テーブル定義書.xlsx
```

## 実行順序（参考）

`run-session1-claude-p.sh` 内の `S15_PROMPT_SKILLS` の定義順です（並列のため完了順は前後し得ます）。

1. s1.5-doc-format-pattern
2. s1.5-event-no
3. s1.5-message-format
4. s1.5-validation-consistency
5. s1.5-reference-spec
6. s1.5-screen-capture

## 出力

各スキルの結果は `session1-claude-runs/<日時>/<スキル名>.log` に保存されます。
