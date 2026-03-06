'use client';

import { useMemo } from 'react';
import { QUOT_STATUS, PROD_QUOT_STATUS } from '@/lib/quot/types';

/**
 * 見積フィールド表示・編集可否状態の型定義
 */
export interface QuotFieldState {
  /** 新規登録モード */
  isNewMode: boolean;
  /** 基本情報（得意先、件名等）の編集可否（後方互換用） */
  isDetailEditable: boolean;
  /** 基本情報フォーム表示 */
  showDetailForm: boolean;
  /** 見積金額の編集可否（作業部門別テーブル用） */
  isAmountEditable: boolean;
  /** 見積金額フォーム表示 */
  showAmountForm: boolean;
  /** 発行済更新フォーム表示 */
  showIssuedForm: boolean;
  /** 制作見積作業部門表示 */
  showProdQuotOperations: boolean;
  /** 見積作業部門表示 */
  showQuotOperations: boolean;
  /** 流用作成ボタン表示 */
  showReuseButton: boolean;

  // フィールド単位の編集可否
  /** 得意先: 新規登録時のみ編集可 */
  isCustomerEditable: boolean;
  /** 得意先名（諸口）: 発行前は編集可 */
  isCustomerNameEditable: boolean;
  /** 見積件名: 発行前は編集可 */
  isSubjectEditable: boolean;
  /** 品名: 発行前は編集可 */
  isProdNameEditable: boolean;
  /** 見積概要: 制作見積依頼前は編集可 */
  isSummaryEditable: boolean;
  /** 見積金額: 作業部門別見積レコードがない場合は編集可 */
  isQuotAmountEditable: boolean;
  /** 提出方法: 常に編集可 */
  isSubmissionMethodEditable: boolean;
  /** 参考資料: 制作見積依頼前は編集可 */
  isReferenceDocEditable: boolean;
  /** 主管センター: 制作見積依頼前は編集可 */
  isCenterEditable: boolean;
  /** 伝達事項: 制作見積依頼前は編集可 */
  isNoteEditable: boolean;
  /** 見積書格納先: 発行後のみ編集可 */
  isStoragePathEditable: boolean;
  /** 失注情報（失注フラグ・失注理由）: 発行後のみ編集可 */
  isLostInfoEditable: boolean;
}

interface UseQuotFieldStateOptions {
  /** 見積ステータス */
  quotStatus: string | null;
  /** 制作見積ステータス */
  prodQuotStatus: string | null;
  /** 新規作成モードかどうか */
  isNew: boolean;
  /** 作業部門別見積レコードが存在するか（制作見積または見積） */
  hasOperations?: boolean;
  /** 見積作業部門レコード（quot_operations）が存在するか（流用作成判定用） */
  hasQuotOperations?: boolean;
}

/**
 * 見積画面のフィールド表示・編集可否を管理するカスタムフック
 *
 * 見積ステータスと制作見積ステータスに応じて、
 * 各フォームセクションの表示/非表示と編集可否を制御する
 *
 * @param options - 見積ステータス情報
 * @returns フィールド表示・編集可否状態
 *
 * @example
 * ```tsx
 * const fieldState = useQuotFieldState({
 *   quotStatus: '00',
 *   prodQuotStatus: '20',
 *   isNew: false,
 * });
 *
 * if (fieldState.isDetailEditable) {
 *   // 基本情報フォームを編集可能にする
 * }
 * ```
 */
