import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as authApi from '@/lib/auth';
import { useAuthErrorStore } from './authErrorStore';
import { useAuthStore } from './authStore';

// API関数のモック
vi.mock('@/lib/auth', () => ({
  login: vi.fn(),
  logout: vi.fn(),
  checkAuth: vi.fn(),
  getCsrfCookie: vi.fn(),
}));

describe('authStore', () => {
  // テスト用ユーザーデータ
  const mockUser = {
    employee_id: 1,
    employee_cd: '000001',
    employee_name: '管理太郎',
    section_cd: '000000',
    section_name: 'システム管理部',
    center_name: null,
    team_name: null,
    access_type: '00',
    roles: [],
    permissions: ['sales.quotes.create'],
    visible_departments: [],
  };

  beforeEach(() => {
    // 各テスト前にストアをリセット
    useAuthStore.setState({
      user: null,
      loading: true,
    });
    useAuthErrorStore.getState().clearErrors();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('初期状態', () => {
    it('初期状態ではユーザーはnull、loading: trueである', () => {
      const { user, loading } = useAuthStore.getState();
      expect(user).toBeNull();
      expect(loading).toBe(true);
    });
  });

  describe('setUser', () => {
    it('ユーザー情報を設定できる', () => {
      const { setUser } = useAuthStore.getState();
      setUser(mockUser);

      const { user } = useAuthStore.getState();
      expect(user).toEqual(mockUser);
    });

    it('ユーザー情報をnullに設定できる', () => {
      const { setUser } = useAuthStore.getState();
      setUser(mockUser);
      setUser(null);

      const { user } = useAuthStore.getState();
      expect(user).toBeNull();
    });
  });

  describe('setLoading', () => {
    it('ローディング状態を設定できる', () => {
      const { setLoading } = useAuthStore.getState();
      setLoading(false);

      const { loading } = useAuthStore.getState();
      expect(loading).toBe(false);
    });
  });

  describe('login', () => {
    it('ログイン成功時にユーザー情報が設定される', async () => {
      vi.mocked(authApi.login).mockResolvedValue({
        success: true,
        user: mockUser,
      });

      const { login } = useAuthStore.getState();
      const result = await login('000000', '000001');

      expect(result.success).toBe(true);
      expect(useAuthStore.getState().user).toEqual(mockUser);
    });

    it('ログイン失敗時にエラーメッセージが返される', async () => {
      vi.mocked(authApi.login).mockResolvedValue({
        success: false,
        message: '認証に失敗しました',
      });

      const { login } = useAuthStore.getState();
      const result = await login('000000', '999999');

      expect(result.success).toBe(false);
      expect(result.message).toBe('認証に失敗しました');
      expect(useAuthStore.getState().user).toBeNull();
    });

    it('ネットワークエラー時にエラーメッセージが返される', async () => {
      vi.mocked(authApi.login).mockRejectedValue(new Error('Network Error'));

      const { login } = useAuthStore.getState();
      const result = await login('000000', '000001');

      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });

    it('ログイン成功時にユーザー情報がない場合はエラーが返される', async () => {
      vi.mocked(authApi.login).mockResolvedValue({
        success: true,
        // user is undefined
      });

      const { login } = useAuthStore.getState();
      const result = await login('000000', '000001');

      // success: trueでもuserがない場合はログイン失敗扱い
      expect(result.success).toBe(false);
    });
  });

  describe('logout', () => {
    it('ログアウト後はユーザーがnullになる', async () => {
      // まずログイン状態にする
      useAuthStore.setState({ user: mockUser, loading: false });
      vi.mocked(authApi.logout).mockResolvedValue();

      const { logout } = useAuthStore.getState();
      await logout();

      const { user, loading } = useAuthStore.getState();
      expect(user).toBeNull();
      expect(loading).toBe(false);
    });

    it('ログアウト時に認証エラーがクリアされる', async () => {
      // まずエラーを設定
      useAuthErrorStore.getState().addError('unauthenticated');
      expect(useAuthErrorStore.getState().errors.length).toBeGreaterThan(0);

      useAuthStore.setState({ user: mockUser, loading: false });
      vi.mocked(authApi.logout).mockResolvedValue();

      const { logout } = useAuthStore.getState();
      await logout();

      expect(useAuthErrorStore.getState().errors).toHaveLength(0);
    });

    it('ログアウトAPIが失敗してもセッションはクリアされる', async () => {
      useAuthStore.setState({ user: mockUser, loading: false });
      vi.mocked(authApi.logout).mockRejectedValue(new Error('Network Error'));

      const { logout } = useAuthStore.getState();
      await logout();

      const { user, loading } = useAuthStore.getState();
      expect(user).toBeNull();
      expect(loading).toBe(false);
    });
  });

  describe('refreshAuth', () => {
    it('認証済みの場合はユーザー情報が設定される', async () => {
      vi.mocked(authApi.checkAuth).mockResolvedValue({
        authenticated: true,
        user: mockUser,
      });

      const { refreshAuth } = useAuthStore.getState();
      await refreshAuth();

      const { user, loading } = useAuthStore.getState();
      expect(user).toEqual(mockUser);
      expect(loading).toBe(false);
    });

    it('未認証の場合はユーザーがnullになる', async () => {
      vi.mocked(authApi.checkAuth).mockResolvedValue({
        authenticated: false,
      });

      const { refreshAuth } = useAuthStore.getState();
      await refreshAuth();

      const { user, loading } = useAuthStore.getState();
      expect(user).toBeNull();
      expect(loading).toBe(false);
    });

    it('認証確認APIが失敗してもユーザーがnullになる', async () => {
      vi.mocked(authApi.checkAuth).mockRejectedValue(new Error('Network Error'));

      const { refreshAuth } = useAuthStore.getState();
      await refreshAuth();

      const { user, loading } = useAuthStore.getState();
      expect(user).toBeNull();
      expect(loading).toBe(false);
    });
  });

  describe('状態の更新', () => {
    it('複数の状態更新が正しく反映される', () => {
      const { setUser, setLoading } = useAuthStore.getState();

      setUser(mockUser);
      setLoading(false);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.loading).toBe(false);
    });

    it('ログイン後にログアウトするとユーザーがnullになる', async () => {
      vi.mocked(authApi.login).mockResolvedValue({
        success: true,
        user: mockUser,
      });
      vi.mocked(authApi.logout).mockResolvedValue();

      const { login, logout } = useAuthStore.getState();

      await login('000000', '000001');
      expect(useAuthStore.getState().user).toEqual(mockUser);

      await logout();
      expect(useAuthStore.getState().user).toBeNull();
    });
  });
});
