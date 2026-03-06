# 見積Zodスキーマ仕様書

## 概要

見積機能で使用するZodスキーマと型定義の仕様書。

## ステータスコード定義

### 見積ステータス（quot_status）

```typescript
// frontend/src/lib/quot/types.ts

/**
 * 見積ステータス定数
 */
export const QUOT_STATUS = {
  DRAFT: '00',           // 作成中
  PENDING_APPROVAL: '10', // 承認待ち
  APPROVED: '20',         // 承認済
  ISSUED: '30',           // 発行済
} as const;

/**
 * 見積ステータスラベル
 */
export const QUOT_STATUS_LABEL = {
  [QUOT_STATUS.DRAFT]: '作成中',
  [QUOT_STATUS.PENDING_APPROVAL]: '承認待ち',
  [QUOT_STATUS.APPROVED]: '承認済',
  [QUOT_STATUS.ISSUED]: '発行済',
} as const;
```

### 制作見積ステータス（prod_quot_status）

```typescript
// frontend/src/lib/quot/types.ts

/**
 * 制作見積ステータス定数
 */
export const PROD_QUOT_STATUS = {
  BEFORE_REQUEST: '00',  // 制作見積依頼前
  REQUESTED: '10',       // 制作見積依頼済
  COMPLETED: '20',       // 制作見積済
  RECEIVED: '30',        // 制作見積受取済
} as const;

/**
 * 制作見積ステータスラベル
 */
export const PROD_QUOT_STATUS_LABEL = {
  [PROD_QUOT_STATUS.BEFORE_REQUEST]: '制作見積依頼前',
  [PROD_QUOT_STATUS.REQUESTED]: '制作見積依頼済',
  [PROD_QUOT_STATUS.COMPLETED]: '制作見積済',
  [PROD_QUOT_STATUS.RECEIVED]: '制作見積受取済',
} as const;
```

---

## 検索フォームスキーマ

```typescript
// frontend/src/schemas/quotSearchSchema.ts

/**
 * 部署コード「全て」を表す値
 */
export const SECTION_CD_ALL = 'all';

/**
 * ステータス「全て」を表す値
 */
export const STATUS_ALL = 'all';

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

const VALIDATION_MESSAGES = {
  SECTION_CD: {
    INVALID: '部署を選択してください',
  },
  STATUS: {
    INVALID: '有効な値を選択してください',
  },
  QUOTE_NO: {
    FORMAT: '半角数字で入力してください',
    LENGTH: '11桁以内で入力してください',
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

export const quotSearchSchema = z.object({
  // 部署コード（必須: 選択肢バリデーションはuseQuotSearchフックで実施）
  section_cd: z
    .string()
    .min(1, VALIDATION_MESSAGES.SECTION_CD.INVALID),
  quote_no: z
    .string()
    .regex(/^[0-9]*$/, VALIDATION_MESSAGES.QUOTE_NO.FORMAT)
    .max(11, VALIDATION_MESSAGES.QUOTE_NO.LENGTH)
    .optional()
    .or(z.literal('')),
  quote_date_from: z.string().optional().or(z.literal('')),
  quote_date_to: z.string().optional().or(z.literal('')),
  quot_subject: z
    .string()
    .max(50, VALIDATION_MESSAGES.QUOT_SUBJECT.LENGTH)
    .optional()
    .or(z.literal('')),
  // 得意先（オブジェクト形式）
  customer: z
    .object({
      customer_id: z.number().int().positive(),
      customer_cd: z.string(),
      customer_name: z.string(),
    })
    .nullable()
    .optional(),
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
}).refine(
  (data) => {
    if (data.quote_date_from && data.quote_date_to) {
      return new Date(data.quote_date_from) <= new Date(data.quote_date_to);
    }
    return true;
  },
  { message: VALIDATION_MESSAGES.DATE.RANGE, path: ['quote_date_to'] }
);

// 検索フォームの初期値
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
```

---

## 新規登録スキーマ

