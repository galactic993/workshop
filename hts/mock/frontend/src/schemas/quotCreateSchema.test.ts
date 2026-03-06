import { describe, it, expect } from 'vitest';
import { quotCreateSchema, quotCreateDefaultValues, MISC_CUSTOMER_CD } from './quotCreateSchema';

describe('quotCreateSchema', () => {
  // テスト用の有効なデータ
  const validData = {
    prod_name: 'テスト品名',
    customer_id: 1,
    quot_subject: 'テスト見積件名',
    quot_summary: 'テスト見積概要',
    submission_method: '00',
    center_id: 1,
  };

  describe('prod_name（品名）', () => {
    it('任意入力（空でも許容）', () => {
      const result = quotCreateSchema.safeParse({
        ...validData,
        prod_name: '',
      });
      expect(result.success).toBe(true);
    });

    it('50文字以内は許容する', () => {
      const result = quotCreateSchema.safeParse({
        ...validData,
        prod_name: 'あ'.repeat(50),
      });
      expect(result.success).toBe(true);
    });

    it('50文字超でエラー', () => {
      const result = quotCreateSchema.safeParse({
        ...validData,
        prod_name: 'あ'.repeat(51),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('50文字以内で入力してください');
      }
    });

    it('1文字でも許容する', () => {
      const result = quotCreateSchema.safeParse({
        ...validData,
        prod_name: 'あ',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('customer_id（得意先）', () => {
    it('必須入力（undefinedでエラー）', () => {
      const result = quotCreateSchema.safeParse({
        ...validData,
        customer_id: undefined,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('得意先を選択してください');
      }
    });

    it('正の整数は許容する', () => {
      const result = quotCreateSchema.safeParse({
        ...validData,
        customer_id: 1,
      });
      expect(result.success).toBe(true);
    });

    it('0でエラー', () => {
      const result = quotCreateSchema.safeParse({
        ...validData,
        customer_id: 0,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('得意先を選択してください');
      }
    });

    it('負の数でエラー', () => {
      const result = quotCreateSchema.safeParse({
        ...validData,
        customer_id: -1,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('得意先を選択してください');
      }
    });

    it('nullでエラー', () => {
      const result = quotCreateSchema.safeParse({
        ...validData,
        customer_id: null,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('得意先を選択してください');
      }
    });

    it('文字列でエラー', () => {
      const result = quotCreateSchema.safeParse({
        ...validData,
        customer_id: 'abc',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('得意先を選択してください');
      }
    });
  });

  describe('quot_subject（見積件名）', () => {
    it('任意入力（空でも許容）', () => {
      const result = quotCreateSchema.safeParse({
        ...validData,
        quot_subject: '',
      });
      expect(result.success).toBe(true);
    });

    it('50文字以内は許容する', () => {
      const result = quotCreateSchema.safeParse({
        ...validData,
        quot_subject: 'あ'.repeat(50),
      });
      expect(result.success).toBe(true);
    });

    it('50文字超でエラー', () => {
      const result = quotCreateSchema.safeParse({
        ...validData,
        quot_subject: 'あ'.repeat(51),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('50文字以内で入力してください');
      }
    });

    it('1文字でも許容する', () => {
      const result = quotCreateSchema.safeParse({
        ...validData,
        quot_subject: 'あ',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('quot_summary（見積概要）', () => {
    it('任意入力（空でも許容）', () => {
      const result = quotCreateSchema.safeParse({
        ...validData,
        quot_summary: '',
      });
      expect(result.success).toBe(true);
    });

    it('2000文字以内は許容する', () => {
      const result = quotCreateSchema.safeParse({
        ...validData,
        quot_summary: 'あ'.repeat(2000),
      });
      expect(result.success).toBe(true);
    });

    it('2000文字超でエラー', () => {
      const result = quotCreateSchema.safeParse({
        ...validData,
        quot_summary: 'あ'.repeat(2001),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('2000文字以内で入力してください');
      }
    });

    it('1文字でも許容する', () => {
      const result = quotCreateSchema.safeParse({
        ...validData,
        quot_summary: 'あ',
      });
      expect(result.success).toBe(true);
    });

    it('改行を含む文字列も許容する', () => {
      const result = quotCreateSchema.safeParse({
        ...validData,
        quot_summary: '1行目\n2行目\n3行目',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('center_id（主管センター）', () => {
    it('任意入力（undefinedでも許容）', () => {
      const result = quotCreateSchema.safeParse({
        ...validData,
        center_id: undefined,
      });
      expect(result.success).toBe(true);
    });

    it('正の整数は許容する', () => {
      const result = quotCreateSchema.safeParse({
        ...validData,
        center_id: 1,
      });
      expect(result.success).toBe(true);
    });

    it('nullは許容する', () => {
      const result = quotCreateSchema.safeParse({
        ...validData,
        center_id: null,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('全フィールドバリデーション', () => {
    it('全ての必須フィールドが入力されていれば有効', () => {
      const result = quotCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('デフォルト値では無効（customer_idとsubmission_methodが必須）', () => {
      const result = quotCreateSchema.safeParse(quotCreateDefaultValues);
      expect(result.success).toBe(false);
    });

    it('customer_idが未入力でエラー', () => {
      const result = quotCreateSchema.safeParse({
        prod_name: '',
        customer_id: undefined,
        quot_subject: '',
        quot_summary: '',
        center_id: undefined,
        submission_method: '00',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        // customer_idのエラーがあることを確認
        const customerIdError = result.error.issues.find((issue) =>
          issue.path.includes('customer_id')
        );
        expect(customerIdError).toBeDefined();
      }
    });
  });

  describe('諸口（MISC_CUSTOMER_CD）の場合', () => {
    it('得意先名が入力されていれば有効', () => {
      const result = quotCreateSchema.safeParse({
        ...validData,
        customer_cd: MISC_CUSTOMER_CD,
        customer_name: '諸口得意先名',
      });
      expect(result.success).toBe(true);
    });

    it('諸口以外の場合は得意先名が空でも有効', () => {
      const result = quotCreateSchema.safeParse({
        ...validData,
        customer_cd: '12345',
        customer_name: '',
      });
      expect(result.success).toBe(true);
    });

    it('customer_name は任意入力', () => {
      const result = quotCreateSchema.safeParse({
        ...validData,
        customer_cd: MISC_CUSTOMER_CD,
        customer_name: '',
      });
      // 現在のスキーマではcustomer_nameは任意入力
      expect(result.success).toBe(true);
    });
  });
});
