'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/auth';
import { useAuthErrorStore } from '@/stores/authErrorStore';
import { useAuthStore } from '@/stores/authStore';

type PermissionChecker = (accessType: string, permissions: string[]) => boolean;

interface UseAuthGuardOptions {
  /** 権限チェック関数 */
  permissionChecker: PermissionChecker;
  /** リダイレクト先（デフォルト: '/'） */
  redirectTo?: string;
}

interface UseAuthGuardResult {
  /** 認証済みユーザー情報 */
  user: User | null;
  /** 認証状態読み込み中 */
  loading: boolean;
  /** 認証状態を再取得 */
  refreshAuth: () => Promise<void>;
}

/**
 * 認証・権限チェックを行うカスタムフック
 *
 * - 未認証時: 認証エラーストアにメッセージを設定してリダイレクト
 * - 権限なし時: 認証エラーストアにメッセージを設定してリダイレクト
 * - ログアウト操作時はメッセージ重複を防止
 */
export function useAuthGuard({
  permissionChecker,
  redirectTo = '/',
}: UseAuthGuardOptions): UseAuthGuardResult {
  const router = useRouter();
  const { user, loading, refreshAuth } = useAuthStore();
  const addError = useAuthErrorStore((state) => state.addError);
  const clearErrors = useAuthErrorStore((state) => state.clearErrors);
  const errors = useAuthErrorStore((state) => state.errors);

  // 初回認証チェック完了フラグ（ログアウト時のメッセージ重複防止用）
  const isInitialAuthCheck = useRef(true);

  // 初回レンダリング時に認証状態を確認
  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  // 認証状態が確定後、未認証または権限なしの場合はリダイレクト
  useEffect(() => {
    if (!loading) {
      if (!user) {
        // 未認証の場合（初回チェック時のみメッセージ設定）
        if (isInitialAuthCheck.current) {
          addError('unauthenticated');
        }
        router.replace(redirectTo);
      } else {
        // 認証済みだが権限がない場合
        const canAccess = permissionChecker(user.access_type || '', user.permissions || []);
        if (!canAccess) {
          addError('unauthorized');
          router.replace(redirectTo);
        } else {
          // 認証・権限チェック成功時にエラーをクリア（エラーがある場合のみ）
          if (errors.length > 0) {
            clearErrors();
          }
        }
        // 認証成功時に初回チェック完了
        isInitialAuthCheck.current = false;
      }
    }
  }, [loading, user, router, addError, permissionChecker, redirectTo, errors.length, clearErrors]);

  return { user, loading, refreshAuth };
}
