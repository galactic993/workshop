'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import PageFooter from '@/components/layout/PageFooter';
import Sidebar from '@/components/layout/Sidebar';
import { QuotReuseModal, ReuseQuotData } from '@/components/quotes/dialogs';
import { ProdQuotOperationsDisplay } from '@/components/quotes/ProdQuotOperationsDisplay';
import { QuotActionButtons } from '@/components/quotes/QuotActionButtons';
import { QuotAmountForm } from '@/components/quotes/QuotAmountForm';
import QuotDetailForm from '@/components/quotes/QuotDetailForm';
import QuotHeaderInfo from '@/components/quotes/QuotHeaderInfo';
import { QuotOperationsForm } from '@/components/quotes/QuotOperationsForm';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Form from '@/components/ui/Form';
import MessageDialog from '@/components/ui/MessageDialog';
import TruncateWithTooltip from '@/components/ui/TruncateWithTooltip';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useQuotButtonState } from '@/hooks/useQuotButtonState';
import { useQuotDetailData } from '@/hooks/useQuotDetailData';
import { useQuotDetailDialogs } from '@/hooks/useQuotDetailDialogs';
import { useQuotDetailForm } from '@/hooks/useQuotDetailForm';
import { useQuotDetailProdRequest } from '@/hooks/useQuotDetailProdRequest';
import { useQuotDetailReuse } from '@/hooks/useQuotDetailReuse';
import { useQuotDetailWorkflow } from '@/hooks/useQuotDetailWorkflow';
import { useQuotFieldState } from '@/hooks/useQuotFieldState';
import { canAccessQuots, canApproveQuots } from '@/lib/permissions';
import {
  suggestQuotCustomersForCreate,
  searchQuotCustomersForCreate,
  suggestQuotCustomers,
  searchQuotCustomers,
  suggestQuotSubject,
  suggestProdName,
} from '@/lib/quot';
import { MISC_CUSTOMER_CD } from '@/schemas/quotCreateSchema';
import {
  quotRejectSchema,
  QuotRejectFormData,
  quotRejectDefaultValues,
} from '@/schemas/quotRejectSchema';

/**
 * 見積作成・更新ページ
 * /sales/quotes/new → 新規作成
 * /sales/quotes/{id} → 詳細・更新
 */
