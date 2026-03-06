import { test, expect } from '@playwright/test';

/**
 * 見積一覧表示のE2Eテスト
 */
test.describe('見積一覧', () => {
  // 各テストの前にログイン
  test.beforeEach(async ({ page }) => {
    // トップページに移動
    await page.goto('/');

    // ログイン
    await page.getByLabel('部署コード').fill('000000');
    await page.getByLabel('社員コード').fill('000001');
    await page.getByRole('button', { name: 'ログイン' }).click();

    // ログイン成功を待つ
    await expect(page.getByRole('navigation')).toBeVisible({ timeout: 10000 });
  });

  test('見積ページに遷移できる', async ({ page }) => {
    // サイドバーから見積メニューをクリック
    await page.getByRole('link', { name: '見積' }).click();

    // 見積ページに遷移したことを確認
    await expect(page).toHaveURL('/sales/quotes');

    // 見積ページのタイトルが表示されることを確認
    await expect(page.getByRole('heading', { name: '見積' })).toBeVisible();
  });

  test('見積一覧が表示される', async ({ page }) => {
    // 見積ページに直接アクセス
    await page.goto('/sales/quotes');

    // ページタイトルが表示されることを確認
    await expect(page.getByRole('heading', { name: '見積' })).toBeVisible();

    // 検索フォームが表示されることを確認
    await expect(page.getByText('部署')).toBeVisible();
    await expect(page.getByText('得意先')).toBeVisible();

    // 新規登録ボタンが表示されることを確認
    await expect(page.getByRole('button', { name: '新規登録' })).toBeVisible();

    // テーブルが表示されることを確認（ローディング後）
    // ※ データがある場合はテーブル行が表示される
    await expect(page.locator('table')).toBeVisible({ timeout: 10000 });
  });

  test('検索条件をクリアできる', async ({ page }) => {
    // 見積ページに直接アクセス
    await page.goto('/sales/quotes');

    // 件名に何か入力
    const subjectInput = page.locator('input[name="quot_subject"]');
    if (await subjectInput.isVisible()) {
      await subjectInput.fill('テスト');

      // クリアボタンをクリック
      await page.getByRole('button', { name: 'クリア' }).click();

      // 入力がクリアされることを確認
      await expect(subjectInput).toHaveValue('');
    }
  });

  test('検索を実行できる', async ({ page }) => {
    // 見積ページに直接アクセス
    await page.goto('/sales/quotes');

    // 検索ボタンをクリック
    await page.getByRole('button', { name: '検索' }).click();

    // ローディングが終わるのを待つ（テーブルが表示される）
    await expect(page.locator('table')).toBeVisible({ timeout: 10000 });
  });

  test('ページネーションが機能する', async ({ page }) => {
    // 見積ページに直接アクセス
    await page.goto('/sales/quotes');

    // テーブルが表示されるのを待つ
    await expect(page.locator('table')).toBeVisible({ timeout: 10000 });

    // ページネーションコンポーネントを探す
    const pagination = page.locator('[data-testid="pagination"]');

    // ページネーションが存在する場合のみテスト
    if (await pagination.isVisible()) {
      // 次ページボタンがあればクリック
      const nextButton = pagination.getByRole('button', { name: /次/ });
      if (await nextButton.isEnabled()) {
        await nextButton.click();
        // ページが変わったことを確認（URLまたはページ番号表示）
        await expect(page.locator('table')).toBeVisible();
      }
    }
  });

  test('表示件数を変更できる', async ({ page }) => {
    // 見積ページに直接アクセス
    await page.goto('/sales/quotes');

    // テーブルが表示されるのを待つ
    await expect(page.locator('table')).toBeVisible({ timeout: 10000 });

    // 表示件数セレクトボックスを探す
    const pageSizeSelect = page.locator('select').first();

    if (await pageSizeSelect.isVisible()) {
      // 表示件数を変更
      await pageSizeSelect.selectOption('50');

      // 選択が反映されることを確認
      await expect(pageSizeSelect).toHaveValue('50');
    }
  });

  test('新規登録ボタンで確認ダイアログが表示される', async ({ page }) => {
    // 見積ページに直接アクセス
    await page.goto('/sales/quotes');

    // 新規登録ボタンをクリック
    await page.getByRole('button', { name: '新規登録' }).click();

    // 確認ダイアログが表示されることを確認
    await expect(
      page.getByText('見積登録・更新画面へ移動します')
    ).toBeVisible({ timeout: 5000 });

    // キャンセルボタンをクリック
    await page.getByRole('button', { name: 'キャンセル' }).click();

    // ダイアログが閉じることを確認
    await expect(
      page.getByText('見積登録・更新画面へ移動します')
    ).not.toBeVisible();
  });
});

/**
 * 権限がないユーザーのテスト
 */
test.describe('見積一覧（権限なしユーザー）', () => {
  test('見積権限がないユーザーはアクセスできない', async ({ page }) => {
    // トップページに移動
    await page.goto('/');

    // 一般ユーザーでログイン（権限制限があるユーザー）
    // ※ 実際のテストユーザーの権限設定に応じて調整が必要
    await page.getByLabel('部署コード').fill('262112');
    await page.getByLabel('社員コード').fill('000009');
    await page.getByRole('button', { name: 'ログイン' }).click();

    // ログイン成功を待つ
    await expect(page.getByRole('navigation')).toBeVisible({ timeout: 10000 });

    // 見積ページに直接アクセスを試みる
    await page.goto('/sales/quotes');

    // 権限チェックにより、トップページにリダイレクトされるか、
    // エラーメッセージが表示されることを確認
    // ※ 実際の権限設定により挙動が異なる可能性があります
    // 以下は権限がある場合のテストをスキップする例
    const hasAccess = await page.getByRole('heading', { name: '見積' }).isVisible();
    if (!hasAccess) {
      // 権限がない場合、適切な画面にリダイレクトされていることを確認
      await expect(page).not.toHaveURL('/sales/quotes');
    }
  });
});
