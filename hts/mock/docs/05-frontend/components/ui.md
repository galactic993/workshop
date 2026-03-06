# UIコンポーネント

## 概要

アプリケーション全体で使用する汎用UIコンポーネントの仕様を定義します。

---

## ErrorBoundary（エラーバウンダリ）

**ファイルパス**: `frontend/src/components/ui/ErrorBoundary.tsx`

### 概要

子コンポーネントで発生したエラーをキャッチし、フォールバックUIを表示するエラーバウンダリコンポーネント。React のクラスコンポーネントとして実装されています。

### インターフェース

```typescript
interface ErrorBoundaryProps {
  children: ReactNode;                    // 子コンポーネント
  fallback?: ReactNode;                   // カスタムフォールバックUI
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;  // エラー発生時のコールバック
  canRetry?: boolean;                     // リトライ可能かどうか（デフォルト: true）
}
```

### 使用例

**基本的な使用例**

```tsx
import ErrorBoundary from '@/components/ui/ErrorBoundary';

<ErrorBoundary>
  <ComponentThatMightThrow />
</ErrorBoundary>
```

**カスタムフォールバックUIを使用**

```tsx
<ErrorBoundary
  fallback={<div>エラーが発生しました。ページを再読み込みしてください。</div>}
>
  <ComponentThatMightThrow />
</ErrorBoundary>
```

**エラーコールバックを使用（エラーログ送信など）**

```tsx
<ErrorBoundary
  onError={(error, errorInfo) => {
    // 外部サービスにエラーを送信
    logErrorToService(error, errorInfo);
  }}
>
  <ComponentThatMightThrow />
</ErrorBoundary>
```

### 動作

1. 子コンポーネントでエラーが発生すると `getDerivedStateFromError` でエラー状態を設定
2. `componentDidCatch` でエラーをログに記録し、`onError` コールバックを実行
3. エラー状態の場合、フォールバックUIを表示
4. 「再試行」ボタンでエラー状態をリセットし、子コンポーネントを再レンダリング

### Next.js App Router との連携

Next.js App Router では、ルートセグメントごとに `error.tsx` ファイルを配置することで、ページ単位のエラーハンドリングが可能です。

**グローバルエラーページ**: `frontend/src/app/error.tsx`
**売上管理エラーページ**: `frontend/src/app/sales/error.tsx`

```tsx
// error.tsx の基本構造
'use client';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div>
      <h1>エラーが発生しました</h1>
      <button onClick={reset}>再試行</button>
    </div>
  );
}
```

---

## ConfirmDialog（確認ダイアログ）

**ファイルパス**: `frontend/src/components/ui/ConfirmDialog.tsx`

### 概要

操作確認用のモーダルダイアログ。承認・削除など重要な操作の前にユーザーに確認を求める場合に使用します。

### インターフェース

```typescript
interface ConfirmDialogProps {
  isOpen: boolean;                    // ダイアログの表示/非表示
  title: string;                      // ダイアログタイトル
  message: string;                    // ダイアログ本文
  confirmLabel?: string;              // 確認ボタンのラベル（デフォルト: "確認"）
  cancelLabel?: string;               // キャンセルボタンのラベル（デフォルト: "キャンセル"）
  confirmVariant?: 'primary' | 'danger';  // 確認ボタンのスタイル（デフォルト: 'primary'）
  onConfirm: () => void;              // 確認ボタンクリック時のハンドラ
  onCancel: () => void;               // キャンセルボタンクリック時のハンドラ
  loading?: boolean;                  // 処理中かどうか（デフォルト: false）
  zIndexClass?: string;               // z-indexクラス（デフォルト: "z-50"）
}
```

### ボタンスタイル

| variant | 背景色 | ホバー時 | 用途 |
|---------|--------|----------|------|
| `primary` | 青（`bg-blue-600`） | `bg-blue-700` | 通常の確認操作（承認など） |
| `danger` | 赤（`bg-red-600`） | `bg-red-700` | 危険な操作（削除、取消など） |

### 使用例

**基本的な使用例**

