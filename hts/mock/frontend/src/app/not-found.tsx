import Link from 'next/link';

/**
 * 404 Not Found ページ
 * App Router ではサーバーコンポーネントとして実装
 */
export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300">404</h1>
        <p className="mt-4 text-xl text-gray-600">ページが見つかりません</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 transition-colors"
        >
          ポータルに戻る
        </Link>
      </div>
    </main>
  );
}
