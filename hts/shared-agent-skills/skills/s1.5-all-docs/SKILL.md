---
name: s1.5-all-docs
description: 全Excelチェックスキル（s1.5-event-no, s1.5-message-format, s1.5-validation-consistency, s1.5-reference-spec, s1.5-screen-capture, s1.5-doc-format-pattern）を順次実行し、統合レポートを出力する一括チェックスクリプト。
---

# s1.5-all-docs スキル

## 概要

複数の画面設計書に対して、各種チェックを順次実行し、統合レポートを生成します。

## 実行方法

```bash
python ~/.claude/skills/s1.5-all-docs/scripts/run_all_checks.py <設計書ディレクトリ> [--output check_all_result.xlsx]
```

## 実行順序

1. s1.5-doc-format-pattern: ドキュメントフォーマットパターン
2. s1.5-event-no: EVENT No採番整合性
3. s1.5-message-format: メッセージフォーマット準拠
4. s1.5-validation-consistency: バリデーション整合性
5. s1.5-reference-spec: 参照仕様整合性
6. s1.5-screen-capture: 画面キャプチャ突合

## 出力

- 統合Excelレポート（各チェックの結果をシート別に格納）
