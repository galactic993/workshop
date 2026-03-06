import { apiGet, apiPost } from '../apiHelpers';
import { QuotApiResponse, QuotRegisterAmountItem, CenterManagersResponse } from './types';

/**
 * 見積を承認する
 * @param quoteId 見積ID
 */
export const approveQuot = async (quoteId: number): Promise<QuotApiResponse> => {
  return apiPost<QuotApiResponse>(`/api/quotes/${quoteId}/approve`);
};

/**
 * 見積の承認を取り消す
 * @param quoteId 見積ID
 */
export const cancelApproveQuot = async (quoteId: number): Promise<QuotApiResponse> => {
  return apiPost<QuotApiResponse>(`/api/quotes/${quoteId}/cancel-approve`);
};

/**
 * 制作見積依頼を行う
 * @param quoteId 見積ID
 */
export const requestProductionQuot = async (quoteId: number): Promise<QuotApiResponse> => {
  return apiPost<QuotApiResponse>(`/api/quotes/${quoteId}/request-production`);
};

/**
 * 差戻しを行う
 * @param quoteId 見積ID
 * @param remandReason 差戻し理由
 */
export const rejectQuot = async (
  quoteId: number,
  remandReason: string
): Promise<QuotApiResponse> => {
  return apiPost<QuotApiResponse>(`/api/quotes/${quoteId}/reject`, {
    remand_reason: remandReason,
  });
};

/**
 * 制作見積を受け取る
 * @param quoteId 見積ID
 */
export const receiveProdQuot = async (quoteId: number): Promise<QuotApiResponse> => {
  return apiPost<QuotApiResponse>(`/api/quotes/${quoteId}/receive-prod-quot`);
};

/**
 * 見積登録API（ステータス00から10へ）
 * 作成中の見積を承認待ちに登録する
 * @param quoteId 見積ID
 */
export const registerDraftQuot = async (quoteId: number): Promise<QuotApiResponse> => {
  return apiPost<QuotApiResponse>(`/api/quotes/${quoteId}/register-draft`);
};

/**
 * 見積登録API（ステータス30から40へ）
 * @param quoteId 見積ID
 * @param amounts 見積金額データ
 */
export const registerQuot = async (
  quoteId: number,
  amounts: QuotRegisterAmountItem[]
): Promise<QuotApiResponse> => {
  return apiPost<QuotApiResponse>(`/api/quotes/${quoteId}/register`, { amounts });
};

/**
 * 見積登録取消API（ステータス40から30へ）
 * @param quoteId 見積ID
 */
export const cancelRegisterQuot = async (quoteId: number): Promise<QuotApiResponse> => {
  return apiPost<QuotApiResponse>(`/api/quotes/${quoteId}/cancel-register`);
};

/**
 * 見積金額更新API（ステータス40）
 * @param quoteId 見積ID
 * @param amounts 見積金額データ
 */
export const updateQuotAmounts = async (
  quoteId: number,
  amounts: QuotRegisterAmountItem[]
): Promise<QuotApiResponse> => {
  return apiPost<QuotApiResponse>(`/api/quotes/${quoteId}/update-amounts`, { amounts });
};

/**
 * センターの所長一覧を取得
 * @param centerId センターID（組織ID）
 */
export const getCenterManagers = async (centerId: number): Promise<CenterManagersResponse> => {
  return apiGet<CenterManagersResponse>(`/api/quotes/center-managers/${centerId}`);
};
