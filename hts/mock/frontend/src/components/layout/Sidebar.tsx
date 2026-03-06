'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { menuItems, MenuItem } from '@/config/menuItems';

/**
 * 展開/折りたたみアイコン
 */
function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

/**
 * ユーザーがメニュー項目にアクセス可能かを判定
 */
function hasAccess(item: MenuItem, accessType: string | null, permissions: string[]): boolean {
  // アクセス区分が「00（すべて）」の場合は常にアクセス可能
  if (accessType === '00') {
    return true;
  }

  // permissionPrefixが設定されていない場合は全員表示（ポータルなど）
  if (!item.permissionPrefix) {
    return true;
  }

  // 権限識別子がワイルドカードの場合（末尾が「.」）
  if (item.permissionPrefix.endsWith('.')) {
    // ユーザーの権限の中に、このプレフィックスで始まるものがあるか確認
    return permissions.some((p) => p.startsWith(item.permissionPrefix!));
  }

  // 権限識別子が完全一致の場合
  return permissions.includes(item.permissionPrefix);
}

/**
 * メニュー項目をフィルタリング（アクセス可能なものだけを残す）
 */
function filterMenuItems(
  items: MenuItem[],
  accessType: string | null,
  permissions: string[]
): MenuItem[] {
  return (
    items
      .filter((item) => hasAccess(item, accessType, permissions))
      .map((item) => ({
        ...item,
        children: item.children
          ? filterMenuItems(item.children, accessType, permissions)
          : undefined,
      }))
      // 子要素が全て除外された場合、親も表示するが子要素は空配列にする
      .filter((item) => {
        // 元々子要素がなかった場合はそのまま表示
        if (!item.children) return true;
        // 子要素があった場合、フィルタ後に1つでも残っていれば表示
        return item.children.length > 0;
      })
  );
}

/**
 * 第3階層メニュー項目
 */
function Level3MenuItem({ item, pathname }: { item: MenuItem; pathname: string }) {
  const isActive = pathname === item.href;

  return (
    <li>
      <Link
        href={item.href}
        className={`block py-2 pl-12 pr-4 text-[13px] transition-colors ${
          isActive
            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
            : 'text-gray-500 hover:bg-gray-200'
        }`}
      >
        {item.label}
      </Link>
    </li>
  );
}

/**
 * 第2階層メニュー項目
 */
function Level2MenuItem({ item, pathname }: { item: MenuItem; pathname: string }) {
  const hasChildren = item.children && item.children.length > 0;
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
  const [isOpen, setIsOpen] = useState(isActive);

  if (!hasChildren) {
    // 配下なし: 直接リンク
    return (
      <li>
        <Link
          href={item.href}
          className={`block py-2.5 pl-8 pr-4 text-sm transition-colors ${
            isActive
              ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
              : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          {item.label}
        </Link>
      </li>
    );
  }

  // 配下あり: リンク + 展開/折りたたみ
  return (
    <li>
      <div
        className={`flex items-center justify-between transition-colors ${
          isActive ? 'text-blue-700' : 'text-gray-600 hover:bg-gray-200'
        }`}
      >
        <Link
          href={item.href}
          className={`flex-1 py-2.5 pl-8 pr-2 text-sm ${
            pathname === item.href ? 'bg-blue-50 border-l-4 border-blue-500' : ''
          }`}
        >
          {item.label}
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 pr-4 hover:bg-gray-300 rounded"
          aria-label={isOpen ? '折りたたむ' : '展開する'}
        >
          <ChevronIcon isOpen={isOpen} />
        </button>
      </div>
      {isOpen && (
        <ul>
          {item.children!.map((child) => (
            <Level3MenuItem key={child.id} item={child} pathname={pathname} />
          ))}
        </ul>
      )}
    </li>
  );
}

/**
 * 第1階層メニュー項目
 */
function Level1MenuItem({ item, pathname }: { item: MenuItem; pathname: string }) {
  const hasChildren = item.children && item.children.length > 0;
  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
  const [isOpen, setIsOpen] = useState(isActive);

  if (!hasChildren) {
    // 配下なし（ポータルなど）: 直接リンク
    return (
      <li>
        <Link
          href={item.href}
          className={`block py-3 px-4 text-sm font-medium transition-colors ${
            isActive
              ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          {item.label}
        </Link>
      </li>
    );
  }

  // 配下あり: リンク + 展開/折りたたみ
  return (
    <li>
      <div
        className={`flex items-center justify-between transition-colors ${
          isActive ? 'text-blue-700' : 'text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Link
          href={item.href}
          className={`flex-1 py-3 pl-4 pr-2 text-sm font-medium ${
            pathname === item.href ? 'bg-blue-50 border-l-4 border-blue-500' : ''
          }`}
        >
          {item.label}
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 pr-4 hover:bg-gray-300 rounded"
          aria-label={isOpen ? '折りたたむ' : '展開する'}
        >
          <ChevronIcon isOpen={isOpen} />
        </button>
      </div>
      {isOpen && (
        <ul>
          {item.children!.map((child) => (
            <Level2MenuItem key={child.id} item={child} pathname={pathname} />
          ))}
        </ul>
      )}
    </li>
  );
}

/**
 * サイドバーコンポーネント
 * 認証済みユーザーに対して最大3階層のナビゲーションメニューを表示
 * ユーザーのアクセス区分・権限に基づいてメニュー項目をフィルタリング
 */
export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  // ユーザーの権限に基づいてメニューをフィルタリング
  const accessType = user?.access_type;
  const permissions = user?.permissions;

  const filteredMenuItems = useMemo(() => {
    if (!user || !accessType) return [];

    return filterMenuItems(menuItems, accessType, permissions || []);
  }, [user, accessType, permissions]);

  return (
    <aside className="w-64 min-h-[calc(100vh-120px)] bg-gray-100 border-r border-gray-200">
      <nav aria-label="メインナビゲーション" className="py-2">
        <ul>
          {filteredMenuItems.map((item) => (
            <Level1MenuItem key={item.id} item={item} pathname={pathname} />
          ))}
        </ul>
      </nav>
    </aside>
  );
}
