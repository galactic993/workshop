import { apiGet } from './apiHelpers';

/**
 * センター情報の型定義
 */
export interface Center {
  department_id: number;
  department_name: string;
}

/**
 * センター一覧レスポンスの型定義
 */
interface CentersResponse {
  success: boolean;
  centers: Center[];
  message?: string;
}

/** センター一覧のデフォルトレスポンス */
const EMPTY_CENTERS_RESPONSE: Omit<CentersResponse, 'success' | 'message'> = {
  centers: [],
};

/**
 * アクセス可能なセンター一覧を取得
 */
export const getCenters = async (): Promise<CentersResponse> => {
  return apiGet<CentersResponse>('/api/centers', undefined, EMPTY_CENTERS_RESPONSE);
};

/**
 * 全センター一覧を取得
 */
export const getAllCenters = async (): Promise<CentersResponse> => {
  return apiGet<CentersResponse>('/api/centers/all', undefined, EMPTY_CENTERS_RESPONSE);
};

/**
 * 見積用センター一覧を取得（編集・印刷のみ）
 */
export const getQuotCenters = async (): Promise<CentersResponse> => {
  return apiGet<CentersResponse>('/api/centers/quot', undefined, EMPTY_CENTERS_RESPONSE);
};
