'use client';

import { useState, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ReuseQuotData } from '@/components/quotes/dialogs';
import { QuotCustomerSuggestion } from '@/lib/quot';
import { QuotOperation } from '@/lib/quot/types';
import { QuotAmountFormData } from '@/schemas/quotAmountSchema';
import { QuotCreateFormData, MISC_CUSTOMER_CD } from '@/schemas/quotCreateSchema';
import { QuotFieldState } from './useQuotFieldState';

/**
 * 編集可能フラグ付きの作業部門別見積の型定義
 */
export interface QuotOperationWithEditable extends QuotOperation {
  isEditable?: boolean;
}

/**
 * useQuotDetailReuse フックのオプション型定義
 */
interface UseQuotDetailReuseOptions {
  /** 見積作成フォーム */
  createForm: UseFormReturn<QuotCreateFormData>;
  /** 見積金額フォーム */
  quotAmountForm: UseFormReturn<QuotAmountFormData>;
  /** フィールド状態 */
  fieldState: QuotFieldState;
  /** 得意先選択時のコールバック */
  setSelectedCustomer: (customer: QuotCustomerSuggestion | null) => void;
}

/**
 * useQuotDetailReuse フックの戻り値型定義
 */
interface UseQuotDetailReuseReturn {
  /** 流用モーダル表示状態 */
  reuseModalOpen: boolean;
  /** 流用モーダル表示状態を設定 */
  setReuseModalOpen: (open: boolean) => void;
  /** 流用元見積ID */
  baseQuotId: number | null;
  /** 流用元の作業部門別見積 */
  reusedOperations: QuotOperationWithEditable[];
  /** 上書き確認ダイアログ表示状態 */
  reuseOverwriteConfirmOpen: boolean;
  /** 上書き確認ダイアログ表示状態を設定 */
  setReuseOverwriteConfirmOpen: (open: boolean) => void;
  /** 保留中の流用データ */
  pendingReuseData: ReuseQuotData | null;
  /** 流用モーダルを開くハンドラ */
  handleReuseModalOpen: () => void;
  /** 流用データを反映するハンドラ */
  applyReuseData: (data: ReuseQuotData, forceOverwrite?: boolean) => void;
  /** 上書き確認ダイアログで「上書き」を選択した場合のハンドラ */
  handleReuseOverwriteConfirm: () => void;
  /** 上書き確認ダイアログで「キャンセル」を選択した場合のハンドラ */
  handleReuseOverwriteCancel: () => void;
}

/**
 * 見積流用作成機能を管理するカスタムフック
 *
 * 見積詳細画面の流用作成ロジックを抽出したフック。
 * 流用モーダルの表示制御、流用データの反映、上書き確認処理を提供する。
 *
 * @param options - フック設定オプション
 * @returns 流用作成関連の状態とハンドラ
 *
 * @example
 * ```tsx
 * const reuse = useQuotDetailReuse({
 *   createForm,
 *   quotAmountForm,
 *   fieldState,
 *   setSelectedCustomer,
 * });
 *
 * // 流用モーダルを開く
 * <button onClick={reuse.handleReuseModalOpen}>流用作成</button>
 *
 * // 流用データを反映
 * <QuotReuseModal onSelect={reuse.applyReuseData} />
 * ```
 */
