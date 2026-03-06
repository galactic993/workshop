# 認証機能仕様書

## 概要

管理会計システムの認証機能は、部署コードと社員コードの組み合わせによるパスワードレス認証を採用します。

**認証ライブラリ**: Laravel Sanctum（SPA認証モード）

**選定理由**:
- セッションベースの認証でシンプル
- CSRF保護が組み込み
- Redisセッションストレージによる水平スケーリング対応
- Next.js との連携実績が豊富

---

## 認証方式

### ログイン方法

**認証情報**:
- 部署コード（6桁の半角数字）
- 社員コード（6桁の半角数字）

**パスワード**: 使用しない

### 認証フロー

```
1. ユーザーがルートページ(/)にアクセス
2. 未認証の場合、ログインフォームを表示
3. ユーザーが部署コードと社員コードを入力
4. システムが employee_section_cd テーブルで該当する組み合わせを検索
5. 組み合わせが存在する場合、認証成功
6. セッションを作成し、ユーザー情報を保持
7. ルートページ(/)へリダイレクト
8. 認証済みの場合、ポータル画面（ダッシュボード）を表示
```

### 画面遷移

```
未認証: / → ログインフォーム表示
         ↓ ログイン成功
認証済: / → ポータル画面表示
```

---

## データベース参照

### 認証時の検証

```sql
SELECT
    esc.*,
    e.employee_name,
    e.email,
    e.access_type,
    s.section_name,
    s.expense_category
FROM employee_section_cd esc
INNER JOIN employees e ON esc.employee_id = e.employee_id
INNER JOIN section_cds s ON esc.section_cd_id = s.section_cd_id
WHERE esc.section_cd = :section_cd
  AND esc.employee_cd = :employee_cd
  AND e.deleted_flag = '0'
  AND s.deleted_flag = '0';
```

### 認証条件

1. **組み合わせの存在確認**
   - `employee_section_cd` テーブルに該当レコードが存在すること
   - `section_cd` と `employee_cd` の両方が一致すること

2. **社員の有効性確認**
   - 社員マスタの `deleted_flag` が '1' でないこと（有効な社員であること）

3. **部署コードの有効性確認**
   - 部署コードマスタの `deleted_flag` が '1' でないこと（有効な部署コードであること）
   - `SectionCd` モデルのグローバルスコープにより、無効な部署コードは自動的に除外される

---

## セッション管理

### 認証方式

**Laravel Sanctum（SPA認証モード）**を使用したセッションベース認証を採用します。

- Laravel Sanctum のセッション認証機能を使用
- Stateful ドメイン設定により CSRF 保護を有効化
- Redis によるセッションストレージ（複数サーバー対応）
- Cookie によるセッション管理（HttpOnly, Secure, SameSite=lax）

### ミドルウェアによる認証チェック

**EnsureSessionAuthenticated** ミドルウェア（`authenticated` エイリアス）を使用して、ルートグループレベルで統一的に認証チェックを行います。

**特徴:**
- ルートグループに適用することで、配下の全エンドポイントに認証チェックを自動適用
- コントローラーごとの認証チェック実装が不要
- 認証失敗時は統一されたエラーメッセージ「ログインしてください」を返却

**使用例（routes/api.php）:**
```php
Route::middleware('authenticated')->group(function () {
    // このグループ配下の全エンドポイントに認証チェックが適用される
    Route::get('/centers', ...);
    Route::post('/quotes', ...);
    // ...
});
```

**認証失敗時のレスポンス（401）:**
```json
{
  "success": false,
  "message": "ログインしてください"
}
```

### セッションに保存する情報

```php
session([
    'employee_section_cd_id' => $employeeSectionCd->employee_section_cd_id,
    'employee_id' => $employeeId,
    'employee_cd' => $employeeSectionCd->employee_cd,
    'section_cd' => $employeeSectionCd->section_cd,
    'employee_name' => $employeeSectionCd->employee->employee_name,
    'section_name' => $employeeSectionCd->sectionCd->section_name,
    'center_name' => $centerName,
    'team_name' => $teamName,
    'access_type' => $accessType,
    'roles' => $roles,
    'permissions' => $permissions,
    'visible_departments' => $visibleDepartments,
]);
```

