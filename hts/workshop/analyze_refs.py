import pandas as pd
import re

pd.set_option('display.max_rows', None)
pd.set_option('display.max_columns', None)
pd.set_option('display.width', None)
pd.set_option('display.max_colwidth', 500)

design_file = '/Users/izutanikazuki/kzp/fileMaker/training/sample/02-02_2_編-制作見積-制作見積書作成トップ_画面設計書_1007.xlsx'
table_file = '/Users/izutanikazuki/kzp/fileMaker/training/sample/編-テーブル定義書_1012.xlsx'

# 1. Read 参照仕様 sheet
df_ref = pd.read_excel(design_file, sheet_name='参照仕様', header=None)

# 2. Convert to text
all_text = ""
for i in range(df_ref.shape[0]):
    for j in range(df_ref.shape[1]):
        val = df_ref.iloc[i, j]
        if pd.notna(val):
            all_text += str(val) + "\n"

# 3. Extract English patterns
eng_patterns = re.findall(r'[a-zA-Z_][a-zA-Z0-9_]*\.[a-zA-Z_][a-zA-Z0-9_]*', all_text)
eng_unique = sorted(set(eng_patterns))

print("=== 英数字パターン (word.word) ===")
for p in eng_unique:
    print(f"  {p}")
print(f"合計: {len(eng_unique)}件")

# 4. Extract Japanese patterns (X.Y where X,Y contain Japanese chars)
jp_patterns = re.findall(r'[\u3000-\u9FFFa-zA-Z0-9_]+[\.．][\u3000-\u9FFFa-zA-Z0-9_]+', all_text)
jp_unique = sorted(set(jp_patterns))

print("\n=== 日本語パターン (テーブル名.カラム名) ===")
for p in jp_unique:
    print(f"  {p}")
print(f"合計: {len(jp_unique)}件")

# 5. Print cells containing dots
print("\n=== ドット含むセル一覧 ===")
for i in range(df_ref.shape[0]):
    for j in range(df_ref.shape[1]):
        val = df_ref.iloc[i, j]
        if pd.notna(val):
            s = str(val)
            if '.' in s or '．' in s:
                print(f"  [{i},{j}] {s}")

# 6. Read table definitions - get both logical and physical names
print("\n\n=== テーブル定義書 詳細 ===")
xls = pd.ExcelFile(table_file)
skip_sheets = ['表紙', '変更履歴', 'テーブル一覧']

table_info = {}
for sheet in xls.sheet_names:
    if sheet in skip_sheets:
        continue
    df = pd.read_excel(table_file, sheet_name=sheet, header=None)
    print(f"\n--- テーブル: {sheet} (shape: {df.shape}) ---")
    # Print first 5 rows to understand structure
    print("先頭5行:")
    print(df.head(5).to_string())
    print(f"\n全列ヘッダー候補 (行0-3):")
    for row_idx in range(min(4, df.shape[0])):
        vals = [str(df.iloc[row_idx, c]) if pd.notna(df.iloc[row_idx, c]) else '' for c in range(min(20, df.shape[1]))]
        print(f"  行{row_idx}: {vals}")

    # Get N column (index 13) values
    if df.shape[1] > 13:
        col_n = df.iloc[:, 13].dropna().tolist()
        print(f"\nN列(index13): {col_n}")

    # Also check for logical names - look at columns around N
    for col_idx in range(max(0, 10), min(20, df.shape[1])):
        col_vals = df.iloc[:, col_idx].dropna().tolist()
        col_vals_str = [str(v) for v in col_vals[:5]]
        print(f"  列{col_idx}(先頭5): {col_vals_str}")

print("\nDONE")