```tsx
import ConfirmDialog from '@/components/ui/ConfirmDialog';

<ConfirmDialog
  isOpen={dialogOpen}
  title="確認"
  message="この操作を実行しますか？"
  onConfirm={handleConfirm}
  onCancel={() => setDialogOpen(false)}
/>
```

**承認操作の例**

```tsx
<ConfirmDialog
  isOpen={approveDialogOpen}
  title="見積"
  message="選択した見積を承認します。よろしいですか？"
  confirmLabel="承認"
  cancelLabel="キャンセル"
  onConfirm={handleApproveConfirm}
  onCancel={() => setApproveDialogOpen(false)}
  loading={approveLoading}
/>
```

**削除操作の例**

```tsx
<ConfirmDialog
  isOpen={deleteDialogOpen}
  title="削除確認"
  message="このデータを削除します。この操作は取り消せません。"
  confirmLabel="削除"
  cancelLabel="キャンセル"
  confirmVariant="danger"
  onConfirm={handleDelete}
  onCancel={() => setDeleteDialogOpen(false)}
  loading={deleteLoading}
/>
```

**モーダル上での表示例（z-index調整）**

別のモーダルの上に確認ダイアログを表示する場合、`zIndexClass`を使用してz-indexを調整します。

```tsx
{/* 親モーダル（z-50） */}
<div className="fixed inset-0 z-50">
  {/* モーダルコンテンツ */}
</div>

{/* 確認ダイアログ（z-[60]で親モーダルより前面に表示） */}
<ConfirmDialog
  isOpen={confirmDialogOpen}
  title="確認"
  message="この操作を実行しますか？"
  onConfirm={handleConfirm}
  onCancel={() => setConfirmDialogOpen(false)}
  zIndexClass="z-[60]"
/>
```

### 動作

1. `isOpen` が `true` の場合、オーバーレイとダイアログを表示
2. オーバーレイをクリックすると `onCancel` を実行
3. キャンセルボタンをクリックすると `onCancel` を実行
4. 確認ボタンをクリックすると `onConfirm` を実行
5. `loading` が `true` の場合、両ボタンを非活性にし、確認ボタンに「処理中...」を表示
6. メッセージ内の改行（`\n`）は自動的に表示される（`whitespace-pre-line`）

### 改行を含むメッセージの例

```tsx
<ConfirmDialog
  isOpen={dialogOpen}
  title="確認"
  message={"操作を実行します。\nよろしいですか？"}
  onConfirm={handleConfirm}
  onCancel={() => setDialogOpen(false)}
/>
```

---

## ErrorMessageList（エラーメッセージリスト）

**ファイルパス**: `frontend/src/components/ui/ErrorMessageList.tsx`

### 概要

エラーメッセージを常時表示するコンポーネント。トーストとは異なり、画面遷移するまで表示され続けます。複数のエラーメッセージを1つのボックス内にリスト形式で表示します。

### インターフェース

```typescript
interface ErrorMessageListProps {
  messages: string[];     // エラーメッセージの配列
  className?: string;     // 追加のCSSクラス
  autoScroll?: boolean;   // メッセージ追加時に自動スクロールするか（デフォルト: true）
}
```

### スタイル

| 項目 | 値 |
|------|-----|
| **背景色** | 赤系（`bg-red-50`） |
| **ボーダー** | 赤（`border-red-300`） |
| **文字色** | 赤（`text-red-700`） |
| **見出し** | 「エラーが発生しました」 |
| **アイコン** | 警告アイコン（三角形） |

### 表示ルール

- `messages` が空配列の場合は何も表示しない
- エラーが1件でも複数件でも同じレイアウト（リスト形式）

### 自動スクロール機能

メッセージが変更されると、自動的にエラーメッセージリストの位置までスムーズスクロールします。これにより、画面下部で操作中にエラーが発生した場合でも、ユーザーがエラーメッセージを見逃すことを防ぎます。

- **デフォルト動作**: 有効（`autoScroll={true}`）
- **無効化**: `autoScroll={false}` を指定
- **スクロール条件**: メッセージの内容が変更されたとき（長さまたは内容の変化を検知）

