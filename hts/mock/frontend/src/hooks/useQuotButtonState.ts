'use client';

import { useMemo } from 'react';
import { QUOT_STATUS, PROD_QUOT_STATUS } from '@/lib/quot/types';

/**
 * 見積ボタン表示・有効状態の型定義
 */
export interface QuotButtonState {
  /** 新規作成ボタン */
  canCreate: boolean;
  /** 更新ボタン（作成中） */
  canUpdate: boolean;
  /** 削除ボタン */
  canDelete: boolean;
  /** 制作見積依頼ボタン */
  canRequestProdQuot: boolean;
  /** 見積登録ボタン（承認依頼） */
  canRegister: boolean;
  /** 承認ボタン */
  canApprove: boolean;
  /** 差戻しボタン */
  canReject: boolean;
  /** 登録取消ボタン */
  canCancelRegister: boolean;
  /** 承認取消ボタン */
  canCancelApprove: boolean;
  /** 発行ボタン */
  canIssue: boolean;
  /** 金額更新ボタン */
  canUpdateAmount: boolean;
  /** 再発行ボタン */
  canReissue: boolean;
  /** 発行済情報更新ボタン */
  canUpdateIssued: boolean;
}

interface UseQuotButtonStateProps {
  /** 見積ステータス */
  quotStatus: string | null;
  /** 制作見積ステータス */
  prodQuotStatus: string | null;
  /** 新規作成モードかどうか */
  isNew: boolean;
  /** 承認権限の有無 */
  hasApprovePermission: boolean;
}

/**
 * 見積画面のボタン表示・有効状態を管理するカスタムフック
 *
 * 見積ステータス、制作見積ステータス、承認権限に応じて、
 * 各ボタンの有効/無効を制御する
 *
 * @param props - 見積ステータスと権限情報
 * @returns ボタン表示・有効状態
 *
 * @example
 * ```tsx
 * const buttonState = useQuotButtonState({
 *   quotStatus: '00',
 *   prodQuotStatus: '20',
 *   isNew: false,
 *   hasApprovePermission: true,
 * });
 *
 * <button disabled={!buttonState.canRegister}>見積登録</button>
 * ```
 */
export function useQuotButtonState({
  quotStatus,
  prodQuotStatus,
  isNew,
  hasApprovePermission,
}: UseQuotButtonStateProps): QuotButtonState {
  return useMemo(() => {
    // 新規登録モード
    if (isNew) {
      return {
        canCreate: true,
        canUpdate: false,
        canDelete: false,
        canRequestProdQuot: false,
        canRegister: false,
        canApprove: false,
        canReject: false,
        canCancelRegister: false,
        canCancelApprove: false,
        canIssue: false,
        canUpdateAmount: false,
        canReissue: false,
        canUpdateIssued: false,
      };
    }

    // ステータス別のボタン状態判定
    switch (quotStatus) {
      case QUOT_STATUS.DRAFT: // 作成中
        return {
          canCreate: false,
          canUpdate: true,
          // 制作見積依頼前のみ削除可能
          canDelete: prodQuotStatus === PROD_QUOT_STATUS.BEFORE_REQUEST,
          canRequestProdQuot: prodQuotStatus === PROD_QUOT_STATUS.BEFORE_REQUEST,
          canRegister: prodQuotStatus === PROD_QUOT_STATUS.COMPLETED,
          canApprove: false,
          canReject: false,
          canCancelRegister: false,
          canCancelApprove: false,
          canIssue: false,
          canUpdateAmount: false,
          canReissue: false,
          canUpdateIssued: false,
        };

      case QUOT_STATUS.PENDING_APPROVAL: // 承認待ち
        return {
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canRequestProdQuot: false,
          canRegister: false,
          canApprove: hasApprovePermission,
          canReject: hasApprovePermission, // 承認待ちでも差し戻し可能
          canCancelRegister: true,
          canCancelApprove: false,
          canIssue: false,
          canUpdateAmount: true,
          canReissue: false,
          canUpdateIssued: false,
        };

      case QUOT_STATUS.APPROVED: // 承認済
        return {
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canRequestProdQuot: false,
          canRegister: false,
          canApprove: false,
          canReject: hasApprovePermission, // 承認済でも差し戻し可能
          canCancelRegister: false,
          canCancelApprove: hasApprovePermission,
          canIssue: true,
          canUpdateAmount: true,
          canReissue: false,
          canUpdateIssued: false,
        };

      case QUOT_STATUS.ISSUED: // 発行済
        return {
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canRequestProdQuot: false,
          canRegister: false,
          canApprove: false,
          canReject: false,
          canCancelRegister: false,
          canCancelApprove: false,
          canIssue: false,
          canUpdateAmount: false,
          canReissue: true,
          canUpdateIssued: true,
        };

      default:
        // 不明なステータスの場合はすべて無効
        return {
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canRequestProdQuot: false,
          canRegister: false,
          canApprove: false,
          canReject: false,
          canCancelRegister: false,
          canCancelApprove: false,
          canIssue: false,
          canUpdateAmount: false,
          canReissue: false,
          canUpdateIssued: false,
        };
    }
  }, [quotStatus, prodQuotStatus, isNew, hasApprovePermission]);
}
