# フォームコンポーネント

## 概要

フォーム入力に関連するコンポーネントの仕様を定義します。

---

## CustomerSelectDialog（得意先選択ダイアログ）

**ファイルパス**: `frontend/src/components/forms/CustomerSelectDialog.tsx`

### 概要

得意先を検索して選択するためのモーダルダイアログ。検索フォームと検索結果一覧を表示し、ラジオボタンで得意先を選択できます。タイトルやフィールドラベルをカスタマイズ可能なため、得意先以外のマスタ選択にも再利用できます。

### インターフェース

```typescript
interface CustomerOption {
  customer_id: number;
  customer_cd: string;
  customer_name: string;
}

interface CustomerSearchResponse {
  success: boolean;
  customers: CustomerOption[];
  message?: string;
}

interface FieldLabels {
  code: string;   // コード入力欄のラベル
  name: string;   // 名称入力欄のラベル
}

interface CustomerSelectDialogProps {
  isOpen: boolean;                        // ダイアログの開閉状態
  onClose: () => void;                    // ダイアログを閉じるコールバック
  onSelect: (customer: CustomerOption) => void;  // 得意先選択時のコールバック
  searchFn: (customerCd?: string, customerName?: string) => Promise<CustomerSearchResponse>;  // 検索関数
  onError?: (message: string) => void;    // エラー時のコールバック
  validationSchema?: z.ZodSchema;         // バリデーションスキーマ（任意）
  title?: string;                         // ダイアログのタイトル（デフォルト: "得意先選択"）
  fieldLabels?: Partial<FieldLabels>;     // フィールドラベル（デフォルト: { code: "得意先コード", name: "得意先名" }）
  codeMaxLength?: number;                 // コード入力欄の最大文字数（デフォルト: 5）
}
```

### スキーマ

```typescript
// 検索フォームのスキーマ
export const customerSelectSearchSchema = z.object({
  customer_cd: z.string()
    .regex(/^[0-9]*$/, '半角数字で入力してください')
    .max(5, '5桁以内で入力してください')
    .optional().or(z.literal('')),
  customer_name: z.string()
    .max(100, '100文字以内で入力してください')
    .optional().or(z.literal('')),
});
```

### 使用例

**基本的な使用例（得意先選択）**

```tsx
import CustomerSelectDialog from '@/components/forms/CustomerSelectDialog';

<CustomerSelectDialog
  isOpen={dialogOpen}
  onClose={() => setDialogOpen(false)}
  onSelect={(customer) => {
    setValue('customer_id', customer.customer_id);
    setValue('customer_query', `${customer.customer_cd} ${customer.customer_name}`);
  }}
  searchFn={searchCustomers}
  onError={(message) => setErrors([message])}
/>
```

**カスタマイズ例（ラベルやタイトルを変更）**

```tsx
<CustomerSelectDialog
  isOpen={dialogOpen}
  onClose={() => setDialogOpen(false)}
  onSelect={handleSelect}
  searchFn={searchProducts}
  title="商品選択"
  fieldLabels={{ code: "商品コード", name: "商品名" }}
  codeMaxLength={10}
/>
```

### 動作

1. ダイアログが開くと、検索フォームと検索結果エリアを表示
2. 検索条件を入力して検索ボタンをクリックすると、`searchFn` を呼び出し
3. 検索結果をラジオボタン形式で表示
4. 得意先を選択して「選択」ボタンをクリックすると、`onSelect` を呼び出し
5. キャンセルボタンまたはオーバーレイクリックで `onClose` を実行

### エラーハンドリング

| ケース | 動作 |
|--------|------|
| APIが `success: false` を返す | `onError(response.message)` を呼び出し |
| 例外発生（ネットワークエラー等） | `onError('得意先の取得に失敗しました。時間を空けて再度お試しください')` を呼び出し |

---

## CustomerSelectField（得意先選択フィールド）

**ファイルパス**: `frontend/src/components/forms/CustomerSelectField.tsx`

### 概要

得意先選択機能を統合したコンポーネント。サジェスト機能とダイアログ選択を一つのフィールドにまとめ、選択後はタグ形式で表示します。内部で`CustomerSelectDialog`を使用しています。

### インターフェース

```typescript
interface CustomerSuggestion {
  customer_id: number;
  customer_cd: string;
  customer_name: string;
}

interface CustomerSuggestResponse {
  success: boolean;
  customers: CustomerSuggestion[];
}

interface CustomerSelectFieldProps {
  value: SelectedCustomer | null;           // 選択された得意先
  onChange: (customer: SelectedCustomer | null) => void;  // 選択変更時のコールバック
  suggestFn: (query: string) => Promise<CustomerSuggestResponse>;  // サジェスト検索API
  searchFn: (customerCd?: string, customerName?: string) => Promise<CustomerSearchResponse>;  // ダイアログ検索API
  onError?: (message: string) => void;      // エラー表示用コールバック
  disabled?: boolean;                       // 無効化フラグ
  error?: string;                           // エラーメッセージ
  placeholder?: string;                     // プレースホルダー（デフォルト: 空文字）
  id?: string;                              // フィールドID
}
```

