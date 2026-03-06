# 第2回: Excelパーサーの理解と活用

## 学習目標
- openpyxlの基本操作を習得する
- screen_design_parser.pyの処理フローを理解する
- table_def_parser.pyの処理フローを理解する
- CLIツールの使い方をマスターする

## 1. openpyxlの基本操作

### インストール
```bash
pip install openpyxl
```

### 基本的な読み取り
```python
from openpyxl import load_workbook

# ワークブックを開く（data_only=Trueで計算結果を取得）
wb = load_workbook('file.xlsx', data_only=True)

# シート一覧
print(wb.sheetnames)

# シートを取得
sheet = wb['シート名']

# セル値の取得（row, column は1始まり）
value = sheet.cell(row=1, column=1).value

# 結合セルの注意点
# 結合セルの場合、左上のセルにのみ値がある
# 他のセルはNoneになる
```

### Excel列番号の対応表
設計書で使用する主要な列:
| 列名 | 列番号 | 用途例 |
|------|--------|--------|
| B | 2 | No, EVENT No |
| G | 7 | 項目名, トリガー |
| P | 16 | 物理名 |
| U | 21 | 区分, 論理名 |
| Z | 26 | 処理内容 |
| AD | 30 | 制御区分 |
| AI | 35 | PK, 制御内容 |
| AS | 45 | メッセージ |

## 2. screen_design_parser.py の解説

### 全体構造
```
parse_screen_design(filepath)
├── _parse_metadata(sheet)      # 行1-2: ヘッダー情報
├── _parse_events(sheet)        # イベント記述書シート
├── _parse_items(sheet)         # 項目記述書シート
├── _parse_db_values(sheet)     # DB登録値シート
└── _parse_messages(sheet)      # メッセージ一覧シート
```

### 戻り値の構造
```python
{
    "metadata": {"画面名": "...", "作成日": "..."},
    "events": [
        {"event_no": "EVENT0001", "trigger": "...", "type": "...", "process_main": "..."}
    ],
    "items": [
        {"no": "1", "name": "...", "type": "ボタン", "event_no": "EVENT0001", ...}
    ],
    "db_values": [
        {"no": "1", "name": "...", "field_name": "...", "condition": "...", "value": "..."}
    ],
    "messages": [
        {"no": "1", "condition": "...", "type": "エラー", "message": "..."}
    ]
}
```

### 重要なポイント
- **空行スキップ**: 連続20行空白で読み取り終了
- **シート判別**: シート名に「イベント記述書」「項目記述書」等を含むかで判定
- **NFC正規化**: macOSのファイル名はNFD形式のため、NFC正規化が必要

## 3. table_def_parser.py の解説

### 全体構造
```
parse_table_definitions(filepath)
├── _parse_table_list(wb)       # テーブル一覧シート
└── _parse_table_sheet(sheet)   # 各テーブル定義シート（繰り返し）
```

### 戻り値の構造
```python
{
    "overview": {
        "tables": [{"no": 1, "logical_name": "...", "physical_name": "...", ...}]
    },
    "tables": {
        "table_physical_name": {
            "logical_name": "...",
            "physical_name": "...",
            "columns": [
                {"no": 1, "logical_name": "...", "physical_name": "...",
                 "data_type": "VARCHAR", "length": "50",
                 "not_null": True, "pk": False, "uk": False, "fk": False,
                 "default": "", "remarks": ""}
            ]
        }
    }
}
```

### 重要なポイント
- **スキップ対象シート**: 「表紙」「変更履歴」「テーブル一覧」
- **●マーク判定**: NOT NULL, PK, UK, FKは「●」の有無で判定
- **カラム情報開始行**: 行6から（ヘッダーは行5）

## 4. main.py CLIの使い方

### 変換コマンド
```bash
# 単一ファイル
python3 main.py convert path/to/file.xlsx -o output/

# ディレクトリ一括
python3 main.py convert path/to/design-sample/ -o output/

# JSON形式で出力
python3 main.py convert path/to/file.xlsx -o output/ --format json
```

### レビューコマンド
```bash
# ディレクトリ内の全設計書をレビュー
python3 main.py review path/to/design-sample/ -o output/
```

## 5. ハンズオン: 新しい設計書のパース

### 演習1: 既存パーサーで変換
```bash
cd tools/excel_parser

# 全ファイルをMarkdown変換
python3 main.py convert ../../design-sample/ -o ../../output/

# 出力を確認
ls ../../output/*.md
```

### 演習2: パース結果をPythonで操作
```python
from screen_design_parser import parse_screen_design

data = parse_screen_design('../../design-sample/02-02_2_編-制作見積-制作見積書作成トップ_画面設計書_1007.xlsx')

# イベント数を確認
print(f"イベント数: {len(data['events'])}")

# ボタン項目を抽出
buttons = [item for item in data['items'] if item['type'] == 'ボタン']
print(f"ボタン数: {len(buttons)}")
for btn in buttons:
    print(f"  - {btn['name']} (EVENT: {btn['event_no']})")
```

### 演習3: テーブル定義の集計
```python
from table_def_parser import parse_table_definitions

data = parse_table_definitions('../../design-sample/共-テーブル定義書_1013.xlsx')

# テーブル数
print(f"テーブル数: {len(data['tables'])}")

# 各テーブルのカラム数
for name, info in data['tables'].items():
    print(f"  {info['logical_name']}({name}): {len(info['columns'])}カラム")
```

## まとめ
- openpyxlでExcelのセル値を行・列番号で取得できる
- screen_design_parser.pyは5つのサブパーサーで構成される
- table_def_parser.pyは各シートを個別テーブルとしてパースする
- main.py CLIで一括変換・レビューが可能

## 次回予告
第3回では、自動レビューツールの仕組みを詳しく解説します。
