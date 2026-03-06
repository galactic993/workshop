import { test, expect } from '@playwright/test';

/**
 * ログインフローのE2Eテスト
 */
test.describe('ログイン', () => {
  test.beforeEach(async ({ page }) => {
    // トップページ（ログインページ）に移動
    await page.goto('/');
  });

  test('ログインフォームが表示される', async ({ page }) => {
    // ログインタイトルが表示されることを確認
    await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible();

    // 部署コード入力欄が表示されることを確認
    await expect(page.getByLabel('部署コード')).toBeVisible();

    // 社員コード入力欄が表示されることを確認
    await expect(page.getByLabel('社員コード')).toBeVisible();

    // ログインボタンが表示されることを確認
    await expect(page.getByRole('button', { name: 'ログイン' })).toBeVisible();
  });

  test('空の入力でバリデーションエラーが表示される', async ({ page }) => {
    // ログインボタンをクリック
    await page.getByRole('button', { name: 'ログイン' }).click();

    // バリデーションエラーが表示されることを確認
    await expect(page.getByText('部署コードを入力してください')).toBeVisible();
    await expect(page.getByText('社員コードを入力してください')).toBeVisible();
  });

  test('不正な入力でバリデーションエラーが表示される（桁数不足）', async ({ page }) => {
    // 3桁の部署コードを入力
    await page.getByLabel('部署コード').fill('123');
    // 3桁の社員コードを入力
    await page.getByLabel('社員コード').fill('456');

    // ログインボタンをクリック
    await page.getByRole('button', { name: 'ログイン' }).click();

    // バリデーションエラーが表示されることを確認
    await expect(page.getByText('部署コードは6桁で入力してください')).toBeVisible();
    await expect(page.getByText('社員コードは6桁で入力してください')).toBeVisible();
  });

  test('正しい認証情報でログインできる', async ({ page }) => {
    // テストユーザーの認証情報を入力
    await page.getByLabel('部署コード').fill('000000');
    await page.getByLabel('社員コード').fill('000001');

    // ログインボタンをクリック
    await page.getByRole('button', { name: 'ログイン' }).click();

    // ログイン成功後、サイドバーが表示されることを確認
    // ※ ログイン成功すると認証済み画面（サイドバー付き）に遷移
    await expect(page.getByRole('navigation')).toBeVisible({ timeout: 10000 });

    // ユーザー情報が表示されることを確認
    await expect(page.getByText('管理太郎')).toBeVisible();
  });

  test('不正な認証情報でエラーが表示される', async ({ page }) => {
    // 存在しないユーザーの認証情報を入力
    await page.getByLabel('部署コード').fill('999999');
    await page.getByLabel('社員コード').fill('999999');

    // ログインボタンをクリック
    await page.getByRole('button', { name: 'ログイン' }).click();

    // エラーメッセージが表示されることを確認
    await expect(
      page.getByText('部署コードまたは社員コードが正しくありません')
    ).toBeVisible({ timeout: 10000 });
  });

  test('ログイン後にログアウトできる', async ({ page }) => {
    // ログイン
    await page.getByLabel('部署コード').fill('000000');
    await page.getByLabel('社員コード').fill('000001');
    await page.getByRole('button', { name: 'ログイン' }).click();

    // ログイン成功を待つ
    await expect(page.getByRole('navigation')).toBeVisible({ timeout: 10000 });

    // ログアウトボタンをクリック
    await page.getByRole('button', { name: 'ログアウト' }).click();

    // ログインフォームに戻ることを確認
    await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible({
      timeout: 10000,
    });
  });
});