### 使用例

**基本的な使用例**

```tsx
import ErrorMessageList from '@/components/ui/ErrorMessageList';

const [errors, setErrors] = useState<string[]>([]);

// API呼び出し時
if (!response.success) {
  setErrors(prev => [...prev, response.message || 'エラーが発生しました']);
}

// 表示
<ErrorMessageList messages={errors} />
```

**エラー1件の場合の表示**

```
┌─────────────────────────────────────────────────────────┐
│ ⚠ エラーが発生しました                                   │
│   ・一覧の取得に失敗しました                             │
└─────────────────────────────────────────────────────────┘
```

**エラー複数件の場合の表示**

```
┌─────────────────────────────────────────────────────────┐
│ ⚠ エラーが発生しました                                   │
│   ・一覧の取得に失敗しました                             │
│   ・部署コードの取得に失敗しました                       │
└─────────────────────────────────────────────────────────┘
```

**認証エラーとの組み合わせ（ポータル画面）**

```tsx
import ErrorMessageList from '@/components/ui/ErrorMessageList';
import { useAuthErrorStore } from '@/stores/authErrorStore';

const { errors: authErrors, clearErrors: clearAuthErrors } = useAuthErrorStore();
const [apiErrors, setApiErrors] = useState<string[]>([]);

// ログイン試行時に前回のエラーをクリア
const onSubmit = async (data: LoginFormData) => {
  clearAuthErrors();
  setApiErrors([]);
  // ...
};

// 認証エラー + APIエラーを統合して表示
<ErrorMessageList messages={[...authErrors, ...apiErrors]} />
```

**自動スクロールを無効化する例**

```tsx
// 自動スクロールが不要な場合
<ErrorMessageList messages={errors} autoScroll={false} />
```

### 認証・権限エラーの表示

認証エラー（未認証・権限なし）は `authErrorStore` と連携して表示されます。

| エラー種別 | メッセージ | 発生元 |
|-----------|-----------|--------|
| 未認証（401） | ログインしてください | api.ts インターセプター / useAuthGuard |
| 権限なし（403） | アクセス権限がありません | api.ts インターセプター / useAuthGuard |

---

## Form（フォーム）

**ファイルパス**: `frontend/src/components/ui/Form.tsx`

### 概要

Enterキーによるフォーム送信を制御するフォームコンポーネント。デフォルトでEnterキーによる送信を無効化し、意図しないフォーム送信を防止します。

### インターフェース

```typescript
interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  allowEnterSubmit?: boolean;  // Enterキーによるサブミットを許可するか（デフォルト: false）
}
```

### 動作

1. デフォルトではEnterキー押下時にフォーム送信を防止
2. `allowEnterSubmit={true}` を指定すると通常のフォーム動作
3. TEXTAREAとBUTTON要素ではEnterキーの動作を妨げない

### 使用例

**基本的な使用例**

```tsx
import Form from '@/components/ui/Form';

<Form onSubmit={handleSubmit}>
  <input type="text" />
  <button type="submit">送信</button>
</Form>
```

**Enterキー送信を許可する場合**

```tsx
<Form allowEnterSubmit onSubmit={handleSubmit}>
  <input type="text" />
  <button type="submit">送信</button>
</Form>
```

---

## Modal（モーダル）

**ファイルパス**: `frontend/src/components/ui/Modal.tsx`

### 概要

汎用モーダルコンポーネント。タイトル、コンテンツ、フッターを持つモーダルダイアログを表示します。

### インターフェース

```typescript
interface ModalProps {
  isOpen: boolean;               // モーダルの表示/非表示
  onClose: () => void;           // モーダルを閉じるハンドラ
  title: string;                 // モーダルタイトル
  children: ReactNode;           // モーダル本体のコンテンツ
  footer?: ReactNode;            // フッター部分のコンテンツ
  maxWidth?: string;             // モーダルの最大幅（デフォルト: "max-w-md"）
  zIndexClass?: string;          // z-indexクラス（デフォルト: "z-50"）
  closeOnOverlayClick?: boolean; // オーバーレイクリックで閉じるか（デフォルト: true）
}
```

