import { z } from 'zod';

/**
 * 諸口の得意先コード
 */
export const MISC_CUSTOMER_CD = '33900';

/**
 * 提出方法の定数
 */
export const SUBMISSION_METHOD = {
  UNDECIDED: '00',
  EMAIL: '10',
  POST: '20',
  HAND: '30',
} as const;

/**
 * 提出方法のオプション
 */
export const SUBMISSION_METHOD_OPTIONS = [
  { value: SUBMISSION_METHOD.UNDECIDED, label: '未定' },
  { value: SUBMISSION_METHOD.EMAIL, label: 'メール' },
  { value: SUBMISSION_METHOD.POST, label: '郵送' },
  { value: SUBMISSION_METHOD.HAND, label: '持参' },
] as const;

/**
 * バリデーションエラーメッセージ
 */
const VALIDATION_MESSAGES = {
  PROD_NAME: {
    REQUIRED: '品名を入力してください',
    MAX_LENGTH: '50文字以内で入力してください',
  },
  CUSTOMER: {
    REQUIRED: '得意先を選択してください',
  },
  CUSTOMER_NAME: {
    REQUIRED: '諸口の場合は得意先名を入力してください',
    MAX_LENGTH: '120文字以内で入力してください',
  },
  QUOT_SUBJECT: {
    REQUIRED: '見積件名を入力してください',
    MAX_LENGTH: '50文字以内で入力してください',
  },
  QUOT_SUMMARY: {
    REQUIRED: '見積概要を入力してください',
    MAX_LENGTH: '2000文字以内で入力してください',
  },
  MESSAGE: {
    MAX_LENGTH: '2000文字以内で入力してください',
  },
  REFERENCE_DOC_PATH: {
    MAX_LENGTH: '255文字以内で入力してください',
  },
  CENTER: {
    REQUIRED: '主管センターを選択してください',
  },
  SUBMISSION_METHOD: {
    REQUIRED: '提出方法を選択してください',
  },
  QUOT_AMOUNT: {
    MIN: '金額は0以上で入力してください',
    MAX: '金額は999,999,999以内で入力してください',
  },
  QUOT_DOC_PATH: {
    MAX_LENGTH: '255文字以内で入力してください',
  },
  LOST_REASON: {
    MAX_LENGTH: '2000文字以内で入力してください',
  },
} as const;

/**
 * 見積新規登録フォームのスキーマ
 */
export const quotCreateSchema = z.object({
  /** 品名（任意・50文字以内） */
  prod_name: z
    .string()
    .max(50, VALIDATION_MESSAGES.PROD_NAME.MAX_LENGTH)
    .optional()
    .or(z.literal('')),

  /** 得意先ID（必須） */
  customer_id: z
    .number({
      required_error: VALIDATION_MESSAGES.CUSTOMER.REQUIRED,
      invalid_type_error: VALIDATION_MESSAGES.CUSTOMER.REQUIRED,
    })
    .positive(VALIDATION_MESSAGES.CUSTOMER.REQUIRED),

  /** 得意先コード（表示・判定用） */
  customer_cd: z.string().optional(),

  /** 得意先名（諸口の場合に入力・120文字以内） */
  customer_name: z
    .string()
    .max(120, VALIDATION_MESSAGES.CUSTOMER_NAME.MAX_LENGTH)
    .optional()
    .or(z.literal('')),

  /** 見積件名（任意・50文字以内） */
  quot_subject: z
    .string()
    .max(50, VALIDATION_MESSAGES.QUOT_SUBJECT.MAX_LENGTH)
    .optional()
    .or(z.literal('')),

  /** 見積概要（任意・2000文字以内） */
  quot_summary: z
    .string()
    .max(2000, VALIDATION_MESSAGES.QUOT_SUMMARY.MAX_LENGTH)
    .optional()
    .or(z.literal('')),

  /** 伝達事項（任意・2000文字以内） */
  message: z
    .string()
    .max(2000, VALIDATION_MESSAGES.MESSAGE.MAX_LENGTH)
    .optional()
    .or(z.literal('')),

  /** 参考資料パス（任意・255文字以内） */
  reference_doc_path: z
    .string()
    .max(255, VALIDATION_MESSAGES.REFERENCE_DOC_PATH.MAX_LENGTH)
    .optional()
    .or(z.literal('')),

  /** 主管センターID（任意） */
  center_id: z.number().positive().optional().nullable(),

  /** 提出方法（必須） */
  submission_method: z
    .string({ required_error: VALIDATION_MESSAGES.SUBMISSION_METHOD.REQUIRED })
    .min(1, VALIDATION_MESSAGES.SUBMISSION_METHOD.REQUIRED),

  /** 見積金額（任意・0以上999,999,999以下） */
  quot_amount: z
    .number()
    .min(0, VALIDATION_MESSAGES.QUOT_AMOUNT.MIN)
    .max(999_999_999, VALIDATION_MESSAGES.QUOT_AMOUNT.MAX)
    .optional()
    .nullable(),

  /** 見積書格納先（任意・255文字以内） */
  quot_doc_path: z
    .string()
    .max(255, VALIDATION_MESSAGES.QUOT_DOC_PATH.MAX_LENGTH)
    .optional()
    .or(z.literal('')),

  /** 失注フラグ（任意） */
  is_lost: z.boolean().optional(),

  /** 失注理由（任意・2000文字以内） */
  lost_reason: z
    .string()
    .max(2000, VALIDATION_MESSAGES.LOST_REASON.MAX_LENGTH)
    .optional()
    .or(z.literal('')),
});

/**
 * 見積作成フォームの型
 */
export type QuotCreateFormData = z.infer<typeof quotCreateSchema>;

/**
 * 見積作成フォームのデフォルト値
 */
export const quotCreateDefaultValues: Partial<QuotCreateFormData> = {
  prod_name: '',
  customer_id: undefined as unknown as number, // フォーム初期状態では未選択
  customer_cd: undefined,
  customer_name: '',
  quot_subject: '',
  quot_summary: '',
  message: '',
  reference_doc_path: '',
  center_id: undefined,
  submission_method: SUBMISSION_METHOD.UNDECIDED,
  quot_amount: undefined,
  quot_doc_path: '',
  is_lost: false,
  lost_reason: '',
};
