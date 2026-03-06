'use client';

import { useState, useCallback } from 'react';
import {
  QuotDetail,
  getQuotDetail,
  approveQuot,
  cancelApproveQuot,
  receiveProdQuot,
} from '@/lib/quot';

interface UseQuotDialogsOptions {
  /** 一覧を再取得する関数 */
  refetch: () => void;
  /** エラー発生時のコールバック（ErrorMessageList用） */
  onError?: (message: string) => void;
  /** エラーをクリアするコールバック */
  clearErrors?: () => void;
  /** 成功メッセージ表示コールバック */
  onSuccess?: (title: string, message: string) => void;
}

interface UseQuotDialogsReturn {
  // 詳細モーダル
  detailModal: {
    isOpen: boolean;
    quoteId: number | null;
    data: QuotDetail | null;
    loading: boolean;
    open: (quoteId: number) => Promise<void>;
    close: () => void;
  };
  // 承認ダイアログ
  approveDialog: {
    isOpen: boolean;
    quoteId: number | null;
    loading: boolean;
    open: (quoteId: number) => void;
    close: () => void;
    confirm: () => Promise<void>;
  };
  // 承認取消ダイアログ
  cancelApproveDialog: {
    isOpen: boolean;
    quoteId: number | null;
    loading: boolean;
    open: (quoteId: number) => void;
    close: () => void;
    confirm: () => Promise<void>;
  };
  // 画面遷移確認ダイアログ
  navigateDialog: {
    isOpen: boolean;
    quotId: number | 'new' | null;
    open: (quotId: number | 'new') => void;
    close: () => void;
    confirm: () => void;
  };
  // 見積更新ダイアログ
  updateDialog: {
    isOpen: boolean;
    loading: boolean;
    open: () => void;
    close: () => void;
    confirm: () => Promise<void>;
  };
  // 制作見積受取確認ダイアログ
  receiveDialog: {
    isOpen: boolean;
    quotId: number | null;
    loading: boolean;
    open: (quotId: number) => void;
    close: () => void;
    confirm: () => Promise<boolean>;
  };
}

/**
 * 見積ページのダイアログ状態を管理するカスタムフック
 */
