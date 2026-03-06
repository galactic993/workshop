'use client';

import Link from 'next/link';
import PageFooter from '@/components/layout/PageFooter';
import Sidebar from '@/components/layout/Sidebar';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { hasPermission, canAccessSales } from '@/lib/permissions';

/**
 * 売上管理第2階層メニューの定義
 */
interface SalesMenuItem {
  id: string;
  label: string;
  description: string;
  href: string;
  permissionPrefix: string;
}

const salesMenuItems: SalesMenuItem[] = [
  {
    id: 'quotes',
    label: '見積',
    description: '見積書を作成します。',
    href: '/sales/quotes',
    permissionPrefix: 'sales.quotes.',
  },
  {
    id: 'orders',
    label: '受注',
    description: '受注登録/工番発行を行います。',
    href: '/sales/orders',
    permissionPrefix: 'sales.orders.',
  },
  {
    id: 'revenue',
    label: '売上',
    description: '社内仕入、売上登録を行います。',
    href: '/sales/revenue',
    permissionPrefix: 'sales.revenue.',
  },
  {
    id: 'monthly',
    label: '月次',
    description: '製品在庫金額一覧、損益集計表などの出力を行います。',
    href: '/sales/monthly',
    permissionPrefix: 'sales.monthly.',
  },
];

/**
 * リンクカードコンポーネント
 */
function LinkCard({ item }: { item: SalesMenuItem }) {
  return (
    <Link
      href={item.href}
      className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
    >
      <h3 className="text-lg font-semibold text-gray-900">{item.label}</h3>
      <p className="mt-2 text-sm text-gray-600">{item.description}</p>
    </Link>
  );
}

/**
 * 売上管理ページ
 * アクセス区分 00 または sales.* 権限を持つユーザーのみアクセス可能
 */
export default function SalesPage() {
  const { user, loading } = useAuthGuard({
    permissionChecker: canAccessSales,
  });

  // ローディング中
  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-120px)]">
        <Sidebar />
        <main className="flex-1 bg-gray-50 px-4 py-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-lg text-gray-600">読み込み中...</p>
          </div>
        </main>
      </div>
    );
  }

  // 未認証の場合
  if (!user) {
    return null;
  }

  // 権限チェック（リダイレクト処理中の表示防止）
  const canAccess = canAccessSales(user.access_type, user.permissions || []);
  if (!canAccess) {
    return null;
  }

  // ユーザーがアクセス可能なメニュー項目をフィルタリング
  const accessibleItems = salesMenuItems.filter((item) =>
    hasPermission(user.access_type, user.permissions || [], item.permissionPrefix)
  );

  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      <Sidebar />
      <main className="flex-1 bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">売上管理</h1>

          {/* メニューグリッド */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {accessibleItems.map((item) => (
              <LinkCard key={item.id} item={item} />
            ))}
          </div>

          {/* アクセス可能なメニューがない場合 */}
          {accessibleItems.length === 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
              <p className="text-gray-600">アクセス可能なメニューがありません。</p>
            </div>
          )}
          <PageFooter version="1.0.1" lastUpdated="2026/02/02" />
        </div>
      </main>
    </div>
  );
}