**保存されるフィールド（12個）**:
1. `employee_section_cd_id` - 部署-社員コード関連ID（内部管理用）
2. `employee_id` - 社員ID
3. `employee_cd` - 社員コード
4. `section_cd` - 部署コード
5. `employee_name` - 社員名
6. `section_name` - 部署名
7. `center_name` - 所属センター名
8. `team_name` - 所属チーム名
9. `access_type` - アクセス区分
10. `roles` - 役割配列
11. `permissions` - 権限配列
12. `visible_departments` - 参照可能組織配列

**注意**: APIレスポンスには `employee_section_cd_id` は含まれません（内部管理用のため）

### セッション有効期限

- セッション有効期限: 48時間（2880分）
- ブラウザ終了時の破棄: なし（セッションは維持される）

---

## API仕様

### ログインエンドポイント

**エンドポイント**: `POST /api/login`

**リクエストボディ**:
```json
{
  "section_cd": "000000",
  "employee_cd": "000000"
}
```

**レスポンス (成功)**:
```json
{
  "success": true,
  "user": {
    "employee_id": 1,
    "employee_cd": "000000",
    "employee_name": "管理者",
    "section_cd": "000000",
    "section_name": "システム管理部",
    "center_name": "システム管理部",
    "team_name": null,
    "access_type": "00",
    "roles": ["システム管理者", "売上管理者"],
    "permissions": ["sales.orders.create", "sales.revenue.posting", ...],
    "visible_departments": [
      {"department_id": 1, "department_name": "第一センター"},
      {"department_id": 2, "department_name": "第二センター"}
    ]
  }
}
```

**注意**:
- `user` オブジェクトには11のフィールドが含まれます
- フロントエンドの `User` 型定義と一致しています
- `visible_departments` は参照可能組織の一覧（アクセス制御に使用）

**レスポンス (失敗)**:
```json
{
  "success": false,
  "message": "部署コードまたは社員コードが正しくありません"
}
```

### ログアウトエンドポイント

**エンドポイント**: `POST /api/logout`

**認証**: 不要（セッションベース認証のため、セッションがあればクリアされる）

**レスポンス**:
```json
{
  "success": true,
  "message": "ログアウトしました"
}
```

**注意**:
- このエンドポイントはミドルウェアで認証チェック対象外
- セッションベース認証を使用しているため、コントローラー内でセッションを直接クリアする

### 認証状態確認エンドポイント

**エンドポイント**: `GET /api/auth/check`

**レスポンス (認証済み)**:
```json
{
  "authenticated": true,
  "user": {
    "employee_id": 1,
    "employee_cd": "000000",
    "employee_name": "管理者",
    "section_cd": "000000",
    "section_name": "システム管理部",
    "center_name": "システム管理部",
    "team_name": null,
    "access_type": "00",
    "roles": ["システム管理者", "売上管理者"],
    "permissions": ["sales.orders.create", "sales.revenue.posting", ...],
    "visible_departments": [
      {"department_id": 1, "department_name": "第一センター"},
      {"department_id": 2, "department_name": "第二センター"}
    ]
  }
}
```

**レスポンス (未認証)**:
```json
{
  "authenticated": false
}
```

---

## フロントエンド仕様

### ルートページ (`/`)

**未認証時**: ログインフォームを表示

**認証済み時**: ポータル画面（ダッシュボード）を表示

### ログインフォーム

**画面構成**:

**タイトル**:
- テキスト: 「ログイン」
- スタイル: 中央揃え、太字、大サイズ（`text-3xl font-bold`）

**説明文**: なし

**レイアウト**:
- 画面中央配置（垂直・水平）
- 最大幅: 448px (`max-w-md`)
- 背景: グレー (`bg-gray-50`)
- 高さ: `min-h-[calc(100vh-120px)]`（ヘッダーとブレッドクラムの高さを除く）

