'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { pathLabels, dynamicPathLabels } from '@/config/menuItems';

export default function Breadcrumb() {
  const pathname = usePathname();

  // ルートページの場合は「ポータル」のみ表示
  if (pathname === '/') {
    return (
      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="h-10 flex items-center px-6">
          <ol className="flex items-center text-sm text-gray-600">
            <li>
              <span className="text-gray-700">ポータル</span>
            </li>
          </ol>
        </div>
      </nav>
    );
  }

  // パスを分割してブレッドクラムアイテムを生成（ポータルを先頭に含める）
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbItems: { label: string; href: string }[] = [{ label: 'ポータル', href: '/' }];

  let currentPath = '';
  pathSegments.forEach((segment) => {
    const parentPath = currentPath;
    currentPath += `/${segment}`;

    // pathLabelsから完全パスでラベルを取得
    let label = pathLabels[currentPath];

    // ラベルが見つからない場合、動的ルートかチェック
    if (!label) {
      const dynamicLabel = dynamicPathLabels[parentPath];
      if (dynamicLabel && (segment === 'new' || /^\d+$/.test(segment))) {
        label = dynamicLabel;
      }
    }

    // それでもラベルがない場合
    if (!label) {
      label = '存在しないページ';
    }

    breadcrumbItems.push({
      label,
      href: currentPath,
    });
  });

  return (
    <nav className="bg-gray-50 border-b border-gray-200">
      <div className="h-10 flex items-center px-6">
        <ol className="flex items-center text-sm text-gray-600">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;

            return (
              <li key={item.href} className="flex items-center">
                {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                {isLast ? (
                  <span className="text-gray-700">{item.label}</span>
                ) : (
                  <Link href={item.href} className="hover:text-gray-900 transition-colors">
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