export function useQuotFieldState({
  quotStatus,
  prodQuotStatus,
  isNew,
  hasOperations = false,
  hasQuotOperations = false,
}: UseQuotFieldStateOptions): QuotFieldState {
  return useMemo(() => {
    // 発行済かどうか
    const isIssued = quotStatus === QUOT_STATUS.ISSUED;
    // 制作見積依頼済みかどうか（依頼前以外）
    const isProdQuotRequested =
      prodQuotStatus !== null && prodQuotStatus !== PROD_QUOT_STATUS.BEFORE_REQUEST;
    // 制作見積が完了しているか（制作見積済または制作見積受取済）
    const isProdQuotCompleted =
      prodQuotStatus === PROD_QUOT_STATUS.COMPLETED || prodQuotStatus === PROD_QUOT_STATUS.RECEIVED;
    // 見積金額編集可能か（制作見積完了または流用作成で既にquot_operationsがある場合）
    const canEditAmount = isProdQuotCompleted || hasQuotOperations;

    // フィールド単位の編集可否（共通ロジック）
    const fieldEditability = {
      // 得意先: 新規登録時のみ編集可
      isCustomerEditable: isNew,
      // 得意先名（諸口）: 発行前は編集可
      isCustomerNameEditable: !isIssued,
      // 見積件名: 発行前は編集可
      isSubjectEditable: !isIssued,
      // 品名: 発行前は編集可
      isProdNameEditable: !isIssued,
      // 見積概要: 制作見積依頼前は編集可
      isSummaryEditable: isNew || !isProdQuotRequested,
      // 見積金額: 作業部門別見積レコードがない場合は編集可
      isQuotAmountEditable: !hasOperations,
      // 提出方法: 常に編集可
      isSubmissionMethodEditable: true,
      // 参考資料: 制作見積依頼前は編集可
      isReferenceDocEditable: isNew || !isProdQuotRequested,
      // 主管センター: 制作見積依頼前は編集可
      isCenterEditable: isNew || !isProdQuotRequested,
      // 伝達事項: 制作見積依頼前は編集可
      isNoteEditable: isNew || !isProdQuotRequested,
      // 見積書格納先: 発行後のみ編集可
      isStoragePathEditable: isIssued,
      // 失注情報: 発行後のみ編集可
      isLostInfoEditable: isIssued,
    };

    // 新規登録モード
    if (isNew) {
      return {
        isNewMode: true,
        isDetailEditable: true,
        showDetailForm: true,
        isAmountEditable: false,
        showAmountForm: false,
        showIssuedForm: false,
        showProdQuotOperations: false,
        showQuotOperations: false,
        showReuseButton: true,
        ...fieldEditability,
      };
    }

    // ステータス別の状態判定
    switch (quotStatus) {
      case QUOT_STATUS.DRAFT: // 作成中
        return {
          isNewMode: false,
          isDetailEditable: true,
          showDetailForm: true,
          isAmountEditable: canEditAmount,
          showAmountForm: canEditAmount,
          showIssuedForm: false,
          // 制作見積が存在する + 制作見積ステータスが受取済の場合のみ表示
          showProdQuotOperations:
            isProdQuotCompleted && prodQuotStatus === PROD_QUOT_STATUS.RECEIVED,
          showQuotOperations: false,
          showReuseButton: true,
          ...fieldEditability,
        };

      case QUOT_STATUS.PENDING_APPROVAL: // 承認待ち
        return {
          isNewMode: false,
          isDetailEditable: false,
          showDetailForm: true,
          isAmountEditable: true, // 承認前は編集可
          showAmountForm: true,
          showIssuedForm: false,
          showProdQuotOperations: false,
          showQuotOperations: true,
          showReuseButton: false,
          ...fieldEditability,
        };

      case QUOT_STATUS.APPROVED: // 承認済
        return {
          isNewMode: false,
          isDetailEditable: false,
          showDetailForm: true,
          isAmountEditable: false, // 承認後は編集不可
          showAmountForm: true,
          showIssuedForm: false,
          showProdQuotOperations: false,
          showQuotOperations: true,
          showReuseButton: false,
          ...fieldEditability,
        };

      case QUOT_STATUS.ISSUED: // 発行済
        return {
          isNewMode: false,
          isDetailEditable: false,
          showDetailForm: true,
          isAmountEditable: false,
          showAmountForm: false,
          showIssuedForm: true,
          showProdQuotOperations: false,
          showQuotOperations: true,
          showReuseButton: false,
          ...fieldEditability,
        };

      default:
        // 不明なステータスの場合はすべて非表示・編集不可
        return {
          isNewMode: false,
          isDetailEditable: false,
          showDetailForm: false,
          isAmountEditable: false,
          showAmountForm: false,
          showIssuedForm: false,
          showProdQuotOperations: false,
          showQuotOperations: false,
          showReuseButton: false,
          ...fieldEditability,
        };
    }
  }, [quotStatus, prodQuotStatus, isNew, hasOperations, hasQuotOperations]);
}
