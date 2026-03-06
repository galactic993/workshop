import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
  QuotDetail,
  CenterManager,
  getCenterManagers,
  requestProductionQuot,
  updateQuot,
  QuotCustomerSuggestion,
} from '@/lib/quot';
import { QuotCreateFormData, MISC_CUSTOMER_CD } from '@/schemas/quotCreateSchema';
import { UseQuotDetailDialogsReturn } from './useQuotDetailDialogs';

/**
 * useQuotDetailProdRequest のオプション型
 */
export interface UseQuotDetailProdRequestOptions {
  detailData: QuotDetail | null;
  dialogs: UseQuotDetailDialogsReturn;
  createForm: UseFormReturn<QuotCreateFormData>;
  selectedCustomer: QuotCustomerSuggestion | null;
  showServerError: (message: string) => void;
  refresh: () => void;
  router: ReturnType<typeof useRouter>;
}

/**
 * useQuotDetailProdRequest の戻り値型
 */
export interface UseQuotDetailProdRequestReturn {
  // state
  prodRequestCenterId: number | null;
  prodRequestCenterName: string;
  prodRequestManagers: CenterManager[];
  prodRequestManagersLoading: boolean;
  prodRequestQuotNumber: string;
  prodRequestMessage: string;
  setProdRequestMessage: (message: string) => void;
  // handlers
  handleProdRequestConfirmClose: () => void;
  handleProdRequestConfirm: () => Promise<void>;
  handleProdRequestExecClick: () => void;
  handleProdRequestExecConfirm: () => Promise<void>;
  handleProdRequestSuccessClose: () => void;
  handleStatus00ProductionClick: () => Promise<void>;
  // internal state setters (for handleCreateConfirm)
  setProdRequestCenterId: (id: number | null) => void;
  setProdRequestCenterName: (name: string) => void;
  setProdRequestQuotNumber: (number: string) => void;
}

/**
 * 見積詳細ページの制作見積依頼ロジック
 *
 * 以下の2つのシナリオに対応：
 * 1. 作成後に制作見積依頼を行う（handleCreateConfirm から呼ばれる）
 * 2. ステータス00から制作見積依頼を行う（handleStatus00ProductionClick）
 */
