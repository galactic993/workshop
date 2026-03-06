# コーディングガイドライン

本ドキュメントは、プロジェクトの保守性を高めるためのコーディング規約を定義します。

## 目次

1. [ディレクトリ構造](#ディレクトリ構造)
2. [コンポーネント設計](#コンポーネント設計)
3. [カスタムフック](#カスタムフック)
4. [状態管理](#状態管理)
5. [API呼び出し](#api呼び出し)
6. [型定義](#型定義)
7. [命名規則](#命名規則)
8. [インポート規則](#インポート規則)

---

## ディレクトリ構造

```
frontend/src/
├── app/                    # ページコンポーネント（App Router）
│   └── {domain}/          # ドメイン別ディレクトリ
│       └── page.tsx       # ページエントリポイント
├── components/
│   ├── layout/            # レイアウト（Header, Sidebar等）
│   ├── ui/                # 汎用UIコンポーネント
│   ├── forms/             # フォーム関連コンポーネント
│   └── {domain}/          # ドメイン固有コンポーネント
│       └── dialogs/       # ダイアログコンポーネント
├── hooks/                 # カスタムフック
├── lib/                   # ユーティリティ・API関数
│   ├── {domain}/          # ドメイン別API（複数ファイルの場合）
│   │   ├── index.ts       # 集約エクスポート
│   │   ├── types.ts       # 型定義
│   │   └── {機能}.ts      # 機能別API関数
│   ├── api.ts             # Axiosインスタンス・エラーハンドリング
│   ├── apiHelpers.ts      # 汎用APIラッパー
│   └── types.ts           # 共通型定義
├── schemas/               # Zodスキーマ
└── stores/                # Zustandストア
```

### 配置ルール

| 種別 | 配置先 | 例 |
|------|--------|-----|
| 共通型（複数ドメインで使用） | `lib/types.ts` | `SortOrder`, `BaseCustomer` |
| ドメイン固有型 | `lib/{domain}/types.ts` | `QuotListItem`, `QuotDetail` |
| 汎用UIコンポーネント | `components/ui/` | `Modal`, `Pagination`, `ConfirmDialog` |
| ドメイン固有コンポーネント | `components/{domain}/` | `QuotTable`, `QuotSearchForm` |
| ダイアログコンポーネント | `components/{domain}/dialogs/` | `QuotDetailModal` |

---

## コンポーネント設計

### 基本構造

```tsx
'use client';

import { useState } from 'react';

interface ComponentNameProps {
  /** プロパティの説明 */
  propName: string;
  /** オプショナルプロパティの説明 */
  optionalProp?: number;
}

/**
 * コンポーネントの説明（1行）
 */
export default function ComponentName({
  propName,
  optionalProp = 10,
}: ComponentNameProps) {
  // 状態の定義
  const [state, setState] = useState(false);

  // 早期リターン
  if (!propName) {
    return null;
  }

  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Props定義ルール

1. **interfaceを使用**: Propsは`interface`で定義（`type`ではなく）
2. **JSDocコメント**: 各プロパティにJSDocコメントを付与
3. **デフォルト値**: 分割代入で設定
4. **命名**: `{ComponentName}Props`

```tsx
interface ModalProps {
  /** モーダルの表示/非表示 */
  isOpen: boolean;
  /** モーダルを閉じるハンドラ */
  onClose: () => void;
  /** モーダルタイトル */
  title: string;
  /** モーダルの最大幅（デフォルト: max-w-md） */
  maxWidth?: string;
}
```

### コンポーネント分割の指針

| 条件 | 分割方法 |
|------|---------|
| 100行を超える場合 | 子コンポーネントに分割 |
| 再利用可能なUI要素 | `components/ui/` に配置 |
| 同一ファイル内で使用する小規模コンポーネント | ファイル内で定義（exportしない） |

```tsx
// 同一ファイル内の小規模コンポーネント例
function SortableHeader({ field, label, onSort }: SortableHeaderProps) {
  return (
    <th onClick={() => onSort(field)}>
      {label}
    </th>
  );
}

// メインコンポーネント
export default function QuotTable() {
  return (
    <table>
      <thead>
        <SortableHeader field="quote_no" label="見積No" onSort={handleSort} />
      </thead>
    </table>
  );
}
```

---

## カスタムフック

### 命名規則

- `use` プレフィックスを付ける
- 機能を表す明確な名前

| パターン | 例 |
|---------|-----|
| ドメインロジック | `useQuotSearch`, `useQuotDialogs` |
| 汎用ロジック | `useDebounce`, `useAuthGuard` |
| 外部ライブラリラッパー | `useCustomerSuggest` |

### 構造パターン

```typescript
interface UseHookNameOptions {
  // オプション
}

interface UseHookNameReturn {
  // 戻り値
}

export function useHookName(options: UseHookNameOptions): UseHookNameReturn {
  // 実装
}
```

### ドメインフックの例

```typescript
interface UseQuotSearchOptions {
  user: { access_type: string | null } | null;
}

interface UseQuotSearchReturn {
  // フォーム関連
  form: ReturnType<typeof useForm<QuotSearchFormData>>;
  // 一覧データ
  quotes: QuotListItem[];
  totalCount: number;
  // ハンドラー
  onSubmit: (data: QuotSearchFormData) => void;
  handlePageChange: (page: number) => void;
}

export function useQuotSearch({ user }: UseQuotSearchOptions): UseQuotSearchReturn {
  // React Hook Formのセットアップ
  const form = useForm<QuotSearchFormData>({
    resolver: zodResolver(quotSearchSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: quotSearchDefaultValues,
  });

  // 状態
  const [quotes, setQuotes] = useState<QuotListItem[]>([]);

  // API呼び出し関数
  const fetchQuotes = useCallback(async (...) => {
    // 実装
  }, []);

  // ハンドラー
  const onSubmit = useCallback((data) => {
    // 実装
  }, []);

  return {
    form,
    quotes,
    onSubmit,
    // ...
  };
}
```

---

## 状態管理

### 使い分け

| 種別 | 用途 | 例 |
|------|------|-----|
| `useState` | ローカルUI状態 | モーダル開閉、入力値 |
| `useForm` | フォーム状態 | 検索フォーム、登録フォーム |
| Zustand | グローバル状態 | 認証状態、認証エラー |

### Zustandストアのパターン

```typescript
import { create } from 'zustand';

interface StoreState {
  // 状態
  data: DataType | null;
  loading: boolean;
  // アクション
  setData: (data: DataType | null) => void;
  fetchData: () => Promise<void>;
}

export const useStore = create<StoreState>((set) => ({
  data: null,
  loading: false,

  setData: (data) => set({ data }),

  fetchData: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/endpoint');
      set({ data: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },
}));
```

### フォーム状態

```typescript
const form = useForm<FormData>({
  resolver: zodResolver(formSchema),
  mode: 'onSubmit',           // 初回バリデーション: 送信時のみ
  reValidateMode: 'onSubmit', // 再バリデーション: 送信時のみ
  defaultValues: defaultValues,
});
```

### Formコンポーネント

Enterキーによる意図しないフォーム送信を防止するため、`Form`コンポーネントを使用:

```tsx
import Form from '@/components/ui/Form';

// 基本的な使い方
<Form onSubmit={handleSubmit(onSubmit)}>
  <input {...register('field')} />
  <button type="submit">送信</button>
</Form>

// Enterキー送信を許可する場合（検索フォームなど）
<Form onSubmit={handleSubmit(onSubmit)} allowEnterSubmit>
  <input {...register('query')} />
  <button type="submit">検索</button>
</Form>
```

**ルール**:
- フォームには必ず `Form` コンポーネントを使用
- `handleSubmit` と組み合わせて `onSubmit` モードのバリデーションを発動
- デフォルトで Enter キー送信は無効（`allowEnterSubmit={true}` で有効化）

---

## API呼び出し

### 基本パターン

`lib/apiHelpers.ts` の汎用ラッパーを使用:

```typescript
import { apiGet, apiPost, apiPut, apiDelete } from '../apiHelpers';

// GET
export const getData = async (params: Params): Promise<Response> => {
  return apiGet<Response>('/api/endpoint', params, defaultResponse);
};

// POST
export const createData = async (data: Request): Promise<Response> => {
  return apiPost<Response>('/api/endpoint', data);
};

// PUT
export const updateData = async (id: number, data: Request): Promise<Response> => {
  return apiPut<Response>(`/api/endpoint/${id}`, data);
};

// DELETE
export const deleteData = async (id: number): Promise<Response> => {
  return apiDelete<Response>('/api/endpoint', { id });
};
```

### デフォルトレスポンス

エラー時にUIが壊れないよう、デフォルトレスポンスを定義:

```typescript
const EMPTY_LIST_RESPONSE: Omit<ListResponse, 'success' | 'message'> = {
  items: [],
  total: 0,
  page: 1,
  per_page: 10,
  total_pages: 0,
};

export const getList = async (params: Params): Promise<ListResponse> => {
  return apiGet<ListResponse>('/api/items', params, EMPTY_LIST_RESPONSE);
};
```

### ドメイン別APIの構成

複数のAPI関数がある場合:

```
lib/quot/
├── index.ts      # 集約エクスポート
├── types.ts      # 型定義
├── list.ts       # 一覧・詳細API
├── customer.ts   # 得意先関連API
├── workflow.ts   # ワークフローAPI
└── issue.ts      # 発行API
```

`index.ts`:
```typescript
// 型定義
export * from './types';

// API関数
export { getQuots, getQuotDetail, createQuot, updateQuot } from './list';
export { suggestQuotCustomers, searchQuotCustomers } from './customer';
```

---

## 型定義

### 配置ルール

| 種別 | 配置先 |
|------|--------|
| 複数ドメインで共有 | `lib/types.ts` |
| 単一ドメイン専用 | `lib/{domain}/types.ts` |
| APIレスポンス型 | API関数と同じファイル、またはtypes.ts |
| フォームデータ型 | `schemas/{domain}Schema.ts` |

### 命名規則

| 種別 | パターン | 例 |
|------|---------|-----|
| APIレスポンス | `{Domain}{Action}Response` | `QuotListResponse`, `QuotDetailResponse` |
| リクエスト | `{Domain}{Action}Request` | `QuotCreateRequest`, `QuotUpdateRequest` |
| リストアイテム | `{Domain}ListItem` | `QuotListItem` |
| 詳細データ | `{Domain}Detail` | `QuotDetail` |

### 基底型の活用

```typescript
// lib/types.ts - 基底型
export interface BaseCustomer {
  customer_id: number;
  customer_cd: string;
  customer_name: string;
}

// lib/quot/types.ts - 拡張
export interface QuotCustomerSuggestion extends BaseCustomer {}
```

---

## 命名規則

### ファイル名

| 種別 | 規則 | 例 |
|------|------|-----|
| コンポーネント | PascalCase | `QuotTable.tsx`, `Modal.tsx` |
| フック | camelCase（use prefix） | `useQuotSearch.ts` |
| API/ユーティリティ | camelCase | `apiHelpers.ts`, `customer.ts` |
| スキーマ | camelCase（Schema suffix） | `quotSearchSchema.ts` |
| ストア | camelCase（Store suffix） | `authStore.ts` |

### 変数・関数名

| 種別 | 規則 | 例 |
|------|------|-----|
| コンポーネント | PascalCase | `QuotTable`, `ConfirmDialog` |
| フック | camelCase（use prefix） | `useQuotSearch` |
| イベントハンドラ | handle/on prefix | `handleSubmit`, `onPageChange` |
| API関数 | 動詞 + 名詞 | `getQuots`, `createQuot` |
| 定数 | UPPER_SNAKE_CASE | `PAGE_SIZE_OPTIONS` |
| 型/Interface | PascalCase | `QuotListItem`, `SortOrder` |

### ハンドラ命名の使い分け

| プレフィックス | 用途 |
|--------------|------|
| `handle` | 内部で定義するハンドラ |
| `on` | Propsとして受け取るコールバック |

```tsx
interface Props {
  onSubmit: (data: FormData) => void;  // Props
}

function Component({ onSubmit }: Props) {
  const handleClick = () => {  // 内部ハンドラ
    onSubmit(formData);
  };
}
```

---

## インポート規則

### インポート順序

ESLint の `import/order` ルールで自動的に整列されます（`npm run lint --fix`）。

1. React関連（builtin）
2. 外部ライブラリ（external）
3. 内部モジュール（`@/` パス）- アルファベット順
4. 相対パス（parent/sibling/index）

```typescript
// 1. React関連
import { useState, useCallback, useEffect } from 'react';

// 2. 外部ライブラリ
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// 3. 内部モジュール
import { SortOrder } from '@/lib/types';
import { getQuots, QuotListItem } from '@/lib/quot';
import { useAuthStore } from '@/stores/authStore';

// 4. 相対パス
import { quotSearchSchema } from '../../schemas/quotSearchSchema';
```

#### 内部モジュール（@/）の優先順位

ESLintのpathGroupsにより以下の順序で自動整列されます。

1. `@/components/**`
2. `@/hooks/**`
3. `@/lib/**`
4. `@/schemas/**`
5. `@/stores/**`

各グループ内ではアルファベット順に並びます。

### 型インポートの原則

- **共通型は`@/lib/types`から**: `SortOrder`, `BaseCustomer`
- **ドメイン型は`@/lib/{domain}`から**: `QuotListItem`, `QuotSortField`
- **型の再エクスポートは禁止**: 各ファイルから直接インポート

```typescript
// 推奨
import { SortOrder } from '@/lib/types';
import { QuotListItem, QuotSortField } from '@/lib/quot';

// 非推奨（再エクスポート経由）
import { SortOrder, QuotListItem } from '@/lib/quot';  // SortOrderは@/lib/typesから
```

---

## Zodスキーマ

### 構成パターン

```typescript
import { z } from 'zod';

// バリデーションメッセージ
export const FORM_ERROR_MESSAGES = {
  REQUIRED: '必須項目です',
  INVALID_FORMAT: '形式が正しくありません',
};

// スキーマ定義
export const formSchema = z.object({
  field1: z.string().min(1, FORM_ERROR_MESSAGES.REQUIRED),
  field2: z.number().nullable(),
});

// 型のエクスポート
export type FormData = z.infer<typeof formSchema>;

// デフォルト値
export const formDefaultValues: FormData = {
  field1: '',
  field2: null,
};
```

---

## テスト

### ファイル配置

テストファイルはテスト対象と同じディレクトリに配置:

```
components/ui/
├── Pagination.tsx
└── Pagination.test.tsx

hooks/
├── useDebounce.ts
└── useDebounce.test.ts
```

### 命名規則

- ファイル名: `{対象ファイル名}.test.ts(x)`
- describe: 対象の関数/コンポーネント名
- it/test: 期待される動作を日本語で記述

```typescript
describe('useDebounce', () => {
  it('指定した遅延時間後に値が更新される', () => {
    // テスト
  });
});
```

---

## 更新履歴

- 2026-01-28: import順序ルールにpathGroupsの詳細を追加
- 2026-01-28: 状態管理の例をトースト通知から認証エラーに変更（トースト機能削除に伴う修正）
