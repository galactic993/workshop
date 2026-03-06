'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomerSelectField from '@/components/forms/CustomerSelectField';
import PageFooter from '@/components/layout/PageFooter';
import Sidebar from '@/components/layout/Sidebar';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import MessageDialog from '@/components/ui/MessageDialog';
import Pagination from '@/components/ui/Pagination';
import TruncateWithTooltip from '@/components/ui/TruncateWithTooltip';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { getCenters, Center } from '@/lib/centers';
import {
  suggestCustomers,
  searchCustomers,
  getSectionCustomers,
  deleteSectionCustomer,
  addSectionCustomer,
  SectionCustomer,
} from '@/lib/customer';
import { canAccessSectionCustomer } from '@/lib/permissions';
import { SortOrder, SelectedCustomer } from '@/lib/types';
import { PAGE_SIZE_OPTIONS } from '@/lib/utils';
import {
  sectionCustomerFormSchema,
  type SectionCustomerFormInput,
} from '@/schemas/sectionCustomerSchema';

/**
 * 部署別得意先メンテナンスページ
 * アクセス区分 00 または sales.orders.customer 権限を持つユーザーのみアクセス可能
 */
export default function SectionCustomerPage() {
  const { user, loading } = useAuthGuard({
    permissionChecker: canAccessSectionCustomer,
  });

  // メッセージダイアログ関連の状態
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messageTitle, setMessageTitle] = useState('');
  const [messageContent, setMessageContent] = useState('');

  // センター関連の状態
  const [centers, setCenters] = useState<Center[]>([]);
  const [centersLoading, setCentersLoading] = useState(true);

  // 一覧表示関連の状態
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'customer_cd' | 'customer_name' | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [sectionCustomers, setSectionCustomers] = useState<SectionCustomer[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [listLoading, setListLoading] = useState(false);

  // 削除確認ダイアログ関連の状態
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<SectionCustomer | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // 追加確認ダイアログ関連の状態
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  // React Hook Form のセットアップ（メインフォーム）
  const {
    register,
    setValue,
    watch,
    control,
    trigger,
    formState: { errors },
  } = useForm<SectionCustomerFormInput>({
    resolver: zodResolver(sectionCustomerFormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      center_id: '',
      customer: null,
    },
  });

  // 選択中のセンターID
  const selectedCenterId = watch('center_id');
  const selectedCustomer = watch('customer');

  // メッセージダイアログを表示
  const showMessageDialog = useCallback((title: string, message: string) => {
    setMessageTitle(title);
    setMessageContent(message);
    setMessageDialogOpen(true);
  }, []);

  // メッセージダイアログを閉じる
  const closeMessageDialog = useCallback(() => {
    setMessageDialogOpen(false);
  }, []);

  // センター一覧を取得
  useEffect(() => {
    const fetchCenters = async () => {
      if (!user) return;

      try {
        setCentersLoading(true);
        const response = await getCenters();
        if (response.success) {
          setCenters(response.centers);
          // 選択肢が1つの場合は自動選択
          if (response.centers.length === 1) {
            setValue('center_id', String(response.centers[0].department_id));
          }
        }
      } catch (error) {
        console.error('センター取得エラー:', error);
        showMessageDialog(
          '部署別得意先メンテナンス',
          'センターの取得に失敗しました。\n時間を空けて再度お試しください'
        );
      } finally {
        setCentersLoading(false);
      }
    };

    if (user && !loading) {
      fetchCenters();
    }
  }, [user, loading, setValue, showMessageDialog]);

  // センター変更時に得意先選択をクリア、ページをリセット
  useEffect(() => {
    setValue('customer', null);
    setCurrentPage(1);
    setSortField(null);
    setSortOrder('asc');
    // 一覧もクリア
    setSectionCustomers([]);
    setTotalCount(0);
    setTotalPages(0);
  }, [selectedCenterId, setValue]);

  // 部署別得意先一覧を取得
  const fetchSectionCustomers = useCallback(async () => {
    if (!selectedCenterId) return;

    try {
      setListLoading(true);
      const response = await getSectionCustomers(
        Number(selectedCenterId),
        currentPage,
        pageSize,
        sortField,
        sortOrder
      );
      if (response.success) {
        setSectionCustomers(response.customers);
        setTotalCount(response.total);
        setTotalPages(response.total_pages);
      }
    } catch (error) {
      console.error('部署別得意先一覧取得エラー:', error);
      showMessageDialog(
        '部署別得意先メンテナンス',
        '部署別得意先の取得に失敗しました。\n時間を空けて再度お試しください'
      );
    } finally {
      setListLoading(false);
    }
  }, [selectedCenterId, currentPage, pageSize, sortField, sortOrder, showMessageDialog]);

  // センター選択時・ページ変更時・ソート変更時に一覧を取得
  useEffect(() => {
    if (selectedCenterId) {
      fetchSectionCustomers();
    }
  }, [selectedCenterId, currentPage, pageSize, sortField, sortOrder, fetchSectionCustomers]);

  // 得意先サジェストAPI（センターIDを含む）
  const handleSuggest = useCallback(
    async (query: string) => {
      if (!selectedCenterId) {
        return { success: false, customers: [] };
      }
      return suggestCustomers(Number(selectedCenterId), query);
    },
    [selectedCenterId]
  );

  // 得意先検索API（センターIDを含む）
  const handleSearch = useCallback(
    async (customerCd?: string, customerName?: string) => {
      if (!selectedCenterId) {
        return { success: false, customers: [], message: 'センターが選択されていません' };
      }
      return searchCustomers(Number(selectedCenterId), customerCd, customerName);
    },
    [selectedCenterId]
  );

  // 得意先選択フィールドのエラーハンドラ
  const handleCustomerError = useCallback(
    (message: string) => {
      showMessageDialog('部署別得意先メンテナンス', message);
    },
    [showMessageDialog]
  );

  // ソート切り替え
  const handleSortToggle = useCallback(
    (field: 'customer_cd' | 'customer_name') => {
      if (sortField === field) {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(field);
        setSortOrder('asc');
      }
      setCurrentPage(1);
    },
    [sortField]
  );

  // ページ変更時
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // 表示件数変更時
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  }, []);

  // 削除ボタンクリック時
  const handleDeleteClick = useCallback((customer: SectionCustomer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  }, []);

  // 削除ダイアログキャンセル
  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogOpen(false);
    setCustomerToDelete(null);
  }, []);

  // 削除実行
  const handleDeleteConfirm = useCallback(async () => {
    if (!customerToDelete || !selectedCenterId) return;

    try {
      setDeleteLoading(true);
      const response = await deleteSectionCustomer(
        Number(selectedCenterId),
        customerToDelete.customer_id
      );

      if (response.success) {
        showMessageDialog('部署別得意先メンテナンス', '削除しました');
        // 一覧を再取得
        fetchSectionCustomers();
      } else {
        showMessageDialog(
          '部署別得意先メンテナンス',
          response.message || '削除に失敗しました。\n時間を空けて再度お試しください'
        );
      }
    } catch (error) {
      console.error('削除エラー:', error);
      showMessageDialog(
        '部署別得意先メンテナンス',
        '削除に失敗しました。\n時間を空けて再度お試しください'
      );
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
    }
  }, [customerToDelete, selectedCenterId, showMessageDialog, fetchSectionCustomers]);

  // 追加ボタンクリック時
  const handleAddClick = useCallback(async () => {
    // 得意先のバリデーションを実行
    const isValid = await trigger('customer');
    if (!isValid) {
      return;
    }
    setAddDialogOpen(true);
  }, [trigger]);

  // 追加ダイアログキャンセル
  const handleAddCancel = useCallback(() => {
    setAddDialogOpen(false);
  }, []);

  // 追加実行
  const handleAddConfirm = useCallback(async () => {
    if (!selectedCustomer || !selectedCenterId) return;

    try {
      setAddLoading(true);
      const response = await addSectionCustomer(
        Number(selectedCenterId),
        selectedCustomer.customer_id
      );

      if (response.success) {
        showMessageDialog('部署別得意先メンテナンス', '登録しました');
        // フォームをクリア
        setValue('customer', null);
        // 一覧を再取得
        fetchSectionCustomers();
      } else {
        showMessageDialog(
          '部署別得意先メンテナンス',
          response.message || '登録に失敗しました。\n時間を空けて再度お試しください'
        );
      }
    } catch (error) {
      console.error('追加エラー:', error);
      showMessageDialog(
        '部署別得意先メンテナンス',
        '登録に失敗しました。\n時間を空けて再度お試しください'
      );
    } finally {
      setAddLoading(false);
      setAddDialogOpen(false);
    }
  }, [selectedCustomer, selectedCenterId, showMessageDialog, setValue, fetchSectionCustomers]);

  // ローディング中
  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-120px)]">
        <Sidebar />
        <main className="flex-1 bg-gray-50 px-4 py-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-lg text-gray-600">読み込み中...</p>
          </div>
        </main>
      </div>
    );
  }

  // 未認証の場合
  if (!user) {
    return null;
  }

  // 権限チェック（リダイレクト処理中の表示防止）
  const canAccess = canAccessSectionCustomer(user.access_type, user.permissions || []);
  if (!canAccess) {
    return null;
  }

  // プルダウンが単一選択肢の場合は非活性
  const isCenterSelectDisabled = centers.length === 1;

  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      <Sidebar />
      <main className="flex-1 bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">部署別得意先メンテナンス</h1>

          {/* 登録フォームカード */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              {/* センター選択 */}
              <div>
                <label htmlFor="center-select" className="block text-sm font-medium text-gray-700">
                  センター
                </label>
                {centersLoading ? (
                  <p className="mt-1 text-sm text-gray-500">読み込み中...</p>
                ) : (
                  <>
                    <div className="relative mt-1 w-1/2">
                      <select
                        id="center-select"
                        {...register('center_id')}
                        disabled={isCenterSelectDisabled}
                        className={`block w-full appearance-none rounded-md border py-2 pl-3 pr-10 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                          errors.center_id
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        } ${isCenterSelectDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      >
                        {!isCenterSelectDisabled && <option value="">選択してください</option>}
                        {centers.map((center) => (
                          <option key={center.department_id} value={center.department_id}>
                            {center.department_name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500 sm:text-sm">▼</span>
                      </div>
                    </div>
                    {errors.center_id && (
                      <p className="mt-1 text-sm text-red-600">{errors.center_id.message}</p>
                    )}
                  </>
                )}
              </div>

              {/* 得意先入力 */}
              {selectedCenterId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">得意先</label>
                  <div className="mt-1 flex items-start gap-2">
                    <div className="w-1/2">
                      <Controller
                        name="customer"
                        control={control}
                        render={({ field }) => (
                          <CustomerSelectField
                            value={field.value}
                            onChange={(customer: SelectedCustomer | null) =>
                              field.onChange(customer)
                            }
                            suggestFn={handleSuggest}
                            searchFn={handleSearch}
                            onError={handleCustomerError}
                            error={errors.customer?.message}
                            id="customer-input"
                          />
                        )}
                      />
                      {errors.customer && (
                        <p className="mt-1 text-sm text-red-600">{errors.customer.message}</p>
                      )}
                    </div>
                    <div className="flex-1" />
                    <button
                      type="button"
                      onClick={handleAddClick}
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      追加
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 一覧表示カード */}
          {selectedCenterId && (
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              {/* ヘッダー */}
              <div className="mb-4 flex items-center justify-between">
                {/* 左側: 件数表示 */}
                <div className="text-sm text-gray-600">
                  {totalCount}件
                  {totalCount > 0 && (
                    <span className="ml-1">
                      ({(currentPage - 1) * pageSize + 1}-
                      {Math.min(currentPage * pageSize, totalCount)}件を表示中)
                    </span>
                  )}
                </div>

                {/* 右側: 表示件数選択 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">表示件数:</span>
                  <div className="relative">
                    <select
                      value={pageSize}
                      onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                      className="appearance-none rounded-md border border-gray-300 py-1 pl-3 pr-8 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {PAGE_SIZE_OPTIONS.map((size) => (
                        <option key={size} value={size}>
                          {size}件
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <span className="text-gray-500 text-xs">▼</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 一覧テーブル */}
              {listLoading ? (
                <div className="py-8 text-center text-sm text-gray-500">読み込み中...</div>
              ) : sectionCustomers.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  部署別得意先が登録されていません
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          className="cursor-pointer px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
                          onClick={() => handleSortToggle('customer_cd')}
                        >
                          <div className="flex items-center gap-1">
                            得意先コード
                            {sortField === 'customer_cd' && (
                              <span className="text-gray-400">
                                {sortOrder === 'asc' ? '▲' : '▼'}
                              </span>
                            )}
                          </div>
                        </th>
                        <th
                          className="cursor-pointer px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
                          onClick={() => handleSortToggle('customer_name')}
                        >
                          <div className="flex items-center gap-1">
                            得意先名
                            {sortField === 'customer_name' && (
                              <span className="text-gray-400">
                                {sortOrder === 'asc' ? '▲' : '▼'}
                              </span>
                            )}
                          </div>
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {sectionCustomers.map((customer) => (
                        <tr key={customer.customer_id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                            {customer.customer_cd}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            <TruncateWithTooltip
                              text={customer.customer_name}
                              maxWidth="max-w-48"
                            />
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteClick(customer)}
                              className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                              削除
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ページネーション */}
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          )}
          <PageFooter version="1.0.3" lastUpdated="2026/01/30" />
        </div>
      </main>

      {/* 削除確認ダイアログ */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="部署別得意先メンテナンス"
        message="選択したデータを削除します。よろしいですか？"
        confirmLabel="削除"
        cancelLabel="キャンセル"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleteLoading}
      />

      {/* 追加確認ダイアログ */}
      {addDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* オーバーレイ */}
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleAddCancel} />
          {/* ダイアログ */}
          <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-gray-900">部署別得意先メンテナンス</h2>
            <p className="mt-4 text-sm text-gray-600">
              選択した得意先を追加します。よろしいですか？
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleAddCancel}
                disabled={addLoading}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleAddConfirm}
                disabled={addLoading}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {addLoading ? '追加中...' : '追加'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* メッセージダイアログ */}
      <MessageDialog
        isOpen={messageDialogOpen}
        title={messageTitle}
        message={messageContent}
        onClose={closeMessageDialog}
      />
    </div>
  );
}
