# クイックスタートガイド

## Excel クロスチェック スクリプト実行方法

### 前提条件

- Python 3.7以上がインストール済み
- 対象Excelファイルが存在
  - `/Users/izutanikazuki/kzp/fileMaker/training/sample/02-02_2_編-制作見積-制作見積書作成トップ_画面設計書_1007.xlsx`
  - `/Users/izutanikazuki/kzp/fileMaker/training/sample/編-テーブル定義書_1012.xlsx`

### 実行手順（3ステップ）

#### Step 1: ディレクトリ移動

```bash
cd /Users/izutanikazuki/kzp/fileMaker/training
```

#### Step 2: 仮想環境セットアップ（初回のみ）

```bash
# 仮想環境作成
python3 -m venv venv

# 仮想環境有効化
source venv/bin/activate

# ライブラリインストール
pip install pandas openpyxl
```

#### Step 3: スクリプト実行

```bash
# 仮想環境が有効な状態で実行
python3 check_excel_cross_reference.py
```

### 出力結果

**標準出力**（画面に表示）:
- チェック処理の進捗
- チェック結果（マークダウン表形式）
- サマリー（総件数、OK件数、エラー件数）

**ファイル出力**:
- `check_result.md` - マークダウン形式のチェック結果

### 実行例（完全なコマンド）

```bash
cd /Users/izutanikazuki/kzp/fileMaker/training
source venv/bin/activate
python3 check_excel_cross_reference.py
```

### 期待される出力

```
====================================================================================================
Excel ファイル クロスチェック
====================================================================================================

1. 画面設計書から DB登録値 を抽出中...
   → 15 件のフィールド定義を抽出しました

2. テーブル定義書からフィールド定義を抽出中...
   → 17 個のテーブル定義を抽出しました

3. クロスチェック実行中...
   → チェック完了

====================================================================================================
チェック結果
====================================================================================================

| DB登録値セクション | 行番号 | 項目名 | フィールド名 | チェック結果 |
|---|---|---|---|---|
| 制作見積 | 1 | ステータス | prod_quot_status | OK |
...

====================================================================================================
サマリー
====================================================================================================
総チェック項目: 15
OK: 15
エラー・警告: 0

✓ 結果を保存しました: check_result.md
```

## よくある質問（FAQ）

### Q1: エラー「No module named 'pandas'」が出たら？

**A**: pandas をインストールしてください
```bash
pip install pandas openpyxl
```

### Q2: スクリプトが見つからないエラーが出たら？

**A**: 正しいディレクトリにいるか確認してください
```bash
pwd  # カレントディレクトリ確認
ls check_excel_cross_reference.py  # ファイル存在確認
```

### Q3: チェック結果が0件で表示されたら？

**A**: 画面設計書のシート名確認
- 「DB登録値」というシートが存在するか確認
- シート構造が変更されていないか確認

### Q4: チェック結果ファイルがない場合？

**A**: 出力ディレクトリの書き込み権限確認
```bash
ls -la check_result.md
```

## スクリプトの動作確認

```bash
# 簡単な動作確認
python3 -c "import pandas; print('pandas OK')"
python3 -c "import openpyxl; print('openpyxl OK')"
```

## トラブル時の情報取得

エラーが発生した場合、以下の情報を取得してください：

```bash
# Python バージョン確認
python3 --version

# パッケージ確認
pip list | grep -E "(pandas|openpyxl)"

# ファイル確認
ls -la sample/02-02_2_*
ls -la sample/編-テーブル定義書*

# スクリプト確認
ls -la check_excel_cross_reference.py
```

## スクリプト概要

| 項目 | 内容 |
|---|---|
| ファイル名 | `check_excel_cross_reference.py` |
| 処理時間 | 約1-3秒 |
| メモリ使用量 | 約10-50MB |
| 出力形式 | マークダウン |
| 対応Excelバージョン | Office 2019以降、Google Sheets不可 |

## ドキュメント

詳細情報は以下を参照:
- `README_CHECK_SCRIPT.md` - 実行結果サマリー
- `SCRIPT_DOCUMENTATION.md` - スクリプト詳細仕様書

---

**Last Updated**: 2026-03-03