```typescript
// frontend/src/schemas/quotCreateSchema.ts

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
} as const;

export const quotCreateSchema = z.object({
  /** 品名（任意・50文字以内） */
  prod_name: z
    .string()
    .max(50, VALIDATION_MESSAGES.PROD_NAME.MAX_LENGTH)
    .optional()
    .or(z.literal('')),

  /** 得意先ID（必須） */
  customer_id: z
    .number({ required_error: VALIDATION_MESSAGES.CUSTOMER.REQUIRED, invalid_type_error: VALIDATION_MESSAGES.CUSTOMER.REQUIRED })
    .positive(VALIDATION_MESSAGES.CUSTOMER.REQUIRED),

  /** 得意先コード（表示・判定用） */
  customer_cd: z.string().optional(),

  /** 得意先名（任意・120文字以内） */
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
  center_id: z
    .number()
    .positive()
    .optional()
    .nullable(),

  /** 提出方法（必須） */
  submission_method: z
    .string({ required_error: VALIDATION_MESSAGES.SUBMISSION_METHOD.REQUIRED })
    .min(1, VALIDATION_MESSAGES.SUBMISSION_METHOD.REQUIRED),
});

// デフォルト値
export const quotCreateDefaultValues: Partial<QuotCreateFormData> = {
  prod_name: '',
  customer_id: undefined as unknown as number,  // フォーム初期状態では未選択
  customer_cd: undefined,
  customer_name: '',
  quot_subject: '',
  quot_summary: '',
  message: '',
  reference_doc_path: '',
  center_id: undefined,
  submission_method: SUBMISSION_METHOD.UNDECIDED,  // 初期値: 未定
};
```

---

## ステータス60更新スキーマ

```typescript
// frontend/src/schemas/quotStatus60Schema.ts

const VALIDATION_MESSAGES = {
  QUOT_DOC_PATH: {
    REQUIRED: '見積書格納先を入力してください',
    MAX_LENGTH: '255文字以内で入力してください',
  },
  LOST_REASON: {
    REQUIRED: '失注理由を入力してください',
    MAX_LENGTH: '2000文字以内で入力してください',
  },
} as const;

export const quotStatus60Schema = z.object({
  /** 見積書格納先（必須・255文字以内） */
  quot_doc_path: z
    .string()
    .min(1, VALIDATION_MESSAGES.QUOT_DOC_PATH.REQUIRED)
    .max(255, VALIDATION_MESSAGES.QUOT_DOC_PATH.MAX_LENGTH),

  /** 失注フラグ */
  is_lost: z.boolean(),

  /** 失注理由（失注時必須・2000文字以内） */
  lost_reason: z
    .string()
    .max(2000, VALIDATION_MESSAGES.LOST_REASON.MAX_LENGTH),
}).refine(
  (data) => {
    // is_lostがtrueの場合、lost_reasonは必須
    if (data.is_lost) {
      return data.lost_reason.trim().length > 0;
    }
    return true;
  },
  {
    message: VALIDATION_MESSAGES.LOST_REASON.REQUIRED,
    path: ['lost_reason'],
  }
);

export type QuotStatus60FormData = z.infer<typeof quotStatus60Schema>;

export const quotStatus60DefaultValues: QuotStatus60FormData = {
  quot_doc_path: '',
  is_lost: false,
  lost_reason: '',
};
```

---

## 差戻しスキーマ

```typescript
// frontend/src/schemas/quotRejectSchema.ts

export const quotRejectSchema = z.object({
  remand_reason: z
    .string()
    .min(1, { message: '差戻し理由を入力してください' })
    .max(1000, { message: '1000文字以内で入力してください' }),
});
```

---

## 見積金額スキーマ

```typescript
// frontend/src/schemas/quotAmountSchema.ts

const quotAmountItemSchema = z.object({
  prod_quot_operation_id: z.number(),
  quot_amount: z
    .number({ invalid_type_error: '見積金額を入力してください' })
    .min(0, { message: '0以上の金額を入力してください' })
    .max(999999999999, { message: '12桁以内で入力してください' }),
});

export const quotAmountSchema = z.object({
  amounts: z.array(quotAmountItemSchema).min(1),
});
```

