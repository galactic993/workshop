import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getQuotCenters, Center } from '@/lib/centers';
import { getQuotDetail, QuotDetail } from '@/lib/quot';

/**
 * useQuotDetailDataのオプション
 */
interface UseQuotDetailDataOptions {
  id: string;
  isNew: boolean;
  loading: boolean;
  user: { employee_id: number } | null;
}

/**
 * useQuotDetailDataの戻り値
 */
interface UseQuotDetailDataReturn {
  // センター関連
  centers: Center[];
  centersLoading: boolean;
  // 詳細データ
  detailData: QuotDetail | null;
  detailLoading: boolean;
  // データ再取得
  refresh: () => void;
  // エラー関連
  showServerError: (message: string) => void;
  serverErrorDialogOpen: boolean;
  serverErrorMessage: string;
  closeServerError: () => void;
}

/**
 * 見積詳細データ取得フック
 * センター一覧と見積詳細データの取得を管理する
 */
export function useQuotDetailData(options: UseQuotDetailDataOptions): UseQuotDetailDataReturn {
  const { id, isNew, loading, user } = options;
  const router = useRouter();

  // サーバーエラーダイアログ
  const [serverErrorDialogOpen, setServerErrorDialogOpen] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState('');

  /**
   * サーバーエラーを表示
   */
  const showServerError = useCallback((message: string) => {
    setServerErrorMessage(message);
    setServerErrorDialogOpen(true);
  }, []);

  /**
   * サーバーエラーダイアログを閉じる
   */
  const closeServerError = useCallback(() => {
    setServerErrorDialogOpen(false);
  }, []);

  // センター一覧取得
  const {
    data: centersData,
    isLoading: centersLoading,
    error: centersError,
  } = useQuery({
    queryKey: ['quotCenters'],
    queryFn: getQuotCenters,
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  });

  // 見積詳細取得（条件付き）
  const {
    data: detailResponse,
    isLoading: detailLoading,
    error: detailError,
    refetch: refetchDetail,
  } = useQuery({
    queryKey: ['quotDetail', id],
    queryFn: async () => {
      const quotId = parseInt(id, 10);
      if (isNaN(quotId)) {
        return null;
      }
      return getQuotDetail(quotId);
    },
    enabled: !isNew && !!id && !loading && !!user,
    staleTime: 0, // 常に最新データを取得
  });

  // センター取得エラーのハンドリング
  useEffect(() => {
    if (centersError) {
      console.error('センター取得エラー:', centersError);
      showServerError('センターの取得に失敗しました。時間を空けて再度お試しください');
    }
  }, [centersError, showServerError]);

  // 詳細データ取得エラーのハンドリング
  useEffect(() => {
    if (detailError) {
      console.error('詳細取得エラー:', detailError);
      showServerError('見積情報の取得に失敗しました。\n時間を空けて再度お試しください');
      router.push('/sales/quotes');
    }
  }, [detailError, showServerError, router]);

  // 詳細データのバリデーション（無効なIDや取得失敗時）
  useEffect(() => {
    if (!isNew && !loading && user && detailResponse !== undefined) {
      if (detailResponse === null) {
        showServerError('無効な見積IDです');
        router.push('/sales/quotes');
      } else if (!detailResponse.success || !detailResponse.quot) {
        showServerError(
          detailResponse.message || '見積情報の取得に失敗しました。\n時間を空けて再度お試しください'
        );
        router.push('/sales/quotes');
      }
    }
  }, [isNew, loading, user, detailResponse, showServerError, router]);

  /**
   * データ再取得をトリガー
   */
  const refresh = useCallback(() => {
    refetchDetail();
  }, [refetchDetail]);

  return {
    centers: centersData?.centers ?? [],
    centersLoading,
    detailData: detailResponse?.quot ?? null,
    detailLoading: !isNew && detailLoading,
    refresh,
    showServerError,
    serverErrorDialogOpen,
    serverErrorMessage,
    closeServerError,
  };
}
