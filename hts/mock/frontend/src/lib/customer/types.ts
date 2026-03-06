import { BaseCustomer } from '../types';

/**
 * 得意先サジェスト候補の型定義
 */
export interface CustomerSuggestion extends BaseCustomer {}

/**
 * 部署別得意先の型定義
 */
export interface SectionCustomer extends BaseCustomer {}

/**
 * 得意先サジェストレスポンスの型定義
 */
export interface CustomerSuggestResponse {
  success: boolean;
  customers: CustomerSuggestion[];
  message?: string;
}

/**
 * 部署別得意先一覧レスポンスの型定義
 */
export interface SectionCustomersResponse {
  success: boolean;
  customers: SectionCustomer[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  message?: string;
}

/**
 * 部署別得意先削除レスポンスの型定義
 */
export interface DeleteSectionCustomerResponse {
  success: boolean;
  message: string;
  deleted_count?: number;
}

/**
 * 部署別得意先追加レスポンスの型定義
 */
export interface AddSectionCustomerResponse {
  success: boolean;
  message: string;
  inserted_count?: number;
}
