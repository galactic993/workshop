import { UseFormReturn } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
  QuotDetail,
  QuotCustomerSuggestion,
  createQuot,
  approveQuot,
  cancelApproveQuot,
  updateQuot,
  deleteQuot,
  rejectQuot,
  registerDraftQuot,
  registerQuot,
  cancelRegisterQuot,
  updateQuotAmounts,
  issueQuot,
  reissueQuot,
  updateQuotStatus60,
} from '@/lib/quot';
import { QuotAmountFormData } from '@/schemas/quotAmountSchema';
import { QuotCreateFormData, MISC_CUSTOMER_CD } from '@/schemas/quotCreateSchema';
import { QuotRejectFormData } from '@/schemas/quotRejectSchema';
import { UseQuotDetailDialogsReturn } from './useQuotDetailDialogs';
import { QuotOperationWithEditable } from './useQuotDetailReuse';

interface UseQuotDetailWorkflowOptions {
  id: string;
  isNew: boolean;
  detailData: QuotDetail | null;
  dialogs: UseQuotDetailDialogsReturn;
  createForm: UseFormReturn<QuotCreateFormData>;
  quotAmountForm: UseFormReturn<QuotAmountFormData>;
  selectedCustomer: QuotCustomerSuggestion | null;
  reusedOperations: QuotOperationWithEditable[];
  baseQuotId: number | null;
  centers: { department_id: number; department_name: string }[];
  prodRequestCenterId: number | null;
  prodRequestCenterName: string;
  prodRequestQuotNumber: string;
  setProdRequestCenterId: (id: number | null) => void;
  setProdRequestCenterName: (name: string) => void;
  setProdRequestQuotNumber: (number: string) => void;
  showServerError: (message: string) => void;
  setServerValidationErrors: (errors: Record<string, string[]>) => boolean;
  refresh: () => void;
  router: ReturnType<typeof useRouter>;
  isCreateFormDirty: boolean;
  isQuotAmountFormDirty: boolean;
}

export interface UseQuotDetailWorkflowReturn {
  handleBack: () => void;
  handleBackConfirm: () => void;
  handleCreateClick: () => Promise<void>;
  handleCreateConfirm: () => Promise<void>;
  handleCreateSuccessClose: () => void;
  handleQuotUpdateClick: () => Promise<void>;
  handleQuotUpdateConfirm: () => Promise<void>;
  handleQuotUpdateCancel: () => void;
  handleQuotUpdateSuccessClose: () => void;
  handleApproveClick: () => void;
  handleApproveConfirm: () => Promise<void>;
  handleApproveSuccessClose: () => void;
  handleCancelApproveClick: () => void;
  handleCancelApproveConfirm: () => Promise<void>;
  handleCancelApproveSuccessClose: () => void;
  handleIssueClick: () => void;
  handleIssueConfirm: () => Promise<void>;
  handleIssueSuccessClose: () => void;
  handleReissueClick: () => void;
  handleReissueConfirm: () => Promise<void>;
  handleReissueSuccessClose: () => void;
  handleRejectClick: () => void;
  handleRejectConfirm: (data: QuotRejectFormData) => Promise<void>;
  handleRejectSuccessClose: () => void;
  handleRejectCancel: () => void;
  handleQuotRegisterClick: () => Promise<void>;
  handleQuotRegisterConfirm: () => Promise<void>;
  handleProductionRegisterSuccessClose: () => void;
  handleQuotRegisterCancel: () => void;
  handleCancelRegisterClick: () => void;
  handleCancelRegisterConfirm: () => Promise<void>;
  handleCancelRegisterSuccessClose: () => void;
  handleStatus00UpdateClick: () => Promise<void>;
  handleStatus00UpdateConfirm: () => Promise<void>;
  handleStatus00UpdateSuccessClose: () => void;
  handleStatus00RegisterClick: () => void;
  handleStatus00RegisterConfirm: () => Promise<void>;
  handleStatus00RegisterSuccessClose: () => void;
  handleStatus60UpdateClick: () => Promise<void>;
  handleStatus60UpdateConfirm: () => Promise<void>;
  handleStatus60UpdateSuccessClose: () => void;
  handleDeleteClick: () => void;
  handleDeleteConfirm: () => Promise<void>;
  handleDeleteSuccessClose: () => void;
}

