import { z } from 'zod';

/**
 * 部署コード「全て」を表す値
 */
export const SECTION_CD_ALL = 'all';

/**
 * ステータス「全て」を表す値
 */
export const STATUS_ALL = 'all';

/**
 * 見積ステータスコードの定義（検索フォーム用）
 * ※ lib/quot/types.ts の QUOT_STATUS と同じ値
 */
export const QUOT_STATUS_CODE = {
  DRAFT: '00', // 作成中
  PENDING_APPROVAL: '10', // 承認待ち
  APPROVED: '20', // 承認済
  ISSUED: '30', // 発行済
} as const;

/**
 * 見積ステータスラベルの定義
 */
export const QUOT_STATUS_LABEL = {
  [QUOT_STATUS_CODE.DRAFT]: '作成中',
  [QUOT_STATUS_CODE.PENDING_APPROVAL]: '承認待ち',
  [QUOT_STATUS_CODE.APPROVED]: '承認済',
  [QUOT_STATUS_CODE.ISSUED]: '発行済',
} as const;

export type QuotStatusCode = (typeof QUOT_STATUS_CODE)[keyof typeof QUOT_STATUS_CODE];

/**
 * ステータス選択肢（ラジオボタン用）
 */
export const QUOT_STATUS_OPTIONS = [
  { value: STATUS_ALL, label: '全て' },
  { value: QUOT_STATUS_CODE.DRAFT, label: QUOT_STATUS_LABEL[QUOT_STATUS_CODE.DRAFT] },
  {
    value: QUOT_STATUS_CODE.PENDING_APPROVAL,
    label: QUOT_STATUS_LABEL[QUOT_STATUS_CODE.PENDING_APPROVAL],
  },
  { value: QUOT_STATUS_CODE.APPROVED, label: QUOT_STATUS_LABEL[QUOT_STATUS_CODE.APPROVED] },
  { value: QUOT_STATUS_CODE.ISSUED, label: QUOT_STATUS_LABEL[QUOT_STATUS_CODE.ISSUED] },
] as const;

/**
 * 有効なステータス値の配列（バリデーション用）
 */
export const VALID_STATUS_VALUES = [
  STATUS_ALL,
  QUOT_STATUS_CODE.DRAFT,
  QUOT_STATUS_CODE.PENDING_APPROVAL,
  QUOT_STATUS_CODE.APPROVED,
  QUOT_STATUS_CODE.ISSUED,
] as const;

/**
 * バリデーションエラーメッセージ
 */
const VALIDATION_MESSAGES = {
  SECTION_CD: {
    INVALID: '部署を選択してください',
  },
  STATUS: {
    INVALID: '有効な値を選択してください',
  },
  QUOTE_NO: {
    FORMAT: '半角数字で入力してください',
    LENGTH: '12桁以内で入力してください',
  },
  DATE: {
    RANGE: '開始日 ≦ 終了日となるように入力してください',
  },
  PRODUCT_NAME: {
    LENGTH: '50文字以内で入力してください',
  },
  QUOT_SUBJECT: {
    LENGTH: '50文字以内で入力してください',
  },
} as const;

/**
 * 見積検索フォームのスキーマ
 */
export const quotSearchSchema = z
  .object({
    // 部署コード（必須: 選択肢バリデーションはuseQuotSearchフックで実施）
    section_cd: z.string().min(1, VALIDATION_MESSAGES.SECTION_CD.INVALID),
    // 見積No（12桁以内、半角数字のみ）
    quote_no: z
      .string()
      .regex(/^[0-9]*$/, VALIDATION_MESSAGES.QUOTE_NO.FORMAT)
      .max(12, VALIDATION_MESSAGES.QUOTE_NO.LENGTH)
      .optional()
      .or(z.literal('')),
    // 見積日（開始）
    quote_date_from: z.string().optional().or(z.literal('')),
    // 見積日（終了）
    quote_date_to: z.string().optional().or(z.literal('')),
    // 見積件名（50文字以内）
    quot_subject: z
      .string()
      .max(50, VALIDATION_MESSAGES.QUOT_SUBJECT.LENGTH)
      .optional()
      .or(z.literal('')),
    // 得意先（選択されたオブジェクト）
    customer: z
      .object({
        customer_id: z.number().int().positive(),
        customer_cd: z.string(),
        customer_name: z.string(),
      })
      .nullable()
      .optional(),
    // 品名（50文字以内）
    product_name: z
      .string()
      .max(50, VALIDATION_MESSAGES.PRODUCT_NAME.LENGTH)
      .optional()
      .or(z.literal('')),
    // ステータス（必須: 選択肢バリデーション）
    status: z
      .string()
      .refine(
        (val) => (VALID_STATUS_VALUES as readonly string[]).includes(val),
        VALIDATION_MESSAGES.STATUS.INVALID
      ),
  })
  .refine(
    (data) => {
      // 見積日の範囲チェック（両方入力されている場合のみ）
      if (data.quote_date_from && data.quote_date_to) {
        return new Date(data.quote_date_from) <= new Date(data.quote_date_to);
      }
      return true;
    },
    {
      message: VALIDATION_MESSAGES.DATE.RANGE,
      path: ['quote_date_to'],
    }
  );

/**
 * フォームの型（Zodから型推論）
 */
export type QuotSearchFormData = z.infer<typeof quotSearchSchema>;

/**
 * 検索フォームの初期値
 */
export const quotSearchDefaultValues: QuotSearchFormData = {
  section_cd: SECTION_CD_ALL,
  quote_no: '',
  quote_date_from: '',
  quote_date_to: '',
  quot_subject: '',
  customer: null,
  product_name: '',
  status: STATUS_ALL,
};
