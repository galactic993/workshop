---
name: s1.5-validation-consistency
description: 画面設計書の項目記述書に記載された制御ルール（必須/桁数等）とメッセージ一覧のメッセージが対応しているかチェックする。
---

# s1.5-validation-consistency スキル

## 概要
画面設計書の項目記述書に記載された制御内容（必須/桁数制限等）と、メッセージ一覧のメッセージが対応しているかチェックする。

## 使い方
python ~/.claude/skills/s1.5-validation-consistency/scripts/check_validation_consistency.py <設計書ディレクトリ> [--output result.xlsx]

## チェック内容
1. 項目記述書の制御内容列から制御ルールを抽出（必須、桁数、半角数字 等）
2. メッセージ一覧からメッセージを抽出
3. 入力チェック系制御ルールに対して対応するエラーメッセージがメッセージ一覧に存在するか確認
4. 不足しているメッセージを検出

## 終了コード
- 0: 全PASS
- 1: WARN/FAILあり
