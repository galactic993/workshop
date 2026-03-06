import { SortOrder, BaseCustomer } from '../types';

/**
 * 見積ステータス定数
 */
export const QUOT_STATUS = {
  DRAFT: '00', // 作成中
  PENDING_APPROVAL: '10', // 承認待ち
  APPROVED: '20', // 承認済
  ISSUED: '30', // 発行済
} as const;

/**
 * 制作見積ステータス定数
 */
export const PROD_QUOT_STATUS = {
  BEFORE_REQUEST: '00', // 制作見積依頼前
  REQUESTED: '10', // 制作見積依頼済
  COMPLETED: '20', // 制作見積済
  RECEIVED: '30', // 制作見積受取済
} as const;

/**
 * 見積一覧アイテムの型定義
 */
export interface QuotListItem {
  quote_id: number;
  quote_no: string;
  customer_name: string;
  quot_subject: string | null;
  product_name: string | null;
  amount: number | null;
  quot_status: string;
  status_label: string;
  prod_quot_status: string;
}

/**
 * ソートフィールドの型定義
 */
export type QuotSortField =
  | 'quote_no'
  | 'customer_name'
  | 'quot_subject'
  | 'prod_name'
  | 'amount'
  | 'quot_status';

/**
 * 見積一覧検索パラメータの型定義
 */
export interface QuotSearchParams {
  section_cd?: string;
  quote_no?: string;
  quote_date_from?: string;
  quote_date_to?: string;
  quot_subject?: string;
  customer_id?: number | null;
  product_name?: string;
  status?: string;
  page?: number;
  per_page?: number;
  sort_field?: QuotSortField;
  sort_order?: SortOrder;
}

/**
 * 見積一覧レスポンスの型定義
 */
export interface QuotListResponse {
  success: boolean;
  quotes: QuotListItem[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  access_info: {
    default_section_cd: string | null;
    is_section_cd_disabled: boolean;
  };
  message?: string;
}

/**
 * 得意先サジェスト候補の型定義
 */
export interface QuotCustomerSuggestion extends BaseCustomer {}

/**
 * 得意先サジェストレスポンスの型定義
 */
export interface QuotCustomerSuggestResponse {
  success: boolean;
  customers: QuotCustomerSuggestion[];
  message?: string;
}

/**
 * 部署コードの型定義
 */
export interface SectionCdOption {
  section_cd_id: number;
  section_cd: string;
  section_name: string;
}

/**
 * 部署コード一覧レスポンスの型定義
 */
export interface SectionCdsResponse {
  success: boolean;
  section_cds: SectionCdOption[];
  is_disabled: boolean;
  message?: string;
}

/**
 * 作業部門別制作見積の型定義
 */
export interface ProdQuotOperation {
  prod_quot_operation_id: number;
  operation_id: number;
  operation_cd: string | null;
  operation_name: string | null;
  prod_quot_cost: number;
}

/**
 * 作業部門別見積の型定義
 */
export interface QuotOperation {
  quot_operation_id: number;
  operation_id: number;
  operation_cd: string | null;
  operation_name: string | null;
  cost: number;
  quot_amount: number;
}

/**
 * 見積詳細の型定義
 */
export interface QuotDetail {
  quot_id: number;
  quot_number: string;
  section_cd: string | null;
  section_name: string | null;
  employee_name: string | null;
  customer_id: number | null;
  customer_cd: string | null;
  customer_name: string | null;
  quot_customer_name: string | null;
  prod_name: string | null;
  quot_subject: string | null;
  quot_summary: string | null;
  reference_doc_path: string | null;
  center_id: number | null;
  center_name: string | null;
  quot_status: string;
  status_label: string;
  prod_quot_status: string;
  prod_quot_status_label: string;
  quot_on: string | null;
  quot_doc_path: string | null;
  quot_amount: number | null;
  submission_method: string | null;
  submission_method_label: string | null;
  quot_result: string | null;
  quot_result_label: string | null;
  lost_reason: string | null;
  message: string | null;
  prod_quot_operations: ProdQuotOperation[];
  quot_operations: QuotOperation[];
}

/**
 * 見積詳細レスポンスの型定義
 */
export interface QuotDetailResponse {
  success: boolean;
  quot?: QuotDetail;
  message?: string;
}

/**
 * 作業部門別見積リクエストの型定義
 */
export interface QuotOperationRequest {
  operation_id: number;
  cost: number;
  quot_amount: number;
}

/**
 * 見積新規登録リクエストの型定義
 */
export interface QuotCreateRequest {
  prod_name?: string;
  customer_id?: number;
  customer_name?: string;
  quot_subject?: string;
  quot_summary?: string;
  message?: string;
  reference_doc_path?: string;
  center_id?: number;
  submission_method: string;
  base_quot_id?: number;
  operations?: QuotOperationRequest[];
}

/**
 * 見積更新リクエストの型定義（ステータス00用）
 */
export interface QuotUpdateRequest {
  prod_name?: string;
  customer_id?: number;
  customer_name?: string;
  quot_subject?: string;
  quot_summary?: string;
  message?: string;
  reference_doc_path?: string;
  center_id?: number;
  submission_method: string;
  base_quot_id?: number;
  operations?: QuotOperationRequest[];
}

/**
 * ステータス60更新リクエストの型定義
 */
export interface QuotStatus60UpdateRequest {
  quot_doc_path: string;
  is_lost: boolean;
  lost_reason: string;
}

/**
 * 見積登録リクエストの型定義
 */
export interface QuotRegisterAmountItem {
  operation_id: number;
  quot_amount: number;
}

/**
 * 標準APIレスポンスの型定義
 */
export interface QuotApiResponse {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * 見積新規登録レスポンスの型定義
 */
export interface QuotCreateResponse extends QuotApiResponse {
  quot_id?: number;
  quot_number?: string;
}

/**
 * センター所長の型定義
 */
export interface CenterManager {
  employee_id: number;
  employee_cd: string;
  employee_name: string;
  email: string | null;
}

/**
 * センター所長一覧レスポンスの型定義
 */
export interface CenterManagersResponse {
  success: boolean;
  managers: CenterManager[];
  message?: string;
}
