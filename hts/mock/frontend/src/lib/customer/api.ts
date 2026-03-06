import { apiGet, apiPost, apiDelete } from '../apiHelpers';
import { SortOrder } from '../types';
import {
  CustomerSuggestResponse,
  SectionCustomersResponse,
  DeleteSectionCustomerResponse,
  AddSectionCustomerResponse,
} from './types';

/** 得意先サジェストのデフォルトレスポンス */
const EMPTY_CUSTOMER_RESPONSE: Omit<CustomerSuggestResponse, 'success' | 'message'> = {
  customers: [],
};

/** 部署別得意先一覧のデフォルトレスポンス */
const EMPTY_SECTION_CUSTOMERS_RESPONSE: Omit<SectionCustomersResponse, 'success' | 'message'> = {
  customers: [],
  total: 0,
  page: 1,
  per_page: 10,
  total_pages: 0,
};

/**
 * 得意先サジェスト検索
 * 指定されたセンターに紐づいていない得意先を検索
 * @param centerId センターID
 * @param query 検索クエリ（得意先コード/得意先名）
 */
export const suggestCustomers = async (
  centerId: number,
  query: string
): Promise<CustomerSuggestResponse> => {
  return apiGet<CustomerSuggestResponse>(
    '/api/customers/suggest',
    { center_id: centerId, query },
    EMPTY_CUSTOMER_RESPONSE
  );
};

/**
 * 得意先検索（得意先選択ダイアログ用）
 * 指定されたセンターに紐づいていない得意先を検索
 * @param centerId センターID
 * @param customerCd 得意先コード（部分一致）
 * @param customerName 得意先名（部分一致）
 */
export const searchCustomers = async (
  centerId: number,
  customerCd?: string,
  customerName?: string
): Promise<CustomerSuggestResponse> => {
  return apiGet<CustomerSuggestResponse>(
    '/api/customers/suggest',
    { center_id: centerId, customer_cd: customerCd, customer_name: customerName },
    EMPTY_CUSTOMER_RESPONSE
  );
};

/**
 * 部署別得意先一覧取得
 * 指定されたセンターに紐づいている得意先を一覧取得
 * @param centerId センターID
 * @param page ページ番号
 * @param perPage 1ページあたりの件数
 * @param sortField ソートフィールド
 * @param sortOrder ソート順（asc: 昇順, desc: 降順）
 */
export const getSectionCustomers = async (
  centerId: number,
  page: number = 1,
  perPage: number = 10,
  sortField: 'customer_cd' | 'customer_name' | null = null,
  sortOrder: SortOrder = 'asc'
): Promise<SectionCustomersResponse> => {
  return apiGet<SectionCustomersResponse>(
    '/api/customers/section-customers',
    {
      center_id: centerId,
      page,
      per_page: perPage,
      sort_field: sortField || undefined,
      sort_order: sortOrder,
    },
    EMPTY_SECTION_CUSTOMERS_RESPONSE
  );
};

/**
 * 部署別得意先の削除
 * 指定されたセンターの部署コードから得意先の紐づけを削除
 * @param centerId センターID
 * @param customerId 得意先ID
 */
export const deleteSectionCustomer = async (
  centerId: number,
  customerId: number
): Promise<DeleteSectionCustomerResponse> => {
  return apiDelete<DeleteSectionCustomerResponse>('/api/customers/section-customers', {
    center_id: centerId,
    customer_id: customerId,
  });
};

/**
 * 部署別得意先の追加
 * 指定されたセンターの部署コードに得意先を紐づける
 * @param centerId センターID
 * @param customerId 得意先ID
 */
export const addSectionCustomer = async (
  centerId: number,
  customerId: number
): Promise<AddSectionCustomerResponse> => {
  return apiPost<AddSectionCustomerResponse>('/api/customers/section-customers', {
    center_id: centerId,
    customer_id: customerId,
  });
};