export default function QuotDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === 'new';

  const { user, loading } = useAuthGuard({
    permissionChecker: canAccessQuots,
  });

  // データ取得フック
  const {
    centers,
    centersLoading,
    detailData,
    detailLoading,
    refresh,
    showServerError,
    serverErrorDialogOpen,
    serverErrorMessage,
    closeServerError,
  } = useQuotDetailData({
    id,
    isNew,
    loading,
    user,
  });

  // フォーム状態管理フック
  const {
    createForm,
    quotAmountForm,
    selectedCustomer,
    setSelectedCustomer,
    handleCustomerChange,
    setServerValidationErrors,
  } = useQuotDetailForm({
    detailData,
    centers,
    isNew,
  });

  // isDirtyを購読するためにformStateをデストラクチャリング
  const { isDirty: isCreateFormDirty } = createForm.formState;
  const { isDirty: isQuotAmountFormDirty } = quotAmountForm.formState;

  // ダイアログ状態管理
  const dialogs = useQuotDetailDialogs();

  // 制作見積依頼ロジック
  const prodRequest = useQuotDetailProdRequest({
    detailData,
    dialogs,
    createForm,
    selectedCustomer,
    showServerError,
    refresh,
    router,
  });

  // 差戻しフォーム
  const rejectForm = useForm<QuotRejectFormData>({
    resolver: zodResolver(quotRejectSchema),
    defaultValues: quotRejectDefaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  // 承認権限チェック
  const canApprove = canApproveQuots(user?.access_type ?? null);

  // フィールド状態とボタン状態の管理
  // 作業部門別見積レコードが存在するか（制作見積または見積）
  const hasOperations =
    (detailData?.prod_quot_operations?.length ?? 0) > 0 ||
    (detailData?.quot_operations?.length ?? 0) > 0;
  // 見積作業部門レコードが存在するか（流用作成判定用）
  const hasQuotOperations = (detailData?.quot_operations?.length ?? 0) > 0;

  const fieldState = useQuotFieldState({
    quotStatus: detailData?.quot_status ?? null,
    prodQuotStatus: detailData?.prod_quot_status ?? null,
    isNew,
    hasOperations,
    hasQuotOperations,
  });

  const buttonState = useQuotButtonState({
    quotStatus: detailData?.quot_status ?? null,
    prodQuotStatus: detailData?.prod_quot_status ?? null,
    isNew,
    hasApprovePermission: canApprove,
  });

  // 流用作成機能フック
  const reuse = useQuotDetailReuse({
    createForm,
    quotAmountForm,
    fieldState,
    setSelectedCustomer,
  });

  // ワークフロー操作フック
  const workflow = useQuotDetailWorkflow({
    id,
    isNew,
    detailData,
    dialogs,
    createForm,
    quotAmountForm,
    selectedCustomer,
    reusedOperations: reuse.reusedOperations,
    baseQuotId: reuse.baseQuotId,
    centers,
    prodRequestCenterId: prodRequest.prodRequestCenterId,
    prodRequestCenterName: prodRequest.prodRequestCenterName,
    prodRequestQuotNumber: prodRequest.prodRequestQuotNumber,
    setProdRequestCenterId: prodRequest.setProdRequestCenterId,
    setProdRequestCenterName: prodRequest.setProdRequestCenterName,
    setProdRequestQuotNumber: prodRequest.setProdRequestQuotNumber,
    showServerError,
    setServerValidationErrors,
    refresh,
    router,
    isCreateFormDirty,
    isQuotAmountFormDirty,
  });

  // 制作見積依頼ボタンの活性条件を詳細にチェック
  const canRequestProdQuotActual = useMemo(() => {
    if (!buttonState.canRequestProdQuot || isNew) return false;
    if (!detailData) return false;

    // 必須項目がすべて入力されているかチェック
    const hasAllRequiredFields = !!(
      detailData.quot_subject &&
      detailData.prod_name &&
      detailData.quot_summary &&
      detailData.center_id
    );

    return hasAllRequiredFields;
  }, [buttonState.canRequestProdQuot, isNew, detailData]);

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

  // 未認証または権限なしの場合（useAuthGuardでリダイレクト処理中）
  if (!user) {
    return null;
  }

  // 詳細・更新表示
  if (!isNew && detailLoading) {
    return (
      <div className="flex min-h-[calc(100vh-120px)]">
        <Sidebar />
        <main className="flex-1 bg-gray-50 px-4 py-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!isNew && !detailData) {
    return (
      <div className="flex min-h-[calc(100vh-120px)]">
        <Sidebar />
        <main className="flex-1 bg-gray-50 px-4 py-8">
          <div className="mx-auto max-w-7xl">
            <p className="py-8 text-center text-sm text-gray-500">データを取得できませんでした</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      <Sidebar />
      <main className="flex-1 bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          {/* ヘッダー */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">見積 - 作成・更新</h1>
            {fieldState.showReuseButton && (
              <button
                type="button"
                onClick={reuse.handleReuseModalOpen}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                流用作成
              </button>
            )}
          </div>

          {/* フォーム */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            {/* ヘッダー情報（部署、担当者、見積書No、ステータス） */}
            <QuotHeaderInfo
              sectionCd={isNew ? (user?.section_cd ?? '') : (detailData?.section_cd ?? '')}
              sectionName={isNew ? (user?.section_name ?? '') : (detailData?.section_name ?? '')}
              employeeName={isNew ? (user?.employee_name ?? '') : (detailData?.employee_name ?? '')}
              quotNumber={isNew ? null : (detailData?.quot_number ?? null)}
              quotOn={isNew ? null : (detailData?.quot_on ?? null)}
              quotStatusLabel={isNew ? null : (detailData?.status_label ?? null)}
              prodQuotStatusLabel={isNew ? null : (detailData?.prod_quot_status_label ?? null)}
              quotResultLabel={isNew ? null : (detailData?.quot_result_label ?? null)}
            />

            {/* 基本情報フォーム（常に表示、活性/非活性で制御） */}
            <QuotDetailForm
              form={createForm}
              selectedCustomer={selectedCustomer}
              onCustomerChange={handleCustomerChange}
              suggestCustomersFn={suggestQuotCustomersForCreate}
              searchCustomersFn={searchQuotCustomersForCreate}
              centers={centers}
              centersLoading={centersLoading}
              onError={showServerError}
              fieldState={fieldState}
            />

            {/* 流用元の作業部門別見積（流用作成時のみ表示） */}
            {reuse.baseQuotId !== null &&
              (reuse.reusedOperations.length > 0 ? (
                <QuotAmountForm
                  quotOperations={reuse.reusedOperations}
                  form={quotAmountForm}
                  isEditable={true}
                  title="【作業部門別見積（流用元）】"
                />
              ) : (
                <div className="mt-6">
                  <span className="block text-sm font-medium text-gray-700">
                    【作業部門別見積（流用元）】
                  </span>
                  <p className="mt-2 text-sm text-gray-500">
                    流用元の見積に作業部門別見積データがありません
                  </p>
                </div>
              ))}

            {/* 【制作見積】エリア：制作見積作業部門データがある場合のみ表示（読み取り専用） */}
            {!isNew && detailData && detailData.prod_quot_operations?.length > 0 && (
              <ProdQuotOperationsDisplay
                prodQuotOperations={detailData.prod_quot_operations}
                title="【制作見積】"
              />
            )}

            {/* 【見積】エリア：見積作業部門データがある場合、または制作見積から新規作成する場合 */}
            {!isNew &&
              detailData &&
              (detailData.quot_operations?.length > 0 ||
                (detailData.prod_quot_operations?.length > 0 && fieldState.isAmountEditable)) && (
                <QuotOperationsForm
                  prodQuotOperations={detailData.prod_quot_operations}
                  quotOperations={detailData.quot_operations}
                  form={quotAmountForm}
                  isEditable={fieldState.isAmountEditable}
                  title="【見積】"
                />
              )}

            {/* フッターボタン */}
            <QuotActionButtons
              quotStatus={isNew ? null : (detailData?.quot_status ?? null)}
              prodQuotStatus={isNew ? null : (detailData?.prod_quot_status ?? null)}
              isNew={isNew}
              hasApprovePermission={canApprove}
              canRequestProdQuotOverride={canRequestProdQuotActual}
              hasQuotOperations={hasQuotOperations}
              handlers={{
                onBack: workflow.handleBack,
                onCreate: workflow.handleCreateClick,
                onUpdate: workflow.handleStatus00UpdateClick,
                onRegisterDraft: workflow.handleStatus00RegisterClick,
                onDelete: workflow.handleDeleteClick,
                onRequestProdQuot: prodRequest.handleStatus00ProductionClick,
                onRegister: workflow.handleQuotRegisterClick,
                onReject: workflow.handleRejectClick,
                onCancelRegister: workflow.handleCancelRegisterClick,
                onUpdateAmount: workflow.handleQuotUpdateClick,
                onApprove: workflow.handleApproveClick,
                onIssue: workflow.handleIssueClick,
                onCancelApprove: workflow.handleCancelApproveClick,
                onUpdateIssued: workflow.handleStatus60UpdateClick,
                onReissue: workflow.handleReissueClick,
              }}
              loading={{
                updating:
                  dialogs.status00UpdateLoading ||
                  dialogs.quotUpdateLoading ||
                  dialogs.status60UpdateLoading,
                deleting: dialogs.deleteLoading,
                approving: dialogs.approveLoading,
                issuing: dialogs.issueLoading || dialogs.reissueLoading,
                registering: dialogs.status00RegisterLoading,
              }}
              formDirtyStates={{
                createFormDirty: isCreateFormDirty,
                quotAmountFormDirty: isQuotAmountFormDirty,
              }}
            />
          </div>
          <PageFooter version="1.0.6" lastUpdated="2026/01/30" />
        </div>
      </main>

      {/* 作成確認ダイアログ */}
      <ConfirmDialog
        isOpen={dialogs.createConfirmDialogOpen}
        title="見積 - 作成・更新"
        message="見積情報を作成します。よろしいですか？"
        confirmLabel="作成"
        cancelLabel="キャンセル"
        onConfirm={workflow.handleCreateConfirm}
        onCancel={() => dialogs.setCreateConfirmDialogOpen(false)}
        loading={dialogs.createLoading}
      />

      {/* 作成成功ダイアログ */}
      <MessageDialog
        isOpen={dialogs.createSuccessDialogOpen}
        title="見積 - 作成・更新"
        message="見積を作成しました"
        onClose={workflow.handleCreateSuccessClose}
      />

      {/* 制作見積依頼確認ダイアログ */}
      <ConfirmDialog
        isOpen={dialogs.prodRequestConfirmDialogOpen}
        title="見積 - 作成・更新"
        message={'見積を作成しました。\n続けて制作見積依頼を行いますか？'}
        confirmLabel="はい"
        cancelLabel="閉じる"
        onConfirm={prodRequest.handleProdRequestConfirm}
        onCancel={prodRequest.handleProdRequestConfirmClose}
      />

      {/* 制作見積依頼モーダル（プレースホルダー） */}
      {dialogs.prodRequestModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="text-lg font-semibold">制作見積依頼</h2>
              <button
                onClick={() => {
                  dialogs.setProdRequestModalOpen(false);
                  // 新規作成時のみ遷移（作成中の場合は現在のページに留まる）
                  if (dialogs.createdQuotId) {
                    router.push(`/sales/quotes/${dialogs.createdQuotId}`);
                  }
                  refresh();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* 主管センター・送信先（同じ行） */}
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                <div className="flex items-center">
                  <span className="font-medium text-gray-700">【主管センター】</span>
                  <span className="ml-2">{prodRequest.prodRequestCenterName || '-'}</span>
                </div>
                <div className="flex items-center flex-wrap">
                  <span className="font-medium text-gray-700">【送信先】</span>
                  {prodRequest.prodRequestManagersLoading ? (
                    <span className="ml-2 text-gray-500">読み込み中...</span>
                  ) : prodRequest.prodRequestManagers.length > 0 ? (
                    <span className="ml-2">
                      {prodRequest.prodRequestManagers.map((manager, index) => (
                        <span key={manager.employee_id}>
                          {manager.employee_name}
                          {index < prodRequest.prodRequestManagers.length - 1 && '、'}
                        </span>
                      ))}
                    </span>
                  ) : (
                    <span className="ml-2 text-gray-500">送信先が見つかりません</span>
                  )}
                </div>
              </div>

              {/* 伝達事項入力欄 */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">【伝達事項】</label>
                <textarea
                  value={prodRequest.prodRequestMessage}
                  onChange={(e) => prodRequest.setProdRequestMessage(e.target.value)}
                  rows={3}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              {/* 依頼内容（本文プレビュー） */}
              <div>
                <span className="font-medium text-gray-700">【依頼内容】</span>
                <div className="mt-2 p-4 bg-gray-50 rounded border text-sm whitespace-pre-wrap">
                  {(() => {
                    const formData = createForm.getValues();
                    const customerCd = selectedCustomer?.customer_cd || '';
                    const customerName =
                      customerCd === MISC_CUSTOMER_CD
                        ? formData.customer_name || '諸口'
                        : selectedCustomer?.customer_name || '';
                    const referenceDocPath = formData.reference_doc_path;

                    return `以下の内容にて制作見積をお願いします

【見積書No】 ${prodRequest.prodRequestQuotNumber}
【担当部署】 ${user?.section_cd ?? ''} ${user?.section_name ?? ''}
【得意先】 ${customerCd} ${customerName}
【見積件名】 ${formData.quot_subject || ''}
【品名】 ${formData.prod_name || ''}
【見積概要】
${formData.quot_summary || ''}
【参考資料】 ${referenceDocPath || '参考資料は未登録です'}
【伝達事項】
${prodRequest.prodRequestMessage || '伝達事項はありません'}`;
                  })()}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-4 py-3 border-t">
              <button
                onClick={() => {
                  dialogs.setProdRequestModalOpen(false);
                  if (dialogs.createdQuotId) {
                    router.push(`/sales/quotes/${dialogs.createdQuotId}`);
                  }
                  refresh();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                キャンセル
              </button>
              <button
                onClick={prodRequest.handleProdRequestExecClick}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                制作見積依頼
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 制作見積依頼実行確認ダイアログ */}
      <ConfirmDialog
        isOpen={dialogs.prodRequestExecDialogOpen}
        title="制作見積依頼"
        message="制作見積依頼を行います。よろしいですか？"
        confirmLabel="制作見積依頼"
        cancelLabel="キャンセル"
        onConfirm={prodRequest.handleProdRequestExecConfirm}
        onCancel={() => dialogs.setProdRequestExecDialogOpen(false)}
        loading={dialogs.prodRequestExecLoading}
        zIndexClass="z-[60]"
      />

      {/* 制作見積依頼成功ダイアログ */}
      <MessageDialog
        isOpen={dialogs.prodRequestSuccessDialogOpen}
        title="制作見積依頼"
        message="制作見積依頼を行いました"
        closeLabel="閉じる"
        onClose={prodRequest.handleProdRequestSuccessClose}
        zIndexClass="z-[60]"
      />

      {/* ステータス00更新確認ダイアログ（一時保存） */}
      <ConfirmDialog
        isOpen={dialogs.status00UpdateDialogOpen}
        title="見積 - 作成・更新"
        message="見積情報を一時保存します。よろしいですか？"
        confirmLabel="一時保存"
        cancelLabel="キャンセル"
        onConfirm={workflow.handleStatus00UpdateConfirm}
        onCancel={() => dialogs.setStatus00UpdateDialogOpen(false)}
        loading={dialogs.status00UpdateLoading}
      />

      {/* ステータス00更新成功ダイアログ */}
      <MessageDialog
        isOpen={dialogs.status00UpdateSuccessDialogOpen}
        title="見積 - 作成・更新"
        message="見積を一時保存しました"
        onClose={workflow.handleStatus00UpdateSuccessClose}
      />

      {/* ステータス00登録確認ダイアログ */}
      <ConfirmDialog
        isOpen={dialogs.status00RegisterDialogOpen}
        title="見積 - 作成・更新"
        message="見積を登録します。よろしいですか？"
        confirmLabel="登録"
        cancelLabel="キャンセル"
        onConfirm={workflow.handleStatus00RegisterConfirm}
        onCancel={() => dialogs.setStatus00RegisterDialogOpen(false)}
        loading={dialogs.status00RegisterLoading}
      />

      {/* ステータス00登録成功ダイアログ */}
      <MessageDialog
        isOpen={dialogs.status00RegisterSuccessDialogOpen}
        title="見積 - 作成・更新"
        message="見積を登録しました"
        onClose={workflow.handleStatus00RegisterSuccessClose}
      />

      {/* ステータス60更新確認ダイアログ */}
      <ConfirmDialog
        isOpen={dialogs.status60UpdateDialogOpen}
        title="見積 - 作成・更新"
        message="見積情報を更新します。よろしいですか？"
        confirmLabel="更新"
        cancelLabel="キャンセル"
        onConfirm={workflow.handleStatus60UpdateConfirm}
        onCancel={() => dialogs.setStatus60UpdateDialogOpen(false)}
        loading={dialogs.status60UpdateLoading}
      />

      {/* 承認確認ダイアログ */}
      <ConfirmDialog
        isOpen={dialogs.approveDialogOpen}
        title="見積"
        message="表示中の見積を承認します。よろしいですか？"
        confirmLabel="承認"
        cancelLabel="キャンセル"
        onConfirm={workflow.handleApproveConfirm}
        onCancel={() => dialogs.setApproveDialogOpen(false)}
        loading={dialogs.approveLoading}
      />

      {/* 承認取消確認ダイアログ */}
      <ConfirmDialog
        isOpen={dialogs.cancelApproveDialogOpen}
        title="見積 - 作成・更新"
        message="表示中の見積を承認取消します。よろしいですか？"
        confirmLabel="承認取消"
        cancelLabel="キャンセル"
        confirmVariant="danger"
        onConfirm={workflow.handleCancelApproveConfirm}
        onCancel={() => dialogs.setCancelApproveDialogOpen(false)}
        loading={dialogs.approveLoading}
      />

      {/* 発行確認ダイアログ */}
      <ConfirmDialog
        isOpen={dialogs.issueDialogOpen}
        title="見積 - 作成・更新"
        message="見積書を発行します。よろしいですか？"
        confirmLabel="発行"
        cancelLabel="キャンセル"
        onConfirm={workflow.handleIssueConfirm}
        onCancel={() => dialogs.setIssueDialogOpen(false)}
        loading={dialogs.issueLoading}
      />

      {/* 再発行確認ダイアログ */}
      <ConfirmDialog
        isOpen={dialogs.reissueDialogOpen}
        title="見積 - 作成・更新"
        message="見積書を再発行します。よろしいですか？"
        confirmLabel="再発行"
        cancelLabel="キャンセル"
        onConfirm={workflow.handleReissueConfirm}
        onCancel={() => dialogs.setReissueDialogOpen(false)}
        loading={dialogs.reissueLoading}
      />

      {/* 登録取消確認ダイアログ */}
      <ConfirmDialog
        isOpen={dialogs.cancelRegisterDialogOpen}
        title="見積 - 作成・更新"
        message="見積の登録を取り消します。よろしいですか？"
        confirmLabel="登録取消"
        cancelLabel="キャンセル"
        onConfirm={workflow.handleCancelRegisterConfirm}
        onCancel={() => dialogs.setCancelRegisterDialogOpen(false)}
        loading={dialogs.cancelRegisterLoading}
      />

      {/* 登録取消成功ダイアログ */}
      <MessageDialog
        isOpen={dialogs.cancelRegisterSuccessDialogOpen}
        title="見積 - 作成・更新"
        message="見積の登録を取り消しました"
        onClose={workflow.handleCancelRegisterSuccessClose}
      />

      {/* 差戻し成功ダイアログ */}
      <MessageDialog
        isOpen={dialogs.rejectSuccessDialogOpen}
        title="見積 - 作成・更新"
        message="差し戻しを行いました"
        onClose={workflow.handleRejectSuccessClose}
      />

      {/* 見積登録確認ダイアログ */}
      <ConfirmDialog
        isOpen={dialogs.productionRegisterDialogOpen}
        title="見積"
        message="入力した見積金額を登録します。よろしいですか？"
        confirmLabel="登録"
        cancelLabel="キャンセル"
        onConfirm={workflow.handleQuotRegisterConfirm}
        onCancel={workflow.handleQuotRegisterCancel}
        loading={dialogs.productionRegisterLoading}
      />

      {/* 見積登録成功ダイアログ */}
      <MessageDialog
        isOpen={dialogs.productionRegisterSuccessDialogOpen}
        title="見積 - 作成・更新"
        message="見積を登録しました"
        onClose={workflow.handleProductionRegisterSuccessClose}
      />

      {/* 承認成功ダイアログ */}
      <MessageDialog
        isOpen={dialogs.approveSuccessDialogOpen}
        title="見積 - 作成・更新"
        message="承認しました"
        onClose={workflow.handleApproveSuccessClose}
      />

      {/* 承認取消成功ダイアログ */}
      <MessageDialog
        isOpen={dialogs.cancelApproveSuccessDialogOpen}
        title="見積 - 作成・更新"
        message="承認を取り消しました"
        onClose={workflow.handleCancelApproveSuccessClose}
      />

      {/* 発行成功ダイアログ */}
      <MessageDialog
        isOpen={dialogs.issueSuccessDialogOpen}
        title="見積 - 作成・更新"
        message="見積書を発行しました"
        onClose={workflow.handleIssueSuccessClose}
      />

      {/* 再発行成功ダイアログ */}
      <MessageDialog
        isOpen={dialogs.reissueSuccessDialogOpen}
        title="見積 - 作成・更新"
        message="見積書を再発行しました"
        onClose={workflow.handleReissueSuccessClose}
      />

      {/* ステータス60更新成功ダイアログ */}
      <MessageDialog
        isOpen={dialogs.status60UpdateSuccessDialogOpen}
        title="見積 - 作成・更新"
        message="更新しました"
        onClose={workflow.handleStatus60UpdateSuccessClose}
      />

      {/* 削除成功ダイアログ */}
      <MessageDialog
        isOpen={dialogs.deleteSuccessDialogOpen}
        title="見積 - 作成・更新"
        message="削除しました"
        onClose={workflow.handleDeleteSuccessClose}
      />

      {/* 見積更新確認ダイアログ */}
      <ConfirmDialog
        isOpen={dialogs.quotUpdateDialogOpen}
        title="見積 - 作成・更新"
        message="見積を更新します。よろしいですか？"
        confirmLabel="更新"
        cancelLabel="キャンセル"
        onConfirm={workflow.handleQuotUpdateConfirm}
        onCancel={workflow.handleQuotUpdateCancel}
        loading={dialogs.quotUpdateLoading}
      />

      {/* 見積更新成功ダイアログ */}
      <MessageDialog
        isOpen={dialogs.quotUpdateSuccessDialogOpen}
        title="見積 - 作成・更新"
        message="見積を更新しました"
        onClose={workflow.handleQuotUpdateSuccessClose}
      />

      {/* 削除確認ダイアログ */}
      <ConfirmDialog
        isOpen={dialogs.deleteDialogOpen}
        title="見積 - 作成・更新"
        message="見積を削除します。よろしいですか？"
        confirmLabel="削除"
        cancelLabel="キャンセル"
        confirmVariant="danger"
        onConfirm={workflow.handleDeleteConfirm}
        onCancel={() => dialogs.setDeleteDialogOpen(false)}
        loading={dialogs.deleteLoading}
      />

      {/* 戻る確認ダイアログ */}
      <ConfirmDialog
        isOpen={dialogs.backConfirmDialogOpen}
        title="見積 - 作成・更新"
        message="変更した内容は破棄されます。よろしいですか？"
        confirmLabel="戻る"
        cancelLabel="キャンセル"
        onConfirm={workflow.handleBackConfirm}
        onCancel={() => dialogs.setBackConfirmDialogOpen(false)}
      />

      {/* 差戻しダイアログ */}
      {dialogs.rejectDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => {
              workflow.handleRejectCancel();
              rejectForm.reset();
            }}
            aria-hidden="true"
          />
          <div
            className="relative z-10 w-full max-w-md rounded-lg bg-white shadow-xl"
            role="dialog"
            aria-modal="true"
          >
            <Form
              onSubmit={rejectForm.handleSubmit((data) => {
                workflow.handleRejectConfirm(data);
                rejectForm.reset();
              })}
            >
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">見積</h2>
              </div>
              <div className="px-6 py-4">
                <div className="mb-4">
                  <label
                    htmlFor="remand_reason"
                    className="block text-sm font-medium text-gray-700"
                  >
                    差戻し理由<span className="ml-1 text-red-500">*</span>
                  </label>
                  <textarea
                    id="remand_reason"
                    rows={3}
                    {...rejectForm.register('remand_reason')}
                    className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                      rejectForm.formState.errors.remand_reason
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  {rejectForm.formState.errors.remand_reason && (
                    <p className="mt-1 text-sm text-red-600">
                      {rejectForm.formState.errors.remand_reason.message}
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-600">制作見積を差戻します。よろしいですか？</p>
              </div>
              <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
                <button
                  type="button"
                  onClick={() => {
                    workflow.handleRejectCancel();
                    rejectForm.reset();
                  }}
                  disabled={dialogs.rejectLoading}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={dialogs.rejectLoading}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
                >
                  {dialogs.rejectLoading ? '処理中...' : '差戻し'}
                </button>
              </div>
            </Form>
          </div>
        </div>
      )}

      {/* 流用データ上書き確認ダイアログ */}
      <ConfirmDialog
        isOpen={reuse.reuseOverwriteConfirmOpen}
        title="流用作成"
        message="既に流用元のデータがあります。上書きしますか？"
        confirmLabel="上書き"
        cancelLabel="キャンセル"
        onConfirm={reuse.handleReuseOverwriteConfirm}
        onCancel={reuse.handleReuseOverwriteCancel}
      />

      {/* 流用作成モーダル */}
      <QuotReuseModal
        isOpen={reuse.reuseModalOpen}
        onClose={() => reuse.setReuseModalOpen(false)}
        sectionCd={user?.section_cd ?? ''}
        onSelect={reuse.applyReuseData}
        customerSuggestFn={suggestQuotCustomers}
        customerSearchFn={searchQuotCustomers}
        quotSubjectSuggestFn={suggestQuotSubject}
        prodNameSuggestFn={suggestProdName}
        onError={showServerError}
      />

      {/* サーバーエラーダイアログ */}
      <MessageDialog
        isOpen={serverErrorDialogOpen}
        title="エラー"
        message={serverErrorMessage}
        onClose={closeServerError}
      />
    </div>
  );
}