---

## 型定義

```typescript
// frontend/src/lib/quot/types.ts

// 見積一覧の型
interface QuotListItem {
  quote_id: number;
  quote_no: string;
  customer_name: string;
  quot_subject: string | null;
  product_name: string | null;
  amount: number | null;
  quot_status: string;
  status_label: string;
}

// ソートフィールドの型
type QuotSortField = 'quote_no' | 'amount' | 'quot_status';

// ソート順の型
type SortOrder = 'asc' | 'desc';

// 検索パラメータの型
interface QuotSearchParams {
  section_cd?: string;
  quote_no?: string;
  quote_date_from?: string;
  quote_date_to?: string;
  quot_subject?: string;
  customer_id?: number;  // APIには customer_id のみ送信
  product_name?: string;
  status?: string;
  page?: number;
  per_page?: number;
  sort_field?: QuotSortField;
  sort_order?: SortOrder;
}

// 検索フォームの型
type QuotSearchFormData = z.infer<typeof quotSearchSchema>;

// 選択された得意先の型（lib/types.ts）
interface SelectedCustomer {
  customer_id: number;
  customer_cd: string;
  customer_name: string;
}

// 得意先サジェスト候補の型
interface QuotCustomerSuggestion {
  customer_id: number;
  customer_cd: string;
  customer_name: string;
}
```

---

## 関連ドキュメント

- [見積ページ仕様書](../pages/quotes.md)
- [見積登録・更新ページ仕様書](../pages/quotes-registration.md)
- [見積API仕様書](../../04-api/quotes.md)
- [バリデーション仕様](../validation.md)

---

## 更新履歴

- 2025-12-11: 初版作成
- 2025-12-15: quotCreateSchema追加
- 2025-12-16: quotRejectSchema, quotAmountSchema追加
- 2026-01-12: quotes.mdから分離
- 2026-01-12: quotStatus60Schema追加、quotCreateSchemaに定数類・提出方法・諸口対応を追加
- 2026-01-13: quotSearchSchemaの得意先をcustomer_query + customer_idからcustomerオブジェクトに変更
- 2026-01-13: quotCreateSchemaのcustomer_id, center_idにrequired_errorを追加（undefined時も日本語エラーメッセージ）
- 2026-01-18: ステータス体系を変更（QUOT_STATUS 4種類 + PROD_QUOT_STATUS 4種類）、見積書Noバリデーションを11桁に変更
- 2026-01-18: section_cdを必須バリデーションに変更、SECTION_CD_ALL定数を追加
- 2026-01-18: useQuotSearchフックにsection_cdの選択肢バリデーションを追加、形式チェックを削除
- 2026-01-18: statusを必須バリデーションに変更、STATUS_ALL定数とVALID_STATUS_VALUESを追加
- 2026-01-18: 日付範囲のエラーメッセージを「開始日 ≦ 終了日となるように入力してください」に変更
- 2026-01-19: quotCreateSchemaの新規登録時バリデーション変更
  - 品名、得意先、得意先名、見積件名、見積概要、主管センターを任意に変更
  - 提出方法の定数値をバックエンドに合わせて修正（UNDECIDED:'00', EMAIL:'10', POST:'20', HAND:'30'）
  - 提出方法に「未定」オプション追加、初期値を「未定」に設定
- 2026-01-19: quotCreateSchemaに伝達事項（message）フィールドを追加（任意、2000文字以内）
  - UI表示順: 主管センターの下に配置
- 2026-01-19: サーバー側バリデーションエラー表示機能を追加
  - フィールド別エラーを各入力欄の下に表示
  - 一般エラーをErrorMessageListに表示
- 2026-01-19: quotCreateSchemaのcustomer_idを必須に変更
- 2026-01-19: 主管センターの選択肢バリデーションをフロントエンドに追加
