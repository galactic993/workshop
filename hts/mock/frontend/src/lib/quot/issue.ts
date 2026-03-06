import { apiPost, apiDownload } from '../apiHelpers';
import { QuotStatus60UpdateRequest, QuotApiResponse } from './types';

/**
 * 見積発行を行い、Excelファイルをダウンロードする
 * @param quoteId 見積ID
 */
export const issueQuot = async (quoteId: number): Promise<QuotApiResponse> => {
  const result = await apiDownload(`/api/quotes/${quoteId}/issue`, {}, `quote_${quoteId}.xlsx`);
  return {
    ...result,
    message: result.success ? '見積書を発行しました' : result.message || '発行に失敗しました',
  };
};

/**
 * 見積書再発行API
 * 発行済の見積書を再発行し、Excelファイルをダウンロードさせる
 * @param quoteId 見積ID
 */
export const reissueQuot = async (quoteId: number): Promise<QuotApiResponse> => {
  const result = await apiDownload(`/api/quotes/${quoteId}/reissue`, {}, `quote_${quoteId}.xlsx`);
  return {
    ...result,
    message: result.success ? '見積書を再発行しました' : result.message || '再発行に失敗しました',
  };
};

/**
 * 見積を更新する（ステータス60用）
 * @param quoteId 見積ID
 * @param data 更新データ
 */
export const updateQuotStatus60 = async (
  quoteId: number,
  data: QuotStatus60UpdateRequest
): Promise<QuotApiResponse> => {
  return apiPost<QuotApiResponse>(`/api/quotes/${quoteId}/update-status60`, data);
};

/**
 * 失注登録を行う
 * @param quoteId 見積ID
 * @param lostReason 失注理由
 */
export const registerLostQuot = async (
  quoteId: number,
  lostReason: string
): Promise<QuotApiResponse> => {
  return apiPost<QuotApiResponse>(`/api/quotes/${quoteId}/register-lost`, {
    lost_reason: lostReason,
  });
};
