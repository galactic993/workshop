# テスト方針

## 概要

このプロジェクトでは、フロントエンド（Vitest + React Testing Library）とバックエンド（PHPUnit）でユニットテスト・機能テストを実施します。

> **詳細なテストケース仕様**については [10-testing/README.md](../10-testing/README.md) を参照してください。
> 各テストケースのチェック内容を含む詳細仕様が記載されています。

## テスト実行コマンド

### フロントエンド

```bash
# 全テスト実行
docker-compose exec frontend npm test

# ウォッチモード（開発時）
docker-compose exec frontend npm run test:watch

# 特定ファイルのみ
docker-compose exec frontend npm test -- src/schemas/quotSearchSchema.test.ts
```

### バックエンド

```bash
# 全テスト実行
docker-compose exec backend php artisan test

# 特定テストクラスのみ
docker-compose exec backend php artisan test --filter=QuotApiTest

# 詳細出力
docker-compose exec backend php artisan test --verbose
```

## フロントエンドテスト

### テストフレームワーク

- **Vitest**: テストランナー
- **React Testing Library**: コンポーネントテスト
- **@testing-library/user-event**: ユーザーインタラクションのシミュレーション

### テストファイル構成

| ファイル | テスト数 | 説明 |
|---------|---------|------|
| `schemas/quotSearchSchema.test.ts` | 27 | 見積検索フォームのZodバリデーション |
| `schemas/sectionCustomerSchema.test.ts` | 13 | 部署別得意先フォームのバリデーション |
| `components/ui/Pagination.test.tsx` | 17 | ページネーションコンポーネント |
| `components/ui/ErrorBoundary.test.tsx` | 11 | エラー境界コンポーネント |
| `components/forms/CustomerSelectDialog.test.tsx` | 18 | 得意先選択ダイアログ |
| `lib/permissions.test.ts` | 14 | 権限判定ユーティリティ |
| `lib/utils.test.ts` | 7 | 共通ユーティリティ関数 |
| `hooks/useDebounce.test.ts` | 5 | デバウンスフック |

### テストパターン

#### Zodスキーマテスト

```typescript
import { describe, it, expect } from 'vitest';
import { quotSearchSchema, quotSearchDefaultValues } from './quotSearchSchema';

describe('quotSearchSchema', () => {
  it('正常な値でパースが成功する', () => {
    const result = quotSearchSchema.safeParse(quotSearchDefaultValues);
    expect(result.success).toBe(true);
  });

  it('無効な値でエラーになる', () => {
    const result = quotSearchSchema.safeParse({
      ...quotSearchDefaultValues,
      section_cd: 'abc', // 半角数字以外
    });
    expect(result.success).toBe(false);
  });
});
```

#### Zustandストアテスト

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './authStore';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth();
  });

  it('ユーザー情報を設定できる', () => {
    const { setUser } = useAuthStore.getState();
    const user = { id: 1, name: 'テストユーザー' };
    setUser(user);
    expect(useAuthStore.getState().user).toEqual(user);
  });
});
```

#### コンポーネントテスト

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from './Pagination';

describe('Pagination', () => {
  it('クリックで onPageChange が呼ばれる', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByRole('button', { name: '3' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});
```

## バックエンドテスト

### テストフレームワーク

- **PHPUnit**: テストフレームワーク
- **Laravel Testing Helpers**: HTTPテスト、データベーステスト

### テストファイル構成

| ファイル | テスト数 | 説明 |
|---------|---------|------|
| `Feature/AuthApiTest.php` | 9 | 認証API（ログイン、ログアウト、認証チェック） |
| `Feature/QuotApiTest.php` | 13 | 見積API（一覧、検索、権限チェック） |
| `Feature/SectionCustomerApiTest.php` | 27 | 部署別得意先API（CRUD、権限） |
| `Feature/CustomerSearchApiTest.php` | 16 | 得意先検索API（サジェスト、検索） |

### テストパターン

#### 認証テスト

```php
/**
 * 未認証ユーザーはアクセスできない
 */
public function test_unauthenticated_user_cannot_access(): void
{
    $response = $this->getJson('/api/quotes');

    $response->assertStatus(401)
        ->assertJson([
            'success' => false,
            'message' => 'ログインしてください',
        ]);
}
```

#### セッション認証テスト

```php
/**
 * 認証済みユーザーはアクセスできる
 */
public function test_authenticated_user_can_access(): void
{
    $response = $this->withSession([
        'employee_id' => 1,
        'access_type' => '00', // 全て（管理者）
        'permissions' => [],
    ])->getJson('/api/quotes');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'quotes',
            'total',
            'page',
        ]);
}
```

#### 権限テスト

```php
/**
 * 権限のないユーザーは403エラー
 */
public function test_user_without_permission_cannot_access(): void
{
    $response = $this->withSession([
        'employee_id' => 1,
        'access_type' => '40', // 一般
        'permissions' => [], // 権限なし
    ])->getJson('/api/quotes');

    $response->assertStatus(403)
        ->assertJson([
            'success' => false,
            'message' => 'アクセス権限がありません',
        ]);
}
```

#### バリデーションテスト

```php
/**
 * 必須パラメータがないとバリデーションエラー
 */
public function test_requires_center_id(): void
{
    $response = $this->withSession([
        'employee_id' => 1,
        'access_type' => '00',
        'permissions' => [],
    ])->getJson('/api/customers/section-customers');

    $response->assertStatus(422);
}
```

## テストカバレッジ

### テスト対象

1. **スキーマバリデーション**
   - 入力値の形式チェック（半角数字、桁数制限など）
   - 条件付きバリデーション（日付範囲、依存フィールド）
   - デフォルト値の適用

2. **ストア（状態管理）**
   - 状態の追加・削除・クリア
   - 自動処理（タイマーによる削除など）
   - エッジケース（空状態での操作）

3. **UIコンポーネント**
   - レンダリング（条件付き表示）
   - ユーザーインタラクション（クリック、入力）
   - コールバック呼び出し
   - アクセシビリティ（aria属性）

4. **API**
   - 認証チェック（401）
   - 権限チェック（403）
   - バリデーション（422）
   - 正常系レスポンス（200）
   - エラー系レスポンス（404, 409）

## CI/CD統合

GitHub Actionsでプルリクエスト時に自動実行：

```yaml
# .github/workflows/test.yml
- name: Run Frontend Tests
  run: docker-compose exec -T frontend npm test

- name: Run Backend Tests
  run: docker-compose exec -T backend php artisan test
```

## 更新履歴

- 2025-12-15: 初版作成（テスト追加に伴うドキュメント作成）
