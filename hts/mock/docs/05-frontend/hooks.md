# カスタムフック

## 概要

アプリケーションで使用するカスタムフックの仕様を定義します。

---

## useDebounce

**ファイルパス**: `frontend/src/hooks/useDebounce.ts`

### 概要

デバウンス処理を行うカスタムフック。入力値の変更などを一定時間遅延させて処理する場合に使用します。

### インターフェース

```typescript
// コールバック関数のデバウンス
function useDebounce<T extends (...args: Parameters<T>) => void>(
  callback: T,
  delay: number
): T;

// 値のデバウンス
function useDebouncedValue<T>(value: T, delay: number): T;
```

### 使用例

```typescript
import { useDebounce, useDebouncedValue } from '@/hooks/useDebounce';

// コールバックのデバウンス
const debouncedSearch = useDebounce((query: string) => {
  searchAPI(query);
}, 300);

// 値のデバウンス
const debouncedValue = useDebouncedValue(inputValue, 300);
```

---

## useAuthGuard

**ファイルパス**: `frontend/src/hooks/useAuthGuard.ts`

### 概要

認証・権限チェックを共通化したカスタムフック。未認証または権限不足の場合、認証エラーストアにメッセージを設定してリダイレクトします。

### インターフェース

```typescript
interface UseAuthGuardOptions {
  permissionChecker: (accessType: string, permissions: string[]) => boolean;
  redirectTo?: string;  // デフォルト: '/'
}

interface UseAuthGuardResult {
  user: User | null;
  loading: boolean;
  refreshAuth: () => void;
}

function useAuthGuard(options: UseAuthGuardOptions): UseAuthGuardResult
```

### 使用例

```typescript
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { canAccessSales } from '@/lib/permissions';

export default function SalesPage() {
  const { user, loading } = useAuthGuard({
    permissionChecker: canAccessSales,
  });

  if (loading) return <Loading />;
  if (!user) return null;

  return <MainContent />;
}
```

### 動作

1. 初回レンダリング時に `refreshAuth()` で認証状態を確認
2. 認証状態確定後:
   - 未認証: 認証エラーストアに「ログインしてください」を設定 → リダイレクト
   - 権限なし: 認証エラーストアに「アクセス権限がありません」を設定 → リダイレクト
   - 認証・権限チェック成功: 前回のエラーをクリアし、`user` を返却
3. ログアウト操作時のメッセージ重複を `useRef` で防止
4. ポータル画面（`/`）でエラーメッセージを `ErrorMessageList` で表示

---

## useQuotSearch

**ファイルパス**: `frontend/src/hooks/useQuotSearch.ts`

### 概要

見積検索・一覧取得機能を統合管理するカスタムフック。React Hook Form による検索フォーム管理、ソート、ページネーション、部署コード取得を包括的に管理します。

### インターフェース

```typescript
interface UseQuotSearchOptions {
  user: { access_type: string | null; permissions?: string[] | null } | null;
}

interface UseQuotSearchReturn {
  // フォーム関連
  form: ReturnType<typeof useForm<QuotSearchFormData>>;
  // 一覧データ
  quotes: QuotListItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  listLoading: boolean;
  // 部署コード関連
  sectionCdOptions: SectionCdOption[];
  isSectionCdDisabled: boolean;
  sectionCdLoading: boolean;
  // ソート
  sortField: QuotSortField | null;
  sortOrder: SortOrder;
  // エラー
  errors: string[];
  // ハンドラー
  onSubmit: (data: QuotSearchFormData) => void;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
  handleSortToggle: (field: QuotSortField) => void;
  handleClear: () => void;
  refetch: () => void;
}

function useQuotSearch(options: UseQuotSearchOptions): UseQuotSearchReturn
```

### 使用例

```typescript
import { useQuotSearch } from '@/hooks/useQuotSearch';

const {
  form,
  quotes,
  totalCount,
  currentPage,
  totalPages,
  pageSize,
  listLoading,
  sectionCdOptions,
  isSectionCdDisabled,
  sortField,
  sortOrder,
  errors,
  onSubmit,
  handlePageChange,
  handlePageSizeChange,
  handleSortToggle,
  handleClear,
  refetch,
} = useQuotSearch({ user });

// 検索フォーム送信
<form onSubmit={form.handleSubmit(onSubmit)}>
  <input {...form.register('quote_no')} />
  {form.formState.errors.quote_no && (
    <span>{form.formState.errors.quote_no.message}</span>
  )}
</form>

// ソート切り替え
<th onClick={() => handleSortToggle('quote_no')}>見積番号</th>

// ページ変更
<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
```

### エラーハンドリング

| HTTPステータス | 処理内容 |
|---------------|---------|
| 401/403 | api.ts のインターセプターで処理 → ポータルにリダイレクト |
| 422 | サーバーバリデーションエラーを各フォームフィールドに表示 |
| 500等 | `errors` 配列に汎用エラーメッセージを追加 |

