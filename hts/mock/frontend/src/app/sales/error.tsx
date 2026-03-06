'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * 売上管理セクションのエラーページ
 */
export default function SalesErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('Sales section error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <div className="mb-4 text-5xl text-yellow-500">&#9888;</div>
          <h1 className="mb-2 text-xl font-bold text-gray-900">売上管理でエラーが発生しました</h1>
          <p className="mb-6 text-sm text-gray-600">
            操作中にエラーが発生しました。再度お試しいただくか、別の操作をお試しください。
          </p>
          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="mb-6 rounded-md bg-yellow-50 p-4 text-left">
              <p className="text-xs font-medium text-yellow-800">エラー詳細:</p>
              <p className="mt-1 text-xs text-yellow-700 break-all">{error.message}</p>
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
              href="/sales"
              className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              売上管理トップへ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
