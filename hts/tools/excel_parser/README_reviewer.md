# 画面設計書レビューツール

画面設計書の内部整合性チェックと、テーブル定義書とのクロスリファレンスチェックを自動化するツールです。

## 機能概要

### A. 画面設計書の内部整合性チェック

| チェックID | チェック内容 | 重要度 |
|-----------|------------|--------|
| A1 | イベント番号の連番性 | Warning |
| A2 | イベント番号のクロスシート対応 | Error |
| A3 | 種別とイベントの矛盾 | Error |
| A4 | 種別とバリデーションの矛盾 | Error/Warning |
| A5 | メッセージの存在確認 | Error |
| A6 | 項目番号の連番性 | Warning |
| A7 | メッセージ番号の連番性 | Warning |

### B. 画面設計書×テーブル定義書のクロスチェック

| チェックID | チェック内容 | 重要度 |
|-----------|------------|--------|
| B1 | DB登録値のフィールド存在確認 | Error |
| B2 | 参照仕様のテーブル/カラム存在確認 | Warning |

## 使用方法

### 基本的な使い方

```python
from tools.excel_parser.screen_design_parser import parse_screen_design
from tools.excel_parser.table_def_parser import parse_table_definitions
from tools.excel_parser.reviewer import review_screen_design, review_cross_reference, format_review_report

# 1. 画面設計書をパース
screen_data = parse_screen_design('path/to/screen_design.xlsx')

# 2. テーブル定義書をパース
table_data_list = [
    parse_table_definitions('path/to/table_def1.xlsx'),
    parse_table_definitions('path/to/table_def2.xlsx'),
]

# 3. レビュー実行
results = review_screen_design(screen_data)
results += review_cross_reference(screen_data, table_data_list)

# 4. レポート生成
report = format_review_report(results, filename='画面名')
print(report)
```

### サンプルスクリプト

`example_review.py` に完全なサンプルコードがあります。

```bash
cd /Users/izutanikazuki/kzp/hts/tools/excel_parser
python3 example_review.py
```

実行すると、以下のファイルが生成されます：
- `review_report.md` - レビュー結果のMarkdownレポート

## レビュー結果の形式

### JSON形式

```python
{
    "check": "A1",           # チェックID
    "severity": "error",     # error | warning | info
    "message": "...",        # エラーメッセージ
    "details": [...]         # 詳細リスト
}
```

### Markdown形式

```markdown
# レビュー結果: 画面名

## サマリー

- エラー: 3件
- 警告: 0件
- 情報: 6件

## 詳細

### ❌ [A2] 項目記述書に記載されているが、イベント記述書に存在しないイベント番号があります

- 未定義のイベント番号: EVENT0012, EVENT0013, ...
```

## チェック項目の詳細

### A1: イベント番号の連番性

イベント記述書のEVENT No.（EVENT0001, EVENT0002...）が抜け番なく連番かを確認します。

**例:**
```
EVENT0001 ✅
EVENT0002 ✅
EVENT0004 ⚠️ EVENT0003が抜けている
```

### A2: イベント番号のクロスシート対応

項目記述書に記載されているEVENT No.が、全てイベント記述書に定義されているかを確認します。

**チェックロジック:**
```
イベント記述書のEVENT No.集合 ⊇ 項目記述書のEVENT No.集合
```

### A3: 種別とイベントの矛盾

項目記述書で種別が「ボタン」「リンク」「プルダウン」「ラジオボタン」の場合、EVENT No.が必須です。

**エラー例:**
```
種別: ボタン
EVENT No: (空) ❌
```

### A4: 種別とバリデーションの矛盾

- 種別が「テキスト」（表示のみ）の場合、制御内容やメッセージがあるのは異常（Error）
- 種別が「テキストインプット」の場合、制御内容が全くないのは警告（Warning）

### A5: メッセージの存在確認

項目記述書のメッセージ文が、メッセージ一覧にも存在するかを確認します（完全一致）。

### A6: 項目番号の連番性

項目記述書のNo.が抜け番なく連番かを確認します。

### A7: メッセージ番号の連番性

メッセージ一覧のNo.が連番かを確認します。

### B1: DB登録値のフィールド存在確認

画面設計書のDB登録値のフィールド名が、テーブル定義書のカラム物理名に存在するかを確認します。

**チェック対象:**
- DB登録値シートの「フィールド名」列

**参照先:**
- 全テーブル定義書のカラム物理名

### B2: 参照仕様のテーブル/カラム存在確認

参照仕様テキストからテーブル名.カラム名パターンを正規表現で抽出し、テーブル定義書のテーブル物理名・カラム物理名と照合します。

**パターン例:**
```
t_users.user_id
m_products.product_name
```

## 拡張

新しいチェック項目を追加する場合は、`reviewer.py` に以下の形式で関数を追加してください：

```python
def _check_new_rule(data: list) -> list:
    """新しいチェックルール"""
    results = []

    # チェックロジック

    if error_found:
        results.append({
            "check": "XX",
            "severity": "error",
            "message": "エラーメッセージ",
            "details": ["詳細1", "詳細2"]
        })

    return results
```

そして、`review_screen_design()` または `review_cross_reference()` から呼び出します。

## ライセンス

社内ツールのため、ライセンスは未定義です。
