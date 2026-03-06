# バリデーション仕様

## 概要

フロントエンドにおけるバリデーションの共通仕様を定義します。

---

## バリデーションタイミング

### 入力フォームのバリデーション

- **入力欄からフォーカスが外れた時（onBlur）**: 各フィールドの個別バリデーション
- **フォーム送信時（onSubmit）**: 全フィールドのバリデーション

### バリデーションの実行順序

1. フォーカスアウト時に該当フィールドをバリデーション
2. 入力中はエラーメッセージをクリア（リアルタイムフィードバック）
3. 送信時に全フィールドを再バリデーション

---

## エラー表示

### 表示位置

- 各入力フィールドの直下にエラーメッセージを表示
- フィールドごとに個別のエラー状態を管理

### 視覚的フィードバック

- **エラーがある場合**:
  - 入力フィールドの枠線を赤色に変更
  - エラーメッセージをフィールド下部に赤文字で表示

- **正常な場合**:
  - 入力フィールドの枠線は通常色（グレー）
  - フォーカス時は青色

### スタイル例

```typescript
// エラー時
className="border-red-300 focus:border-red-500 focus:ring-red-500"

// 正常時
className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
```

---

## エラーメッセージ仕様

### 基本原則

1. **簡潔で明確**: ユーザーが何をすべきか明確に伝える
2. **末尾の句点は不要**: 簡潔性を保つため句点は省略
3. **項目名の使用**:
   - 必須エラー: 項目名を含める（例: `部署コードを入力してください`）
   - 形式エラー: 項目名は不要（例: `半角数字で入力してください`）
   - 桁数エラー: 項目名は不要（例: `6桁で入力してください`）

### メッセージパターン

#### 必須チェック
```
[項目名]を入力してください
```
**例**: `部署コードを入力してください`

#### 形式チェック（数字）
```
半角数字で入力してください
```

#### 桁数チェック
```
[桁数]桁で入力してください
```
**例**: `6桁で入力してください`

#### 形式チェック（メール）
```
有効なメールアドレスを入力してください
```

#### 範囲チェック
```
[最小値]以上[最大値]以内で入力してください
```
**例**: `1以上100以内で入力してください`

---

## 実装例

### 定数定義

```typescript
/**
 * バリデーションエラーメッセージ
 */
const VALIDATION_MESSAGES = {
  SECTION_CD: {
    REQUIRED: '部署コードを入力してください',
    NUMERIC: '半角数字で入力してください',
    LENGTH: '6桁で入力してください',
  },
  EMPLOYEE_CD: {
    REQUIRED: '社員コードを入力してください',
    NUMERIC: '半角数字で入力してください',
    LENGTH: '6桁で入力してください',
  },
} as const;
```

### バリデーション関数

```typescript
const validateSectionCd = (value: string): string => {
  if (!value) {
    return VALIDATION_MESSAGES.SECTION_CD.REQUIRED;
  }
  if (!/^\d+$/.test(value)) {
    return VALIDATION_MESSAGES.SECTION_CD.NUMERIC;
  }
  if (value.length !== 6) {
    return VALIDATION_MESSAGES.SECTION_CD.LENGTH;
  }
  return '';
};
```

### フォーカスアウト処理

```typescript
const handleSectionCdBlur = () => {
  const errorMsg = validateSectionCd(sectionCd);
  setSectionCdError(errorMsg);
};
```

### 入力フィールド

```tsx
<input
  id="section-cd"
  type="text"
  value={sectionCd}
  onChange={(e) => {
    setSectionCd(e.target.value);
    setSectionCdError(''); // 入力中はエラーをクリア
  }}
  onBlur={handleSectionCdBlur}
  className={`${
    sectionCdError
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
  }`}
/>
{sectionCdError && (
  <p className="mt-1 text-sm text-red-600">{sectionCdError}</p>
)}
```

---

## Zod + React Hook Form によるバリデーション

現在の実装では、Zodによるスキーマバリデーションと React Hook Form を組み合わせて使用しています。

### メリット

- TypeScriptとの統合が強力（型推論による型安全性）
- スキーマの再利用性
- エラーメッセージの一元管理
- バリデーションロジックの宣言的な記述
- フォーム状態管理の自動化

