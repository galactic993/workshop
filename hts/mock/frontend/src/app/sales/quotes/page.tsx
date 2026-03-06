'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import PageFooter from '@/components/layout/PageFooter';
import Sidebar from '@/components/layout/Sidebar';
import { QuotDetailModal } from '@/components/quotes/dialogs';
import QuotSearchForm from '@/components/quotes/QuotSearchForm';
import QuotTable from '@/components/quotes/QuotTable';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ErrorMessageList from '@/components/ui/ErrorMessageList';
import Form from '@/components/ui/Form';
import MessageDialog from '@/components/ui/MessageDialog';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useQuotDialogs } from '@/hooks/useQuotDialogs';
import { useQuotSearch } from '@/hooks/useQuotSearch';
import { canAccessQuots } from '@/lib/permissions';
import {
  suggestQuotCustomers,
  searchQuotCustomers,
  suggestQuotSubject,
  suggestProdName,
} from '@/lib/quot';

/**
 * 見積ページ
 * アクセス区分 00 または sales.quotes.* 権限を持つユーザーのみアクセス可能
 */
export default function QuotesPage() {
  const router = useRouter();
  const { user, loading } = useAuthGuard({
    permissionChecker: canAccessQuots,
  });
  // ダイアログエラー状態
  const [dialogErrors, setDialogErrors] = useState<string[]>([]);

  // ダイアログエラー設定（最新のエラーで置き換え）
  const setDialogError = useCallback((message: string) => {
    setDialogErrors([message]);
  }, []);

  // ダイアログエラークリア
  const clearDialogErrors = useCallback(() => {
    setDialogErrors([]);
  }, []);

  // メッセージダイアログ関連の状態
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messageTitle, setMessageTitle] = useState('');
  const [messageContent, setMessageContent] = useState('');

  // 成功メッセージダイアログを表示
  const showSuccessDialog = useCallback((title: string, message: string) => {
    setMessageTitle(title);
    setMessageContent(message);
    setMessageDialogOpen(true);
  }, []);

  // メッセージダイアログを閉じる
  const closeMessageDialog = useCallback(() => {
    setMessageDialogOpen(false);
  }, []);

  // 検索・一覧ロジック
  const {
    form,
    quotes,
    totalCount,
    totalPages,
    currentPage,
    pageSize,
    listLoading,
    sectionCdOptions,
    isSectionCdDisabled,
    sectionCdLoading,
    sortField,
    sortOrder,
    errors,
    addError,
    onSubmit,
    handlePageChange,
    handlePageSizeChange,
    handleSortToggle,
    handleClear,
    refetch,
  } = useQuotSearch({ user });

  // ダイアログ状態管理
  const dialogs = useQuotDialogs({
    refetch,
    onError: setDialogError,
    clearErrors: clearDialogErrors,
    onSuccess: showSuccessDialog,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors: formErrors },
  } = form;

  // 画面遷移確定
  const handleNavigateConfirm = () => {
    const quotId = dialogs.navigateDialog.quotId;
    dialogs.navigateDialog.confirm();
    if (quotId) {
      router.push(`/sales/quotes/${quotId}`);
    }
  };

  // 制作見積受取画面遷移確定
  const handleReceiveConfirm = async () => {
    const quotId = dialogs.receiveDialog.quotId;
    setDialogErrors([]); // 前回のエラーをクリア
    const success = await dialogs.receiveDialog.confirm();
    if (success && quotId) {
      router.push(`/sales/quotes/${quotId}`);
    }
  };

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
  const canAccess = canAccessQuots(user.access_type, user.permissions || []);
  if (!canAccess) {
    return null;
  }

  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      <Sidebar />
      <main className="flex-1 bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          {/* エラーメッセージ */}
          <ErrorMessageList messages={[...errors, ...dialogErrors]} className="mb-4" />

          {/* ヘッダー */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">見積</h1>
            <button
              type="button"
              onClick={() => dialogs.navigateDialog.open('new')}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              新規登録
            </button>
          </div>

          {/* 検索フォーム */}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <QuotSearchForm
              register={register}
              errors={formErrors}
              watch={watch}
              setValue={setValue}
              sectionCdOptions={sectionCdOptions}
              isSectionCdDisabled={isSectionCdDisabled}
              sectionCdLoading={sectionCdLoading}
              customerSuggestFn={suggestQuotCustomers}
              customerSearchFn={searchQuotCustomers}
              quotSubjectSuggestFn={suggestQuotSubject}
              prodNameSuggestFn={suggestProdName}
              onError={addError}
              onClear={handleClear}
            />
          </Form>

          {/* 一覧テーブル */}
          <QuotTable
            quotes={quotes}
            totalCount={totalCount}
            totalPages={totalPages}
            currentPage={currentPage}
            pageSize={pageSize}
            listLoading={listLoading}
            sortField={sortField}
            sortOrder={sortOrder}
            onSortToggle={handleSortToggle}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onQuotNumberClick={dialogs.detailModal.open}
            onSelectClick={(quoteId) => dialogs.navigateDialog.open(quoteId)}
            onReceiveClick={(quoteId) => dialogs.receiveDialog.open(quoteId)}
          />
          <PageFooter version="1.0.7" lastUpdated="2026/01/30" />
        </div>
      </main>

      {/* 承認確認ダイアログ */}
      <ConfirmDialog
        isOpen={dialogs.approveDialog.isOpen}
        title="見積"
        message="選択した見積を承認します。よろしいですか？"
        confirmLabel="承認"
        cancelLabel="キャンセル"
        onConfirm={dialogs.approveDialog.confirm}
        onCancel={dialogs.approveDialog.close}
        loading={dialogs.approveDialog.loading}
        zIndexClass="z-[60]"
      />

      {/* 承認取消確認ダイアログ */}
      <ConfirmDialog
        isOpen={dialogs.cancelApproveDialog.isOpen}
        title="見積"
        message="選択した見積を承認取消します。よろしいですか？"
        confirmLabel="承認取消"
        cancelLabel="キャンセル"
        confirmVariant="danger"
        onConfirm={dialogs.cancelApproveDialog.confirm}
        onCancel={dialogs.cancelApproveDialog.close}
        loading={dialogs.cancelApproveDialog.loading}
      />

      {/* 詳細情報モーダル */}
      <QuotDetailModal
        isOpen={dialogs.detailModal.isOpen}
        onClose={dialogs.detailModal.close}
        data={dialogs.detailModal.data}
        loading={dialogs.detailModal.loading}
      />

      {/* 見積更新確認ダイアログ */}
      <ConfirmDialog
        isOpen={dialogs.updateDialog.isOpen}
        title="見積"
        message="見積金額を更新します。よろしいですか？"
        confirmLabel="更新"
        cancelLabel="キャンセル"
        onConfirm={dialogs.updateDialog.confirm}
        onCancel={dialogs.updateDialog.close}
        loading={dialogs.updateDialog.loading}
        zIndexClass="z-[60]"
      />

      {/* 登録・更新画面遷移確認ダイアログ */}
      <ConfirmDialog
        isOpen={dialogs.navigateDialog.isOpen}
        title="見積"
        message="見積登録・更新画面へ移動します。よろしいですか？"
        confirmLabel="移動"
        cancelLabel="キャンセル"
        onConfirm={handleNavigateConfirm}
        onCancel={dialogs.navigateDialog.close}
      />

      {/* 制作見積受取画面遷移確認ダイアログ */}
      <ConfirmDialog
        isOpen={dialogs.receiveDialog.isOpen}
        title="見積"
        message={'制作見積を受け取り、見積登録・更新画面へ移動します。\nよろしいですか？'}
        confirmLabel="移動"
        cancelLabel="キャンセル"
        onConfirm={handleReceiveConfirm}
        onCancel={dialogs.receiveDialog.close}
        loading={dialogs.receiveDialog.loading}
      />

      {/* メッセージダイアログ（成功通知） */}
      <MessageDialog
        isOpen={messageDialogOpen}
        title={messageTitle}
        message={messageContent}
        onClose={closeMessageDialog}
      />
    </div>
  );
}
