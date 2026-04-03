---
name: s1.5-all-docs
description: 全Excelチェック（s1.5-event-no, s1.5-message-format 等）をまとめて実行する案内。run-all-check.sh が s1.5 個別スキルを並列実行する。
---

# s1.5-all-docs スキル

## 概要

複数の画面設計書チェック観点（`s1.5-doc-format-pattern` から `s1.5-screen-capture` まで）を **まとめて実行**したい場合の案内です。本リポジトリでは **`scripts/run-all-check.sh`** に画面設計書・テーブル定義書を渡すと、次の **s1.5 個別スキル**が `claude -p` で並列実行されます。

同じスクリプトでは **s1.5 以外**に **a1–c3**（イベント連番、項目番号、DB 登録、参照・FK 等）も実行されるため、「画面設計書だけの s1.5」ではなく **Session1 全体**のログとして解釈してください。スクリプトの役割分担・テーブル定義書1冊の前提は [`scripts/README.md`](../scripts/README.md) を参照。

## 一括実行

```bash
cd /path/to/shared-agent-skills
./scripts/run-all-check.sh /path/to/画面設計書.xlsx /path/to/テーブル定義書.xlsx
```

## 実行順序（参考）

`run-all-check.sh` 内の `S15_PROMPT_SKILLS` の定義順です（並列のため完了順は前後し得ます）。

1. s1.5-doc-format-pattern
2. s1.5-event-no
3. s1.5-message-format
4. s1.5-validation-consistency
5. s1.5-reference-spec
6. s1.5-screen-capture

## 出力

各スキルの結果は `session1-claude-runs/<日時>/<スキル名>.log` に保存されます。

## 参照仕様と「リレーション」

- **s1.5-reference-spec** は、参照仕様に書かれた **テーブル論理名・項目論理名がテーブル定義書に存在するか**を扱う。
- **テーブル定義書内部の FK** は **c1-fk-reference-target-exists** が担当する。
- 参照仕様の **結合・取得の業務意味**の正しさは、現状の s1.5 / a–c スキルには含めない（手動レビューまたは将来の別スキル）。