### Zodスキーマ定義

```typescript
import { z } from 'zod';

const VALIDATION_MESSAGES = {
  SECTION_CD: {
    REQUIRED: '部署コードを入力してください',
    NUMERIC: '半角数字で入力してください',
    LENGTH: '6桁で入力してください',
  },
  EMPLOYEE_CD: {
    REQUIRED: '社員コードを入力してください',
    NUMERIC: '半角数字で入力してください',
    LENGTH: '6桁で入力してください',
  },
} as const;

export const loginSchema = z.object({
  section_cd: z
    .string()
    .min(1, VALIDATION_MESSAGES.SECTION_CD.REQUIRED)
    .regex(/^\d+$/, VALIDATION_MESSAGES.SECTION_CD.NUMERIC)
    .length(6, VALIDATION_MESSAGES.SECTION_CD.LENGTH),
  employee_cd: z
    .string()
    .min(1, VALIDATION_MESSAGES.EMPLOYEE_CD.REQUIRED)
    .regex(/^\d+$/, VALIDATION_MESSAGES.EMPLOYEE_CD.NUMERIC)
    .length(6, VALIDATION_MESSAGES.EMPLOYEE_CD.LENGTH),
});

// 型推論
export type LoginFormData = z.infer<typeof loginSchema>;
```

### React Hook Form での使用

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/schemas/loginSchema';

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur', // フォーカスアウト時にバリデーション
  });

  const onSubmit = async (data: LoginFormData) => {
    // バリデーション済みのデータを使用
    console.log(data.section_cd, data.employee_cd);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('section_cd')}
        className={errors.section_cd ? 'border-red-300' : 'border-gray-300'}
      />
      {errors.section_cd && (
        <p className="text-red-600">{errors.section_cd.message}</p>
      )}

      <button type="submit" disabled={isSubmitting}>
        ログイン
      </button>
    </form>
  );
}
```

---

## 全体エラーメッセージ

フォーム全体に関わるエラー（APIエラー、認証エラーなど）については、個別のフィールドエラーとは別に表示します。

### エラーメッセージ定数

```typescript
export const LOGIN_ERROR_MESSAGES = {
  GENERAL: 'ログインに失敗しました',
  RETRY: 'ログインに失敗しました。もう一度お試しください',
  INVALID_CREDENTIALS: '部署コードまたは社員コードが正しくありません',
} as const;
```

### 表示位置

- タイトルとフォームフィールドの間に表示
- 赤背景（`bg-red-50`）、赤文字（`text-red-800`）のボックス形式

### 使用例

```typescript
const [error, setError] = useState('');

const onSubmit = async (data: LoginFormData) => {
  setError(''); // エラーをクリア

  try {
    const result = await login(data.section_cd, data.employee_cd);
    if (!result.success) {
      setError(result.message || LOGIN_ERROR_MESSAGES.GENERAL);
    }
  } catch (err) {
    setError(LOGIN_ERROR_MESSAGES.RETRY);
  }
};

// JSX
{error && (
  <div className="rounded-md bg-red-50 p-4">
    <p className="text-sm font-medium text-red-800">{error}</p>
  </div>
)}
```

---

## サーバーサイドバリデーションエラー

バックエンドから返却される422バリデーションエラーを、フロントエンドのフォームフィールドに表示する方法を説明します。

### エラーレスポンス形式

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "section_cd": ["部署を選択してください"],
    "quote_no": ["11桁以内で入力してください", "半角数字で入力してください"],
    "quote_date_to": ["開始日 ≦ 終了日となるように入力してください"]
  }
}
```

### フィールド名マッピング

サーバーのフィールド名とフロントエンドのフォームフィールド名が異なる場合、マッピングを定義します:

```typescript
import { Path } from 'react-hook-form';

const SERVER_TO_FORM_FIELD_MAP: Record<string, Path<FormData> | null> = {
  section_cd: 'section_cd',
  quote_no: 'quote_no',
  customer_id: 'customer',  // サーバー: customer_id → フォーム: customer
  // フォームに対応するフィールドがない場合は null
  page: null,
  per_page: null,
};
```

### エラーセット関数