### 使用例

**基本的な使用例**

```tsx
import CustomerSelectField from '@/components/forms/CustomerSelectField';
import { suggestQuotCustomers, searchQuotCustomers } from '@/lib/quot';

const [selectedCustomer, setSelectedCustomer] = useState<SelectedCustomer | null>(null);

// エラーはErrorMessageListで表示する場合
<CustomerSelectField
  value={selectedCustomer}
  onChange={setSelectedCustomer}
  suggestFn={suggestQuotCustomers}
  searchFn={searchQuotCustomers}
  onError={addError}  // errorsステートに追加
  id="customer"
/>
```

**React Hook Formとの組み合わせ**

```tsx
// Controllerを使用する場合
import { Controller } from 'react-hook-form';

<Controller
  name="customer"
  control={control}
  render={({ field }) => (
    <CustomerSelectField
      value={field.value}
      onChange={field.onChange}
      suggestFn={suggestFn}
      searchFn={searchFn}
      onError={onError}
    />
  )}
/>
```

**バリデーションエラー表示付き**

```tsx
<Controller
  name="customer"
  control={control}
  render={({ field }) => (
    <CustomerSelectField
      value={field.value}
      onChange={field.onChange}
      suggestFn={suggestFn}
      searchFn={searchFn}
      onError={onError}
      error={errors.customer?.message}
    />
  )}
/>
{errors.customer && (
  <p className="mt-1 text-sm text-red-600">{errors.customer.message}</p>
)}
```

### 動作

1. **未選択時**: 入力フィールドと「得意先選択」ボタンを表示
2. **入力時**: 300msのデバウンス後にサジェスト検索を実行、候補をドロップダウン表示
3. **サジェストから選択**: クリックで得意先を選択、タグ表示に切り替え
4. **ダイアログから選択**: 「得意先選択」ボタンでダイアログを開き、検索・選択
5. **選択済み時**: タグ形式で得意先名を表示、×ボタンでクリア可能
6. **ダイアログはPortalを使用**: 親フォームの外部（document.body）にレンダリングされるため、ネストしたフォームの問題を回避

### キーボード操作

| キー | 動作 |
|------|------|
| ↓（ArrowDown） | 次の候補をハイライト（末尾の場合は先頭に戻る） |
| ↑（ArrowUp） | 前の候補をハイライト（先頭の場合は末尾に戻る） |
| Enter | ハイライト中の候補を選択 |
| Escape | サジェストリストを閉じる |

マウスホバーでもハイライトが移動します。

### エラーハンドリング

サジェスト検索とダイアログ検索の両方でエラーハンドリングを行います。

| ケース | 動作 |
|--------|------|
| サジェスト検索で例外発生 | `onError('得意先の取得に失敗しました。時間を空けて再度お試しください')` を呼び出し |
| ダイアログ検索でエラー | 内部の`CustomerSelectDialog`が`onError`を呼び出し |

**推奨パターン**: `ErrorMessageList`で画面上部にエラーを表示

```tsx
const [errors, setErrors] = useState<string[]>([]);

const addError = useCallback((message: string) => {
  setErrors(prev => [...prev, message]);
}, []);

// 画面上部
<ErrorMessageList messages={errors} />

// フィールド
<CustomerSelectField
  ...
  onError={addError}
/>
```

### 注意事項

- `CustomerSelectDialog`は内部で使用されるため、別途インポートする必要はありません
- サジェスト検索とダイアログ検索は異なるAPIエンドポイントを使用できます
- 選択後の表示は得意先名のみです（得意先コードは非表示）

---

## 更新履歴

- 2025-12-12: CustomerSelectDialogコンポーネントを追加
- 2025-12-13: バリデーションスキーマを統一（得意先コード: 半角数字のみ）
- 2025-12-13: title, fieldLabels, codeMaxLengthプロパティを追加（汎用化）
- 2025-12-25: components.mdから分離
- 2026-01-13: CustomerSelectFieldコンポーネントを追加
- 2026-01-13: CustomerSelectDialogにPortalを追加（ネストフォーム問題の解決）
- 2026-01-13: CustomerSelectFieldにキーボードナビゲーション機能を追加（矢印キー、Enter、Escape）
- 2026-01-13: CustomerSelectFieldにバリデーションエラー表示の使用例を追加
- 2026-01-18: CustomerSelectFieldのプレースホルダーのデフォルト値を空文字に変更
- 2026-01-19: CustomerSelectFieldのサジェスト検索にonErrorコールバック追加
- 2026-01-19: CustomerSelectDialogのエラーメッセージを変更
- 2026-01-19: エラーハンドリングセクションを追加（ErrorMessageListでの表示推奨）
