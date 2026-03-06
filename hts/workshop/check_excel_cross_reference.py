#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Excel Cross-Check Script
Compares field names between screen design doc and table definition doc
"""

import pandas as pd
from typing import Dict, List, Tuple

# File paths
SCREEN_DESIGN_FILE = "/Users/izutanikazuki/kzp/fileMaker/training/sample/02-02_2_編-制作見積-制作見積書作成トップ_画面設計書_1007.xlsx"
TABLE_DEF_FILE = "/Users/izutanikazuki/kzp/fileMaker/training/sample/編-テーブル定義書_1012.xlsx"

def extract_screen_design_data() -> List[Dict]:
    """
    Extract table sections, field names, and registration values from DB登録値 sheet

    Returns:
        List of dicts: [
            {
                'table_name': str,
                'row_num': int,
                'item_name': str,
                'field_name': str,
                'other_condition': str,
                'registration_value': str
            }
        ]
    """
    df = pd.read_excel(SCREEN_DESIGN_FILE, sheet_name="DB登録値", header=None)

    results = []
    current_table = None

    for idx, row in df.iterrows():
        # Column indices (Excel columns converted to 0-based indices):
        # B=1, G=6, O=14, Y=24, AN=39

        col_b = row[1]
        col_g = row[6]
        col_o = row[14]
        col_y = row[24]
        col_an = row[39]

        # Skip header metadata rows
        if pd.isna(col_b):
            # Check if column B is empty but we can still identify patterns
            pass
        else:
            col_b_str = str(col_b).strip()

            # Detect table name rows (column B has table name, column G is empty)
            col_g_str = str(col_g).strip() if pd.notna(col_g) else ''
            if col_b_str and col_b_str not in ['No.', 'システム名', 'サブシステム名']:
                if pd.isna(col_g) or col_g_str == '':
                    # This is a table name row
                    if '見積' in col_b_str or '依頼' in col_b_str:
                        current_table = col_b_str
                        continue

            # Skip header rows (containing "No." in column B)
            if col_b_str == 'No.':
                continue

            # Check if this is a data row (column B is a number)
            try:
                row_num = int(col_b_str)
                col_g_str = str(col_g).strip() if pd.notna(col_g) else None
                col_o_str = str(col_o).strip() if pd.notna(col_o) else None

                if current_table and col_g_str and col_o_str:
                    other_cond = str(col_y).strip() if pd.notna(col_y) else ""
                    reg_value = str(col_an).strip() if pd.notna(col_an) else ""

                    results.append({
                        'table_name': current_table,
                        'row_num': row_num,
                        'item_name': col_g_str,
                        'field_name': col_o_str,
                        'other_condition': other_cond,
                        'registration_value': reg_value
                    })
            except (ValueError, TypeError):
                pass

    return results


def extract_table_definitions() -> Dict[str, List[str]]:
    """
    Extract field names from all table definition sheets

    Returns:
        Dict mapping table name to list of field names (physical names from column N)
    """
    excel_file = pd.ExcelFile(TABLE_DEF_FILE)
    table_fields = {}

    # Skip the first few sheets (表紙, 変更履歴, テーブル一覧) - they're metadata
    table_sheets = excel_file.sheet_names[3:]  # Start from index 3

    for sheet_name in table_sheets:
        df = pd.read_excel(TABLE_DEF_FILE, sheet_name=sheet_name, header=None)

        fields = []
        for idx, row in df.iterrows():
            # Column indices: B=1, E=4, N=13
            col_b = row[1]
            col_e = row[4]
            col_n = row[13]

            # Data rows: column B is a number, column E is logical name, column N is physical name
            if pd.notna(col_b):
                try:
                    row_num = int(col_b)
                    if pd.notna(col_n):
                        field_name = str(col_n).strip()
                        if field_name:
                            fields.append(field_name)
                except (ValueError, TypeError):
                    pass

        if fields:
            table_fields[sheet_name] = fields

    return table_fields


def cross_check(screen_data: List[Dict], table_fields: Dict[str, List[str]]) -> Tuple[List[Dict], List[str]]:
    """
    Cross-check field names from screen design against table definitions

    Returns:
        Tuple of (results_list, error_messages)
    """
    results = []
    errors = []

    for record in screen_data:
        table_name = record['table_name']
        field_name = record['field_name']

        # Check if table exists in definitions
        if table_name not in table_fields:
            check_result = f"エラー: テーブル '{table_name}' が定義書に存在しません"
            errors.append(check_result)
        else:
            # Check if field exists in table
            if field_name in table_fields[table_name]:
                check_result = "OK"
            else:
                check_result = f"警告: フィールド '{field_name}' が {table_name} に存在しません"
                errors.append(check_result)

        results.append({
            'section': record['table_name'],
            'row_num': record['row_num'],
            'item_name': record['item_name'],
            'field_name': record['field_name'],
            'check_result': check_result
        })

    return results, errors


def format_markdown_table(results: List[Dict]) -> str:
    """Format results as markdown table"""
    lines = []
    lines.append("| DB登録値セクション | 行番号 | 項目名 | フィールド名 | チェック結果 |")
    lines.append("|---|---|---|---|---|")

    for r in results:
        lines.append(
            f"| {r['section']} | {r['row_num']} | {r['item_name']} | {r['field_name']} | {r['check_result']} |"
        )

    return "\n".join(lines)


def main():
    print("=" * 100)
    print("Excel ファイル クロスチェック")
    print("=" * 100)
    print()

    # Extract data
    print("1. 画面設計書から DB登録値 を抽出中...")
    screen_data = extract_screen_design_data()
    print(f"   → {len(screen_data)} 件のフィールド定義を抽出しました")
    print()

    print("2. テーブル定義書からフィールド定義を抽出中...")
    table_fields = extract_table_definitions()
    print(f"   → {len(table_fields)} 個のテーブル定義を抽出しました")
    for table_name, fields in sorted(table_fields.items()):
        print(f"      - {table_name}: {len(fields)} フィールド")
    print()

    # Cross-check
    print("3. クロスチェック実行中...")
    results, errors = cross_check(screen_data, table_fields)
    print(f"   → チェック完了")
    print()

    # Output results
    print("=" * 100)
    print("チェック結果")
    print("=" * 100)
    print()
    markdown_table = format_markdown_table(results)
    print(markdown_table)
    print()

    # Summary
    ok_count = sum(1 for r in results if r['check_result'] == "OK")
    error_count = len(errors)

    print()
    print("=" * 100)
    print("サマリー")
    print("=" * 100)
    print(f"総チェック項目: {len(results)}")
    print(f"OK: {ok_count}")
    print(f"エラー・警告: {error_count}")

    if errors:
        print()
        print("エラー・警告の詳細:")
        for error in errors:
            print(f"  - {error}")

    print()

    # Save to file
    output_file = "/Users/izutanikazuki/kzp/fileMaker/training/check_result.md"
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("# Excel ファイル クロスチェック結果\n\n")
            f.write("## チェック対象ファイル\n\n")
            f.write("- 画面設計書: 02-02_2_編-制作見積-制作見積書作成トップ_画面設計書_1007.xlsx\n")
            f.write("- テーブル定義書: 編-テーブル定義書_1012.xlsx\n\n")
            f.write("## チェック結果\n\n")
            f.write(markdown_table)
            f.write("\n\n")
            f.write("## サマリー\n\n")
            f.write(f"- 総チェック項目: {len(results)}\n")
            f.write(f"- OK: {ok_count}\n")
            f.write(f"- エラー・警告: {error_count}\n")
            if errors:
                f.write("\n## エラー・警告の詳細\n\n")
                for error in errors:
                    f.write(f"- {error}\n")
        print(f"✓ 結果を保存しました: {output_file}")
    except Exception as e:
        print(f"✗ ファイル保存エラー: {e}")


if __name__ == "__main__":
    main()