```typescript
const setServerValidationErrors = useCallback((
  serverErrors: Record<string, string[]>
) => {
  Object.entries(serverErrors).forEach(([serverField, messages]) => {
    const formField = SERVER_TO_FORM_FIELD_MAP[serverField];
    if (formField && messages.length > 0) {
      setError(formField, { message: messages[0] });
    }
  });
}, [setError]);
```

### API呼び出しでの使用

```typescript
import axios from 'axios';

try {
  const response = await apiCall(params);
  // 成功処理
} catch (err) {
  if (axios.isAxiosError(err) && err.response?.status === 422) {
    const serverErrors = err.response.data?.errors as Record<string, string[]> | undefined;
    if (serverErrors) {
      setServerValidationErrors(serverErrors);
    }
    return;
  }
  // その他のエラー処理
}
```

### 表示

サーバーからのバリデーションエラーは、フロントエンドのバリデーションエラーと同じ位置（各入力フィールドの直下）に同じスタイルで表示されます。React Hook Form の `setError` を使用することで、統一されたエラー表示が実現されます。

---

## カスタムバリデーション例

### 部署別得意先メンテナンス

得意先オブジェクトの必須バリデーション（Zodの`.refine()`を使用）:

```typescript
// frontend/src/schemas/sectionCustomerSchema.ts
const VALIDATION_MESSAGES = {
  CENTER: { REQUIRED: 'センターを選択してください' },
  CUSTOMER: { REQUIRED: '得意先を選択してください' },
} as const;

const customerObjectSchema = z.object({
  customer_id: z.number().int().positive(),
  customer_cd: z.string(),
  customer_name: z.string(),
});

export const sectionCustomerFormSchema = z.object({
  center_id: z.string().min(1, VALIDATION_MESSAGES.CENTER.REQUIRED),
  customer: customerObjectSchema
    .nullable()
    .refine((val) => val !== null, {
      message: VALIDATION_MESSAGES.CUSTOMER.REQUIRED,
    }),
});

// 入力型（フォーム初期値・操作用、customerがnullable）
export type SectionCustomerFormInput = z.input<typeof sectionCustomerFormSchema>;
// 出力型（バリデーション後、customerは非null）
export type SectionCustomerFormData = z.infer<typeof sectionCustomerFormSchema>;
```

### 手動バリデーション実行

react-hook-formの`trigger`を使用して、ボタンクリック時にバリデーションを実行:

```typescript
const { trigger, formState: { errors } } = useForm<SectionCustomerFormInput>({
  resolver: zodResolver(sectionCustomerFormSchema),
  mode: 'onSubmit',
  reValidateMode: 'onSubmit',
  defaultValues: {
    center_id: '',
    customer: null,
  },
});

// 追加ボタンクリック時
const handleAddClick = useCallback(async () => {
  const isValid = await trigger('customer');
  if (!isValid) {
    return; // エラーは入力欄の下に表示される
  }
  setAddDialogOpen(true);
}, [trigger]);
```

### 得意先選択ダイアログ検索フォーム

得意先コードの入力制限（半角数字のみ、5桁以内）:

```typescript
// frontend/src/schemas/sectionCustomerSchema.ts
const CUSTOMER_SELECT_MESSAGES = {
  CUSTOMER_CD: {
    NUMERIC: '半角数字で入力してください',
    LENGTH: '5桁以内で入力してください',
  },
} as const;

export const customerSelectSearchSchema = z.object({
  customer_cd: z
    .string()
    .regex(/^[0-9]*$/, CUSTOMER_SELECT_MESSAGES.CUSTOMER_CD.NUMERIC)
    .max(5, CUSTOMER_SELECT_MESSAGES.CUSTOMER_CD.LENGTH),
  customer_name: z.string(),
});
```

---

## 更新履歴

- 2025-12-08: 初版作成（バリデーション共通仕様）
- 2025-12-08: Zod + React Hook Form の実装を追加、全体エラーメッセージ仕様を追加
- 2025-12-10: カスタムバリデーション例（部署別得意先メンテナンス）を追加
- 2025-12-10: 得意先選択ダイアログ検索フォームのバリデーション例を追加
- 2026-01-13: 部署別得意先メンテナンスのバリデーション例をcustomerオブジェクト形式に更新
- 2026-01-18: サーバーサイドバリデーションエラー（422）の処理方法を追加
