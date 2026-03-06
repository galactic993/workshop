'use client';

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCenters, Center } from '@/lib/centers';
import {
  getSectionCustomers,
  deleteSectionCustomer,
  addSectionCustomer,
  SectionCustomer,
} from '@/lib/customer';
import { SortOrder } from '@/lib/types';

/**
 * useSectionCustomerDataの引数
 */
interface UseSectionCustomerDataParams {
  /** 認証済みかどうか */
  isAuthenticated: boolean;
  /** 選択中のセンターID */
  centerId: string;
  /** 現在のページ */
  currentPage: number;
  /** ページサイズ */
  pageSize: number;
  /** ソートフィールド */
  sortField: 'customer_cd' | 'customer_name' | null;
  /** ソート順 */
  sortOrder: SortOrder;
  /** メッセージダイアログ表示用コールバック */
  onShowDialog: (title: string, message: string) => void;
}

/**
 * useSectionCustomerDataの戻り値
 */
export interface UseSectionCustomerDataReturn {
  // センター関連
  centers: Center[];
  centersLoading: boolean;
  // 部署別得意先一覧関連
  sectionCustomers: SectionCustomer[];
  listLoading: boolean;
  totalCount: number;
  totalPages: number;
  // ミューテーション
  addCustomer: (customerId: number) => Promise<{ success: boolean }>;
  deleteCustomer: (customerId: number) => Promise<{ success: boolean }>;
  isAddLoading: boolean;
  isDeleteLoading: boolean;
}

/**
 * 部署別得意先メンテナンスのデータ取得・操作フック
 * TanStack Queryを使用してデータ取得とキャッシュ管理を行う
 */
export function useSectionCustomerData({
  isAuthenticated,
  centerId,
  currentPage,
  pageSize,
  sortField,
  sortOrder,
  onShowDialog,
}: UseSectionCustomerDataParams): UseSectionCustomerDataReturn {
  const queryClient = useQueryClient();

  // センター一覧を取得
  const { data: centersData, isLoading: centersLoading } = useQuery({
    queryKey: ['centers'],
    queryFn: getCenters,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  });

  const centers = centersData?.success ? centersData.centers : [];

  // 部署別得意先一覧を取得
  const { data: sectionCustomersData, isLoading: listLoading } = useQuery({
    queryKey: ['sectionCustomers', centerId, currentPage, pageSize, sortField, sortOrder],
    queryFn: () =>
      getSectionCustomers(Number(centerId), currentPage, pageSize, sortField, sortOrder),
    enabled: isAuthenticated && !!centerId,
    staleTime: 30 * 1000, // 30秒間キャッシュ
  });

  const sectionCustomers = sectionCustomersData?.success ? sectionCustomersData.customers : [];
  const totalCount = sectionCustomersData?.success ? sectionCustomersData.total : 0;
  const totalPages = sectionCustomersData?.success ? sectionCustomersData.total_pages : 0;

  // 追加ミューテーション
  const addMutation = useMutation({
    mutationFn: (customerId: number) => addSectionCustomer(Number(centerId), customerId),
    onSuccess: (response) => {
      if (response.success) {
        onShowDialog('部署別得意先メンテナンス', '登録しました');
        // キャッシュを無効化して再取得
        queryClient.invalidateQueries({ queryKey: ['sectionCustomers', centerId] });
      } else {
        onShowDialog(
          '部署別得意先メンテナンス',
          '登録に失敗しました。\n時間を空けて再度お試しください'
        );
      }
    },
    onError: (error) => {
      console.error('追加エラー:', error);
      onShowDialog(
        '部署別得意先メンテナンス',
        '登録に失敗しました。\n時間を空けて再度お試しください'
      );
    },
  });

  // 削除ミューテーション
  const deleteMutation = useMutation({
    mutationFn: (customerId: number) => deleteSectionCustomer(Number(centerId), customerId),
    onSuccess: (response) => {
      if (response.success) {
        onShowDialog('部署別得意先メンテナンス', '削除しました');
        // キャッシュを無効化して再取得
        queryClient.invalidateQueries({ queryKey: ['sectionCustomers', centerId] });
      } else {
        onShowDialog(
          '部署別得意先メンテナンス',
          '削除に失敗しました。\n時間を空けて再度お試しください'
        );
      }
    },
    onError: (error) => {
      console.error('削除エラー:', error);
      onShowDialog(
        '部署別得意先メンテナンス',
        '削除に失敗しました。\n時間を空けて再度お試しください'
      );
    },
  });

  // 追加処理をラップ（エラーハンドリングはミューテーション内で処理済み）
  const addCustomer = useCallback(
    async (customerId: number): Promise<{ success: boolean }> => {
      try {
        const response = await addMutation.mutateAsync(customerId);
        return { success: response.success };
      } catch (error) {
        // エラーはonErrorで処理済み
        return { success: false };
      }
    },
    [addMutation]
  );

  // 削除処理をラップ（エラーハンドリングはミューテーション内で処理済み）
  const deleteCustomer = useCallback(
    async (customerId: number): Promise<{ success: boolean }> => {
      try {
        const response = await deleteMutation.mutateAsync(customerId);
        return { success: response.success };
      } catch (error) {
        // エラーはonErrorで処理済み
        return { success: false };
      }
    },
    [deleteMutation]
  );

  return {
    // センター関連
    centers,
    centersLoading,
    // 部署別得意先一覧関連
    sectionCustomers,
    listLoading,
    totalCount,
    totalPages,
    // ミューテーション
    addCustomer,
    deleteCustomer,
    isAddLoading: addMutation.isPending,
    isDeleteLoading: deleteMutation.isPending,
  };
}
