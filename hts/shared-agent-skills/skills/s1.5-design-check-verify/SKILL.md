---
name: s1.5-design-check-verify
description: 画面設計書チェック（s1.5-*）の動作検証。最小の Excel ペアを用意し run-session1 で確認する。
---

# s1.5-design-check-verify

## 目的

`s1.5-*` スキルが、想定する Excel 形式で問題なく解釈できるか、研修・デモ用の **最小の画面設計書・テーブル定義書ペア** で確認する。

## 手順

1. 手元の作業フォルダに最小限の画面設計書・テーブル定義書を用意し、ファイル名のプレフィックス（共/売/編など）が対応するようにする（[`scripts/validate_design_table_pair.sh`](../../scripts/validate_design_table_pair.sh) と同じ命名規則）。
2. リポジトリルートで:

```bash
./scripts/run-session1-claude-p.sh /path/to/画面設計書.xlsx /path/to/テーブル定義書.xlsx
```

3. `session1-claude-runs/<日時>/` の各 `.log` を確認する。

## 前提

- `claude` CLI（`claude -p`）
- `skills/` に `s1.5-doc-format-pattern` … `s1.5-screen-capture` が揃っていること

## 注意

- `s1.5-screen-capture` は埋め込み画像・環境依存で WARN になりやすい。
