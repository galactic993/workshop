---
name: s1.5-screen-capture
description: 画面設計書の画面概要シートに埋め込まれたキャプチャ画像内の項目名・ボタンラベルと、項目記述書の項目名リストを突合する。
---

# s1.5-screen-capture スキル

## 概要
画面設計書の画面概要シートに埋め込まれたキャプチャ画像内の項目名・ボタンラベルと、
項目記述書の項目名リストを突合する。

## 使い方
python ~/.claude/skills/s1.5-screen-capture/scripts/check_screen_capture.py <設計書ディレクトリ> [--output result.xlsx]

## チェック内容
1. 画面概要シートから埋め込み画像を抽出（openpyxlのws._imagesを使用）
2. 画像をbase64エンコードし、Claudeに項目名・ボタンラベルの読み取りを依頼（claude -p を使用）
3. 項目記述書の項目名リストと突合
4. 画像にあるが項目記述書にない項目、またはその逆を検出

## 注意
- claude CLIが必要。利用できない場合はスキップしてレポートにその旨を記載
- 画像が埋め込まれていない場合は画面概要シートのテキスト情報で代替チェックを実施

## 終了コード
- 0: 全PASS
- 1: WARN/FAILあり
