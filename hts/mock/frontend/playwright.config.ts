import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright設定
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // テストディレクトリ
  testDir: './e2e',

  // テストファイルパターン
  testMatch: '**/*.spec.ts',

  // 並列実行を無効化（E2Eテストは順序依存の場合があるため）
  fullyParallel: false,

  // CIでのリトライ回数
  retries: process.env.CI ? 2 : 0,

  // 並列ワーカー数（CIでは1、ローカルでは1）
  workers: 1,

  // レポーター設定
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],

  // 共通設定
  use: {
    // ベースURL（環境変数またはデフォルト）
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',

    // スクリーンショット（失敗時のみ）
    screenshot: 'only-on-failure',

    // 動画（失敗時のみ）
    video: 'retain-on-failure',

    // トレース（失敗時のみ）
    trace: 'retain-on-failure',

    // タイムアウト設定
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  // グローバルタイムアウト
  timeout: 60000,

  // expect タイムアウト
  expect: {
    timeout: 10000,
  },

  // プロジェクト（ブラウザ）設定
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // 必要に応じて他のブラウザを追加
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // 出力ディレクトリ
  outputDir: 'test-results',

  // Webサーバー設定（開発サーバーが起動していない場合に自動起動）
  // ※ Docker環境では手動でサーバーを起動することを想定
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120000,
  // },
});
