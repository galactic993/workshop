import { z } from 'zod';

/**
 * バリデーションエラーメッセージ
 */
const VALIDATION_MESSAGES = {
  REMAND_REASON: {
    REQUIRED: '差戻し理由を入力してください',
    MAX_LENGTH: '1000文字以内で入力してください',
  },
} as const;

/**
 * 差戻しフォームのZodスキーマ
 */
export const quotRejectSchema = z.object({
  remand_reason: z
    .string()
    .min(1, { message: VALIDATION_MESSAGES.REMAND_REASON.REQUIRED })
    .max(1000, { message: VALIDATION_MESSAGES.REMAND_REASON.MAX_LENGTH }),
});

/**
 * 差戻しフォームの型定義
 */
export type QuotRejectFormData = z.infer<typeof quotRejectSchema>;

/**
 * 差戻しフォームのデフォルト値
 */
export const quotRejectDefaultValues: QuotRejectFormData = {
  remand_reason: '',
};
