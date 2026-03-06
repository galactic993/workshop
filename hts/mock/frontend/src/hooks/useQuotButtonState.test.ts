import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { QUOT_STATUS, PROD_QUOT_STATUS } from '@/lib/quot/types';
import { useQuotButtonState } from './useQuotButtonState';

describe('useQuotButtonState', () => {
  describe('新規登録モード', () => {
    it('isNew=trueの場合、新規登録ボタンのみ有効', () => {
      const { result } = renderHook(() =>
        useQuotButtonState({
          quotStatus: null,
          prodQuotStatus: null,
          isNew: true,
          hasApprovePermission: false,
        })
      );

      expect(result.current).toEqual({
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
      });
    });

    it('承認権限があってもボタン状態は変わらない', () => {
      const { result } = renderHook(() =>
        useQuotButtonState({
          quotStatus: null,
          prodQuotStatus: null,
          isNew: true,
          hasApprovePermission: true,
        })
      );

      expect(result.current.canCreate).toBe(true);
      expect(result.current.canApprove).toBe(false);
    });
  });

  describe('作成中（DRAFT/00）', () => {
    it('制作見積依頼前の場合、更新・削除・制作見積依頼が可能', () => {
      const { result } = renderHook(() =>
        useQuotButtonState({
          quotStatus: QUOT_STATUS.DRAFT,
          prodQuotStatus: PROD_QUOT_STATUS.BEFORE_REQUEST,
          isNew: false,
          hasApprovePermission: false,
        })
      );

      expect(result.current.canUpdate).toBe(true);
      expect(result.current.canDelete).toBe(true);
      expect(result.current.canRequestProdQuot).toBe(true);
      expect(result.current.canRegister).toBe(false);
    });

    it('制作見積済（COMPLETED/20）の場合、見積登録が可能になるが削除は不可', () => {
      const { result } = renderHook(() =>
        useQuotButtonState({
          quotStatus: QUOT_STATUS.DRAFT,
          prodQuotStatus: PROD_QUOT_STATUS.COMPLETED,
          isNew: false,
          hasApprovePermission: false,
        })
      );

      expect(result.current.canUpdate).toBe(true);
      expect(result.current.canDelete).toBe(false);
      expect(result.current.canRequestProdQuot).toBe(false);
      expect(result.current.canRegister).toBe(true);
    });

    it('制作見積依頼済（REQUESTED/10）の場合、制作見積依頼・削除ボタンは無効', () => {
      const { result } = renderHook(() =>
        useQuotButtonState({
          quotStatus: QUOT_STATUS.DRAFT,
          prodQuotStatus: PROD_QUOT_STATUS.REQUESTED,
          isNew: false,
          hasApprovePermission: false,
        })
      );

      expect(result.current.canUpdate).toBe(true);
      expect(result.current.canDelete).toBe(false);
      expect(result.current.canRequestProdQuot).toBe(false);
      expect(result.current.canRegister).toBe(false);
    });
  });

  describe('承認待ち（PENDING_APPROVAL/10）', () => {
    it('承認権限ありの場合、承認・差戻しが可能', () => {
      const { result } = renderHook(() =>
        useQuotButtonState({
          quotStatus: QUOT_STATUS.PENDING_APPROVAL,
          prodQuotStatus: PROD_QUOT_STATUS.COMPLETED,
          isNew: false,
          hasApprovePermission: true,
        })
      );

      expect(result.current.canApprove).toBe(true);
      expect(result.current.canReject).toBe(true);
      expect(result.current.canCancelRegister).toBe(true);
      expect(result.current.canUpdateAmount).toBe(true);
      expect(result.current.canUpdate).toBe(false);
      expect(result.current.canDelete).toBe(false);
    });

    it('承認権限なしの場合、承認・差戻しは不可', () => {
      const { result } = renderHook(() =>
        useQuotButtonState({
          quotStatus: QUOT_STATUS.PENDING_APPROVAL,
          prodQuotStatus: PROD_QUOT_STATUS.COMPLETED,
          isNew: false,
          hasApprovePermission: false,
        })
      );

      expect(result.current.canApprove).toBe(false);
      expect(result.current.canReject).toBe(false);
      expect(result.current.canCancelRegister).toBe(true);
      expect(result.current.canUpdateAmount).toBe(true);
    });
  });

  describe('承認済（APPROVED/20）', () => {
    it('承認権限ありの場合、承認取消・発行・金額更新が可能', () => {
      const { result } = renderHook(() =>
        useQuotButtonState({
          quotStatus: QUOT_STATUS.APPROVED,
          prodQuotStatus: PROD_QUOT_STATUS.COMPLETED,
          isNew: false,
          hasApprovePermission: true,
        })
      );

      expect(result.current.canCancelApprove).toBe(true);
      expect(result.current.canIssue).toBe(true);
      expect(result.current.canUpdateAmount).toBe(true);
      expect(result.current.canApprove).toBe(false);
      expect(result.current.canReject).toBe(true); // 承認済でも差し戻し可能
    });

    it('承認権限なしの場合、承認取消は不可', () => {
      const { result } = renderHook(() =>
        useQuotButtonState({
          quotStatus: QUOT_STATUS.APPROVED,
          prodQuotStatus: PROD_QUOT_STATUS.COMPLETED,
          isNew: false,
          hasApprovePermission: false,
        })
      );

      expect(result.current.canCancelApprove).toBe(false);
      expect(result.current.canIssue).toBe(true);
      expect(result.current.canUpdateAmount).toBe(true);
    });
  });

  describe('発行済（ISSUED/30）', () => {
    it('再発行・発行済情報更新のみ可能', () => {
      const { result } = renderHook(() =>
        useQuotButtonState({
          quotStatus: QUOT_STATUS.ISSUED,
          prodQuotStatus: PROD_QUOT_STATUS.COMPLETED,
          isNew: false,
          hasApprovePermission: false,
        })
      );

      expect(result.current.canReissue).toBe(true);
      expect(result.current.canUpdateIssued).toBe(true);
      expect(result.current.canIssue).toBe(false);
      expect(result.current.canUpdateAmount).toBe(false);
      expect(result.current.canUpdate).toBe(false);
      expect(result.current.canDelete).toBe(false);
    });

    it('承認権限があってもボタン状態は変わらない', () => {
      const { result } = renderHook(() =>
        useQuotButtonState({
          quotStatus: QUOT_STATUS.ISSUED,
          prodQuotStatus: PROD_QUOT_STATUS.COMPLETED,
          isNew: false,
          hasApprovePermission: true,
        })
      );

      expect(result.current.canReissue).toBe(true);
      expect(result.current.canUpdateIssued).toBe(true);
      expect(result.current.canApprove).toBe(false);
      expect(result.current.canCancelApprove).toBe(false);
    });
  });

  describe('不明なステータス', () => {
    it('nullの場合、すべてのボタンが無効', () => {
      const { result } = renderHook(() =>
        useQuotButtonState({
          quotStatus: null,
          prodQuotStatus: null,
          isNew: false,
          hasApprovePermission: true,
        })
      );

      expect(result.current).toEqual({
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
      });
    });

    it('不正な値の場合、すべてのボタンが無効', () => {
      const { result } = renderHook(() =>
        useQuotButtonState({
          quotStatus: '99', // 不正な値
          prodQuotStatus: PROD_QUOT_STATUS.COMPLETED,
          isNew: false,
          hasApprovePermission: true,
        })
      );

      expect(result.current).toEqual({
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
      });
    });
  });

  describe('メモ化の動作確認', () => {
    it('同じ引数で再レンダリングしても同じオブジェクトを返す', () => {
      const { result, rerender } = renderHook(
        ({ quotStatus, prodQuotStatus, isNew, hasApprovePermission }) =>
          useQuotButtonState({
            quotStatus,
            prodQuotStatus,
            isNew,
            hasApprovePermission,
          }),
        {
          initialProps: {
            quotStatus: QUOT_STATUS.PENDING_APPROVAL,
            prodQuotStatus: PROD_QUOT_STATUS.COMPLETED,
            isNew: false,
            hasApprovePermission: true,
          },
        }
      );

      const firstResult = result.current;
      rerender({
        quotStatus: QUOT_STATUS.PENDING_APPROVAL,
        prodQuotStatus: PROD_QUOT_STATUS.COMPLETED,
        isNew: false,
        hasApprovePermission: true,
      });
      const secondResult = result.current;

      expect(firstResult).toBe(secondResult);
    });

    it('quotStatusが変わると新しいオブジェクトを返す', () => {
      const { result, rerender } = renderHook(
        ({ quotStatus, prodQuotStatus, isNew, hasApprovePermission }) =>
          useQuotButtonState({
            quotStatus,
            prodQuotStatus,
            isNew,
            hasApprovePermission,
          }),
        {
          initialProps: {
            quotStatus: QUOT_STATUS.PENDING_APPROVAL,
            prodQuotStatus: PROD_QUOT_STATUS.COMPLETED,
            isNew: false,
            hasApprovePermission: true,
          },
        }
      );

      const firstResult = result.current;
      rerender({
        quotStatus: QUOT_STATUS.APPROVED,
        prodQuotStatus: PROD_QUOT_STATUS.COMPLETED,
        isNew: false,
        hasApprovePermission: true,
      });
      const secondResult = result.current;

      expect(firstResult).not.toBe(secondResult);
      expect(firstResult.canApprove).toBe(true);
      expect(secondResult.canApprove).toBe(false);
      expect(secondResult.canIssue).toBe(true);
    });

    it('hasApprovePermissionが変わると新しいオブジェクトを返す', () => {
      const { result, rerender } = renderHook(
        ({ quotStatus, prodQuotStatus, isNew, hasApprovePermission }) =>
          useQuotButtonState({
            quotStatus,
            prodQuotStatus,
            isNew,
            hasApprovePermission,
          }),
        {
          initialProps: {
            quotStatus: QUOT_STATUS.PENDING_APPROVAL,
            prodQuotStatus: PROD_QUOT_STATUS.COMPLETED,
            isNew: false,
            hasApprovePermission: false,
          },
        }
      );

      const firstResult = result.current;
      rerender({
        quotStatus: QUOT_STATUS.PENDING_APPROVAL,
        prodQuotStatus: PROD_QUOT_STATUS.COMPLETED,
        isNew: false,
        hasApprovePermission: true,
      });
      const secondResult = result.current;

      expect(firstResult).not.toBe(secondResult);
      expect(firstResult.canApprove).toBe(false);
      expect(secondResult.canApprove).toBe(true);
    });
  });

  describe('ステータスと権限の組み合わせ', () => {
    it('作成中では承認権限は影響しない', () => {
      const resultWithPermission = renderHook(() =>
        useQuotButtonState({
          quotStatus: QUOT_STATUS.DRAFT,
          prodQuotStatus: PROD_QUOT_STATUS.COMPLETED,
          isNew: false,
          hasApprovePermission: true,
        })
      ).result;

      const resultWithoutPermission = renderHook(() =>
        useQuotButtonState({
          quotStatus: QUOT_STATUS.DRAFT,
          prodQuotStatus: PROD_QUOT_STATUS.COMPLETED,
          isNew: false,
          hasApprovePermission: false,
        })
      ).result;

      expect(resultWithPermission.current).toEqual(resultWithoutPermission.current);
    });

    it('発行済では承認権限は影響しない', () => {
      const resultWithPermission = renderHook(() =>
        useQuotButtonState({
          quotStatus: QUOT_STATUS.ISSUED,
          prodQuotStatus: PROD_QUOT_STATUS.COMPLETED,
          isNew: false,
          hasApprovePermission: true,
        })
      ).result;

      const resultWithoutPermission = renderHook(() =>
        useQuotButtonState({
          quotStatus: QUOT_STATUS.ISSUED,
          prodQuotStatus: PROD_QUOT_STATUS.COMPLETED,
          isNew: false,
          hasApprovePermission: false,
        })
      ).result;

      expect(resultWithPermission.current).toEqual(resultWithoutPermission.current);
    });
  });
});
