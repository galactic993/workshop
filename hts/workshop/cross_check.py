import pandas as pd
import re

pd.set_option('display.max_rows', None)
pd.set_option('display.max_columns', None)
pd.set_option('display.width', None)
pd.set_option('display.max_colwidth', 500)

design_file = '/Users/izutanikazuki/kzp/fileMaker/training/sample/02-02_2_編-制作見積-制作見積書作成トップ_画面設計書_1007.xlsx'
table_file = '/Users/izutanikazuki/kzp/fileMaker/training/sample/編-テーブル定義書_1012.xlsx'

# Step 1: Understand テーブル定義書 structure
skip_sheets = ['表紙', '変更履歴', 'テーブル一覧']
xls = pd.ExcelFile(table_file)

# Print first sheet's full structure to find logical column name position
first_data_sheet = [s for s in xls.sheet_names if s not in skip_sheets][0]
df_first = pd.read_excel(table_file, sheet_name=first_data_sheet, header=None)
print(f"=== テーブル定義書 構造確認: {first_data_sheet} ===")
print(f"Shape: {df_first.shape}")
print("\n全列の先頭10行:")
for col_idx in range(df_first.shape[1]):
    col_vals = []
    for row_idx in range(min(10, df_first.shape[0])):
        v = df_first.iloc[row_idx, col_idx]
        if pd.notna(v):
            col_vals.append(f"[{row_idx}]{str(v)}")
    if col_vals:
        print(f"  列{col_idx}: {col_vals}")

# Step 2: Build mappings
# (Will determine the logical name column from Step 1 output)
# For now, check multiple columns for Japanese names
table_logical_columns = {}
table_physical_columns = {}

for sheet in xls.sheet_names:
    if sheet in skip_sheets:
        continue
    df = pd.read_excel(table_file, sheet_name=sheet, header=None)

    # Physical columns from N column (index 13)
    if df.shape[1] > 13:
        phys_cols = [str(v).strip() for v in df.iloc[:, 13].dropna().tolist()
                     if str(v).strip() and str(v).strip() != 'nan']
        # Remove header row values
        phys_cols = [c for c in phys_cols if c not in ['物理名', 'カラム物理名', 'フィールド物理名', 'カラム名(物理)', '物理カラム名', 'Physical Name']]
        table_physical_columns[sheet] = phys_cols

    # Find logical column names - check columns around index 10-16 for Japanese text
    # Also check all columns for one that contains Japanese field-like names
    for check_col in range(df.shape[1]):
        vals = [str(v).strip() for v in df.iloc[:, check_col].dropna().tolist() if str(v).strip()]
        # Check if this column has header-like value suggesting logical names
        for v in vals[:3]:
            if v in ['論理名', 'カラム論理名', 'フィールド論理名', 'カラム名(論理)', '論理カラム名', 'Logical Name', 'フィールド名', '項目名', 'カラム名', '日本語名']:
                # This might be the logical column header
                logical_cols = [str(x).strip() for x in df.iloc[:, check_col].dropna().tolist() if str(x).strip() != v and str(x).strip()]
                if logical_cols:
                    table_logical_columns[sheet] = logical_cols
                    print(f"\n論理カラム名列 発見: {sheet} 列{check_col} ヘッダー='{v}'")
                    print(f"  値: {logical_cols}")
                break

# If no logical column found, try another approach - look for the column with the most Japanese text
for sheet in xls.sheet_names:
    if sheet in skip_sheets or sheet in table_logical_columns:
        continue
    df = pd.read_excel(table_file, sheet_name=sheet, header=None)
    best_col = -1
    best_count = 0
    for check_col in range(df.shape[1]):
        vals = [str(v).strip() for v in df.iloc[:, check_col].dropna().tolist() if str(v).strip()]
        jp_count = sum(1 for v in vals if re.search(r'[\u3040-\u9FFF]', v))
        if jp_count > best_count and jp_count >= 3:
            best_count = jp_count
            best_col = check_col
    if best_col >= 0 and best_col != 13:  # Don't confuse with physical column
        vals = [str(v).strip() for v in df.iloc[:, best_col].dropna().tolist() if str(v).strip()]
        table_logical_columns[sheet] = vals
        print(f"\n論理カラム名列 推定: {sheet} 列{best_col}")
        print(f"  値: {vals}")