**画面要素**:
1. タイトル - 「ログイン」
2. 部署コード入力フィールド
   - ラベル: 「部署コード」
   - 入力形式: 6桁数字、IME無効 (`inputMode="numeric"`)
   - プレースホルダー: なし
   - 最大入力文字数: 6桁
3. 社員コード入力フィールド
   - ラベル: 「社員コード」
   - 入力形式: 6桁数字、IME無効 (`inputMode="numeric"`)
   - プレースホルダー: なし
   - 最大入力文字数: 6桁
4. ログインボタン
   - テキスト: 「ログイン」（ローディング時: 「ログイン中...」）
   - スタイル: 青色背景 (`bg-blue-600`)、幅100%
5. エラーメッセージ表示エリア
   - 位置: 各入力フィールドの直下（個別エラー）、タイトルと部署コード入力フィールドの間（全体エラー）
   - スタイル: 赤文字 (`text-red-600`)、赤背景 (`bg-red-50`)（全体エラー）

**バリデーション**:
- 部署コード: 必須、半角数字、6桁固定
- 社員コード: 必須、半角数字、6桁固定

**バリデーション詳細**:

バリデーションのタイミング、エラー表示、エラーメッセージについては、[バリデーション共通仕様](../05-frontend/validation.md)を参照してください。

**実装されているバリデーション**:
- フォーカスアウト時（onBlur）の個別バリデーション
- フォーム送信時（onSubmit）の全体バリデーション
- 入力中のエラーメッセージクリア
- フィールドごとの個別エラー表示（赤枠線 + エラーメッセージ）

### ポータル画面（ダッシュボード）

**現在の実装**: 簡易版（Phase 1完了時点）

**表示内容**:
- 中央に「ログイン成功」というメッセージを表示
- ヘッダーにはユーザー情報とログアウトボタンを表示

**実装コード**:
```tsx
<main className="min-h-[calc(100vh-120px)] bg-gray-50 px-4 py-8">
  <div className="mx-auto max-w-7xl">
    <div className="rounded-lg bg-white p-6 shadow">
      <h1 className="text-2xl font-bold text-gray-900 text-center">
        ログイン成功
      </h1>
    </div>
  </div>
</main>
```

**将来実装予定** (Phase 2以降):
- ブレッドクラム（「ポータル」）
- ウェルカムメッセージ（ユーザー名、部署名表示）
- メインコンテンツ:
  - 各機能へのリンク（稟議書管理、予算管理、レポートなど）
  - お知らせ表示エリア
  - 最近の活動履歴

---

## フロントエンド認証状態管理

### Zustand Store 仕様

**ファイルパス**: `frontend/src/stores/authStore.ts`

**概要**: Zustandを使用して、アプリケーション全体で認証状態を管理します。Zustandは軽量で、React Contextと異なりProviderが不要です。

#### 提供する機能

**状態（State）**:
- `user: User | null` - ログイン中のユーザー情報（未認証時は `null`）
- `loading: boolean` - 認証状態確認中かどうか

**アクション（Actions）**:
- `setUser(user: User | null): void`
  - ユーザー情報を設定

- `setLoading(loading: boolean): void`
  - ローディング状態を設定

- `login(sectionCd: string, employeeCd: string): Promise<{ success: boolean; message?: string }>`
  - ログイン実行
  - 成功時: `{ success: true }` を返す
  - 失敗時: `{ success: false, message: エラーメッセージ }` を返す
  - バリデーションエラー（422）、認証エラー（401）を適切に処理

- `logout(): Promise<void>`
  - ログアウト実行
  - セッションをクリアし、ユーザー状態を `null` に設定
  - ページリロードは行わず、Reactの状態更新でログインフォームに遷移

- `refreshAuth(): Promise<void>`
  - 認証状態を再取得（`/api/auth/check` を呼び出し）

#### User型定義

```typescript
interface VisibleDepartment {
  department_id: number;
  department_name: string;
}

interface User {
  employee_id: number;
  employee_cd: string;
  employee_name: string;
  section_cd: string;
  section_name: string;
  center_name: string | null;
  team_name: string | null;
  access_type: string | null;
  roles: string[];
  permissions: string[];
  visible_departments: VisibleDepartment[];  // 参照可能組織
}
```

