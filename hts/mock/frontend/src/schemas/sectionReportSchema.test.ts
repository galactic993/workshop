import { describe, it, expect } from 'vitest';
import { sectionReportSchema } from './sectionReportSchema';

describe('sectionReportSchema', () => {
  // 有効なフォームデータ
  const validFormData = {
    cumulative_period_from: '2026-01-01',
    cumulative_period_to: '2026-01-28',
    business_days: '20',
    working_days: '15',
    include_aggregated: false,
  };

  describe('正常系', () => {
    it('有効な値でバリデーション通過', () => {
      const result = sectionReportSchema.safeParse(validFormData);
      expect(result.success).toBe(true);
    });

    it('include_aggregatedがtrueでも通過', () => {
      const result = sectionReportSchema.safeParse({
        ...validFormData,
        include_aggregated: true,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('cumulative_period_from（累計期間開始）', () => {
    it('空文字列でエラー', () => {
      const result = sectionReportSchema.safeParse({
        ...validFormData,
        cumulative_period_from: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('累計期間は必須です');
        expect(result.error.issues[0].path).toContain('cumulative_period_from');
      }
    });
  });

  describe('cumulative_period_to（累計期間終了）', () => {
    it('空文字列でエラー', () => {
      const result = sectionReportSchema.safeParse({
        ...validFormData,
        cumulative_period_to: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('累計期間は必須です');
        expect(result.error.issues[0].path).toContain('cumulative_period_to');
      }
    });
  });

  describe('business_days（営業日数）', () => {
    it('空文字列でエラー（必須チェック）', () => {
      const result = sectionReportSchema.safeParse({
        ...validFormData,
        business_days: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('営業日数は必須です');
        expect(result.error.issues[0].path).toContain('business_days');
      }
    });

    it('全角数字でエラー（半角数字チェック）', () => {
      const result = sectionReportSchema.safeParse({
        ...validFormData,
        business_days: '２０',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('半角数字で入力してください');
      }
    });

    it('アルファベットでエラー（半角数字チェック）', () => {
      const result = sectionReportSchema.safeParse({
        ...validFormData,
        business_days: 'ab',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('半角数字で入力してください');
      }
    });

    it('記号でエラー（半角数字チェック）', () => {
      const result = sectionReportSchema.safeParse({
        ...validFormData,
        business_days: '-1',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('半角数字で入力してください');
      }
    });

    it('3桁以上でエラー（2桁以内チェック）', () => {
      const result = sectionReportSchema.safeParse({
        ...validFormData,
        business_days: '100',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('2桁以内で入力してください');
      }
    });

    it('0でエラー（1以上チェック）', () => {
      const result = sectionReportSchema.safeParse({
        ...validFormData,
        business_days: '0',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('1以上で入力してください');
      }
    });

    it('32でエラー（31以下チェック）', () => {
      const result = sectionReportSchema.safeParse({
        ...validFormData,
        business_days: '32',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('31以下で入力してください');
      }
    });

    it('1は成功（境界値）', () => {
      const result = sectionReportSchema.safeParse({
        ...validFormData,
        business_days: '1',
      });
      expect(result.success).toBe(true);
    });

    it('31は成功（境界値）', () => {
      const result = sectionReportSchema.safeParse({
        ...validFormData,
        business_days: '31',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('working_days（稼働日数）', () => {
    it('空文字列でエラー（必須チェック）', () => {
      const result = sectionReportSchema.safeParse({
        ...validFormData,
        working_days: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('稼働日数は必須です');
        expect(result.error.issues[0].path).toContain('working_days');
      }
    });

    it('全角数字でエラー（半角数字チェック）', () => {
      const result = sectionReportSchema.safeParse({
        ...validFormData,
        working_days: '１５',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('半角数字で入力してください');
      }
    });

    it('アルファベットでエラー（半角数字チェック）', () => {
      const result = sectionReportSchema.safeParse({
        ...validFormData,
        working_days: 'xy',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('半角数字で入力してください');
      }
    });

    it('記号でエラー（半角数字チェック）', () => {
      const result = sectionReportSchema.safeParse({
        ...validFormData,
        working_days: '+5',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('半角数字で入力してください');
      }
    });

    it('3桁以上でエラー（2桁以内チェック）', () => {
      const result = sectionReportSchema.safeParse({
        ...validFormData,
        working_days: '999',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('2桁以内で入力してください');
      }
    });

    it('0でエラー（1以上チェック）', () => {
      const result = sectionReportSchema.safeParse({
        ...validFormData,
        working_days: '0',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('1以上で入力してください');
      }
    });

    it('32でエラー（31以下チェック）', () => {
      const result = sectionReportSchema.safeParse({
        ...validFormData,
        working_days: '32',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('31以下で入力してください');
      }
    });

    it('1は成功（境界値）', () => {
      const result = sectionReportSchema.safeParse({
        ...validFormData,
        working_days: '1',
      });
      expect(result.success).toBe(true);
    });

    it('31は成功（境界値）', () => {
      const result = sectionReportSchema.safeParse({
        ...validFormData,
        working_days: '31',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('月末日バリデーション', () => {
    it('2月の場合、営業日数29でエラー（28日月）', () => {
      const result = sectionReportSchema.safeParse({
        ...validFormData,
        cumulative_period_to: '2025-02-28', // 平年2月（28日まで）
        business_days: '29',
        working_days: '20',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('累計期間終了月の月末日以下で入力してください');
      }
    });

    it('2月の場合、稼働日数29でエラー（28日月）', () => {
      const result = sectionReportSchema.safeParse({
        ...validFormData,
        cumulative_period_to: '2025-02-28',
        business_days: '20',
        working_days: '29',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('累計期間終了月の月末日以下で入力してください');
      }
    });

    it('2月の場合、28日は成功（境界値）', () => {
      const result = sectionReportSchema.safeParse({
        ...validFormData,
        cumulative_period_to: '2025-02-28',
        business_days: '28',
        working_days: '28',
      });
      expect(result.success).toBe(true);
    });

    it('閏年2月の場合、29日は成功', () => {
      const result = sectionReportSchema.safeParse({
        ...validFormData,
        cumulative_period_to: '2024-02-29', // 閏年2月
        business_days: '29',
        working_days: '29',
      });
      expect(result.success).toBe(true);
    });

    it('閏年2月の場合、30日でエラー', () => {
      const result = sectionReportSchema.safeParse({
        ...validFormData,
        cumulative_period_to: '2024-02-29',
        business_days: '30',
        working_days: '20',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('累計期間終了月の月末日以下で入力してください');
      }
    });

    it('4月の場合、営業日数31でエラー（30日月）', () => {
      const result = sectionReportSchema.safeParse({
        ...validFormData,
        cumulative_period_to: '2026-04-30',
        business_days: '31',
        working_days: '20',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('累計期間終了月の月末日以下で入力してください');
      }
    });

    it('4月の場合、30日は成功（境界値）', () => {
      const result = sectionReportSchema.safeParse({
        ...validFormData,
        cumulative_period_to: '2026-04-30',
        business_days: '30',
        working_days: '30',
      });
      expect(result.success).toBe(true);
    });

    it('1月の場合、31日は成功', () => {
      const result = sectionReportSchema.safeParse({
        ...validFormData,
        cumulative_period_to: '2026-01-31',
        business_days: '31',
        working_days: '31',
      });
      expect(result.success).toBe(true);
    });
  });
});
