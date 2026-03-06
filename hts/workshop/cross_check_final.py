import pandas as pd
import re

pd.set_option('display.max_rows', None)
pd.set_option('display.max_columns', None)
pd.set_option('display.width', None)
pd.set_option('display.max_colwidth', 500)

design_file = '/Users/izutanikazuki/kzp/fileMaker/training/sample/02-02_2_編-制作見積-制作見積書作成トップ_画面設計書_1007.xlsx'
table_file = '/Users/izutanikazuki/kzp/fileMaker/training/sample/編-テーブル定義書_1012.xlsx'
skip_sheets = ['表紙', '変更履歴', 'テーブル一覧']

# ============================================================
# Step 1: Build table definition mapping
# ============================================================
xls = pd.ExcelFile(table_file)
table_logical_columns = {}  # テーブル名 -> [論理カラム名]
table_physical_columns = {}  # テーブル名 -> [物理カラム名]
table_logical_to_physical = {}  # テーブル名 -> {論理名: 物理名}

for sheet in xls.sheet_names:
    if sheet in skip_sheets:
        continue
    df = pd.read_excel(table_file, sheet_name=sheet, header=None)

    logical_cols = []
    physical_cols = []
    l2p = {}

    # Data starts from row 5 (row 4 is header)
    for row_idx in range(5, df.shape[0]):
        logical_val = df.iloc[row_idx, 4] if df.shape[1] > 4 else None
        physical_val = df.iloc[row_idx, 13] if df.shape[1] > 13 else None

        if pd.notna(logical_val):
            ln = str(logical_val).strip()
            if ln and ln not in ['論理名', 'nan']:
                logical_cols.append(ln)
                if pd.notna(physical_val):
                    pn = str(physical_val).strip()
                    physical_cols.append(pn)
                    l2p[ln] = pn

    table_logical_columns[sheet] = logical_cols
    table_physical_columns[sheet] = physical_cols
    table_logical_to_physical[sheet] = l2p

print("=== テーブル定義書マッピング ===\n")
for sheet in xls.sheet_names:
    if sheet in skip_sheets:
        continue
    print(f"■ {sheet}")
    if sheet in table_logical_columns:
        for ln in table_logical_columns[sheet]:
            pn = table_logical_to_physical[sheet].get(ln, '?')
            print(f"  {ln} → {pn}")
    print()

# ============================================================
# Step 2: Extract テーブル名.カラム名 patterns from 参照仕様
# ============================================================
df_ref = pd.read_excel(design_file, sheet_name='参照仕様', header=None)

raw_cells = []
for i in range(df_ref.shape[0]):
    for j in range(df_ref.shape[1]):
        val = df_ref.iloc[i, j]
        if pd.notna(val):
            s = str(val)
            if '.' in s or '．' in s:
                raw_cells.append((i, j, s))

# Parse テーブル名.カラム名
extracted_refs = set()
for row, col, text in raw_cells:
    text = text.strip()
    # Skip section headers like "1.《..."  and "No."
    if re.match(r'^\d+\.《', text) or text.strip() == 'No.':
        continue

    # Clean: remove leading "and　"  or "→"
    text = re.sub(r'^and\s*', '', text)
    text = re.sub(r'^→', '', text)

    # Split on = or ≠ to get reference parts
    parts = re.split(r'[=≠]', text)
    for part in parts:
        part = part.strip()
        if not part:
            continue

        # Match テーブル名.カラム名 (with possible .サブ参照)
        # テーブル名: Japanese+alphanumeric, カラム名: Japanese+alphanumeric
        matches = re.findall(r'([\u3000-\u9FFFa-zA-Z0-9_]+)\.([\u3000-\u9FFFa-zA-Z0-9_]+)', part)
        for table, column in matches:
            # Skip if table is just a number
            if re.match(r'^\d+$', table):
                continue
            # Skip non-table references (conditions mixed in)
            # e.g., "得意先名がNot" - if column contains が/の/に/を particles, it's likely a sentence
            if re.search(r'[がのにをはでもへと]$', column) or re.search(r'^[がのにをはでもへと]', column):
                continue
            # Skip if column looks like a sentence fragment
            if 'の場合' in column or 'Null' in column or 'null' in column or 'Not' in column:
                continue
            extracted_refs.add((table, column))

