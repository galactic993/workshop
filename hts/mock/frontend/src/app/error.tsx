'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * グローバルエラーページ
 * App Router でキャッチされなかったエラーを表示
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // エラーをログに記録（本番環境では外部サービスに送信することも可能）
    console.error('Unhandled error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <div className="mb-4 text-6xl text-red-500">!</div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">エラーが発生しました</h1>
          <p className="mb-6 text-sm text-gray-600">
            予期せぬエラーが発生しました。問題が解決しない場合は、管理者にお問い合わせください。
          </p>
          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="mb-6 rounded-md bg-red-50 p-4 text-left">
              <p className="text-xs font-medium text-red-800">エラー詳細:</p>
              <p className="mt-1 text-xs text-red-600 break-all">{error.message}</p>
            </div>
          )}
          <div className="flex justify-center gap-4">
            <button
              onClick={reset}
              className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              再試行
            </button>
            <Link
              href="/"
              className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              トップページへ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
