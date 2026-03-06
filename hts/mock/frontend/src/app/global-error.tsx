'use client';

/**
 * グローバルエラーページ
 * ルートレイアウトのエラーをキャッチする
 * 独自の<html>と<body>タグが必要
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-300">
        <div className="mx-auto max-w-[1366px] bg-white shadow-sm min-h-screen">
          <main className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-300">500</h1>
              <p className="mt-4 text-xl text-gray-600">エラーが発生しました</p>
              <button
                onClick={() => reset()}
                className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 transition-colors"
              >
                再試行
              </button>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