export function useQuotDetailReuse({
  createForm,
  quotAmountForm,
  fieldState,
  setSelectedCustomer,
}: UseQuotDetailReuseOptions): UseQuotDetailReuseReturn {
  // 流用モーダルの状態
  const [reuseModalOpen, setReuseModalOpen] = useState(false);
  // 流用元見積ID
  const [baseQuotId, setBaseQuotId] = useState<number | null>(null);
  // 流用元の作業部門別見積
  const [reusedOperations, setReusedOperations] = useState<QuotOperationWithEditable[]>([]);
  // 流用上書き確認ダイアログの状態
  const [reuseOverwriteConfirmOpen, setReuseOverwriteConfirmOpen] = useState(false);
  const [pendingReuseData, setPendingReuseData] = useState<ReuseQuotData | null>(null);

  /**
   * 流用作成モーダルを開くハンドラ
   */
  const handleReuseModalOpen = useCallback(() => {
    setReuseModalOpen(true);
  }, []);

  /**
   * 流用データをフォームに反映するハンドラ
   *
   * @param data - 流用元の見積データ
   * @param forceOverwrite - 既存データを強制的に上書きするか（上書き確認ダイアログで使用）
   */
  const applyReuseData = useCallback(
    (data: ReuseQuotData, forceOverwrite = false) => {
      // 既に流用データがある場合は確認ダイアログを表示
      if (!forceOverwrite && baseQuotId !== null) {
        setPendingReuseData(data);
        setReuseOverwriteConfirmOpen(true);
        return;
      }

      // 流用元見積IDをセット
      setBaseQuotId(data.quot_id);

      // 得意先をセット（isCustomerEditableがtrueの場合のみ）
      if (
        fieldState.isCustomerEditable &&
        data.customer_id &&
        data.customer_cd &&
        data.customer_name
      ) {
        setSelectedCustomer({
          customer_id: data.customer_id,
          customer_cd: data.customer_cd,
          customer_name: data.customer_name,
        });
        createForm.setValue('customer_id', data.customer_id, { shouldDirty: true });
        // 諸口の場合は得意先名もセット
        if (data.customer_cd === MISC_CUSTOMER_CD && data.quot_customer_name) {
          createForm.setValue('customer_name', data.quot_customer_name, { shouldDirty: true });
        }
      }

      // センターをセット
      if (data.center_id) {
        createForm.setValue('center_id', data.center_id, { shouldDirty: true });
      }

      // 件名をセット（isSubjectEditableがtrueの場合のみ）
      if (fieldState.isSubjectEditable && data.quot_subject) {
        createForm.setValue('quot_subject', data.quot_subject, { shouldDirty: true });
      }

      // 品名をセット（isProdNameEditableがtrueの場合のみ）
      if (fieldState.isProdNameEditable && data.prod_name) {
        createForm.setValue('prod_name', data.prod_name, { shouldDirty: true });
      }

      // 見積概要をセット（isSummaryEditableがtrueの場合のみ）
      if (fieldState.isSummaryEditable && data.quot_summary) {
        createForm.setValue('quot_summary', data.quot_summary, { shouldDirty: true });
      }

      // 伝達事項をセット（isNoteEditableがtrueの場合のみ）
      if (fieldState.isNoteEditable && data.message) {
        createForm.setValue('message', data.message, { shouldDirty: true });
      }

      // 作業部門別見積をセット
      if (Array.isArray(data.quot_operations) && data.quot_operations.length > 0) {
        setReusedOperations(data.quot_operations);
        // 金額フォームを初期化
        const amounts = data.quot_operations.map((op) => ({
          operation_id: op.operation_id,
          quot_amount: op.quot_amount,
        }));
        quotAmountForm.reset({ amounts });
      } else {
        // 作業部門別見積がない場合はクリア
        setReusedOperations([]);
        quotAmountForm.reset({ amounts: [] });
      }

      // 流用モーダルを閉じる
      setReuseModalOpen(false);
    },
    [fieldState, createForm, quotAmountForm, setSelectedCustomer, baseQuotId]
  );

  /**
   * 上書き確認ダイアログで「上書き」を選択した場合のハンドラ
   */
  const handleReuseOverwriteConfirm = useCallback(() => {
    if (pendingReuseData) {
      applyReuseData(pendingReuseData, true);
    }
    setReuseOverwriteConfirmOpen(false);
    setPendingReuseData(null);
  }, [pendingReuseData, applyReuseData]);

  /**
   * 上書き確認ダイアログで「キャンセル」を選択した場合のハンドラ
   */
  const handleReuseOverwriteCancel = useCallback(() => {
    setReuseOverwriteConfirmOpen(false);
    setPendingReuseData(null);
  }, []);

  return {
    reuseModalOpen,
    setReuseModalOpen,
    baseQuotId,
    reusedOperations,
    reuseOverwriteConfirmOpen,
    setReuseOverwriteConfirmOpen,
    pendingReuseData,
    handleReuseModalOpen,
    applyReuseData,
    handleReuseOverwriteConfirm,
    handleReuseOverwriteCancel,
  };
}
