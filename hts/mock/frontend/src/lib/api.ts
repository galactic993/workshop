import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { useAuthErrorStore } from '@/stores/authErrorStore';
import { navigateTo } from './navigationService';

/**
 * APIエラー情報の型定義
 */
export interface ApiErrorInfo {
  isAuthError: boolean;
  isPermissionError: boolean;
  message: string;
}

/**
 * APIエラーを判定してエラー情報を返す
 * @param error エラーオブジェクト
 * @returns エラー情報（認証/権限エラーでない場合はnull）
 */
export const getApiErrorInfo = (error: unknown): ApiErrorInfo | null => {
  if (!axios.isAxiosError(error)) {
    return null;
  }

  const axiosError = error as AxiosError<{ message?: string }>;
  const status = axiosError.response?.status;

  if (status === 401) {
    return {
      isAuthError: true,
      isPermissionError: false,
      message: 'ログインしてください',
    };
  }

  if (status === 403) {
    return {
      isAuthError: false,
      isPermissionError: true,
      message: axiosError.response?.data?.message || 'アクセス権限がありません',
    };
  }

  return null;
};

/**
 * APIクライアント
 * Laravel Sanctum SPA認証に対応したaxiosインスタンス
 * リバースプロキシ構成のため、同一オリジン（相対パス）でアクセス
 */
const api = axios.create({
  baseURL: '',
  withCredentials: true, // Cookie（セッション）を送信
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// リクエストインターセプター: CSRFトークンを手動でヘッダーに設定
api.interceptors.request.use((config) => {
  const token = Cookies.get('XSRF-TOKEN');
  if (token) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
  }
  return config;
});

// レスポンスインターセプター: 401/403エラー時にログイン画面へリダイレクト
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const requestUrl = error.config?.url || '';
      // ログイン関連のエンドポイントは除外（エラーメッセージを表示するため）
      const isAuthEndpoint = requestUrl.includes('/api/login') || requestUrl.includes('/api/user');

      // ブラウザ環境かつ認証エンドポイント以外の場合
      if (typeof window !== 'undefined' && !isAuthEndpoint) {
        if (status === 401) {
          // 未認証: エラーをストアに設定してリダイレクト
          useAuthErrorStore.getState().addError('unauthenticated');
          navigateTo('/');
        } else if (status === 403) {
          // 権限なし: エラーをストアに設定してリダイレクト
          useAuthErrorStore.getState().addError('unauthorized');
          navigateTo('/');
        }
      }
    }
    return Promise.reject(error);
  }
);

/**
 * CSRF Cookieを取得
 * ログインなどの状態変更リクエストの前に呼び出す
 */
export const getCsrfCookie = async (): Promise<void> => {
  await api.get('/sanctum/csrf-cookie');
};

export default api;
