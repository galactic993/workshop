import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as quotApi from '@/lib/quot';
import { useQuotSearch } from './useQuotSearch';

// API関数のモック
vi.mock('@/lib/quot', async () => {
  const actual = await vi.importActual('@/lib/quot');
  return {
    ...actual,
    getQuots: vi.fn(),
    getSectionCds: vi.fn(),
  };
});

// QueryClient を作成するヘルパー
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

// wrapper を作成するヘルパー
const createWrapper = () => {
  const queryClient = createTestQueryClient();
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'TestQueryClientWrapper';
  return Wrapper;
};

describe('useQuotSearch', () => {
  // テスト用ユーザーデータ
  const mockUser = {
    access_type: '00',
    permissions: ['sales.quotes.create'],
  };

  // モックレスポンスデータ
  const mockQuotsResponse = {
    success: true,
    quotes: [
      {
        quote_id: 1,
        quote_no: '25-00001',
        customer_name: 'テスト得意先',
        quot_subject: 'テスト件名',
        product_name: 'テスト商品',
        amount: 100000,
        quot_status: '00',
        status_label: '登録済',
        prod_quot_status: '00',
      },
    ],
    total: 1,
    page: 1,
    per_page: 50,
    total_pages: 1,
    access_info: {
      default_section_cd: null,
      is_section_cd_disabled: false,
    },
  };

  const mockSectionCdsResponse = {
    success: true,
    section_cds: [
      { section_cd_id: 1, section_cd: '262111', section_name: '東京営業1課' },
      { section_cd_id: 2, section_cd: '262112', section_name: '東京営業2課' },
    ],
    is_disabled: false,
  };

  beforeEach(() => {
    vi.mocked(quotApi.getQuots).mockResolvedValue(mockQuotsResponse);
    vi.mocked(quotApi.getSectionCds).mockResolvedValue(mockSectionCdsResponse);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('初期化', () => {
    it('ユーザーが存在する場合、初期データを取得する', async () => {
      const { result } = renderHook(() => useQuotSearch({ user: mockUser }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.listLoading).toBe(false);
      });

      expect(quotApi.getQuots).toHaveBeenCalled();
      expect(quotApi.getSectionCds).toHaveBeenCalled();
    });

    it('ユーザーがnullの場合、データを取得しない', async () => {
      const { result } = renderHook(() => useQuotSearch({ user: null }), {
        wrapper: createWrapper(),
      });

      // データ取得が呼ばれていないことを確認
      expect(quotApi.getQuots).not.toHaveBeenCalled();
      expect(quotApi.getSectionCds).not.toHaveBeenCalled();
    });

    it('フォームの初期値が正しく設定される', () => {
      const { result } = renderHook(() => useQuotSearch({ user: mockUser }), {
        wrapper: createWrapper(),
      });

      const formValues = result.current.form.getValues();
      expect(formValues.section_cd).toBe('all');
      expect(formValues.status).toBe('all');
      expect(formValues.quote_no).toBe('');
      expect(formValues.customer).toBeNull();
    });
  });

  describe('見積一覧取得', () => {
    it('見積一覧が正しく取得される', async () => {
      const { result } = renderHook(() => useQuotSearch({ user: mockUser }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.listLoading).toBe(false);
      });

      expect(result.current.quotes).toHaveLength(1);
      expect(result.current.quotes[0].quote_no).toBe('25-00001');
      expect(result.current.totalCount).toBe(1);
    });

    it('一覧取得失敗時にエラーが設定される', async () => {
      vi.mocked(quotApi.getQuots).mockResolvedValue({
        ...mockQuotsResponse,
        success: false,
        message: '取得に失敗しました',
      });

      const { result } = renderHook(() => useQuotSearch({ user: mockUser }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.listLoading).toBe(false);
      });

      expect(result.current.errors).toContain('取得に失敗しました');
    });
  });

  describe('部署コード取得', () => {
    it('部署コード一覧が正しく取得される', async () => {
      const { result } = renderHook(() => useQuotSearch({ user: mockUser }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.sectionCdLoading).toBe(false);
      });

      expect(result.current.sectionCdOptions).toHaveLength(2);
      expect(result.current.isSectionCdDisabled).toBe(false);
    });

    it('部署コードが1つのみの場合、自動選択される', async () => {
      vi.mocked(quotApi.getSectionCds).mockResolvedValue({
        success: true,
        section_cds: [{ section_cd_id: 1, section_cd: '262111', section_name: '東京営業1課' }],
        is_disabled: true,
      });

      const { result } = renderHook(() => useQuotSearch({ user: mockUser }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.sectionCdLoading).toBe(false);
      });

      expect(result.current.form.getValues('section_cd')).toBe('262111');
    });
  });

  describe('検索実行', () => {
    it('検索が正しく実行される', async () => {
      const { result } = renderHook(() => useQuotSearch({ user: mockUser }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.listLoading).toBe(false);
      });

      // 検索を実行
      act(() => {
        result.current.onSubmit({
          section_cd: 'all',
          quote_no: '00001',
          quote_date_from: '',
          quote_date_to: '',
          quot_subject: '',
          customer: null,
          product_name: '',
          status: 'all',
        });
      });

      await waitFor(() => {
        expect(quotApi.getQuots).toHaveBeenLastCalledWith(
          expect.objectContaining({
            quote_no: '00001',
          })
        );
      });
    });

    it('無効な部署コードでは検索が実行されない', async () => {
      const { result } = renderHook(() => useQuotSearch({ user: mockUser }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.listLoading).toBe(false);
      });

      const initialCallCount = vi.mocked(quotApi.getQuots).mock.calls.length;

      // 無効な部署コードで検索
      act(() => {
        result.current.onSubmit({
          section_cd: '999999', // 存在しない部署コード
          quote_no: '',
          quote_date_from: '',
          quote_date_to: '',
          quot_subject: '',
          customer: null,
          product_name: '',
          status: 'all',
        });
      });

      // 追加の検索が実行されていないことを確認
      expect(vi.mocked(quotApi.getQuots).mock.calls.length).toBe(initialCallCount);
    });
  });

  describe('ページネーション', () => {
    it('ページ変更が正しく動作する', async () => {
      const { result } = renderHook(() => useQuotSearch({ user: mockUser }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.listLoading).toBe(false);
      });

      // ページを変更
      act(() => {
        result.current.handlePageChange(2);
      });

      await waitFor(() => {
        expect(quotApi.getQuots).toHaveBeenLastCalledWith(
          expect.objectContaining({
            page: 2,
          })
        );
      });
    });

    it('表示件数変更が正しく動作する', async () => {
      const { result } = renderHook(() => useQuotSearch({ user: mockUser }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.listLoading).toBe(false);
      });

      // 表示件数を変更
      act(() => {
        result.current.handlePageSizeChange(100);
      });

      await waitFor(() => {
        expect(quotApi.getQuots).toHaveBeenLastCalledWith(
          expect.objectContaining({
            per_page: 100,
            page: 1, // ページは1にリセット
          })
        );
      });
    });
  });

  describe('ソート', () => {
    it('ソート切り替えが正しく動作する', async () => {
      const { result } = renderHook(() => useQuotSearch({ user: mockUser }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.listLoading).toBe(false);
      });

      // ソートを切り替え
      act(() => {
        result.current.handleSortToggle('quote_no');
      });

      await waitFor(() => {
        expect(result.current.sortField).toBe('quote_no');
        expect(result.current.sortOrder).toBe('asc');
      });

      // 同じフィールドで再度切り替え
      act(() => {
        result.current.handleSortToggle('quote_no');
      });

      await waitFor(() => {
        expect(result.current.sortOrder).toBe('desc');
      });
    });
  });

  describe('クリア', () => {
    it('フォームがクリアされる', async () => {
      const { result } = renderHook(() => useQuotSearch({ user: mockUser }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.listLoading).toBe(false);
      });

      // フォームに値を設定
      act(() => {
        result.current.form.setValue('quote_no', '12345');
        result.current.form.setValue('product_name', 'テスト');
      });

      // クリア
      act(() => {
        result.current.handleClear();
      });

      expect(result.current.form.getValues('quote_no')).toBe('');
      expect(result.current.form.getValues('product_name')).toBe('');
      expect(result.current.form.getValues('section_cd')).toBe('all');
    });
  });

  describe('再取得', () => {
    it('refetchで現在の条件で再取得される', async () => {
      const { result } = renderHook(() => useQuotSearch({ user: mockUser }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.listLoading).toBe(false);
      });

      const callCountBefore = vi.mocked(quotApi.getQuots).mock.calls.length;

      // 再取得
      act(() => {
        result.current.refetch();
      });

      await waitFor(() => {
        expect(vi.mocked(quotApi.getQuots).mock.calls.length).toBe(callCountBefore + 1);
      });
    });
  });

  describe('エラー管理', () => {
    it('addErrorでエラーが追加される', () => {
      const { result } = renderHook(() => useQuotSearch({ user: mockUser }), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addError('テストエラー');
      });

      expect(result.current.errors).toContain('テストエラー');
    });
  });
});
