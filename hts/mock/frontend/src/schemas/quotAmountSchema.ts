import { z } from 'zod';

/**
 * バリデーションエラーメッセージ
 */
const VALIDATION_MESSAGES = {
  QUOT_AMOUNT: {
    REQUIRED: '見積金額を入力してください',
    MIN: '0以上の金額を入力してください',
    MAX: '12桁以内で入力してください',
  },
} as const;

/**
 * 見積金額の最大値（12桁）
 */
export const QUOT_AMOUNT_MAX = 999999999999;

/**
 * 見積金額項目のスキーマ
 */
const quotAmountItemSchema = z.object({
  operation_id: z.number(),
  quot_amount: z
    .number({ invalid_type_error: VALIDATION_MESSAGES.QUOT_AMOUNT.REQUIRED })
    .min(0, { message: VALIDATION_MESSAGES.QUOT_AMOUNT.MIN })
    .max(QUOT_AMOUNT_MAX, { message: VALIDATION_MESSAGES.QUOT_AMOUNT.MAX }),
});

/**
 * 見積金額登録フォームのZodスキーマ
 */
export const quotAmountSchema = z.object({
  amounts: z.array(quotAmountItemSchema).min(1),
});

/**
 * 見積金額登録フォームの型定義
 */
export type QuotAmountFormData = z.infer<typeof quotAmountSchema>;

/**
 * 見積金額項目の型定義
 */
export type QuotAmountItem = z.infer<typeof quotAmountItemSchema>;
