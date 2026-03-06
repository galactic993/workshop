import { z } from 'zod';

/**
 * 指定日付の月末日を取得
 */
function getLastDayOfMonth(dateString: string): number {
  const date = new Date(dateString);
  // 翌月の0日目 = 当月の最終日
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

/**
 * バリデーションエラーメッセージ
 */
const VALIDATION_MESSAGES = {
  CUMULATIVE_PERIOD: {
    REQUIRED: '累計期間は必須です',
  },
  BUSINESS_DAYS: {
    REQUIRED: '営業日数は必須です',
    NUMERIC: '半角数字で入力してください',
    MAX_LENGTH: '2桁以内で入力してください',
    MIN: '1以上で入力してください',
    MAX: '31以下で入力してください',
  },
  WORKING_DAYS: {
    REQUIRED: '稼働日数は必須です',
    NUMERIC: '半角数字で入力してください',
    MAX_LENGTH: '2桁以内で入力してください',
    MIN: '1以上で入力してください',
    MAX: '31以下で入力してください',
  },
} as const;

/**
 * 日数バリデーション（営業日数・稼働日数共通）
 * 基本バリデーションのみ（月末日チェックはrefineで実施）
 */
const daysSchema = (messages: {
  REQUIRED: string;
  NUMERIC: string;
  MAX_LENGTH: string;
  MIN: string;
  MAX: string;
}) =>
  z
    .string()
    .min(1, messages.REQUIRED)
    .regex(/^\d+$/, messages.NUMERIC)
    .refine((val) => val.length <= 2, { message: messages.MAX_LENGTH })
    .refine((val) => parseInt(val, 10) >= 1, { message: messages.MIN })
    .refine((val) => parseInt(val, 10) <= 31, { message: messages.MAX });

/**
 * 受注週報（得意先別）フォームのスキーマ
 */
export const customerReportSchema = z
  .object({
    center_id: z.string().min(1, 'センターを選択してください'),
    cumulative_period_from: z.string().min(1, VALIDATION_MESSAGES.CUMULATIVE_PERIOD.REQUIRED),
    cumulative_period_to: z.string().min(1, VALIDATION_MESSAGES.CUMULATIVE_PERIOD.REQUIRED),
    business_days: daysSchema(VALIDATION_MESSAGES.BUSINESS_DAYS),
    working_days: daysSchema(VALIDATION_MESSAGES.WORKING_DAYS),
    include_aggregated: z.boolean(),
  })
  .refine(
    (data) => {
      if (!data.cumulative_period_to || !data.business_days) return true;
      const lastDay = getLastDayOfMonth(data.cumulative_period_to);
      const businessDays = parseInt(data.business_days, 10);
      return businessDays <= lastDay;
    },
    {
      message: '累計期間終了月の月末日以下で入力してください',
      path: ['business_days'],
    }
  )
  .refine(
    (data) => {
      if (!data.cumulative_period_to || !data.working_days) return true;
      const lastDay = getLastDayOfMonth(data.cumulative_period_to);
      const workingDays = parseInt(data.working_days, 10);
      return workingDays <= lastDay;
    },
    {
      message: '累計期間終了月の月末日以下で入力してください',
      path: ['working_days'],
    }
  );

/**
 * 受注週報（得意先別）フォームの型（Zodから型推論）
 */
export type CustomerReportFormData = z.infer<typeof customerReportSchema>;
