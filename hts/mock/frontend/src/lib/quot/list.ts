import { apiGet, apiPost, apiPut, apiDelete } from '../apiHelpers';
import {
  QuotSearchParams,
  QuotListResponse,
  QuotDetailResponse,
  QuotCreateRequest,
  QuotCreateResponse,
  QuotUpdateRequest,
  QuotApiResponse,
} from './types';

/** 見積一覧エラー時のデフォルトレスポンス */
const EMPTY_QUOT_LIST_RESPONSE: Omit<QuotListResponse, 'success' | 'message'> = {
  quotes: [],
  total: 0,
  page: 1,
  per_page: 10,
  total_pages: 0,
  access_info: {
    default_section_cd: null,
    is_section_cd_disabled: false,
  },
};

/**
 * 見積一覧取得
 * @param params 検索パラメータ
 */
export const getQuots = async (params: QuotSearchParams = {}): Promise<QuotListResponse> => {
  return apiGet<QuotListResponse>(
    '/api/quotes',
    params as Record<string, unknown>,
    EMPTY_QUOT_LIST_RESPONSE
  );
};

/**
 * 見積詳細を取得する
 * @param quoteId 見積ID
 */
export const getQuotDetail = async (quoteId: number): Promise<QuotDetailResponse> => {
  return apiGet<QuotDetailResponse>(`/api/quotes/${quoteId}`);
};

/**
 * 見積を新規登録する
 * @param data 登録データ
 */
export const createQuot = async (data: QuotCreateRequest): Promise<QuotCreateResponse> => {
  return apiPost<QuotCreateResponse>('/api/quotes', data);
};

/**
 * 見積を更新する（ステータス00用）
 * @param quoteId 見積ID
 * @param data 更新データ
 */
export const updateQuot = async (
  quoteId: number,
  data: QuotUpdateRequest
): Promise<QuotApiResponse> => {
  return apiPut<QuotApiResponse>(`/api/quotes/${quoteId}`, data);
};

/**
 * 見積を削除する（ステータス00用）
 * @param quoteId 見積ID
 */
export const deleteQuot = async (quoteId: number): Promise<QuotApiResponse> => {
  return apiDelete<QuotApiResponse>(`/api/quotes/${quoteId}`);
};
