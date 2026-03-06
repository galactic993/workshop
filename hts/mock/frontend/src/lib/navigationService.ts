/**
 * Next.js App Router インスタンスを保持するサービス
 * React コンポーネント外（api.ts など）からルーターを使用するため
 */

/** ルーターインターフェース（必要なメソッドのみ定義） */
interface RouterInstance {
  replace: (href: string) => void;
  push: (href: string) => void;
}

let routerInstance: RouterInstance | null = null;

/**
 * ルーターインスタンスを登録
 * RouterInitializer コンポーネントから呼び出される
 */
export const setRouter = (router: RouterInstance): void => {
  routerInstance = router;
};

/**
 * 指定されたパスにクライアントサイドで遷移
 * ルーターが未初期化の場合はフォールバックとして window.location.href を使用
 */
export const navigateTo = (path: string): void => {
  if (routerInstance) {
    routerInstance.replace(path);
  } else if (typeof window !== 'undefined') {
    // フォールバック: ルーター未初期化時
    console.warn(
      '[navigationService] Router not initialized, falling back to window.location.href'
    );
    window.location.href = path;
  }
};
