---
name: design-check-verify
description: 画面設計書チェック（s1.5-*）の動作検証。最小の Excel ペアを用意し shared-agent-skills の run-all-check で確認する。
---

# design-check-verify

## 目的

`s1.5-*` スキルが、想定する Excel 形式で問題なく解釈できるか、研修・デモ用の **最小の画面設計書・テーブル定義書ペア** で確認する。

## 手順

1. 手元の作業フォルダに最小限の画面設計書・テーブル定義書を用意し、ファイル名のプレフィックス（共/売/編など）が対応するようにする（[`shared-agent-skills/scripts/validate_design_table_pair.sh`](../../shared-agent-skills/scripts/validate_design_table_pair.sh) と同じ命名規則）。
2. `shared-agent-skills` ルートで:

```bash
./scripts/run-all-check.sh /path/to/画面設計書.xlsx /path/to/テーブル定義書.xlsx
```

3. `session1-claude-runs/<日時>/` の各 `.log` を確認する。

## 前提

- `claude` CLI（`claude -p`）
- `shared-agent-skills/skills/` に `s1.5-doc-format-pattern` … `s1.5-screen-capture` が揃っていること

## 注意

- `s1.5-screen-capture` は埋め込み画像・環境依存で WARN になりやすい。
