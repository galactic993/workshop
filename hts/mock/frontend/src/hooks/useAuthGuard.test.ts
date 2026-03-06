import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAuthErrorStore } from '@/stores/authErrorStore';
import { useAuthStore } from '@/stores/authStore';
import { useAuthGuard } from './useAuthGuard';

// next/navigation のモック
const mockReplace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: mockReplace,
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  usePathname: () => '/quotes',
  useSearchParams: () => new URLSearchParams(),
}));

describe('useAuthGuard', () => {
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
      refreshAuth: vi.fn().mockResolvedValue(undefined),
    });
    // clearErrors()ではなく直接stateをリセット（無限ループ防止）
    useAuthErrorStore.setState({ errors: [] });
    mockReplace.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('認証状態のチェック', () => {
    it('ローディング中はloading: trueを返す', () => {
      useAuthStore.setState({ user: null, loading: true });

      const permissionChecker = vi.fn(() => true);
      const { result } = renderHook(() => useAuthGuard({ permissionChecker }));

      expect(result.current.loading).toBe(true);
      expect(result.current.user).toBeNull();
    });

    it('認証済みの場合はユーザー情報を返す', async () => {
      useAuthStore.setState({
        user: mockUser,
        loading: false,
        refreshAuth: vi.fn().mockResolvedValue(undefined),
      });

      const permissionChecker = vi.fn(() => true);
      const { result } = renderHook(() => useAuthGuard({ permissionChecker }));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
    });

    it('未認証の場合はリダイレクトされる', async () => {
      useAuthStore.setState({
        user: null,
        loading: false,
        refreshAuth: vi.fn().mockResolvedValue(undefined),
      });

      const permissionChecker = vi.fn(() => true);
      renderHook(() => useAuthGuard({ permissionChecker }));

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/');
      });
    });

    it('未認証の場合は認証エラーメッセージが設定される', async () => {
      useAuthStore.setState({
        user: null,
        loading: false,
        refreshAuth: vi.fn().mockResolvedValue(undefined),
      });

      const permissionChecker = vi.fn(() => true);
      renderHook(() => useAuthGuard({ permissionChecker }));

      await waitFor(() => {
        const errors = useAuthErrorStore.getState().errors;
        expect(errors).toContain('ログインしてください');
      });
    });
  });

  describe('権限チェック', () => {
    it('権限がある場合はリダイレクトされない', async () => {
      useAuthStore.setState({
        user: mockUser,
        loading: false,
        refreshAuth: vi.fn().mockResolvedValue(undefined),
      });

      const permissionChecker = vi.fn(() => true);
      const { result } = renderHook(() => useAuthGuard({ permissionChecker }));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockReplace).not.toHaveBeenCalled();
      expect(permissionChecker).toHaveBeenCalledWith(mockUser.access_type, mockUser.permissions);
    });

    it('権限がない場合はリダイレクトされる', async () => {
      useAuthStore.setState({
        user: mockUser,
        loading: false,
        refreshAuth: vi.fn().mockResolvedValue(undefined),
      });

      const permissionChecker = vi.fn(() => false);
      renderHook(() => useAuthGuard({ permissionChecker }));

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/');
      });
    });

    it('権限がない場合は権限エラーメッセージが設定される', async () => {
      useAuthStore.setState({
        user: mockUser,
        loading: false,
        refreshAuth: vi.fn().mockResolvedValue(undefined),
      });

      const permissionChecker = vi.fn(() => false);
      renderHook(() => useAuthGuard({ permissionChecker }));

      await waitFor(() => {
        const errors = useAuthErrorStore.getState().errors;
        expect(errors).toContain('アクセス権限がありません');
      });
    });
  });

  describe('リダイレクト先の指定', () => {
    it('デフォルトのリダイレクト先は "/" である', async () => {
      useAuthStore.setState({
        user: null,
        loading: false,
        refreshAuth: vi.fn().mockResolvedValue(undefined),
      });

      const permissionChecker = vi.fn(() => true);
      renderHook(() => useAuthGuard({ permissionChecker }));

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/');
      });
    });

    it('カスタムのリダイレクト先を指定できる', async () => {
      useAuthStore.setState({
        user: null,
        loading: false,
        refreshAuth: vi.fn().mockResolvedValue(undefined),
      });

      const permissionChecker = vi.fn(() => true);
      renderHook(() => useAuthGuard({ permissionChecker, redirectTo: '/login' }));

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/login');
      });
    });
  });

  describe('refreshAuth関数', () => {
    it('refreshAuth関数が返される', () => {
      useAuthStore.setState({
        user: mockUser,
        loading: false,
        refreshAuth: vi.fn().mockResolvedValue(undefined),
      });

      const permissionChecker = vi.fn(() => true);
      const { result } = renderHook(() => useAuthGuard({ permissionChecker }));

      expect(typeof result.current.refreshAuth).toBe('function');
    });
  });

  describe('認証成功時のエラークリア', () => {
    it('認証・権限チェック成功時にエラーがクリアされる', async () => {
      // 事前にエラーを設定
      useAuthErrorStore.getState().addError('unauthenticated');
      expect(useAuthErrorStore.getState().errors.length).toBeGreaterThan(0);

      useAuthStore.setState({
        user: mockUser,
        loading: false,
        refreshAuth: vi.fn().mockResolvedValue(undefined),
      });

      const permissionChecker = vi.fn(() => true);
      renderHook(() => useAuthGuard({ permissionChecker }));

      await waitFor(() => {
        const errors = useAuthErrorStore.getState().errors;
        expect(errors).toHaveLength(0);
      });
    });
  });
});
