import { create } from 'zustand';

/**
 * 認証エラーの種類
 */
export type AuthErrorType = 'unauthenticated' | 'unauthorized';

/**
 * 認証エラーストアの状態型
 */
interface AuthErrorState {
  /** エラーメッセージの配列 */
  errors: string[];
  /** エラーを追加 */
  addError: (type: AuthErrorType) => void;
  /** エラーをクリア */
  clearErrors: () => void;
}

/**
 * エラータイプに対応するメッセージ
 */
const ERROR_MESSAGES: Record<AuthErrorType, string> = {
  unauthenticated: 'ログインしてください',
  unauthorized: 'アクセス権限がありません',
};

/**
 * 認証エラーストア
 * 認証・権限エラー時のメッセージをポータル画面で表示するために使用
 */
export const useAuthErrorStore = create<AuthErrorState>((set) => ({
  errors: [],

  /**
   * エラーを追加
   * 同じメッセージが既に存在する場合は追加しない
   */
  addError: (type) =>
    set((state) => {
      const message = ERROR_MESSAGES[type];
      if (state.errors.includes(message)) {
        return state;
      }
      return { errors: [...state.errors, message] };
    }),

  /**
   * エラーをクリア
   */
  clearErrors: () => set({ errors: [] }),
}));
