'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';

export default function Header() {
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // メニュー外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="h-20 flex items-center justify-between px-6">
        <h1 className="text-2xl font-bold text-gray-900">
          <Link href="/" className="hover:text-gray-700 transition-colors">
            管理会計システム
          </Link>
        </h1>

        {user && (
          <div className="relative" ref={menuRef}>
            {/* ユーザーメニューボタン */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span>{user.employee_name}</span>
              <svg
                className={`h-4 w-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* ドロップダウンメニュー */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  {/* センター */}
                  {user.center_name && (
                    <>
                      <div className="px-4 py-2">
                        <p className="text-xs text-gray-500">センター</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">{user.center_name}</p>
                      </div>
                      <div className="border-t border-gray-200" />
                    </>
                  )}

                  {/* チーム */}
                  {user.team_name && (
                    <>
                      <div className="px-4 py-2">
                        <p className="text-xs text-gray-500">チーム</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">{user.team_name}</p>
                      </div>
                      <div className="border-t border-gray-200" />
                    </>
                  )}

                  {/* ログアウトボタン */}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    ログアウト
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
