import { describe, it, expect } from 'vitest';
import {
  quotSearchSchema,
  QUOT_STATUS_CODE,
  QUOT_STATUS_LABEL,
  QUOT_STATUS_OPTIONS,
  quotSearchDefaultValues,
} from './quotSearchSchema';

describe('quotSearchSchema', () => {
  describe('section_cd', () => {
    it('有効な値を許容する', () => {
      const result = quotSearchSchema.safeParse({
        ...quotSearchDefaultValues,
        section_cd: '123456',
      });
      expect(result.success).toBe(true);
    });

    it('allを許容する', () => {
      const result = quotSearchSchema.safeParse({
        ...quotSearchDefaultValues,
        section_cd: 'all',
      });
      expect(result.success).toBe(true);
    });

    it('空文字列でエラー', () => {
      const result = quotSearchSchema.safeParse({
        ...quotSearchDefaultValues,
        section_cd: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('部署を選択してください');
      }
    });
  });

  describe('quote_no', () => {
    it('半角数字のみ許容する', () => {
      const result = quotSearchSchema.safeParse({
        ...quotSearchDefaultValues,
        quote_no: '123456789012',
      });
      expect(result.success).toBe(true);
    });

    it('半角数字以外でエラー', () => {
      const result = quotSearchSchema.safeParse({
        ...quotSearchDefaultValues,
        quote_no: 'ABC-001',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('半角数字で入力してください');
      }
    });

    it('12桁超でエラー', () => {
      const result = quotSearchSchema.safeParse({
        ...quotSearchDefaultValues,
        quote_no: '1234567890123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('12桁以内で入力してください');
      }
    });

    it('空文字列は許容する', () => {
      const result = quotSearchSchema.safeParse({
        ...quotSearchDefaultValues,
        quote_no: '',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('customer（得意先オブジェクト）', () => {
    const validCustomer = {
      customer_id: 1,
      customer_cd: '00001',
      customer_name: 'テスト得意先',
    };

    it('有効な得意先オブジェクトは許容する', () => {
      const result = quotSearchSchema.safeParse({
        ...quotSearchDefaultValues,
        customer: validCustomer,
      });
      expect(result.success).toBe(true);
    });

    it('nullは許容する', () => {
      const result = quotSearchSchema.safeParse({
        ...quotSearchDefaultValues,
        customer: null,
      });
      expect(result.success).toBe(true);
    });

    it('未指定（undefined）は許容する', () => {
      const result = quotSearchSchema.safeParse({
        ...quotSearchDefaultValues,
      });
      expect(result.success).toBe(true);
    });

    it('customer_idが0以下でエラー', () => {
      const result = quotSearchSchema.safeParse({
        ...quotSearchDefaultValues,
        customer: {
          customer_id: 0,
          customer_cd: '00001',
          customer_name: 'テスト',
        },
      });
      expect(result.success).toBe(false);
    });

    it('customer_idが負の数でエラー', () => {
      const result = quotSearchSchema.safeParse({
        ...quotSearchDefaultValues,
        customer: {
          customer_id: -1,
          customer_cd: '00001',
          customer_name: 'テスト',
        },
      });
      expect(result.success).toBe(false);
    });

    it('customer_idが小数でエラー', () => {
      const result = quotSearchSchema.safeParse({
        ...quotSearchDefaultValues,
        customer: {
          customer_id: 1.5,
          customer_cd: '00001',
          customer_name: 'テスト',
        },
      });
      expect(result.success).toBe(false);
    });
  });

  describe('quot_subject', () => {
    it('50文字以内は許容する', () => {
      const result = quotSearchSchema.safeParse({
        ...quotSearchDefaultValues,
        quot_subject: 'あ'.repeat(50),
      });
      expect(result.success).toBe(true);
    });

    it('50文字超でエラー', () => {
      const result = quotSearchSchema.safeParse({
        ...quotSearchDefaultValues,
        quot_subject: 'あ'.repeat(51),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('50文字以内で入力してください');
      }
    });

    it('空文字列は許容する', () => {
      const result = quotSearchSchema.safeParse({
        ...quotSearchDefaultValues,
        quot_subject: '',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('product_name', () => {
    it('50文字以内は許容する', () => {
      const result = quotSearchSchema.safeParse({
        ...quotSearchDefaultValues,
        product_name: 'あ'.repeat(50),
      });
      expect(result.success).toBe(true);
    });

    it('50文字超でエラー', () => {
      const result = quotSearchSchema.safeParse({
        ...quotSearchDefaultValues,
        product_name: 'あ'.repeat(51),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('50文字以内で入力してください');
      }
    });
  });

  describe('日付範囲チェック', () => {
    it('開始日 <= 終了日は許容する', () => {
      const result = quotSearchSchema.safeParse({
        ...quotSearchDefaultValues,
        quote_date_from: '2024-01-01',
        quote_date_to: '2024-01-31',
      });
      expect(result.success).toBe(true);
    });

    it('開始日 = 終了日は許容する', () => {
      const result = quotSearchSchema.safeParse({
        ...quotSearchDefaultValues,
        quote_date_from: '2024-01-01',
        quote_date_to: '2024-01-01',
      });
      expect(result.success).toBe(true);
    });

    it('開始日 > 終了日でエラー', () => {
      const result = quotSearchSchema.safeParse({
        ...quotSearchDefaultValues,
        quote_date_from: '2024-01-31',
        quote_date_to: '2024-01-01',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('開始日 ≦ 終了日となるように入力してください');
        expect(result.error.issues[0].path).toContain('quote_date_to');
      }
    });

    it('片方のみ入力でも許容する（開始日のみ）', () => {
      const result = quotSearchSchema.safeParse({
        ...quotSearchDefaultValues,
        quote_date_from: '2024-01-01',
        quote_date_to: '',
      });
      expect(result.success).toBe(true);
    });

    it('片方のみ入力でも許容する（終了日のみ）', () => {
      const result = quotSearchSchema.safeParse({
        ...quotSearchDefaultValues,
        quote_date_from: '',
        quote_date_to: '2024-01-31',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('空文字列の許容', () => {
    it('全フィールド空文字列で有効', () => {
      const result = quotSearchSchema.safeParse(quotSearchDefaultValues);
      expect(result.success).toBe(true);
    });
  });
});

describe('QUOT_STATUS定数', () => {
  describe('QUOT_STATUS_CODE', () => {
    it('4つのステータスコードを持つ', () => {
      expect(Object.keys(QUOT_STATUS_CODE)).toHaveLength(4);
    });

    it('正しいコード値を持つ', () => {
      expect(QUOT_STATUS_CODE.DRAFT).toBe('00');
      expect(QUOT_STATUS_CODE.PENDING_APPROVAL).toBe('10');
      expect(QUOT_STATUS_CODE.APPROVED).toBe('20');
      expect(QUOT_STATUS_CODE.ISSUED).toBe('30');
    });
  });

  describe('QUOT_STATUS_LABEL', () => {
    it('全てのコードに対応するラベルを持つ', () => {
      expect(QUOT_STATUS_LABEL['00']).toBe('作成中');
      expect(QUOT_STATUS_LABEL['10']).toBe('承認待ち');
      expect(QUOT_STATUS_LABEL['20']).toBe('承認済');
      expect(QUOT_STATUS_LABEL['30']).toBe('発行済');
    });
  });

  describe('QUOT_STATUS_OPTIONS', () => {
    it('5つの選択肢を持つ（全て + 4ステータス）', () => {
      expect(QUOT_STATUS_OPTIONS).toHaveLength(5);
    });

    it('最初の選択肢は「全て」', () => {
      expect(QUOT_STATUS_OPTIONS[0]).toEqual({ value: 'all', label: '全て' });
    });

    it('全ての選択肢がvalue/labelプロパティを持つ', () => {
      QUOT_STATUS_OPTIONS.forEach((option) => {
        expect(option).toHaveProperty('value');
        expect(option).toHaveProperty('label');
      });
    });
  });
});
