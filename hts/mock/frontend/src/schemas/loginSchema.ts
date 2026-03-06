import { z } from 'zod';

/**
 * バリデーションエラーメッセージ
 */
const VALIDATION_MESSAGES = {
  SECTION_CD: {
    REQUIRED: '部署コードを入力してください',
    NUMERIC: '半角数字で入力してください',
    LENGTH: '6桁で入力してください',
  },
  EMPLOYEE_CD: {
    REQUIRED: '社員コードを入力してください',
    NUMERIC: '半角数字で入力してください',
    LENGTH: '6桁で入力してください',
  },
} as const;

/**
 * ログインエラーメッセージ
 */
export const LOGIN_ERROR_MESSAGES = {
  GENERAL: 'ログインに失敗しました',
  RETRY: 'ログインに失敗しました。もう一度お試しください',
  INVALID_CREDENTIALS: '部署コードまたは社員コードが正しくありません',
} as const;

/**
 * ログインフォームのスキーマ
 */
export const loginSchema = z.object({
  section_cd: z
    .string()
    .min(1, VALIDATION_MESSAGES.SECTION_CD.REQUIRED)
    .regex(/^\d+$/, VALIDATION_MESSAGES.SECTION_CD.NUMERIC)
    .length(6, VALIDATION_MESSAGES.SECTION_CD.LENGTH),
  employee_cd: z
    .string()
    .min(1, VALIDATION_MESSAGES.EMPLOYEE_CD.REQUIRED)
    .regex(/^\d+$/, VALIDATION_MESSAGES.EMPLOYEE_CD.NUMERIC)
    .length(6, VALIDATION_MESSAGES.EMPLOYEE_CD.LENGTH),
});

/**
 * ログインフォームの型（Zodから型推論）
 */
export type LoginFormData = z.infer<typeof loginSchema>;
