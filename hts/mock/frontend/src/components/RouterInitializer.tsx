'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setRouter } from '@/lib/navigationService';

/**
 * ルーターインスタンスを Navigation Service に登録するコンポーネント
 * レイアウトに配置して、アプリ全体でルーターを使用可能にする
 */
export default function RouterInitializer() {
  const router = useRouter();

  useEffect(() => {
    setRouter(router);
  }, [router]);

  return null;
}
