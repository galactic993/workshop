import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { QUOT_STATUS, PROD_QUOT_STATUS } from '@/lib/quot/types';
import { useQuotFieldState } from './useQuotFieldState';

describe('useQuotFieldState', () => {
  describe('新規作成モード', () => {
    it('isNew=trueの場合、新規作成モードの状態を返す', () => {
      const { result } = renderHook(() =>
        useQuotFieldState({
          quotStatus: null,
          prodQuotStatus: null,
          isNew: true,
        })
      );

      expect(result.current).toEqual({
        isNewMode: true,
        isDetailEditable: true,
        showDetailForm: true,
        isAmountEditable: false,
        showAmountForm: false,
        showIssuedForm: false,
        showProdQuotOperations: false,
        showQuotOperations: false,
        showReuseButton: true,
        // フィールド単位の編集可否
        isCustomerEditable: true,
        isCustomerNameEditable: true,
        isSubjectEditable: true,
        isProdNameEditable: true,
        isSummaryEditable: true,
        isQuotAmountEditable: true,
        isSubmissionMethodEditable: true,
        isReferenceDocEditable: true,
        isCenterEditable: true,
        isNoteEditable: true,
        isStoragePathEditable: false,
        isLostInfoEditable: false,
      });
    });
  });

  describe('作成中（DRAFT/00）', () => {
    it('制作見積依頼前の場合、基本情報のみ編集可能', () => {
      const { result } = renderHook(() =>
        useQuotFieldState({
          quotStatus: QUOT_STATUS.DRAFT,
          prodQuotStatus: PROD_QUOT_STATUS.BEFORE_REQUEST,
          isNew: false,
        })
      );

      expect(result.current).toEqual({
        isNewMode: false,
        isDetailEditable: true,
        showDetailForm: true,
        isAmountEditable: false,
        showAmountForm: false,
        showIssuedForm: false,
        showProdQuotOperations: false,
        showQuotOperations: false,
        showReuseButton: true,
        // フィールド単位の編集可否
        isCustomerEditable: false,
        isCustomerNameEditable: true,
        isSubjectEditable: true,
        isProdNameEditable: true,
        isSummaryEditable: true,
        isQuotAmountEditable: true,
        isSubmissionMethodEditable: true,
        isReferenceDocEditable: true,
        isCenterEditable: true,
        isNoteEditable: true,
        isStoragePathEditable: false,
        isLostInfoEditable: false,
      });
    });

    it('制作見積済（COMPLETED/20）の場合、金額編集が可能になる', () => {
      const { result } = renderHook(() =>
        useQuotFieldState({
          quotStatus: QUOT_STATUS.DRAFT,
          prodQuotStatus: PROD_QUOT_STATUS.COMPLETED,
          isNew: false,
        })
      );

      expect(result.current).toEqual({
        isNewMode: false,
        isDetailEditable: true,
        showDetailForm: true,
        isAmountEditable: true,
        showAmountForm: true,
        showIssuedForm: false,
        showProdQuotOperations: false, // RECEIVED('30')のみ表示
        showQuotOperations: false,
        showReuseButton: true,
        // フィールド単位の編集可否（制作見積依頼済み）
        isCustomerEditable: false,
        isCustomerNameEditable: true,
        isSubjectEditable: true,
        isProdNameEditable: true,
        isSummaryEditable: false,
        isQuotAmountEditable: true,
        isSubmissionMethodEditable: true,
        isReferenceDocEditable: false,
        isCenterEditable: false,
        isNoteEditable: false,
        isStoragePathEditable: false,
        isLostInfoEditable: false,
      });
    });

    it('制作見積依頼済（REQUESTED/10）の場合、金額編集は不可', () => {
      const { result } = renderHook(() =>
        useQuotFieldState({
          quotStatus: QUOT_STATUS.DRAFT,
          prodQuotStatus: PROD_QUOT_STATUS.REQUESTED,
          isNew: false,
        })
      );

      expect(result.current).toEqual({
        isNewMode: false,
        isDetailEditable: true,
        showDetailForm: true,
        isAmountEditable: false,
        showAmountForm: false,
        showIssuedForm: false,
        showProdQuotOperations: false,
        showQuotOperations: false,
        showReuseButton: true,
        // フィールド単位の編集可否（制作見積依頼済み）
        isCustomerEditable: false,
        isCustomerNameEditable: true,
        isSubjectEditable: true,
        isProdNameEditable: true,
        isSummaryEditable: false,
        isQuotAmountEditable: true,
        isSubmissionMethodEditable: true,
        isReferenceDocEditable: false,
        isCenterEditable: false,
        isNoteEditable: false,
        isStoragePathEditable: false,
        isLostInfoEditable: false,
      });
    });

    it('制作見積受取済（RECEIVED/30）の場合、金額編集が可能になる', () => {
      const { result } = renderHook(() =>
        useQuotFieldState({
          quotStatus: QUOT_STATUS.DRAFT,
          prodQuotStatus: PROD_QUOT_STATUS.RECEIVED,
          isNew: false,
        })
      );

      expect(result.current).toEqual({
        isNewMode: false,
        isDetailEditable: true,
        showDetailForm: true,
        isAmountEditable: true,
        showAmountForm: true,
        showIssuedForm: false,
        showProdQuotOperations: true,
        showQuotOperations: false,
        showReuseButton: true,
        // フィールド単位の編集可否（制作見積依頼済み）
        isCustomerEditable: false,
        isCustomerNameEditable: true,
        isSubjectEditable: true,
        isProdNameEditable: true,
        isSummaryEditable: false,
        isQuotAmountEditable: true,
        isSubmissionMethodEditable: true,
        isReferenceDocEditable: false,
        isCenterEditable: false,
        isNoteEditable: false,
        isStoragePathEditable: false,
        isLostInfoEditable: false,
      });
    });

    it('流用作成（quot_operationsが存在）の場合、金額編集が可能', () => {
      const { result } = renderHook(() =>
        useQuotFieldState({
          quotStatus: QUOT_STATUS.DRAFT,
          prodQuotStatus: PROD_QUOT_STATUS.REQUESTED, // 制作見積依頼済だがquot_operationsがある
          isNew: false,
          hasQuotOperations: true,
        })
      );

      expect(result.current).toEqual({
        isNewMode: false,
        isDetailEditable: true,
        showDetailForm: true,
        isAmountEditable: true, // 流用作成なので編集可
        showAmountForm: true,
        showIssuedForm: false,
        showProdQuotOperations: false, // prod_quot_statusがCOMPLETED/RECEIVEDではないのでfalse
        showQuotOperations: false,
        showReuseButton: true,
        // フィールド単位の編集可否（制作見積依頼済み）
        isCustomerEditable: false,
        isCustomerNameEditable: true,
        isSubjectEditable: true,
        isProdNameEditable: true,
        isSummaryEditable: false,
        isQuotAmountEditable: true,
        isSubmissionMethodEditable: true,
        isReferenceDocEditable: false,
        isCenterEditable: false,
        isNoteEditable: false,
        isStoragePathEditable: false,
        isLostInfoEditable: false,
      });
    });
  });

  describe('承認待ち（PENDING_APPROVAL/10）', () => {
    it('基本情報は編集不可、金額編集可能', () => {
      const { result } = renderHook(() =>
        useQuotFieldState({
          quotStatus: QUOT_STATUS.PENDING_APPROVAL,
          prodQuotStatus: PROD_QUOT_STATUS.COMPLETED,
          isNew: false,
        })
      );

      expect(result.current).toEqual({
        isNewMode: false,
        isDetailEditable: false,
        showDetailForm: true,
        isAmountEditable: true,
        showAmountForm: true,
        showIssuedForm: false,
        showProdQuotOperations: false,
        showQuotOperations: true,
        showReuseButton: false,
        // フィールド単位の編集可否
        isCustomerEditable: false,
        isCustomerNameEditable: true,
        isSubjectEditable: true,
        isProdNameEditable: true,
        isSummaryEditable: false,
        isQuotAmountEditable: true,
        isSubmissionMethodEditable: true,
        isReferenceDocEditable: false,
        isCenterEditable: false,
        isNoteEditable: false,
        isStoragePathEditable: false,
        isLostInfoEditable: false,
      });
    });
  });

  describe('承認済（APPROVED/20）', () => {
    it('基本情報・金額ともに編集不可', () => {
      const { result } = renderHook(() =>
        useQuotFieldState({
          quotStatus: QUOT_STATUS.APPROVED,
          prodQuotStatus: PROD_QUOT_STATUS.COMPLETED,
          isNew: false,
        })
      );

      expect(result.current).toEqual({
        isNewMode: false,
        isDetailEditable: false,
        showDetailForm: true,
        isAmountEditable: false, // 承認済は編集不可
        showAmountForm: true,
        showIssuedForm: false,
        showProdQuotOperations: false,
        showQuotOperations: true,
        showReuseButton: false,
        // フィールド単位の編集可否
        isCustomerEditable: false,
        isCustomerNameEditable: true,
        isSubjectEditable: true,
        isProdNameEditable: true,
        isSummaryEditable: false,
        isQuotAmountEditable: true,
        isSubmissionMethodEditable: true,
        isReferenceDocEditable: false,
        isCenterEditable: false,
        isNoteEditable: false,
        isStoragePathEditable: false,
        isLostInfoEditable: false,
      });
    });
  });

  describe('発行済（ISSUED/30）', () => {
    it('発行済フォームのみ表示、格納先・失注情報が編集可能', () => {
      const { result } = renderHook(() =>
        useQuotFieldState({
          quotStatus: QUOT_STATUS.ISSUED,
          prodQuotStatus: PROD_QUOT_STATUS.COMPLETED,
          isNew: false,
        })
      );

      expect(result.current).toEqual({
        isNewMode: false,
        isDetailEditable: false,
        showDetailForm: true,
        isAmountEditable: false,
        showAmountForm: false,
        showIssuedForm: true,
        showProdQuotOperations: false,
        showQuotOperations: true,
        showReuseButton: false,
        // フィールド単位の編集可否（発行済み）
        isCustomerEditable: false,
        isCustomerNameEditable: false,
        isSubjectEditable: false,
        isProdNameEditable: false,
        isSummaryEditable: false,
        isQuotAmountEditable: true,
        isSubmissionMethodEditable: true,
        isReferenceDocEditable: false,
        isCenterEditable: false,
        isNoteEditable: false,
        isStoragePathEditable: true,
        isLostInfoEditable: true,
      });
    });
  });

  describe('不明なステータス', () => {
    it('nullの場合、すべて非表示・編集不可', () => {
      const { result } = renderHook(() =>
        useQuotFieldState({
          quotStatus: null,
          prodQuotStatus: null,
          isNew: false,
        })
      );

      expect(result.current).toEqual({
        isNewMode: false,
        isDetailEditable: false,
        showDetailForm: false,
        isAmountEditable: false,
        showAmountForm: false,
        showIssuedForm: false,
        showProdQuotOperations: false,
        showQuotOperations: false,
        showReuseButton: false,
        // フィールド単位の編集可否
        isCustomerEditable: false,
        isCustomerNameEditable: true,
        isSubjectEditable: true,
        isProdNameEditable: true,
        isSummaryEditable: true,
        isQuotAmountEditable: true,
        isSubmissionMethodEditable: true,
        isReferenceDocEditable: true,
        isCenterEditable: true,
        isNoteEditable: true,
        isStoragePathEditable: false,
        isLostInfoEditable: false,
      });
    });

    it('不正な値の場合、すべて非表示・編集不可', () => {
      const { result } = renderHook(() =>
        useQuotFieldState({
          quotStatus: '99', // 不正な値
          prodQuotStatus: PROD_QUOT_STATUS.COMPLETED,
          isNew: false,
        })
      );

      expect(result.current).toEqual({
        isNewMode: false,
        isDetailEditable: false,
        showDetailForm: false,
        isAmountEditable: false,
        showAmountForm: false,
        showIssuedForm: false,
        showProdQuotOperations: false,
        showQuotOperations: false,
        showReuseButton: false,
        // フィールド単位の編集可否（制作見積依頼済み）
        isCustomerEditable: false,
        isCustomerNameEditable: true,
        isSubjectEditable: true,
        isProdNameEditable: true,
        isSummaryEditable: false,
        isQuotAmountEditable: true,
        isSubmissionMethodEditable: true,
        isReferenceDocEditable: false,
        isCenterEditable: false,
        isNoteEditable: false,
        isStoragePathEditable: false,
        isLostInfoEditable: false,
      });
    });
  });

  describe('メモ化の動作確認', () => {
    it('同じ引数で再レンダリングしても同じオブジェクトを返す', () => {
      const { result, rerender } = renderHook(
        ({ quotStatus, prodQuotStatus, isNew }) =>
          useQuotFieldState({
            quotStatus,
            prodQuotStatus,
            isNew,
          }),
        {
          initialProps: {
            quotStatus: QUOT_STATUS.DRAFT,
            prodQuotStatus: PROD_QUOT_STATUS.COMPLETED,
            isNew: false,
          },
        }
      );

      const firstResult = result.current;
      rerender({
        quotStatus: QUOT_STATUS.DRAFT,
        prodQuotStatus: PROD_QUOT_STATUS.COMPLETED,
        isNew: false,
      });
      const secondResult = result.current;

      expect(firstResult).toBe(secondResult);
    });

    it('引数が変わると新しいオブジェクトを返す', () => {
      const { result, rerender } = renderHook(
        ({ quotStatus, prodQuotStatus, isNew }) =>
          useQuotFieldState({
            quotStatus,
            prodQuotStatus,
            isNew,
          }),
        {
          initialProps: {
            quotStatus: QUOT_STATUS.DRAFT,
            prodQuotStatus: PROD_QUOT_STATUS.BEFORE_REQUEST,
            isNew: false,
          },
        }
      );

      const firstResult = result.current;
      rerender({
        quotStatus: QUOT_STATUS.DRAFT,
        prodQuotStatus: PROD_QUOT_STATUS.COMPLETED,
        isNew: false,
      });
      const secondResult = result.current;

      expect(firstResult).not.toBe(secondResult);
      expect(firstResult.isAmountEditable).toBe(false);
      expect(secondResult.isAmountEditable).toBe(true);
    });
  });
});