#### 使用方法

```typescript
'use client';

import { useAuthStore } from '@/stores/authStore';

export default function MyComponent() {
  const { user, loading, login, logout } = useAuthStore();

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (!user) {
    return <div>未認証</div>;
  }

  return (
    <div>
      <p>ようこそ、{user.employee_name}さん</p>
      <button onClick={logout}>ログアウト</button>
    </div>
  );
}
```

**注意**: ZustandはProviderが不要なため、`layout.tsx`でラップする必要はありません。

#### 認証フロー

**1. 初回レンダリング時**:
- コンポーネントが `refreshAuth()` を呼び出し（`useEffect`内）
- `/api/auth/check` にリクエスト送信
- 認証済みの場合: ユーザー情報を取得して state に保存
- 未認証の場合: `user` を `null` に設定

**2. ログイン時**:
1. `login(sectionCd, employeeCd)` を呼び出し
2. CSRF Cookie を取得（`/sanctum/csrf-cookie`）
3. `/api/login` にリクエスト送信
4. 成功時: ユーザー情報を保存
5. ルートページが認証状態に応じて表示を切り替える（ログインフォーム → ダッシュボード）

**3. ログアウト時**:
1. `logout()` を呼び出し
2. `/api/logout` にリクエスト送信
3. ユーザー情報をクリア（`user: null`, `loading: false`）
4. Reactが自動的に再レンダリングし、ログインフォームを表示
5. ページリロードは行わないため、スムーズに画面が切り替わる

#### エラーメッセージ定数

ログイン時の全体エラーメッセージは `frontend/src/schemas/loginSchema.ts` で定義されています:

```typescript
export const LOGIN_ERROR_MESSAGES = {
  GENERAL: 'ログインに失敗しました',
  RETRY: 'ログインに失敗しました。もう一度お試しください',
  INVALID_CREDENTIALS: '部署コードまたは社員コードが正しくありません',
} as const;
```

**注意**: すべてのエラーメッセージは末尾に句点（。）を含みません。バックエンドのエラーメッセージも同様です。

#### エラーハンドリング

認証APIのエラーハンドリングは `frontend/src/lib/auth.ts` で実装されています:

- **401エラー（認証失敗）**: 例外としてthrowせず、`{ success: false, message: ... }` を返す
- **422エラー（バリデーションエラー）**: 例外としてthrowせず、`{ success: false, message: ..., errors: ... }` を返す
- **その他のエラー**: 例外として再throw（ネットワークエラーなど）

これにより、認証失敗やバリデーションエラーは正常なフローの一部として扱われ、コンソールにエラーログが表示されません。

#### 認証エラーストア（authErrorStore）

認証・権限エラー時のメッセージをポータル画面で表示するためのZustandストアです。

**ファイルパス**: `frontend/src/stores/authErrorStore.ts`

**インターフェース**:

```typescript
type AuthErrorType = 'unauthenticated' | 'unauthorized';

interface AuthErrorState {
  errors: string[];
  addError: (type: AuthErrorType) => void;
  clearErrors: () => void;
}
```

**エラーメッセージ**:

| エラータイプ | メッセージ |
|-------------|-----------|
| `unauthenticated` | ログインしてください |
| `unauthorized` | アクセス権限がありません |

**使用フロー**:

1. **API呼び出し時（api.ts インターセプター）**
   - 401/403エラーを検出
   - `addError()` でエラーを設定
   - `navigateTo('/')` でクライアントサイド遷移（Navigation Service 使用）
   - ※ `window.location.href` ではなくルーターを使用することで、Zustandストアの状態が保持される

2. **ページ遷移時（useAuthGuard）**
   - 未認証または権限なしを検出
   - `addError()` でエラーを設定
   - ポータル画面（`/`）へリダイレクト
   - 認証・権限チェックの両方が成功した場合のみ `clearErrors()` で前回のエラーをクリア

3. **ポータル画面（page.tsx）**
   - `ErrorMessageList` でエラーを表示
   - ログイン試行時に `clearErrors()` でクリア

