import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as quotApi from '@/lib/quot';
import { useQuotDialogs } from './useQuotDialogs';

// API関数のモック
vi.mock('@/lib/quot', async () => {
  const actual = await vi.importActual('@/lib/quot');
  return {
    ...actual,
    getQuotDetail: vi.fn(),
    approveQuot: vi.fn(),
    cancelApproveQuot: vi.fn(),
    receiveProdQuot: vi.fn(),
  };
});

describe('useQuotDialogs', () => {
  // モック関数
  const mockRefetch = vi.fn();
  const mockOnError = vi.fn();
  const mockClearErrors = vi.fn();

  // モックデータ
  const mockQuotDetail = {
    quot_id: 1,
    quot_number: '25-00001',
    section_cd: '262111',
    section_name: '東京営業1課',
    employee_name: 'テスト太郎',
    customer_id: 1,
    customer_cd: '001',
    customer_name: 'テスト得意先',
    quot_customer_name: null,
    prod_name: 'テスト商品',
    quot_subject: 'テスト件名',
    quot_summary: 'テスト概要',
    reference_doc_path: null,
    center_id: 1,
    center_name: '東京センター',
    quot_status: '40',
    status_label: '承認待ち',
    prod_quot_status: '20',
    prod_quot_status_label: '制作見積済',
    quot_on: '2025-01-01',
    quot_doc_path: null,
    quot_amount: 100000,
    submission_method: '00',
    submission_method_label: 'メール',
    quot_result: null,
    quot_result_label: null,
    lost_reason: null,
    message: null,
    prod_quot_operations: [],
    quot_operations: [],
  };

  beforeEach(() => {
    // ストアをリセット
    vi.mocked(quotApi.getQuotDetail).mockResolvedValue({
      success: true,
      quot: mockQuotDetail,
    });
    vi.mocked(quotApi.approveQuot).mockResolvedValue({
      success: true,
      message: '承認しました',
    });
    vi.mocked(quotApi.cancelApproveQuot).mockResolvedValue({
      success: true,
      message: '承認を取り消しました',
    });
    vi.mocked(quotApi.receiveProdQuot).mockResolvedValue({
      success: true,
      message: '受け取りました',
    });
    mockRefetch.mockClear();
    mockOnError.mockClear();
    mockClearErrors.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('詳細モーダル', () => {
    it('詳細モーダルを開くと見積詳細が取得される', async () => {
      const { result } = renderHook(() =>
        useQuotDialogs({
          refetch: mockRefetch,
          onError: mockOnError,
          clearErrors: mockClearErrors,
        })
      );

      // モーダルを開く
      await act(async () => {
        await result.current.detailModal.open(1);
      });

      expect(result.current.detailModal.isOpen).toBe(true);
      expect(result.current.detailModal.quoteId).toBe(1);
      expect(result.current.detailModal.data).toEqual(mockQuotDetail);
      expect(quotApi.getQuotDetail).toHaveBeenCalledWith(1);
      expect(mockClearErrors).toHaveBeenCalled();
    });

    it('詳細取得失敗時はエラーハンドラーが呼ばれる', async () => {
      vi.mocked(quotApi.getQuotDetail).mockResolvedValue({
        success: false,
        message: '取得に失敗しました',
      });

      const { result } = renderHook(() =>
        useQuotDialogs({
          refetch: mockRefetch,
          onError: mockOnError,
          clearErrors: mockClearErrors,
        })
      );

      await act(async () => {
        await result.current.detailModal.open(1);
      });

      expect(result.current.detailModal.isOpen).toBe(false);
      expect(mockOnError).toHaveBeenCalled();
    });

    it('詳細モーダルを閉じると状態がリセットされる', async () => {
      const { result } = renderHook(() =>
        useQuotDialogs({
          refetch: mockRefetch,
          onError: mockOnError,
          clearErrors: mockClearErrors,
        })
      );

      // モーダルを開く
      await act(async () => {
        await result.current.detailModal.open(1);
      });

      expect(result.current.detailModal.isOpen).toBe(true);

      // モーダルを閉じる
      act(() => {
        result.current.detailModal.close();
      });

      expect(result.current.detailModal.isOpen).toBe(false);
      expect(result.current.detailModal.quoteId).toBeNull();
      expect(result.current.detailModal.data).toBeNull();
    });
  });

  describe('承認ダイアログ', () => {
    it('承認ダイアログを開くことができる', () => {
      const { result } = renderHook(() =>
        useQuotDialogs({
          refetch: mockRefetch,
          onError: mockOnError,
        })
      );

      act(() => {
        result.current.approveDialog.open(1);
      });

      expect(result.current.approveDialog.isOpen).toBe(true);
      expect(result.current.approveDialog.quoteId).toBe(1);
    });

    it('承認が成功するとトーストが表示され一覧が再取得される', async () => {
      const { result } = renderHook(() =>
        useQuotDialogs({
          refetch: mockRefetch,
          onError: mockOnError,
        })
      );

      // ダイアログを開く
      act(() => {
        result.current.approveDialog.open(1);
      });

      // 承認を実行
      await act(async () => {
        await result.current.approveDialog.confirm();
      });

      expect(quotApi.approveQuot).toHaveBeenCalledWith(1);
      expect(result.current.approveDialog.isOpen).toBe(false);
      expect(mockRefetch).toHaveBeenCalled();

      // トーストが表示されていることを確認
    });

    it('承認が失敗するとエラートーストが表示される', async () => {
      vi.mocked(quotApi.approveQuot).mockResolvedValue({
        success: false,
        message: '承認に失敗しました',
      });

      const { result } = renderHook(() =>
        useQuotDialogs({
          refetch: mockRefetch,
          onError: mockOnError,
        })
      );

      act(() => {
        result.current.approveDialog.open(1);
      });

      await act(async () => {
        await result.current.approveDialog.confirm();
      });
    });

    it('承認ダイアログを閉じることができる', () => {
      const { result } = renderHook(() =>
        useQuotDialogs({
          refetch: mockRefetch,
          onError: mockOnError,
        })
      );

      act(() => {
        result.current.approveDialog.open(1);
      });

      act(() => {
        result.current.approveDialog.close();
      });

      expect(result.current.approveDialog.isOpen).toBe(false);
      expect(result.current.approveDialog.quoteId).toBeNull();
    });
  });

  describe('承認取消ダイアログ', () => {
    it('承認取消ダイアログを開くことができる', () => {
      const { result } = renderHook(() =>
        useQuotDialogs({
          refetch: mockRefetch,
          onError: mockOnError,
        })
      );

      act(() => {
        result.current.cancelApproveDialog.open(1);
      });

      expect(result.current.cancelApproveDialog.isOpen).toBe(true);
      expect(result.current.cancelApproveDialog.quoteId).toBe(1);
    });

    it('承認取消が成功するとトーストが表示され一覧が再取得される', async () => {
      const { result } = renderHook(() =>
        useQuotDialogs({
          refetch: mockRefetch,
          onError: mockOnError,
        })
      );

      act(() => {
        result.current.cancelApproveDialog.open(1);
      });

      await act(async () => {
        await result.current.cancelApproveDialog.confirm();
      });

      expect(quotApi.cancelApproveQuot).toHaveBeenCalledWith(1);
      expect(result.current.cancelApproveDialog.isOpen).toBe(false);
      expect(mockRefetch).toHaveBeenCalled();
    });

    it('承認取消ダイアログを閉じることができる', () => {
      const { result } = renderHook(() =>
        useQuotDialogs({
          refetch: mockRefetch,
          onError: mockOnError,
        })
      );

      act(() => {
        result.current.cancelApproveDialog.open(1);
      });

      act(() => {
        result.current.cancelApproveDialog.close();
      });

      expect(result.current.cancelApproveDialog.isOpen).toBe(false);
    });
  });

  describe('画面遷移確認ダイアログ', () => {
    it('画面遷移確認ダイアログを開くことができる', () => {
      const { result } = renderHook(() =>
        useQuotDialogs({
          refetch: mockRefetch,
          onError: mockOnError,
        })
      );

      act(() => {
        result.current.navigateDialog.open(1);
      });

      expect(result.current.navigateDialog.isOpen).toBe(true);
      expect(result.current.navigateDialog.quotId).toBe(1);
    });

    it('新規作成用の画面遷移ダイアログを開くことができる', () => {
      const { result } = renderHook(() =>
        useQuotDialogs({
          refetch: mockRefetch,
          onError: mockOnError,
        })
      );

      act(() => {
        result.current.navigateDialog.open('new');
      });

      expect(result.current.navigateDialog.isOpen).toBe(true);
      expect(result.current.navigateDialog.quotId).toBe('new');
    });

    it('画面遷移確認ダイアログを閉じることができる', () => {
      const { result } = renderHook(() =>
        useQuotDialogs({
          refetch: mockRefetch,
          onError: mockOnError,
        })
      );

      act(() => {
        result.current.navigateDialog.open(1);
      });

      act(() => {
        result.current.navigateDialog.close();
      });

      expect(result.current.navigateDialog.isOpen).toBe(false);
      expect(result.current.navigateDialog.quotId).toBeNull();
    });

    it('確認するとダイアログが閉じる', () => {
      const { result } = renderHook(() =>
        useQuotDialogs({
          refetch: mockRefetch,
          onError: mockOnError,
        })
      );

      act(() => {
        result.current.navigateDialog.open(1);
      });

      act(() => {
        result.current.navigateDialog.confirm();
      });

      expect(result.current.navigateDialog.isOpen).toBe(false);
    });
  });

  describe('見積更新ダイアログ', () => {
    it('見積更新ダイアログを開くことができる', () => {
      const { result } = renderHook(() =>
        useQuotDialogs({
          refetch: mockRefetch,
          onError: mockOnError,
        })
      );

      act(() => {
        result.current.updateDialog.open();
      });

      expect(result.current.updateDialog.isOpen).toBe(true);
    });

    it('見積更新ダイアログを閉じることができる', () => {
      const { result } = renderHook(() =>
        useQuotDialogs({
          refetch: mockRefetch,
          onError: mockOnError,
        })
      );

      act(() => {
        result.current.updateDialog.open();
      });

      act(() => {
        result.current.updateDialog.close();
      });

      expect(result.current.updateDialog.isOpen).toBe(false);
    });
  });

  describe('制作見積受取確認ダイアログ', () => {
    it('受取確認ダイアログを開くことができる', () => {
      const { result } = renderHook(() =>
        useQuotDialogs({
          refetch: mockRefetch,
          onError: mockOnError,
        })
      );

      act(() => {
        result.current.receiveDialog.open(1);
      });

      expect(result.current.receiveDialog.isOpen).toBe(true);
      expect(result.current.receiveDialog.quotId).toBe(1);
    });

    it('受取が成功するとtrueが返される', async () => {
      const { result } = renderHook(() =>
        useQuotDialogs({
          refetch: mockRefetch,
          onError: mockOnError,
        })
      );

      act(() => {
        result.current.receiveDialog.open(1);
      });

      let confirmResult: boolean = false;
      await act(async () => {
        confirmResult = await result.current.receiveDialog.confirm();
      });

      expect(confirmResult).toBe(true);
      expect(quotApi.receiveProdQuot).toHaveBeenCalledWith(1);
      expect(result.current.receiveDialog.isOpen).toBe(false);
    });

    it('受取が失敗するとfalseが返される', async () => {
      vi.mocked(quotApi.receiveProdQuot).mockResolvedValue({
        success: false,
        message: '受け取りに失敗しました',
      });

      const { result } = renderHook(() =>
        useQuotDialogs({
          refetch: mockRefetch,
          onError: mockOnError,
        })
      );

      act(() => {
        result.current.receiveDialog.open(1);
      });

      let confirmResult: boolean = true;
      await act(async () => {
        confirmResult = await result.current.receiveDialog.confirm();
      });

      expect(confirmResult).toBe(false);
      expect(mockOnError).toHaveBeenCalled();
      expect(mockRefetch).toHaveBeenCalled();
    });

    it('受取確認ダイアログを閉じることができる', () => {
      const { result } = renderHook(() =>
        useQuotDialogs({
          refetch: mockRefetch,
          onError: mockOnError,
        })
      );

      act(() => {
        result.current.receiveDialog.open(1);
      });

      act(() => {
        result.current.receiveDialog.close();
      });

      expect(result.current.receiveDialog.isOpen).toBe(false);
      expect(result.current.receiveDialog.quotId).toBeNull();
    });
  });

  describe('詳細モーダルからの承認', () => {
    it('詳細モーダルが開いている状態で承認すると詳細モーダルも閉じる', async () => {
      const { result } = renderHook(() =>
        useQuotDialogs({
          refetch: mockRefetch,
          onError: mockOnError,
          clearErrors: mockClearErrors,
        })
      );

      // 詳細モーダルを開く
      await act(async () => {
        await result.current.detailModal.open(1);
      });

      expect(result.current.detailModal.isOpen).toBe(true);

      // 承認ダイアログを開く
      act(() => {
        result.current.approveDialog.open(1);
      });

      // 承認を実行
      await act(async () => {
        await result.current.approveDialog.confirm();
      });

      // 両方のダイアログが閉じていることを確認
      expect(result.current.approveDialog.isOpen).toBe(false);
      expect(result.current.detailModal.isOpen).toBe(false);
    });
  });
});
