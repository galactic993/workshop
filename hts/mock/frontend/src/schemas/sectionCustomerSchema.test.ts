import { describe, it, expect } from 'vitest';
import { sectionCustomerFormSchema } from './sectionCustomerSchema';

describe('sectionCustomerFormSchema', () => {
  // 有効な得意先オブジェクト
  const validCustomer = {
    customer_id: 1,
    customer_cd: '00001',
    customer_name: 'テスト得意先',
  };

  describe('center_id', () => {
    it('空文字列でエラー', () => {
      const result = sectionCustomerFormSchema.safeParse({
        center_id: '',
        customer: null,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('センターを選択してください');
        expect(result.error.issues[0].path).toContain('center_id');
      }
    });

    it('値がある場合は許容する', () => {
      const result = sectionCustomerFormSchema.safeParse({
        center_id: '1',
        customer: validCustomer,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('customer（得意先オブジェクト）', () => {
    it('有効な得意先オブジェクトは許容する', () => {
      const result = sectionCustomerFormSchema.safeParse({
        center_id: '1',
        customer: validCustomer,
      });
      expect(result.success).toBe(true);
    });

    it('nullでエラー', () => {
      const result = sectionCustomerFormSchema.safeParse({
        center_id: '1',
        customer: null,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('得意先を選択してください');
      }
    });

    it('customer_idが0以下でエラー', () => {
      const result = sectionCustomerFormSchema.safeParse({
        center_id: '1',
        customer: {
          customer_id: 0,
          customer_cd: '00001',
          customer_name: 'テスト',
        },
      });
      expect(result.success).toBe(false);
    });

    it('customer_idが負の数でエラー', () => {
      const result = sectionCustomerFormSchema.safeParse({
        center_id: '1',
        customer: {
          customer_id: -1,
          customer_cd: '00001',
          customer_name: 'テスト',
        },
      });
      expect(result.success).toBe(false);
    });

    it('customer_idが小数でエラー', () => {
      const result = sectionCustomerFormSchema.safeParse({
        center_id: '1',
        customer: {
          customer_id: 1.5,
          customer_cd: '00001',
          customer_name: 'テスト',
        },
      });
      expect(result.success).toBe(false);
    });
  });

  describe('有効なフォームデータ', () => {
    it('センターと得意先の両方選択で有効', () => {
      const result = sectionCustomerFormSchema.safeParse({
        center_id: '1',
        customer: validCustomer,
      });
      expect(result.success).toBe(true);
    });
  });
});