4. **ログアウト時（authStore.logout）**
   - `clearErrors()` でエラーをクリア

#### Navigation Service

React コンポーネント外（api.ts など）から Next.js ルーターを使用するためのサービスです。

**ファイルパス**: `frontend/src/lib/navigationService.ts`

**概要**:
- `window.location.href` を使用するとフルページリロードが発生し、Zustand ストアがリセットされる
- Navigation Service を使用することで、クライアントサイド遷移となりストアの状態が保持される

**インターフェース**:

```typescript
// ルーターインスタンスを登録（RouterInitializer から呼び出し）
setRouter(router: AppRouterInstance): void

// 指定パスへクライアントサイド遷移
navigateTo(path: string): void
```

**RouterInitializer コンポーネント**:

```typescript
// frontend/src/components/RouterInitializer.tsx
// layout.tsx に配置し、アプリ起動時にルーターを登録
```

---

## セキュリティ考慮事項

### ブルートフォース攻撃対策

1. **レート制限** ✅ 実装済
   - IPアドレス単位: 10回/分
   - アカウント単位（部署コード+社員コード+IP）: 5回/分
   - 制限超過時は429エラーを返却
   - 実装: `AppServiceProvider::configureRateLimiting()`

2. **ログ記録**
   - ※未実装（将来対応）

### セッション管理

1. **セッション固定攻撃対策**
   - ログイン成功時にセッションIDを再生成

2. **CSRF 対策**
   - 全ての POST リクエストに CSRF トークンを要求

3. **セッションハイジャック対策**
   - HTTPS 必須
   - セキュアクッキー使用
   - HttpOnly フラグ設定

---

## Next.js との連携

### CSRF保護の流れ

```
1. Next.js が /sanctum/csrf-cookie にリクエスト
2. Laravel が XSRF-TOKEN Cookie を設定
3. Next.js がログインリクエスト時に自動的に CSRF トークンを送信
4. Laravel が CSRF トークンを検証
```

### axios クライアント設定例

```typescript
import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: '', // リバースプロキシ経由のため相対パス
  withCredentials: true, // Cookie を送信
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// リクエストインターセプター: CSRFトークンを手動でヘッダーに設定
// axiosの自動CSRF処理ではタイミング問題があるため、手動で設定
api.interceptors.request.use((config) => {
  const token = Cookies.get('XSRF-TOKEN');
  if (token) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
  }
  return config;
});

// CSRF Cookie を取得
export const getCsrfCookie = async () => {
  await api.get('/sanctum/csrf-cookie');
};

// ログインAPI
export const login = async (sectionCd: string, employeeCd: string) => {
  await getCsrfCookie();
  return api.post('/api/login', {
    section_cd: sectionCd,
    employee_cd: employeeCd,
  });
};
```

**重要な変更点:**
- `js-cookie` パッケージを使用して XSRF-TOKEN Cookie を手動で読み取る
- リクエストインターセプターで各リクエストの前に自動的にCSRFトークンをヘッダーに設定
- axios の `xsrfCookieName` / `xsrfHeaderName` オプションはタイミング問題があるため使用しない

---

## Laravel Sanctum セットアップ

### パッケージインストール

```bash
docker compose exec backend composer require laravel/sanctum
docker compose exec backend php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
docker compose exec backend php artisan migrate
```

### 設定ファイル

**config/sanctum.php**:
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,localhost:3000,127.0.0.1,127.0.0.1:3000,::1')),
'middleware' => [
    'encrypt_cookies' => App\Http\Middleware\EncryptCookies::class,
    'verify_csrf_token' => App\Http\Middleware\VerifyCsrfToken::class,
],
```

**config/cors.php**:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'supports_credentials' => true,
```

**.env**:
```env
SESSION_DRIVER=redis
SESSION_LIFETIME=2880  # 48時間
SESSION_DOMAIN=null  # localhost環境ではnullに設定
SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1  # リバースプロキシ経由のためポート番号は不要
```

### ミドルウェア設定

**bootstrap/app.php** (Laravel 11):
```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->api(prepend: [
        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    ]);
})
```

---

## 実装チェックリスト

### バックエンド