### 動作

1. `isOpen` が `true` の場合、オーバーレイとモーダルを表示
2. ESCキー押下でモーダルを閉じる
3. オーバーレイクリックでモーダルを閉じる（`closeOnOverlayClick={false}` で無効化可能）
4. 閉じるボタン（×）をクリックでモーダルを閉じる
5. モーダル表示時にフォーカスを移動

### 使用例

**基本的な使用例**

```tsx
import Modal from '@/components/ui/Modal';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="モーダルタイトル"
>
  <p>モーダルの内容</p>
</Modal>
```

**フッター付きの例**

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="確認"
  footer={
    <>
      <button onClick={() => setIsOpen(false)}>キャンセル</button>
      <button onClick={handleConfirm}>確認</button>
    </>
  }
>
  <p>この操作を実行しますか？</p>
</Modal>
```

---

## FormDialog（フォーム付きダイアログ）

**ファイルパス**: `frontend/src/components/ui/FormDialog.tsx`

### 概要

フォーム入力を伴う確認ダイアログ。失注理由の入力や見積書格納先パスの入力など、追加情報の入力が必要な確認操作に使用します。

### インターフェース

```typescript
interface FormDialogProps {
  isOpen: boolean;               // ダイアログの表示/非表示
  title: string;                 // ダイアログタイトル
  description?: string;          // ダイアログ説明文
  children: ReactNode;           // フォームフィールド
  confirmLabel?: string;         // 確認ボタンのラベル（デフォルト: "確認"）
  cancelLabel?: string;          // キャンセルボタンのラベル（デフォルト: "キャンセル"）
  onConfirm: () => void;         // 確認ボタンクリック時のハンドラ
  onCancel: () => void;          // キャンセルボタンクリック時のハンドラ
  loading?: boolean;             // 処理中かどうか（デフォルト: false）
  zIndexClass?: string;          // z-indexクラス（デフォルト: "z-[60]"）
}
```

### 使用例

**失注登録ダイアログの例**

```tsx
import FormDialog from '@/components/ui/FormDialog';

<FormDialog
  isOpen={isOpen}
  title="失注登録"
  description="失注理由を入力してください。"
  confirmLabel="登録"
  cancelLabel="キャンセル"
  onConfirm={handleConfirm}
  onCancel={() => setIsOpen(false)}
  loading={loading}
>
  <div>
    <label>失注理由</label>
    <textarea
      value={lostReason}
      onChange={(e) => setLostReason(e.target.value)}
    />
  </div>