/**
 * 見積詳細のワークフロー操作ロジックを管理するフック
 */
export function useQuotDetailWorkflow(
  options: UseQuotDetailWorkflowOptions
): UseQuotDetailWorkflowReturn {
  const {
    id,
    isNew,
    detailData,
    dialogs,
    createForm,
    quotAmountForm,
    selectedCustomer,
    reusedOperations,
    baseQuotId,
    centers,
    prodRequestCenterId,
    prodRequestCenterName,
    prodRequestQuotNumber,
    setProdRequestCenterId,
    setProdRequestCenterName,
    setProdRequestQuotNumber,
    showServerError,
    setServerValidationErrors,
    refresh,
    router,
    isCreateFormDirty,
    isQuotAmountFormDirty,
  } = options;

  // 一覧に戻る
  const handleBack = () => {
    // 未保存の変更があるか確認
    const hasUnsavedChanges = isCreateFormDirty || isQuotAmountFormDirty;

    if (hasUnsavedChanges) {
      dialogs.setBackConfirmDialogOpen(true);
    } else {
      router.push('/sales/quotes');
    }
  };

  // 戻る確認ダイアログで「戻る」を選択した場合
  const handleBackConfirm = () => {
    dialogs.setBackConfirmDialogOpen(false);
    router.push('/sales/quotes');
  };

  // 作成ボタンクリック（確認ダイアログを開く）
  const handleCreateClick = async () => {
    const isValid = await createForm.trigger();

    // 主管センターの選択肢バリデーション（trigger後に実行してエラーを追加）
    const formValues = createForm.getValues();
    let hasCenterError = false;
    if (formValues.center_id != null) {
      const isValidCenter = centers.some((center) => center.department_id === formValues.center_id);
      if (!isValidCenter) {
        createForm.setError('center_id', {
          type: 'custom',
          message: '有効な値を選択してください',
        });
        hasCenterError = true;
      }
    }

    if (!isValid || hasCenterError) return;
    dialogs.setCreateConfirmDialogOpen(true);
  };

  // 作成確定ハンドラ
  const handleCreateConfirm = async () => {
    const formData = createForm.getValues();
    dialogs.setCreateLoading(true);

    // 流用作成時は作業部門別見積データも送信
    const operations =
      reusedOperations.length > 0
        ? reusedOperations.map((op, index) => ({
            operation_id: op.operation_id,
            cost: op.cost,
            quot_amount: quotAmountForm.getValues().amounts[index]?.quot_amount ?? 0,
          }))
        : undefined;

    const response = await createQuot({
      prod_name: formData.prod_name,
      customer_id: formData.customer_id ?? undefined,
      customer_name: formData.customer_cd === MISC_CUSTOMER_CD ? formData.customer_name : undefined,
      quot_subject: formData.quot_subject,
      quot_summary: formData.quot_summary,
      message: formData.message,
      reference_doc_path: formData.reference_doc_path || undefined,
      center_id: formData.center_id ?? undefined,
      submission_method: formData.submission_method,
      base_quot_id: baseQuotId ?? undefined,
      operations,
    });

    dialogs.setCreateLoading(false);

    if (response.success) {
      dialogs.setCreateConfirmDialogOpen(false);
      // 作成成功ダイアログを表示
      if (response.quot_id) {
        dialogs.setCreatedQuotId(response.quot_id);
        // 必須項目が全て入力されている場合は制作見積依頼確認ダイアログを表示
        const hasAllRequiredFields = !!(
          formData.quot_subject &&
          formData.prod_name &&
          formData.quot_summary &&
          formData.center_id
        );
        if (hasAllRequiredFields) {
          // 見積情報を保存（制作見積依頼モーダル用）
          setProdRequestCenterId(formData.center_id ?? null);
          const selectedCenter = centers.find((c) => c.department_id === formData.center_id);
          setProdRequestCenterName(selectedCenter?.department_name || '');
          setProdRequestQuotNumber(response.quot_number || '');
          dialogs.setProdRequestConfirmDialogOpen(true);
        } else {
          dialogs.setCreateSuccessDialogOpen(true);
        }
      }
    } else {
      // ダイアログを閉じてエラーを表示
      dialogs.setCreateConfirmDialogOpen(false);
      // フィールド別エラーをフォームにセット
      if (response.errors) {
        setServerValidationErrors(response.errors);
      }
      // 一般エラーをダイアログに表示
      showServerError('見積の作成に失敗しました。時間を空けて再度お試しください');
    }
  };

  // 作成成功ダイアログを閉じるハンドラ
  const handleCreateSuccessClose = () => {
    dialogs.setCreateSuccessDialogOpen(false);
    // 登録したデータの作成・更新画面へ遷移
    if (dialogs.createdQuotId) {
      router.push(`/sales/quotes/${dialogs.createdQuotId}`);
    }
    refresh();
  };

  // 差戻しボタンクリック
  const handleRejectClick = () => {
    dialogs.setRejectDialogOpen(true);
  };

  // 差戻し確定ハンドラ
  const handleRejectConfirm = async (data: QuotRejectFormData) => {
    if (!detailData) return;

    dialogs.setRejectLoading(true);
    const response = await rejectQuot(detailData.quot_id, data.remand_reason);
    dialogs.setRejectLoading(false);

    if (response.success) {
      dialogs.setRejectDialogOpen(false);
      dialogs.setRejectSuccessDialogOpen(true);
    } else {
      dialogs.setRejectDialogOpen(false);
      showServerError(response.message || '差戻しに失敗しました');
    }
  };

  // 差戻し成功ダイアログを閉じるハンドラ
  const handleRejectSuccessClose = () => {
    dialogs.setRejectSuccessDialogOpen(false);
    // データを再取得して画面を更新
    if (detailData) {
      const quotId = detailData.quot_id;
      router.push(`/sales/quotes/${quotId}`);
    }
    refresh();
  };

  // 差戻しキャンセルハンドラ
  const handleRejectCancel = () => {
    dialogs.setRejectDialogOpen(false);
  };

  // 見積登録ボタンクリック
  const handleQuotRegisterClick = async () => {
    const isValid = await quotAmountForm.trigger();
    if (!isValid) return;
    dialogs.setProductionRegisterDialogOpen(true);
  };

  // 見積登録確定ハンドラ
  const handleQuotRegisterConfirm = async () => {
    const quotId = parseInt(id, 10);
    const formData = quotAmountForm.getValues();

    dialogs.setProductionRegisterLoading(true);
    const response = await registerQuot(quotId, formData.amounts);
    dialogs.setProductionRegisterLoading(false);

    if (response.success) {
      dialogs.setProductionRegisterDialogOpen(false);
      dialogs.setProductionRegisterSuccessDialogOpen(true);
    } else {
      dialogs.setProductionRegisterDialogOpen(false);
      showServerError(response.message || '見積登録に失敗しました');
    }
  };

  // 見積登録成功ダイアログを閉じるハンドラ
  const handleProductionRegisterSuccessClose = () => {
    dialogs.setProductionRegisterSuccessDialogOpen(false);
    const quotId = parseInt(id, 10);
    router.push(`/sales/quotes/${quotId}`);
    refresh();
  };

  // 見積登録キャンセルハンドラ
  const handleQuotRegisterCancel = () => {
    dialogs.setProductionRegisterDialogOpen(false);
  };

  // 見積更新ボタンクリック
  const handleQuotUpdateClick = async () => {
    const isValid = await quotAmountForm.trigger();
    if (!isValid) return;
    dialogs.setQuotUpdateDialogOpen(true);
  };

  // 見積更新確定ハンドラ
  const handleQuotUpdateConfirm = async () => {
    const quotId = parseInt(id, 10);
    const formData = quotAmountForm.getValues();

    dialogs.setQuotUpdateLoading(true);
    const response = await updateQuotAmounts(quotId, formData.amounts);
    dialogs.setQuotUpdateLoading(false);

    if (response.success) {
      dialogs.setQuotUpdateDialogOpen(false);
      dialogs.setQuotUpdateSuccessDialogOpen(true);
    } else {
      dialogs.setQuotUpdateDialogOpen(false);
      showServerError(response.message || '見積更新に失敗しました');
    }
  };

  // 見積更新キャンセルハンドラ
  const handleQuotUpdateCancel = () => {
    dialogs.setQuotUpdateDialogOpen(false);
  };

  // 見積更新成功ダイアログを閉じるハンドラ
  const handleQuotUpdateSuccessClose = () => {
    dialogs.setQuotUpdateSuccessDialogOpen(false);
    // ページをリロード（同じIDの作成・更新画面を再表示）
    const quotId = parseInt(id, 10);
    router.push(`/sales/quotes/${quotId}`);
    refresh();
  };

  // 承認ボタンクリック
  const handleApproveClick = () => {
    dialogs.setApproveDialogOpen(true);
  };

  // 承認確定ハンドラ
  const handleApproveConfirm = async () => {
    const quotId = parseInt(id, 10);
    dialogs.setApproveLoading(true);
    const response = await approveQuot(quotId);
    dialogs.setApproveLoading(false);

    if (response.success) {
      dialogs.setApproveDialogOpen(false);
      dialogs.setApproveSuccessDialogOpen(true);
    } else {
      dialogs.setApproveDialogOpen(false);
      showServerError(response.message || '承認に失敗しました');
    }
  };

  // 承認成功ダイアログを閉じるハンドラ
  const handleApproveSuccessClose = () => {
    dialogs.setApproveSuccessDialogOpen(false);
    const quotId = parseInt(id, 10);
    router.push(`/sales/quotes/${quotId}`);
    refresh();
  };

  // 承認取消ボタンクリック
  const handleCancelApproveClick = () => {
    dialogs.setCancelApproveDialogOpen(true);
  };

  // 承認取消確定ハンドラ
  const handleCancelApproveConfirm = async () => {
    const quotId = parseInt(id, 10);
    dialogs.setApproveLoading(true);
    const response = await cancelApproveQuot(quotId);
    dialogs.setApproveLoading(false);

    if (response.success) {
      dialogs.setCancelApproveDialogOpen(false);
      dialogs.setCancelApproveSuccessDialogOpen(true);
    } else {
      dialogs.setCancelApproveDialogOpen(false);
      showServerError(response.message || '承認取消に失敗しました');
    }
  };

  // 承認取消成功ダイアログを閉じるハンドラ
  const handleCancelApproveSuccessClose = () => {
    dialogs.setCancelApproveSuccessDialogOpen(false);
    const quotId = parseInt(id, 10);
    router.push(`/sales/quotes/${quotId}`);
    refresh();
  };

  // 発行ボタンクリック
  const handleIssueClick = () => {
    dialogs.setIssueDialogOpen(true);
  };

  // 発行確定ハンドラ
  const handleIssueConfirm = async () => {
    const quotId = parseInt(id, 10);
    dialogs.setIssueLoading(true);
    const response = await issueQuot(quotId);
    dialogs.setIssueLoading(false);

    if (response.success) {
      dialogs.setIssueDialogOpen(false);
      dialogs.setIssueSuccessDialogOpen(true);
    } else {
      dialogs.setIssueDialogOpen(false);
      showServerError(response.message || '発行に失敗しました');
    }
  };

  // 発行成功ダイアログを閉じるハンドラ
  const handleIssueSuccessClose = () => {
    dialogs.setIssueSuccessDialogOpen(false);
    const quotId = parseInt(id, 10);
    router.push(`/sales/quotes/${quotId}`);
    refresh();
  };

  // 再発行ボタンクリック
  const handleReissueClick = () => {
    dialogs.setReissueDialogOpen(true);
  };

  // 再発行確定ハンドラ
  const handleReissueConfirm = async () => {
    const quotId = parseInt(id, 10);
    dialogs.setReissueLoading(true);
    const response = await reissueQuot(quotId);
    dialogs.setReissueLoading(false);

    if (response.success) {
      dialogs.setReissueDialogOpen(false);
      dialogs.setReissueSuccessDialogOpen(true);
    } else {
      dialogs.setReissueDialogOpen(false);
      showServerError(response.message || '再発行に失敗しました');
    }
  };

  // 再発行成功ダイアログを閉じるハンドラ
  const handleReissueSuccessClose = () => {
    dialogs.setReissueSuccessDialogOpen(false);
    refresh();
  };

  // 登録取消ボタンクリック
  const handleCancelRegisterClick = () => {
    dialogs.setCancelRegisterDialogOpen(true);
  };

  // 登録取消確定ハンドラ
  const handleCancelRegisterConfirm = async () => {
    const quotId = parseInt(id, 10);
    dialogs.setCancelRegisterLoading(true);
    const response = await cancelRegisterQuot(quotId);
    dialogs.setCancelRegisterLoading(false);

    if (response.success) {
      dialogs.setCancelRegisterDialogOpen(false);
      dialogs.setCancelRegisterSuccessDialogOpen(true);
    } else {
      dialogs.setCancelRegisterDialogOpen(false);
      showServerError(response.message || '登録取消に失敗しました');
    }
  };

  // 登録取消成功ダイアログを閉じるハンドラ
  const handleCancelRegisterSuccessClose = () => {
    dialogs.setCancelRegisterSuccessDialogOpen(false);
    // ページをリロード（同じIDの作成・更新画面を再表示）
    const quotId = parseInt(id, 10);
    router.push(`/sales/quotes/${quotId}`);
    refresh();
  };

  // ステータス00更新ボタンクリックハンドラ
  const handleStatus00UpdateClick = async () => {
    const isValid = await createForm.trigger();

    // 諸口の場合の得意先名チェック（trigger後に実行してエラーを追加）
    const formValues = createForm.getValues();
    let hasCustomerNameError = false;
    if (formValues.customer_cd === MISC_CUSTOMER_CD) {
      if (!formValues.customer_name || formValues.customer_name.trim().length === 0) {
        createForm.setError('customer_name', {
          type: 'custom',
          message: '諸口の場合は得意先名を入力してください',
        });
        hasCustomerNameError = true;
      }
    }

    // 主管センターの選択肢バリデーション
    let hasCenterError = false;
    if (formValues.center_id != null) {
      const isValidCenter = centers.some((center) => center.department_id === formValues.center_id);
      if (!isValidCenter) {
        createForm.setError('center_id', {
          type: 'custom',
          message: '有効な値を選択してください',
        });
        hasCenterError = true;
      }
    }

    if (!isValid || hasCustomerNameError || hasCenterError) return;
    dialogs.setStatus00UpdateDialogOpen(true);
  };

  // ステータス00更新確定ハンドラ（一時保存）
  const handleStatus00UpdateConfirm = async () => {
    const quotId = parseInt(id, 10);
    const formData = createForm.getValues();
    dialogs.setStatus00UpdateLoading(true);

    // 流用作成時は作業部門別見積データも送信
    const operations =
      reusedOperations.length > 0
        ? reusedOperations.map((op, index) => ({
            operation_id: op.operation_id,
            cost: op.cost,
            quot_amount: quotAmountForm.getValues().amounts[index]?.quot_amount ?? 0,
          }))
        : undefined;

    const response = await updateQuot(quotId, {
      prod_name: formData.prod_name,
      customer_id: formData.customer_id ?? undefined,
      customer_name: formData.customer_cd === MISC_CUSTOMER_CD ? formData.customer_name : undefined,
      quot_subject: formData.quot_subject,
      quot_summary: formData.quot_summary,
      message: formData.message,
      reference_doc_path: formData.reference_doc_path || undefined,
      center_id: formData.center_id ?? undefined,
      submission_method: formData.submission_method,
      base_quot_id: baseQuotId ?? undefined,
      operations,
    });

    dialogs.setStatus00UpdateLoading(false);

    if (response.success) {
      dialogs.setStatus00UpdateDialogOpen(false);
      // 成功ダイアログを表示
      dialogs.setStatus00UpdateSuccessDialogOpen(true);
    } else {
      // ダイアログを閉じてエラーを表示
      dialogs.setStatus00UpdateDialogOpen(false);
      // フィールド別エラーをフォームにセット
      if (response.errors) {
        setServerValidationErrors(response.errors);
      }
      // 一般エラーをダイアログに表示
      showServerError('見積の更新に失敗しました。時間を空けて再度お試しください');
    }
  };

  // ステータス00更新成功ダイアログを閉じるハンドラ
  const handleStatus00UpdateSuccessClose = () => {
    dialogs.setStatus00UpdateSuccessDialogOpen(false);
    // ページをリロード（同じIDの作成・更新画面を再表示）
    const quotId = parseInt(id, 10);
    router.push(`/sales/quotes/${quotId}`);
    refresh();
  };

  // ステータス00登録ボタンクリックハンドラ
  const handleStatus00RegisterClick = () => {
    dialogs.setStatus00RegisterDialogOpen(true);
  };

  // ステータス00登録確定ハンドラ
  const handleStatus00RegisterConfirm = async () => {
    const quotId = parseInt(id, 10);
    dialogs.setStatus00RegisterLoading(true);

    // まず詳細フォームとquotAmountFormのデータを更新
    const formData = createForm.getValues();
    const operations =
      reusedOperations.length > 0
        ? reusedOperations.map((op, index) => ({
            operation_id: op.operation_id,
            cost: op.cost,
            quot_amount: quotAmountForm.getValues().amounts[index]?.quot_amount ?? 0,
          }))
        : undefined;

    const updateResponse = await updateQuot(quotId, {
      prod_name: formData.prod_name,
      customer_id: formData.customer_id ?? undefined,
      customer_name: formData.customer_cd === MISC_CUSTOMER_CD ? formData.customer_name : undefined,
      quot_subject: formData.quot_subject,
      quot_summary: formData.quot_summary,
      message: formData.message,
      reference_doc_path: formData.reference_doc_path || undefined,
      center_id: formData.center_id ?? undefined,
      submission_method: formData.submission_method,
      base_quot_id: baseQuotId ?? undefined,
      operations,
    });

    if (!updateResponse.success) {
      dialogs.setStatus00RegisterLoading(false);
      dialogs.setStatus00RegisterDialogOpen(false);
      // フィールド別エラーをフォームにセット
      if (updateResponse.errors) {
        setServerValidationErrors(updateResponse.errors);
      }
      // 一般エラーをダイアログに表示
      showServerError('見積の更新に失敗しました。時間を空けて再度お試しください');
      return;
    }

    // 更新成功後、登録処理を実行
    const registerResponse = await registerDraftQuot(quotId);
    dialogs.setStatus00RegisterLoading(false);

    if (registerResponse.success) {
      dialogs.setStatus00RegisterDialogOpen(false);
      // 成功ダイアログを表示
      dialogs.setStatus00RegisterSuccessDialogOpen(true);
    } else {
      dialogs.setStatus00RegisterDialogOpen(false);
      showServerError(registerResponse.message || '見積の登録に失敗しました');
    }
  };

  // ステータス00登録成功ダイアログを閉じるハンドラ
  const handleStatus00RegisterSuccessClose = () => {
    dialogs.setStatus00RegisterSuccessDialogOpen(false);
    // ページをリロード
    const quotId = parseInt(id, 10);
    router.push(`/sales/quotes/${quotId}`);
    refresh();
  };

  // ステータス60更新ボタンクリックハンドラ
  const handleStatus60UpdateClick = async () => {
    // 格納先・失注情報は任意なのでバリデーション不要
    dialogs.setStatus60UpdateDialogOpen(true);
  };

  // ステータス60更新確定ハンドラ
  const handleStatus60UpdateConfirm = async () => {
    const quotId = parseInt(id, 10);
    const formData = createForm.getValues();
    dialogs.setStatus60UpdateLoading(true);

    const response = await updateQuotStatus60(quotId, {
      quot_doc_path: formData.quot_doc_path || '',
      is_lost: formData.is_lost || false,
      lost_reason: formData.is_lost ? formData.lost_reason || '' : '',
    });

    dialogs.setStatus60UpdateLoading(false);

    if (response.success) {
      dialogs.setStatus60UpdateDialogOpen(false);
      dialogs.setStatus60UpdateSuccessDialogOpen(true);
    } else {
      dialogs.setStatus60UpdateDialogOpen(false);
      showServerError(response.message || '更新に失敗しました');
    }
  };

  // ステータス60更新成功ダイアログを閉じるハンドラ
  const handleStatus60UpdateSuccessClose = () => {
    dialogs.setStatus60UpdateSuccessDialogOpen(false);
    const quotId = parseInt(id, 10);
    router.push(`/sales/quotes/${quotId}`);
    refresh();
  };

  // 削除ボタンクリックハンドラ
  const handleDeleteClick = () => {
    dialogs.setDeleteDialogOpen(true);
  };

  // 削除確定ハンドラ
  const handleDeleteConfirm = async () => {
    if (!detailData) return;

    dialogs.setDeleteLoading(true);
    const response = await deleteQuot(detailData.quot_id);
    dialogs.setDeleteLoading(false);

    if (response.success) {
      dialogs.setDeleteDialogOpen(false);
      dialogs.setDeleteSuccessDialogOpen(true);
    } else {
      dialogs.setDeleteDialogOpen(false);
      showServerError(response.message || '削除に失敗しました');
    }
  };

  // 削除成功ダイアログを閉じるハンドラ
  const handleDeleteSuccessClose = () => {
    dialogs.setDeleteSuccessDialogOpen(false);
    router.push('/sales/quotes');
  };

  return {
    handleBack,
    handleBackConfirm,
    handleCreateClick,
    handleCreateConfirm,
    handleCreateSuccessClose,
    handleQuotUpdateClick,
    handleQuotUpdateConfirm,
    handleQuotUpdateCancel,
    handleQuotUpdateSuccessClose,
    handleApproveClick,
    handleApproveConfirm,
    handleApproveSuccessClose,
    handleCancelApproveClick,
    handleCancelApproveConfirm,
    handleCancelApproveSuccessClose,
    handleIssueClick,
    handleIssueConfirm,
    handleIssueSuccessClose,
    handleReissueClick,
    handleReissueConfirm,
    handleReissueSuccessClose,
    handleRejectClick,
    handleRejectConfirm,
    handleRejectSuccessClose,
    handleRejectCancel,
    handleQuotRegisterClick,
    handleQuotRegisterConfirm,
    handleProductionRegisterSuccessClose,
    handleQuotRegisterCancel,
    handleCancelRegisterClick,
    handleCancelRegisterConfirm,
    handleCancelRegisterSuccessClose,
    handleStatus00UpdateClick,
    handleStatus00UpdateConfirm,
    handleStatus00UpdateSuccessClose,
    handleStatus00RegisterClick,
    handleStatus00RegisterConfirm,
    handleStatus00RegisterSuccessClose,
    handleStatus60UpdateClick,
    handleStatus60UpdateConfirm,
    handleStatus60UpdateSuccessClose,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteSuccessClose,
  };
}
