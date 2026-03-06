import { z } from 'zod';

/**
 * バリデーションエラーメッセージ
 */
const VALIDATION_MESSAGES = {
  QUOT_DOC_PATH: {
    REQUIRED: '見積書格納先を入力してください',
    MAX_LENGTH: '255文字以内で入力してください',
  },
  LOST_REASON: {
    MAX_LENGTH: '2000文字以内で入力してください',
  },
} as const;

/**
 * ステータス60更新フォームのZodスキーマ
 */
export const quotStatus60Schema = z.object({
  /** 見積書格納先（必須・255文字以内） */
  quot_doc_path: z
    .string()
    .min(1, VALIDATION_MESSAGES.QUOT_DOC_PATH.REQUIRED)
    .max(255, VALIDATION_MESSAGES.QUOT_DOC_PATH.MAX_LENGTH),

  /** 失注フラグ */
  is_lost: z.boolean(),

  /** 失注理由（任意・2000文字以内） */
  lost_reason: z.string().max(2000, VALIDATION_MESSAGES.LOST_REASON.MAX_LENGTH),
});

/**
 * ステータス60更新フォームの型定義
 */
export type QuotStatus60FormData = z.infer<typeof quotStatus60Schema>;

/**
 * ステータス60更新フォームのデフォルト値
 */
export const quotStatus60DefaultValues: QuotStatus60FormData = {
  quot_doc_path: '',
  is_lost: false,
  lost_reason: '',
};
