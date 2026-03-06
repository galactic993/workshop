# Excel クロスチェック スクリプト - ドキュメント索引

## 概要

このディレクトリには、2つのExcelファイルを相互参照するPythonスクリプトと、その関連ドキュメントが含まれています。

## ファイル構成

### メインスクリプト

#### `check_excel_cross_reference.py` (261行)
Excelファイルの自動クロスチェックを実行するメインスクリプト

**用途**:
- 画面設計書（DB登録値）から取得したフィールドが、テーブル定義書に正しく存在するか検証

**実行方法**:
```bash
python3 check_excel_cross_reference.py
```

**出力**:
- 標準出力: 詳細なチェック結果
- `check_result.md`: マークダウン形式のレポート

---

### ドキュメント一覧

#### 1. `QUICK_START.md` (推奨: まずこれを読む)
**対象者**: スクリプトをすぐに実行したい方

**内容**:
- 前提条件
- 3ステップで実行可能な手順
- よくある質問（FAQ）
- トラブル時の情報取得方法

**所要時間**: 3-5分

---

#### 2. `README_CHECK_SCRIPT.md`
**対象者**: 実行結果と詳細を知りたい方

**内容**:
- 実行結果サマリー
- チェック対象データの詳細
- 使用技術スタック
- 扱うテーブル・フィールド一覧
- 拡張可能な機能

**所要時間**: 10-15分

---

#### 3. `SCRIPT_DOCUMENTATION.md`
**対象者**: スクリプトの動作を理解したい開発者

**内容**:
- スクリプト処理フロー（4段階）
- 対象ファイルの詳細構造
- Excelカラム対応表（Excel列 <-> Python列インデックス）
- チェック対象テーブル一覧
- スクリプト内部関数の説明
- トラブルシューティング

**所要時間**: 20-30分

---

#### 4. `SUMMARY.txt`
**対象者**: プロジェクト全体の状況を把握したい方

**内容**:
- プロジェクト完了状況
- チェック結果サマリー
- スクリプト実装内容
- 技術スタック
- ファイル一覧
- パフォーマンス指標
- 品質指標

**所要時間**: 5-10分

---

### 出力ファイル

#### `check_result.md`
スクリプト実行後に自動生成されるマークダウン形式のレポート

**内容**:
- チェック対象ファイル情報
- チェック結果テーブル
- サマリー統計
- エラー・警告詳細（存在する場合）

**更新**: スクリプト実行時に上書きされます

---

## 使用開始フロー

### シナリオ別ガイド

#### シナリオ1: 「スクリプトをすぐに実行したい」
1. `QUICK_START.md` を読む（5分）
2. 3ステップの実行手順を実行（3秒）
3. 結果を確認

#### シナリオ2: 「実行結果の詳細を知りたい」
1. `QUICK_START.md` でスクリプト実行（5分）
2. `README_CHECK_SCRIPT.md` で結果を理解（10分）
3. `check_result.md` で詳細レポートを確認

#### シナリオ3: 「スクリプトを改造したい」
1. `QUICK_START.md` で環境セットアップ（5分）
2. `SCRIPT_DOCUMENTATION.md` で仕様を理解（25分）
3. `check_excel_cross_reference.py` を編集・テスト

#### シナリオ4: 「トラブルが発生した」
1. `QUICK_START.md` の FAQ を確認
2. `SCRIPT_DOCUMENTATION.md` のトラブルシューティング確認
3. スクリプト実行時のエラーメッセージ確認

---

## ドキュメント選択フロー（図）

```
スクリプトについて知りたい
    |
    +--「すぐに実行したい」 → QUICK_START.md
    |
    +--「結果を理解したい」 → README_CHECK_SCRIPT.md
    |
    +--「仕様を理解したい」 → SCRIPT_DOCUMENTATION.md
    |
    +--「プロジェクト全体を知りたい」 → SUMMARY.txt
    |
    +--「トラブルが発生」 → QUICK_START.md (FAQ)
                      → SCRIPT_DOCUMENTATION.md (トラブルシューティング)
```

---

## 実行環境

### 必須

- **Python**: 3.7以上
- **OS**: macOS / Linux / Windows
- **Excelファイル**:
  - `/Users/izutanikazuki/kzp/fileMaker/training/sample/02-02_2_編-制作見積-制作見積書作成トップ_画面設計書_1007.xlsx`
  - `/Users/izutanikazuki/kzp/fileMaker/training/sample/編-テーブル定義書_1012.xlsx`

### 必須ライブラリ

```
pandas >= 1.0.0
openpyxl >= 2.6.0
```

### インストール

```bash
pip install pandas openpyxl
```

---

## チェック内容サマリー

| 項目 | 結果 |
|---|---|
| 総チェック項目 | 15件 |
| OK | 15件 (100%) |
| エラー・警告 | 0件 |
| チェック対象テーブル | 2個 |
| 参照テーブル | 17個 |
| 処理時間 | 約1-3秒 |

---

## ドキュメント統計

| ファイル | 形式 | サイズ | 行数 |
|---|---|---|---|
| check_excel_cross_reference.py | Python | 8.7KB | 261 |
| QUICK_START.md | Markdown | 4.5KB | 120 |
| README_CHECK_SCRIPT.md | Markdown | 7.2KB | 200 |
| SCRIPT_DOCUMENTATION.md | Markdown | 8.0KB | 250 |
| SUMMARY.txt | Text | 5.8KB | 180 |
| INDEX.md | Markdown | - | - |
| check_result.md | Markdown | 1.4KB | 33 |

---

## よくある質問（クイック版）

**Q: どのドキュメントから始めるべき？**
A: `QUICK_START.md` からどうぞ

**Q: スクリプトはどこにある？**
A: `check_excel_cross_reference.py`

**Q: 結果はどこに出力される？**
A: `check_result.md` に自動保存

**Q: エラーが出た場合は？**
A: `QUICK_START.md` の FAQ セクションを確認

**Q: スクリプトを改造したい場合は？**
A: `SCRIPT_DOCUMENTATION.md` で仕様を確認

---

## 関連リンク

- Python公式: https://www.python.org/
- pandas ドキュメント: https://pandas.pydata.org/
- openpyxl ドキュメント: https://openpyxl.readthedocs.io/

---

## 更新履歴

| 日付 | 内容 |
|---|---|
| 2026-03-03 | スクリプト完成・全ドキュメント作成 |

---

## サポート

### トラブル時の確認項目

1. Python バージョン確認
   ```bash
   python3 --version
   ```

2. ライブラリインストール確認
   ```bash
   pip list | grep -E "(pandas|openpyxl)"
   ```

3. ファイル存在確認
   ```bash
   ls -la sample/02-02_2_*
   ls -la sample/編-テーブル定義書*
   ```

4. スクリプト実行確認
   ```bash
   python3 check_excel_cross_reference.py
   ```

### サポートリソース

- `QUICK_START.md`: FAQ と基本的なトラブルシューティング
- `SCRIPT_DOCUMENTATION.md`: 詳細なトラブルシューティング

---

**Last Updated**: 2026-03-03
**Status**: 本番利用可能
**Version**: 1.0