</FormDialog>
```

### ConfirmDialogとの使い分け

| コンポーネント | 用途 |
|---------------|------|
| ConfirmDialog | 単純な確認（メッセージのみ） |
| FormDialog | 追加入力が必要な確認 |

---

## Pagination（ページネーション）

**ファイルパス**: `frontend/src/components/ui/Pagination.tsx`

### 概要

一覧画面で使用するページネーションコンポーネント。前後ボタンと省略記号付きのページ番号を表示します。

### インターフェース

```typescript
interface PaginationProps {
  currentPage: number;      // 現在のページ番号
  totalPages: number;       // 総ページ数
  onPageChange: (page: number) => void;  // ページ変更時のコールバック
  maxVisiblePages?: number; // 表示するページ番号の最大数（デフォルト: 5）
}
```

### 表示ルール

- 総ページ数が1以下の場合は非表示
- 前後ボタン（`<` / `>`）は常に表示、端では非活性
- ページ番号は省略記号（`...`）で省略表示

### 使用例

```tsx
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={(page) => setCurrentPage(page)}
/>
```

---

## TruncateWithTooltip（テキスト省略・ツールチップ）

**ファイルパス**: `frontend/src/components/ui/TruncateWithTooltip.tsx`

### 概要

長いテキストを省略表示し、ホバー時にツールチップで全文を表示するコンポーネント。データベースから取得した長い値（顧客名、件名、ファイルパスなど）を表示する際に、レイアウト崩れを防止します。

### インターフェース

```typescript
interface TruncateWithTooltipProps {
  text: string | null | undefined;  // 表示するテキスト
  maxWidth?: string;                // 最大幅（Tailwindクラス）デフォルト: "max-w-48"
  className?: string;               // 追加のCSSクラス
}
```

### 動作

1. テキストが `null` または `undefined` の場合、`-` を表示
2. テキストが表示領域に収まる場合、そのまま表示（ツールチップなし）
3. テキストが省略される場合、ホバー時に白背景のツールチップで全文を表示

### ツールチップのスタイル

| 項目 | 値 |
|------|-----|
| **背景色** | 白（`bg-white`） |
| **文字色** | グレー（`text-gray-700`） |
| **ボーダー** | グレー（`border-gray-200`） |
| **角丸** | 小（`rounded`） |
| **影** | 中（`shadow-md`） |
| **表示位置** | 要素の下（`position: fixed`、`getBoundingClientRect()`で計算） |
| **z-index** | 9999 |
| **レンダリング** | React Portal（body要素に直接描画） |

### 推奨する `maxWidth` の設定

| 使用場所 | 推奨値 | 説明 |
|----------|--------|------|
| 狭いテーブル列 | `max-w-40` | 160px相当 |
| 標準テーブル列 | `max-w-48` | 192px相当（デフォルト） |
| 詳細表示・モーダル | `max-w-64` | 256px相当 |

### 使用例

**基本的な使用例**

```tsx
import TruncateWithTooltip from '@/components/ui/TruncateWithTooltip';

<TruncateWithTooltip text={customer.customer_name} />
```

**最大幅を指定**

```tsx
<TruncateWithTooltip
  text={quot.quot_subject}
  maxWidth="max-w-64"
/>
```

**追加スタイルを指定**

```tsx
<TruncateWithTooltip
  text={customer.customer_name}
  maxWidth="max-w-48"
  className="ml-2 text-gray-600"
/>
```

**テーブル内での使用例**

```tsx
<td className="px-3 py-3 text-sm text-gray-900">
  <TruncateWithTooltip text={row.customer_name} maxWidth="max-w-40" />
</td>
```

### 適用箇所

以下の画面で使用しています：

| 画面 | 適用フィールド |
|------|---------------|
| 見積一覧テーブル | 顧客名、件名、製品名 |
| 見積一覧モーダル | 顧客名、件名、製品名、参照書類パス、見積書パス、作業名 |
| 見積詳細画面 | 顧客名、件名、製品名、参照書類パス、見積書パス |
| 得意先選択ダイアログ | 顧客名 |
| 得意先別受注一覧 | 顧客名 |

### 注意事項

- フォーム入力フィールドには使用しない（入力欄はスクロールで対応）
- モバイル対応は不要（デスクトップブラウザ専用）
- React Portalでbody要素に直接描画するため、親要素の`overflow`設定の影響を受けない

---

## 更新履歴

- 2025-12-10: Toast（トースト通知）コンポーネントを追加
- 2025-12-12: Paginationコンポーネントを追加
- 2025-12-13: ErrorBoundaryコンポーネントを追加
- 2025-12-15: ConfirmDialogコンポーネントを追加
- 2025-12-16: ConfirmDialogにzIndexClassプロパティを追加
- 2025-12-25: components.mdから分離
- 2026-01-09: TruncateWithTooltipコンポーネントを追加
- 2026-01-12: Form、Modal、FormDialogコンポーネントを追加
- 2026-01-18: ErrorMessageListコンポーネントを追加、認証エラーストアとの連携方法を記載
- 2026-01-18: TruncateWithTooltipをReact Portal実装に変更（overflow問題を解消）
- 2026-01-18: ConfirmDialogでメッセージ内の改行（\n）をサポート
- 2026-01-19: ErrorMessageListに自動スクロール機能を追加（autoScrollプロップ）
- 2026-01-19: ErrorMessageListの自動スクロール判定をメッセージ内容の変化検知に改善
- 2026-01-28: トースト機能を削除、MessageDialogに統一（Toast.tsxを削除）