# Also handle chained refs like X.Y.Z → extract X.Y
chained_refs = set()
for row, col, text in raw_cells:
    text = text.strip()
    if re.match(r'^\d+\.《', text) or text.strip() == 'No.':
        continue
    text = re.sub(r'^and\s*', '', text)
    text = re.sub(r'^→', '', text)

    parts = re.split(r'[=≠]', text)
    for part in parts:
        part = part.strip()
        # Match X.Y.Z pattern (chained FK reference)
        chain_matches = re.findall(r'([\u3000-\u9FFFa-zA-Z0-9_]+)\.([\u3000-\u9FFFa-zA-Z0-9_]+)\.([\u3000-\u9FFFa-zA-Z0-9_]+)', part)
        for t, fk_col, target_col in chain_matches:
            if not re.match(r'^\d+$', t):
                chained_refs.add((t, fk_col, target_col))

print("\n=== 抽出された参照パターン ===\n")
sorted_refs = sorted(extracted_refs)
for i, (table, col) in enumerate(sorted_refs, 1):
    print(f"  {i:2d}. {table}.{col}")
print(f"\n合計: {len(sorted_refs)}件")

if chained_refs:
    print(f"\n=== チェーン参照 (X.Y.Z) ===")
    for t, fk, target in sorted(chained_refs):
        print(f"  {t}.{fk}.{target}")

# ============================================================
# Step 3: Cross-check
# ============================================================
available_tables = set(s for s in xls.sheet_names if s not in skip_sheets)

results = []
for table, column in sorted_refs:
    table_exists = table in available_tables

    if table_exists:
        logical_cols = table_logical_columns.get(table, [])
        if column in logical_cols:
            col_exists = 'あり'
            status = 'OK'
        else:
            col_exists = 'なし'
            # Show available columns for debugging
            status = f'警告: カラム「{column}」が存在しません'
    else:
        col_exists = '-'
        status = f'警告: テーブル「{table}」が存在しません'

    results.append({
        'パターン': f'{table}.{column}',
        'テーブル存在': 'あり' if table_exists else 'なし',
        'カラム存在': col_exists,
        'チェック結果': status
    })

# Also check chained refs
for t, fk_col, target_col in sorted(chained_refs):
    table_exists = t in available_tables
    if table_exists:
        logical_cols = table_logical_columns.get(t, [])
        if fk_col in logical_cols:
            fk_exists = 'あり'
            status = f'OK (→{target_col}はFK先のカラム)'
        else:
            fk_exists = 'なし'
            status = f'警告: FKカラム「{fk_col}」が存在しません'
    else:
        fk_exists = '-'
        status = f'警告: テーブル「{t}」が存在しません'

    results.append({
        'パターン': f'{t}.{fk_col}.{target_col}',
        'テーブル存在': 'あり' if table_exists else 'なし',
        'カラム存在': fk_exists,
        'チェック結果': status
    })

# ============================================================
# Step 4: Output results
# ============================================================
print("\n\n" + "="*100)
print("クロスチェック結果")
print("="*100)

# Missing tables
referenced_tables = set(t for t, c in extracted_refs) | set(t for t, f, c in chained_refs)
missing_tables = referenced_tables - available_tables
if missing_tables:
    print(f"\n■ テーブル定義書に存在しないテーブル: {sorted(missing_tables)}")

# Result table
print(f"\n| No | 抽出されたパターン | テーブル存在 | カラム存在 | チェック結果 |")
print(f"|----|--------------------|--------------|------------|--------------|")
for i, r in enumerate(results, 1):
    print(f"| {i} | {r['パターン']} | {r['テーブル存在']} | {r['カラム存在']} | {r['チェック結果']} |")

# Summary
ok_count = sum(1 for r in results if 'OK' in r['チェック結果'])
warn_count = len(results) - ok_count
missing_table_count = sum(1 for r in results if 'テーブル' in r['チェック結果'] and '警告' in r['チェック結果'])
missing_col_count = sum(1 for r in results if 'カラム' in r['チェック結果'] and '警告' in r['チェック結果'])

print(f"\n{'='*60}")
print(f"■ サマリー")
print(f"{'='*60}")
print(f"  チェック対象合計: {len(results)}件")
print(f"  OK: {ok_count}件")
print(f"  警告（テーブル不在）: {missing_table_count}件")
print(f"  警告（カラム不在）: {missing_col_count}件")

# Show what columns exist for tables with missing columns
print(f"\n{'='*60}")
print(f"■ カラム不在の詳細")
print(f"{'='*60}")
missing_col_details = [(r['パターン']) for r in results if 'カラム' in r['チェック結果'] and '警告' in r['チェック結果']]
for pattern in missing_col_details:
    table = pattern.split('.')[0]
    col = pattern.split('.')[1]
    if table in table_logical_columns:
        print(f"\n  {pattern}")
        print(f"    テーブル「{table}」の論理カラム一覧:")
        for lc in table_logical_columns[table]:
            print(f"      - {lc}")

print("\nDONE")
