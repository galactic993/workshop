import { apiGet } from '../apiHelpers';
import { QuotCustomerSuggestResponse, SectionCdsResponse } from './types';

const EMPTY_CUSTOMER_RESPONSE: Omit<QuotCustomerSuggestResponse, 'success' | 'message'> = {
  customers: [],
};

const EMPTY_SECTION_CDS_RESPONSE: Omit<SectionCdsResponse, 'success' | 'message'> = {
  section_cds: [],
  is_disabled: true,
};

/**
 * 得意先サジェスト検索（見積ページ用）
 * 自身が参照可能な部署コードのセンターに紐づく部署別得意先から検索
 * @param query 検索クエリ（得意先コード/得意先名）
 */
export const suggestQuotCustomers = async (query: string): Promise<QuotCustomerSuggestResponse> => {
  return apiGet<QuotCustomerSuggestResponse>(
    '/api/quotes/customers/suggest',
    { query },
    EMPTY_CUSTOMER_RESPONSE
  );
};

/**
 * 得意先検索（見積ページ用・得意先選択ダイアログ）
 * 自身が参照可能な部署コードのセンターに紐づく部署別得意先から検索
 * @param customerCd 得意先コード（部分一致）
 * @param customerName 得意先名（部分一致）
 */
export const searchQuotCustomers = async (
  customerCd?: string,
  customerName?: string
): Promise<QuotCustomerSuggestResponse> => {
  return apiGet<QuotCustomerSuggestResponse>(
    '/api/quotes/customers/search',
    { customer_cd: customerCd, customer_name: customerName },
    EMPTY_CUSTOMER_RESPONSE
  );
};

/**
 * 得意先サジェスト検索（新規登録モーダル用）
 * ログインユーザーの所属センターに紐づく部署別得意先から検索
 * @param query 検索クエリ（得意先コード/得意先名）
 */
export const suggestQuotCustomersForCreate = async (
  query: string
): Promise<QuotCustomerSuggestResponse> => {
  return apiGet<QuotCustomerSuggestResponse>(
    '/api/quotes/customers/suggest-for-create',
    { query },
    EMPTY_CUSTOMER_RESPONSE
  );
};

/**
 * 得意先検索（新規登録モーダル用・得意先選択ダイアログ）
 * ログインユーザーの所属センターに紐づく部署別得意先から検索
 * @param customerCd 得意先コード（部分一致）
 * @param customerName 得意先名（部分一致）
 */
export const searchQuotCustomersForCreate = async (
  customerCd?: string,
  customerName?: string
): Promise<QuotCustomerSuggestResponse> => {
  return apiGet<QuotCustomerSuggestResponse>(
    '/api/quotes/customers/search-for-create',
    { customer_cd: customerCd, customer_name: customerName },
    EMPTY_CUSTOMER_RESPONSE
  );
};

/**
 * 選択可能な部署コード一覧を取得（プルダウン用）
 */
export const getSectionCds = async (): Promise<SectionCdsResponse> => {
  return apiGet<SectionCdsResponse>(
    '/api/quotes/section-cds',
    undefined,
    EMPTY_SECTION_CDS_RESPONSE
  );
};
