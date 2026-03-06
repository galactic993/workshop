import axios from 'axios';
import api, { getCsrfCookie } from './api';

/**
 * 参照可能組織の型定義
 */
export interface VisibleDepartment {
  department_id: number;
  department_name: string;
}

/**
 * ユーザー情報の型定義
 */
export interface User {
  employee_id: number;
  employee_cd: string;
  employee_name: string;
  section_cd: string;
  section_name: string;
  center_name: string | null;
  team_name: string | null;
  access_type: string | null;
  roles: string[];
  permissions: string[];
  visible_departments: VisibleDepartment[];
}

/**
 * ログインレスポンスの型定義
 */
interface LoginResponse {
  success: boolean;
  user?: User;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * 認証状態確認レスポンスの型定義
 */
interface AuthCheckResponse {
  authenticated: boolean;
  user?: User;
}

/**
 * ログイン
 * @param sectionCd 部署コード
 * @param employeeCd 社員コード
 */
export const login = async (sectionCd: string, employeeCd: string): Promise<LoginResponse> => {
  try {
    // CSRF Cookieを取得
    await getCsrfCookie();

    const response = await api.post<LoginResponse>('/api/login', {
      section_cd: sectionCd,
      employee_cd: employeeCd,
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // 401エラー（認証失敗）は正常なフローの一部として処理
      if (error.response?.status === 401) {
        return {
          success: false,
          message: error.response.data?.message,
        };
      }

      // 422エラー（バリデーションエラー）も正常なフローとして処理
      if (error.response?.status === 422) {
        return {
          success: false,
          message: error.response.data?.message,
          errors: error.response.data?.errors,
        };
      }
    }

    // その他のエラーは再throw
    throw error;
  }
};

/**
 * ログアウト
 */
export const logout = async (): Promise<void> => {
  await api.post('/api/logout');
};

/**
 * 認証状態確認
 */
export const checkAuth = async (): Promise<AuthCheckResponse> => {
  const response = await api.get<AuthCheckResponse>('/api/auth/check');
  return response.data;
};
