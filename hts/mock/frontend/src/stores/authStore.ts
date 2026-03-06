import { create } from 'zustand';
import { User, login as apiLogin, logout as apiLogout, checkAuth } from '@/lib/auth';
import { LOGIN_ERROR_MESSAGES } from '@/schemas/loginSchema';
import { useAuthErrorStore } from './authErrorStore';

/**
 * 認証ストアの状態型
 */
interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (sectionCd: string, employeeCd: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

/**
 * 認証ストア
 * Zustandを使用してグローバルな認証状態を管理
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  /**
   * ユーザー情報を設定
   */
  setUser: (user) => set({ user }),

  /**
   * ローディング状態を設定
   */
  setLoading: (loading) => set({ loading }),

  /**
   * ログイン
   */
  login: async (sectionCd, employeeCd) => {
    try {
      const response = await apiLogin(sectionCd, employeeCd);

      if (response.success && response.user) {
        set({ user: response.user });
        return { success: true };
      } else {
        return {
          success: false,
          message: response.message || LOGIN_ERROR_MESSAGES.INVALID_CREDENTIALS,
        };
      }
    } catch (error: unknown) {
      // 予期しないエラー（ネットワークエラーなど）の処理
      console.error('ログインエラー:', error);
      return {
        success: false,
        message: LOGIN_ERROR_MESSAGES.RETRY,
      };
    }
  },

  /**
   * ログアウト
   */
  logout: async () => {
    const { clearErrors } = useAuthErrorStore.getState();
    try {
      await apiLogout();
      set({ user: null, loading: false });
      clearErrors(); // 認証エラーをクリア
      // ページリロードせず、Reactの状態更新でログインフォームに遷移
    } catch (error) {
      console.error('ログアウトエラー:', error);
      // エラーが発生してもセッションをクリア
      set({ user: null, loading: false });
      clearErrors(); // 認証エラーをクリア
    }
  },

  /**
   * 認証状態を確認
   */
  refreshAuth: async () => {
    try {
      const response = await checkAuth();
      if (response.authenticated && response.user) {
        set({ user: response.user, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    } catch (error) {
      console.error('認証状態の確認に失敗しました:', error);
      set({ user: null, loading: false });
    }
  },
}));
