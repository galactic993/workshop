---
name: s1.5-event-no
description: 画面設計書のEVENT No採番整合性チェック。欠番・重複検出、項目記述書からの未定義参照検出、振り直し案の提示を行う。
---

# s1.5-event-no スキル

## 概要
画面設計書のイベント記述書・項目記述書シートを対象に、EVENT No（EVENT0001形式）の採番整合性をチェックする。

## 使い方
```bash
python ~/.claude/skills/s1.5-event-no/scripts/check_event_no.py <設計書ディレクトリ> [--output result.xlsx]
```

## チェック内容
1. イベント記述書の全EVENT Noを抽出（EVENT\d{4}形式）
2. 連番チェック: 欠番・重複を検出
3. 項目記述書のEVENT No列を抽出し、イベント記述書に存在するか突合
4. 振り直し案（連番で再採番した場合の新旧対応表）を生成

## 出力レポート列
| 列 | 内容 |
|---|---|
| ファイル名 | 対象画面設計書 |
| チェック種別 | 欠番/重複/未定義参照 |
| EVENT No | 対象のEVENT No |
| 行番号 | シート内の行位置 |
| 詳細 | 問題の説明 |
| 判定 | PASS/WARN/FAIL |

## 終了コード
- 0: 全PASS
- 1: WARN/FAILあり
