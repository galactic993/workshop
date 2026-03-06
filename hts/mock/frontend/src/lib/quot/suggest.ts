import { apiGet } from '../apiHelpers';

/**
 * サジェストレスポンスの型定義
 */
export interface QuotSuggestResponse {
  success: boolean;
  suggestions: string[];
  message?: string;
}

const EMPTY_SUGGEST_RESPONSE: Omit<QuotSuggestResponse, 'success' | 'message'> = {
  suggestions: [],
};

/**
 * 見積件名サジェスト検索
 * @param query 検索クエリ
 * @returns サジェスト候補の配列
 */
export const suggestQuotSubject = async (query: string): Promise<string[]> => {
  const response = await apiGet<QuotSuggestResponse>(
    '/api/quotes/suggest',
    { field: 'quot_subject', query },
    EMPTY_SUGGEST_RESPONSE
  );
  return response.success ? response.suggestions : [];
};

/**
 * 品名サジェスト検索
 * @param query 検索クエリ
 * @returns サジェスト候補の配列
 */
export const suggestProdName = async (query: string): Promise<string[]> => {
  const response = await apiGet<QuotSuggestResponse>(
    '/api/quotes/suggest',
    { field: 'prod_name', query },
    EMPTY_SUGGEST_RESPONSE
  );
  return response.success ? response.suggestions : [];
};