サーバーからの422バリデーションエラーは、`SERVER_TO_FORM_FIELD_MAP` によりサーバーのフィールド名からフォームのフィールド名にマッピングされ、React Hook Form の `setError` を通じて各入力フィールドの下にエラーメッセージが表示されます。

---

## useQuotDialogs

**ファイルパス**: `frontend/src/hooks/useQuotDialogs.ts`

### 概要

見積一覧画面のダイアログ状態を管理するカスタムフック。詳細モーダル、承認ダイアログ、画面遷移確認ダイアログなどの状態と操作を一元管理します。

### インターフェース

```typescript
interface UseQuotDialogsOptions {
  /** 一覧を再取得する関数 */
  refetch: () => void;
  /** エラー発生時のコールバック（ErrorMessageList用） */
  onError?: (message: string) => void;
  /** エラーをクリアするコールバック */
  clearErrors?: () => void;
}

interface UseQuotDialogsReturn {
  detailModal: {
    isOpen: boolean;
    quoteId: number | null;
    data: QuotDetail | null;
    loading: boolean;
    open: (quoteId: number) => Promise<void>;
    close: () => void;
  };
  approveDialog: { /* 承認ダイアログ */ };
  cancelApproveDialog: { /* 承認取消ダイアログ */ };
  navigateDialog: { /* 画面遷移確認ダイアログ */ };
  updateDialog: { /* 見積更新ダイアログ */ };
  receiveDialog: { /* 制作見積受取ダイアログ */ };
}

function useQuotDialogs(options: UseQuotDialogsOptions): UseQuotDialogsReturn
```

### 使用例

```typescript
import { useQuotDialogs } from '@/hooks/useQuotDialogs';

const [dialogErrors, setDialogErrors] = useState<string[]>([]);

const setDialogError = useCallback((message: string) => {
  setDialogErrors([message]);
}, []);

const clearDialogErrors = useCallback(() => {
  setDialogErrors([]);
}, []);

const dialogs = useQuotDialogs({
  refetch,
  onError: setDialogError,
  clearErrors: clearDialogErrors,
});

// 詳細モーダルを開く
dialogs.detailModal.open(quoteId);

// 受取ダイアログを開く
dialogs.receiveDialog.open(quoteId);

// エラー表示
<ErrorMessageList messages={[...errors, ...dialogErrors]} />
```

### エラーハンドリング

詳細モーダルや受取処理でエラーが発生した場合、`onError`コールバックでエラーメッセージを通知します。連続操作時のスクロール動作を正しくするため、`clearErrors`で前回のエラーをクリアしてから新しいエラーを設定します。

---

---

## useSectionCustomerData

**ファイルパス**: `frontend/src/hooks/useSectionCustomerData.ts`

### 概要

部署別得意先メンテナンスのデータ取得・操作を統合管理するカスタムフック。TanStack Queryを使用してセンター一覧・部署別得意先一覧の取得とキャッシュ管理、追加・削除のミューテーション処理を行います。

### インターフェース

```typescript
interface UseSectionCustomerDataParams {
  isAuthenticated: boolean;
  centerId: string;
  currentPage: number;
  pageSize: number;
  sortOrder: SortOrder;
  onShowDialog: (type: 'success' | 'error', message: string) => void;
}

interface UseSectionCustomerDataReturn {
  centers: Center[];
  centersLoading: boolean;
  sectionCustomers: SectionCustomer[];
  listLoading: boolean;
  totalCount: number;
  totalPages: number;
  addCustomer: (customerId: number) => Promise<{ success: boolean }>;
  deleteCustomer: (customerId: number) => Promise<{ success: boolean }>;
  isAddLoading: boolean;
  isDeleteLoading: boolean;
}
```

### キャッシュ戦略

| データ種別 | キャッシュ時間 | 無効化タイミング |
|-----------|---------------|----------------|
| センター一覧 | 5分 | - |
| 部署別得意先一覧 | 30秒 | 追加・削除時 |

---

## 更新履歴

- 2025-12-10: useAuthGuardカスタムフック仕様を追加
- 2025-12-12: useDebounceフックを追加
- 2025-12-25: components.mdから分離、useCustomerSuggest・useQuotSearchを追加
- 2026-01-13: useCustomerSuggestを削除（CustomerSelectFieldコンポーネントに機能を統合）
- 2026-01-18: useAuthGuardをトースト通知から認証エラーストアに変更
- 2026-01-18: useQuotSearchのインターフェースを実装に合わせて更新、サーバーバリデーションエラー処理を追記
- 2026-01-19: useQuotDialogsフック仕様を追加（詳細モーダル・受取処理のエラーハンドリング）
- 2026-01-28: useSectionCustomerDataフック仕様を追加
- 2026-01-28: useSectionCustomerDataの`onToast`を`onShowDialog`に修正（通知をMessageDialogに統一）
