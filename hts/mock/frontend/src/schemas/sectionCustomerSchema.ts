import { z } from 'zod';

/**
 * バリデーションエラーメッセージ
 */
const VALIDATION_MESSAGES = {
  CENTER: {
    REQUIRED: 'センターを選択してください',
  },
  CUSTOMER: {
    REQUIRED: '得意先を選択してください',
  },
} as const;

/**
 * 得意先オブジェクトのスキーマ
 */
const customerObjectSchema = z.object({
  customer_id: z.number().int().positive(),
  customer_cd: z.string(),
  customer_name: z.string(),
});

/**
 * 部署別得意先メンテナンス登録フォームのスキーマ
 */
export const sectionCustomerFormSchema = z.object({
  center_id: z.string().min(1, VALIDATION_MESSAGES.CENTER.REQUIRED),
  customer: customerObjectSchema.nullable().refine((val) => val !== null, {
    message: VALIDATION_MESSAGES.CUSTOMER.REQUIRED,
  }),
});

/**
 * フォームの入力型（初期値・フォーム操作用）
 */
export type SectionCustomerFormInput = z.input<typeof sectionCustomerFormSchema>;

/**
 * フォームの出力型（バリデーション後）
 */
export type SectionCustomerFormData = z.infer<typeof sectionCustomerFormSchema>;