- [x] Laravel Sanctum インストール
- [x] Sanctum 設定ファイル公開
- [x] CORS 設定
- [x] セッション設定（Redis）
- [x] ログインAPIエンドポイント実装
- [x] ログアウトAPIエンドポイント実装
- [x] 認証状態確認APIエンドポイント実装
- [x] CSRF Cookie エンドポイント実装（Sanctum自動提供）
- [x] カスタム認証ロジック実装（部署コード+社員コード）
- [x] レート制限実装（IP単位: 10回/分、アカウント単位: 5回/分）
- [ ] ログ記録実装
- [x] 認証ミドルウェア設定

### フロントエンド

- [x] Next.js axios クライアント設定（withCredentials: true）
- [x] CSRF トークン取得処理実装
- [x] ログイン画面実装（ルートページに統合）
- [x] バリデーション実装（Zod + React Hook Form、6桁数字、必須チェック）
- [x] 認証状態管理実装（Zustand）
- [x] ログアウト機能実装
- [x] 認証済みルートの保護実装（認証状態に応じた表示切り替え）

### テスト

- [ ] 正常系ログインテスト（シーダー必要）
- [x] 異常系ログインテスト（存在しない組み合わせ）
- [ ] 削除済み社員のログイン拒否テスト（シーダー必要）
- [ ] 無効な部署コードのログイン拒否テスト（シーダー必要）
- [x] 認証状態確認テスト
- [x] レート制限テスト（IP単位・アカウント単位）
- [ ] CSRF対策テスト

**テストファイル**: `backend/tests/Feature/AuthApiTest.php`

---

## 更新履歴

- 2025-12-08: 初版作成（パスワードレス認証仕様）
- 2025-12-08: バックエンド実装完了（Laravel 11対応、実装チェックリスト更新）
- 2025-12-08: フロントエンド実装完了（React Context、ログイン/ログアウト機能）
- 2025-12-08: CSRF設定を修正（SESSION_DOMAIN、axios設定）
- 2025-12-08: CSRF問題を解決（js-cookieを使用したリクエストインターセプター実装）
- 2025-12-08: ログアウトエンドポイントを修正（auth:sanctumミドルウェアを削除、セッションベース認証に対応）
- 2025-12-08: 認証機能の実装完了（ログイン、ログアウト、認証状態確認が正常動作）
- 2025-12-08: 認証状態管理をReact ContextからZustandへ移行、バリデーションをZod + React Hook Formへ移行
- 2025-12-08: ログインフォームのUI調整（エラーメッセージ位置、プレースホルダー削除、タイトル変更）
- 2025-12-08: エラーハンドリング改善（401/422エラーを正常レスポンスとして処理）、エラーメッセージから句点を削除
- 2025-12-08: ログインフォームの高さ調整（min-h-screenからmin-h-[calc(100vh-120px)]へ変更）
- 2025-12-08: ログアウト処理を改善（ページリロードを廃止し、React状態管理でスムーズに遷移）
- 2025-12-09: User型を拡張（center_name, team_name, access_type, permissionsを追加）
- 2025-12-09: 認証状態確認APIのレスポンスを更新
- 2025-12-09: User型にrolesを追加
- 2025-12-10: リバースプロキシ構成に対応（baseURL、SANCTUM_STATEFUL_DOMAINSを更新）
- 2025-12-10: User型にvisible_departments（参照可能組織）を追加、セッション保存情報を更新
- 2025-12-13: レート制限実装（IP単位10回/分、アカウント単位5回/分）、AuthApiTest追加
- 2026-01-16: 部署コードの有効性判定を追加（deleted_flagが'1'でないこと）
- 2026-01-18: 認証エラーストア（authErrorStore）を追加、ErrorMessageListへ変更
- 2026-01-18: Navigation Service を追加（api.ts のリダイレクトをクライアントサイド遷移に変更）
- 2026-01-18: ログアウト時に認証エラーをクリアする処理を追加
- 2026-01-28: 認証チェック統一（ミドルウェアレベルでの実装）、ミドルウェアセクション追加、認証エラーメッセージ統一説明を追加
