# Excel クロスチェック スクリプト - 実行結果サマリー

## 完成したスクリプト

**ファイル**: `/Users/izutanikazuki/kzp/fileMaker/training/check_excel_cross_reference.py`

## 実行結果

```
総チェック項目: 15 件
OK: 15 件
エラー・警告: 0 件
```

**チェック状況**: ✓ 全項目OK（エラーなし）

## チェック対象

### 1. 画面設計書（DB登録値）から抽出されたフィールド

| テーブル | No. | 項目名 | フィールド名 | 状態 |
|---|---|---|---|---|
| 制作見積 | 1 | ステータス | prod_quot_status | OK |
| 制作見積 | 2 | 更新日 | updated_at | OK |
| 制作見積依頼 | 1 | 制作見積依頼id | prod_quot_request_id | OK |
| 制作見積依頼 | 2 | 制作見積id | prod_quot_id | OK |
| 制作見積依頼 | 3 | 作業部署id | section_cd_id | OK |
| 制作見積依頼 | 4 | 依頼者id | requested_by | OK |
| 制作見積依頼 | 5 | 依頼概要 | request_summary | OK |
| 制作見積依頼 | 6 | 参考資料 | reference_doc_path | OK |
| 制作見積依頼 | 7 | 根拠資料 | supporting_doc_path | OK |
| 制作見積依頼 | 8 | 設計者id | designed_by | OK |
| 制作見積依頼 | 9 | 承認者id | approved_by | OK |
| 制作見積依頼 | 10 | 承認日時 | approved_at | OK |
| 制作見積依頼 | 11 | ステータス | prod_quot_request_status | OK |
| 制作見積依頼 | 12 | 作成日 | created_at | OK |
| 制作見積依頼 | 13 | 更新日 | updated_at | OK |

### 2. テーブル定義書から抽出されたテーブル（17個）

1. **制作見積** (10フィールド)
   - prod_quot_id, quot_id, cost, quot_doc_path, reference_doc_path, submission_on, prod_quot_status, version, created_at, updated_at

2. **制作見積依頼** (13フィールド)
   - prod_quot_request_id, prod_quot_id, section_cd_id, requested_by, request_summary, reference_doc_path, supporting_doc_path, designed_by, approved_by, approved_at, prod_quot_request_status, created_at, updated_at

3. **制作見積詳細** (9フィールド)

4. **作業部門別制作見積** (6フィールド)

5. **制作見積差戻管理** (7フィールド)

6. **制作基準価格** (8フィールド)

7. **ランク単価マスタ** (3フィールド)

8. **ランク単価マスタ履歴** (6フィールド)

9. **個人別ランク単価マスタ** (3フィールド)

10. **個人別ランク単価マスタ履歴** (6フィールド)

11. **原価単価マスタ** (4フィールド)

12. **原価単価マスタ履歴** (6フィールド)

13. **作業振分** (6フィールド)

14. **作業項目別作業設計** (7フィールド)

15. **担当者別作業設計** (10フィールド)

16. **作業実績** (7フィールド)

17. **社内仕掛在庫金額計上** (7フィールド)

## スクリプトの機能

### 主要機能

1. **Excelファイル読み込み**
   - pandas + openpyxl を使用してExcelファイルを読み込み
   - 複数シート対応

2. **データ抽出**
   - 画面設計書の「DB登録値」シートからテーブル名とフィールド定義を抽出
   - テーブル定義書の各テーブルシートからフィールド定義を抽出
   - 列インデックスの正確な解析（A-AN列対応）

3. **クロスチェック**
   - 画面設計書で定義されたフィールドがテーブル定義書に存在するか確認
   - テーブル存在チェック
   - フィールド名存在チェック

4. **結果出力**
   - 標準出力にテーブル形式で表示
   - マークダウンファイル (`check_result.md`) に保存

### スクリプト構成

```python
# 3つの主要関数

1. extract_screen_design_data()
   - 画面設計書からデータ抽出
   - 戻り値: フィールド定義リスト (15件)

2. extract_table_definitions()
   - テーブル定義書からテーブル・フィールド抽出
   - 戻り値: テーブル->フィールド辞書 (17テーブル)

3. cross_check(screen_data, table_fields)
   - フィールド名が存在するか確認
   - 戻り値: (チェック結果リスト, エラーリスト)

4. format_markdown_table(results)
   - マークダウンテーブルにフォーマット
```

## 出力ファイル

### 1. check_result.md（自動生成）

チェック結果をマークダウン形式で保存

```
# Excel ファイル クロスチェック結果

## チェック対象ファイル
- 画面設計書: 02-02_2_編-制作見積-制作見積書作成トップ_画面設計書_1007.xlsx
- テーブル定義書: 編-テーブル定義書_1012.xlsx

## チェック結果
| DB登録値セクション | 行番号 | 項目名 | フィールド名 | チェック結果 |
|---|---|---|---|---|
| 制作見積 | 1 | ステータス | prod_quot_status | OK |
...

## サマリー
- 総チェック項目: 15
- OK: 15
- エラー・警告: 0
```

## 使用技術

- **Python 3.x**
- **pandas**: Excel読み込み・データ処理
- **openpyxl**: Excelファイル形式対応
- **型ヒント (typing)**: コード品質向上

## 実行方法

```bash
# ディレクトリ移動
cd /Users/izutanikazuki/kzp/fileMaker/training

# 仮想環境有効化（初回のみ）
python3 -m venv venv
source venv/bin/activate
pip install pandas openpyxl

# スクリプト実行
python3 check_excel_cross_reference.py

# 出力
# - 標準出力: チェック結果の詳細表示
# - check_result.md: マークダウン形式の結果ファイル
```

## 拡張可能な機能

今後追加可能な機能：

1. **フィールド型チェック**
   - 論理名に基づくデータ型検証

2. **フィールド長チェック**
   - 定義された最大長の検証

3. **必須フィールドチェック**
   - Null許可フラグの検証

4. **差分レポート**
   - 前回実行との差分表示

5. **複数スクリーン対応**
   - 複数の画面設計書を一括チェック

6. **Excelレポート出力**
   - フォーマット済みのExcelレポート生成

7. **Webダッシュボード**
   - ブラウザで結果表示

## ファイル一覧

| ファイル | 説明 |
|---|---|
| `check_excel_cross_reference.py` | メインスクリプト |
| `SCRIPT_DOCUMENTATION.md` | スクリプト詳細説明書 |
| `README_CHECK_SCRIPT.md` | このファイル |
| `check_result.md` | チェック結果（自動生成） |

## トラブルシューティング

### スクリプト実行エラー

**Error: ModuleNotFoundError: No module named 'pandas'**
```bash
pip install pandas openpyxl
```

**Error: ファイルが見つからない**
- ファイルパスが正確か確認
- `sample` フォルダの存在確認

**チェック結果が0件**
- 画面設計書の「DB登録値」シートが存在するか確認
- シート構造が変更されていないか確認

## 今後の改善事項

1. **設定ファイル化**
   - ハードコードされたパスを設定ファイルから読み込み

2. **ロギング機能**
   - 実行ログの詳細記録

3. **バリデーション強化**
   - より細かいエラーチェック

4. **パフォーマンス最適化**
   - 大規模ファイル対応

5. **テストケース追加**
   - ユニットテスト・統合テスト

---

**作成日**: 2026-03-03
**最終実行**: 成功（エラーなし）
**対応Excel仕様**: Office 2019以降、LibreOffice対応