export function useQuotDialogs({
  refetch,
  onError,
  clearErrors,
  onSuccess,
}: UseQuotDialogsOptions): UseQuotDialogsReturn {
  // 詳細モーダル
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailQuoteId, setDetailQuoteId] = useState<number | null>(null);
  const [detailData, setDetailData] = useState<QuotDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // 承認ダイアログ
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [approveQuoteId, setApproveQuoteId] = useState<number | null>(null);
  const [approveLoading, setApproveLoading] = useState(false);

  // 承認取消ダイアログ
  const [cancelApproveDialogOpen, setCancelApproveDialogOpen] = useState(false);

  // 画面遷移確認ダイアログ
  const [navigateDialogOpen, setNavigateDialogOpen] = useState(false);
  const [navigateQuotId, setNavigateQuotId] = useState<number | 'new' | null>(null);

  // 見積更新ダイアログ
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  // 制作見積受取確認ダイアログ
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
  const [receiveQuotId, setReceiveQuotId] = useState<number | null>(null);
  const [receiveLoading, setReceiveLoading] = useState(false);

  // 詳細モーダルを開く
  const openDetailModal = useCallback(
    async (quoteId: number) => {
      clearErrors?.(); // 前回のエラーをクリア
      setDetailQuoteId(quoteId);
      setDetailModalOpen(true);
      setDetailLoading(true);
      setDetailData(null);

      const response = await getQuotDetail(quoteId);
      setDetailLoading(false);

      if (response.success && response.quot) {
        setDetailData(response.quot);
      } else {
        setDetailModalOpen(false);
        setDetailQuoteId(null);
        onError?.('見積情報の取得に失敗しました。時間を空けて再度お試しください。');
      }
    },
    [onError, clearErrors]
  );

  // 詳細モーダルを閉じる
  const closeDetailModal = useCallback(() => {
    setDetailModalOpen(false);
    setDetailQuoteId(null);
    setDetailData(null);
  }, []);

  // 承認確定
  const confirmApprove = useCallback(async () => {
    if (!approveQuoteId) return;

    setApproveLoading(true);
    const response = await approveQuot(approveQuoteId);
    setApproveLoading(false);

    if (response.success) {
      onSuccess?.('見積 - 作成・更新', '承認しました');
      setApproveDialogOpen(false);
      setApproveQuoteId(null);
      if (detailModalOpen) {
        closeDetailModal();
      }
      refetch();
    } else {
      onError?.(response.message || '承認に失敗しました。\n時間を空けて再度お試しください');
    }
  }, [approveQuoteId, detailModalOpen, closeDetailModal, refetch, onSuccess, onError]);

  // 承認取消確定
  const confirmCancelApprove = useCallback(async () => {
    if (!approveQuoteId) return;

    setApproveLoading(true);
    const response = await cancelApproveQuot(approveQuoteId);
    setApproveLoading(false);

    if (response.success) {
      onSuccess?.('見積 - 作成・更新', '承認を取り消しました');
      setCancelApproveDialogOpen(false);
      setApproveQuoteId(null);
      refetch();
    } else {
      onError?.(response.message || '承認取消に失敗しました。\n時間を空けて再度お試しください');
    }
  }, [approveQuoteId, refetch, onSuccess, onError]);

  // 見積更新確定
  const confirmUpdate = useCallback(async () => {
    if (!detailQuoteId) return;

    setUpdateLoading(true);
    // TODO: 見積更新APIを呼び出す
    await new Promise((resolve) => setTimeout(resolve, 500));
    setUpdateLoading(false);

    onSuccess?.('見積 - 作成・更新', '見積を更新しました');
    setUpdateDialogOpen(false);
    closeDetailModal();
    refetch();
  }, [detailQuoteId, closeDetailModal, refetch, onSuccess]);

  return {
    detailModal: {
      isOpen: detailModalOpen,
      quoteId: detailQuoteId,
      data: detailData,
      loading: detailLoading,
      open: openDetailModal,
      close: closeDetailModal,
    },
    approveDialog: {
      isOpen: approveDialogOpen,
      quoteId: approveQuoteId,
      loading: approveLoading,
      open: (quoteId: number) => {
        setApproveQuoteId(quoteId);
        setApproveDialogOpen(true);
      },
      close: () => {
        setApproveDialogOpen(false);
        setApproveQuoteId(null);
      },
      confirm: confirmApprove,
    },
    cancelApproveDialog: {
      isOpen: cancelApproveDialogOpen,
      quoteId: approveQuoteId,
      loading: approveLoading,
      open: (quoteId: number) => {
        setApproveQuoteId(quoteId);
        setCancelApproveDialogOpen(true);
      },
      close: () => {
        setCancelApproveDialogOpen(false);
        setApproveQuoteId(null);
      },
      confirm: confirmCancelApprove,
    },
    navigateDialog: {
      isOpen: navigateDialogOpen,
      quotId: navigateQuotId,
      open: (quotId: number | 'new') => {
        setNavigateQuotId(quotId);
        setNavigateDialogOpen(true);
      },
      close: () => {
        setNavigateDialogOpen(false);
        setNavigateQuotId(null);
      },
      confirm: () => {
        setNavigateDialogOpen(false);
      },
    },
    updateDialog: {
      isOpen: updateDialogOpen,
      loading: updateLoading,
      open: () => setUpdateDialogOpen(true),
      close: () => setUpdateDialogOpen(false),
      confirm: confirmUpdate,
    },
    receiveDialog: {
      isOpen: receiveDialogOpen,
      quotId: receiveQuotId,
      loading: receiveLoading,
      open: (quotId: number) => {
        setReceiveQuotId(quotId);
        setReceiveDialogOpen(true);
      },
      close: () => {
        setReceiveDialogOpen(false);
        setReceiveQuotId(null);
      },
      confirm: async () => {
        if (!receiveQuotId) return false;

        setReceiveLoading(true);
        const response = await receiveProdQuot(receiveQuotId);
        setReceiveLoading(false);

        if (response.success) {
          setReceiveDialogOpen(false);
          return true;
        } else {
          setReceiveDialogOpen(false);
          setReceiveQuotId(null);
          onError?.('制作見積の受け取りに失敗しました。時間を空けて再度お試しください。');
          refetch();
          return false;
        }
      },
    },
  };
}