export function useQuotDetailProdRequest({
  detailData,
  dialogs,
  createForm,
  selectedCustomer,
  showServerError,
  refresh,
  router,
}: UseQuotDetailProdRequestOptions): UseQuotDetailProdRequestReturn {
  const [prodRequestCenterId, setProdRequestCenterId] = useState<number | null>(null);
  const [prodRequestCenterName, setProdRequestCenterName] = useState<string>('');
  const [prodRequestManagers, setProdRequestManagers] = useState<CenterManager[]>([]);
  const [prodRequestManagersLoading, setProdRequestManagersLoading] = useState(false);
  const [prodRequestQuotNumber, setProdRequestQuotNumber] = useState<string>('');
  const [prodRequestMessage, setProdRequestMessage] = useState<string>('');

  /**
   * 制作見積依頼確認ダイアログを閉じるハンドラ
   * 作成成功後の確認ダイアログから呼ばれる
   */
  const handleProdRequestConfirmClose = () => {
    dialogs.setProdRequestConfirmDialogOpen(false);
    // 登録したデータの作成・更新画面へ遷移
    if (dialogs.createdQuotId) {
      router.push(`/sales/quotes/${dialogs.createdQuotId}`);
    }
    refresh();
  };

  /**
   * 制作見積依頼確認ダイアログの「制作見積依頼」ボタンハンドラ
   * 伝達事項の初期値を設定し、モーダルを開く
   */
  const handleProdRequestConfirm = async () => {
    dialogs.setProdRequestConfirmDialogOpen(false);
    // 伝達事項の初期値を設定
    const initialMessage = createForm.getValues().message || detailData?.message || '';
    setProdRequestMessage(initialMessage);
    dialogs.setProdRequestModalOpen(true);

    // センターの所長一覧を取得
    if (prodRequestCenterId) {
      setProdRequestManagersLoading(true);
      const response = await getCenterManagers(prodRequestCenterId);
      setProdRequestManagersLoading(false);
      if (response.success) {
        setProdRequestManagers(response.managers);
      }
    }
  };

  /**
   * 制作見積依頼モーダルの「制作見積依頼」ボタンハンドラ
   * 実行確認ダイアログを表示
   */
  const handleProdRequestExecClick = () => {
    dialogs.setProdRequestExecDialogOpen(true);
  };

  /**
   * 制作見積依頼実行確認ダイアログの「制作見積依頼」ボタンハンドラ
   * 伝達事項が変更されている場合は先に更新し、その後制作見積依頼を実行
   */
  const handleProdRequestExecConfirm = async () => {
    // 対象の見積IDを取得（新規作成時はcreatedQuotId、作成中はdetailData.quot_id）
    const targetQuotId = dialogs.createdQuotId || detailData?.quot_id;
    if (!targetQuotId) return;

    dialogs.setProdRequestExecLoading(true);

    // 伝達事項が変更されていれば先に更新
    const formValues = createForm.getValues();
    const currentMessage = formValues.message || detailData?.message || '';
    if (prodRequestMessage !== currentMessage) {
      // フォームの伝達事項も更新
      createForm.setValue('message', prodRequestMessage);

      const updateResponse = await updateQuot(targetQuotId, {
        prod_name: formValues.prod_name || detailData?.prod_name || undefined,
        customer_id: formValues.customer_id ?? detailData?.customer_id ?? undefined,
        customer_name:
          (selectedCustomer?.customer_cd || detailData?.customer_cd) === MISC_CUSTOMER_CD
            ? formValues.customer_name || detailData?.quot_customer_name || undefined
            : undefined,
        quot_subject: formValues.quot_subject || detailData?.quot_subject || undefined,
        quot_summary: formValues.quot_summary || detailData?.quot_summary || undefined,
        message: prodRequestMessage,
        reference_doc_path:
          formValues.reference_doc_path || detailData?.reference_doc_path || undefined,
        center_id: formValues.center_id ?? detailData?.center_id ?? undefined,
        submission_method: formValues.submission_method || detailData?.submission_method || '00',
      });

      if (!updateResponse.success) {
        dialogs.setProdRequestExecLoading(false);
        dialogs.setProdRequestExecDialogOpen(false);
        dialogs.setProdRequestModalOpen(false);
        showServerError(updateResponse.message || '伝達事項の更新に失敗しました');
        return;
      }
    }

    const response = await requestProductionQuot(targetQuotId);
    dialogs.setProdRequestExecLoading(false);

    if (response.success) {
      dialogs.setProdRequestExecDialogOpen(false);
      dialogs.setProdRequestModalOpen(false);
      dialogs.setProdRequestSuccessDialogOpen(true);
    } else {
      // エラー時はダイアログを閉じてエラーを表示
      dialogs.setProdRequestExecDialogOpen(false);
      dialogs.setProdRequestModalOpen(false);
      showServerError(response.message || '制作見積依頼に失敗しました');
      // エラー時は作成・更新画面へ遷移
      router.push(`/sales/quotes/${targetQuotId}`);
      refresh();
    }
  };

  /**
   * 制作見積依頼成功ダイアログの「閉じる」ボタンハンドラ
   */
  const handleProdRequestSuccessClose = () => {
    dialogs.setProdRequestSuccessDialogOpen(false);
    const targetQuotId = dialogs.createdQuotId || detailData?.quot_id;
    if (targetQuotId) {
      router.push(`/sales/quotes/${targetQuotId}`);
    }
    refresh();
  };

  /**
   * ステータス00から制作見積依頼ボタンクリックハンドラ
   * 既存の見積データから制作見積依頼モーダルを開く
   */
  const handleStatus00ProductionClick = async () => {
    if (!detailData) return;

    // 見積書Noを設定
    setProdRequestQuotNumber(detailData.quot_number || '');
    // センター名を設定
    setProdRequestCenterName(detailData.center_name || '');
    setProdRequestCenterId(detailData.center_id ?? null);
    // 伝達事項の初期値を設定
    const initialMessage = createForm.getValues().message || detailData.message || '';
    setProdRequestMessage(initialMessage);
    // モーダルを開く
    dialogs.setProdRequestModalOpen(true);

    // センターの所長一覧を取得
    if (detailData.center_id) {
      setProdRequestManagersLoading(true);
      const response = await getCenterManagers(detailData.center_id);
      setProdRequestManagersLoading(false);
      if (response.success) {
        setProdRequestManagers(response.managers);
      }
    }
  };

  return {
    prodRequestCenterId,
    prodRequestCenterName,
    prodRequestManagers,
    prodRequestManagersLoading,
    prodRequestQuotNumber,
    prodRequestMessage,
    setProdRequestMessage,
    handleProdRequestConfirmClose,
    handleProdRequestConfirm,
    handleProdRequestExecClick,
    handleProdRequestExecConfirm,
    handleProdRequestSuccessClose,
    handleStatus00ProductionClick,
    setProdRequestCenterId,
    setProdRequestCenterName,
    setProdRequestQuotNumber,
  };
}