print("\n\n=== テーブル定義書 マッピング ===")
for sheet in xls.sheet_names:
    if sheet in skip_sheets:
        continue
    print(f"\nテーブル: {sheet}")
    if sheet in table_physical_columns:
        print(f"  物理: {table_physical_columns[sheet]}")
    if sheet in table_logical_columns:
        print(f"  論理: {table_logical_columns[sheet]}")

# Step 3: Extract patterns from 参照仕様
df_ref = pd.read_excel(design_file, sheet_name='参照仕様', header=None)

raw_patterns = []
for i in range(df_ref.shape[0]):
    for j in range(df_ref.shape[1]):
        val = df_ref.iloc[i, j]
        if pd.notna(val):
            s = str(val)
            if '.' in s or '．' in s:
                # Skip section headers like "1.《..."
                if re.match(r'^\d+\.《', s):
                    continue
                if s.strip() == 'No.':
                    continue
                raw_patterns.append((i, j, s))

# Parse テーブル名.カラム名 from raw patterns
extracted_refs = set()
for row, col, text in raw_patterns:
    # Clean up
    text = text.strip()
    text = re.sub(r'^and\s*', '', text)
    text = re.sub(r'^→', '', text)

    # Split on = to get the reference part(s)
    parts = re.split(r'[=≠]', text)
    for part in parts:
        part = part.strip()
        # Extract テーブル名.カラム名 patterns
        # Japanese table.column pattern
        matches = re.findall(r'([\u3000-\u9FFFa-zA-Z0-9_]+)\.([\u3000-\u9FFFa-zA-Z0-9_]+)', part)
        for table, column in matches:
            # Skip if table is a number (like section number)
            if re.match(r'^\d+$', table):
                continue
            extracted_refs.add((table, column))

print("\n\n=== 抽出された参照パターン ===")
sorted_refs = sorted(extracted_refs)
for table, col in sorted_refs:
    print(f"  {table}.{col}")
print(f"合計: {len(sorted_refs)}件")

# Step 4: Cross-check
print("\n\n=== クロスチェック結果 ===")

# Available tables in テーブル定義書
available_tables = set(s for s in xls.sheet_names if s not in skip_sheets)
print(f"\nテーブル定義書のテーブル: {sorted(available_tables)}")

# Referenced tables
referenced_tables = set(t for t, c in extracted_refs)
print(f"\n参照仕様で参照されるテーブル: {sorted(referenced_tables)}")

# Tables not in テーブル定義書
missing_tables = referenced_tables - available_tables
print(f"\nテーブル定義書に存在しないテーブル: {sorted(missing_tables)}")

# Build result table
results = []
for table, column in sorted_refs:
    table_exists = table in available_tables
    col_exists = False
    col_check = '-'

    if table_exists:
        # Check in logical columns
        if table in table_logical_columns:
            if column in table_logical_columns[table]:
                col_exists = True
        # Check in physical columns too
        if not col_exists and table in table_physical_columns:
            if column in table_physical_columns[table]:
                col_exists = True

        if col_exists:
            col_check = 'あり'
            status = 'OK'
        else:
            col_check = 'なし'
            status = f'警告: カラム「{column}」が存在しません'
    else:
        col_check = '-'
        status = f'警告: テーブル「{table}」が存在しません'

    results.append({
        'パターン': f'{table}.{column}',
        'テーブル存在': 'あり' if table_exists else 'なし',
        'カラム存在': col_check,
        'チェック結果': status
    })

# Print markdown table
print("\n\n| No | 抽出されたパターン | テーブル存在 | カラム存在 | チェック結果 |")
print("|----|--------------------|--------------|------------|--------------|")
for i, r in enumerate(results, 1):
    print(f"| {i} | {r['パターン']} | {r['テーブル存在']} | {r['カラム存在']} | {r['チェック結果']} |")

# Summary
ok_count = sum(1 for r in results if r['チェック結果'] == 'OK')
warn_count = len(results) - ok_count
print(f"\n=== サマリー ===")
print(f"チェック対象: {len(results)}件")
print(f"OK: {ok_count}件")
print(f"警告: {warn_count}件")

print("\nDONE")
