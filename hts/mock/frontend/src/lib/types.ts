/**
 * 共通型定義
 */

/**
 * ソート順の型定義
 */
export type SortOrder = 'asc' | 'desc';

/**
 * 基本的な得意先情報の型定義
 */
export interface BaseCustomer {
  customer_id: number;
  customer_cd: string;
  customer_name: string;
}

/**
 * 選択された得意先の型定義
 * フォームで得意先を選択した際に使用
 */
export type SelectedCustomer = BaseCustomer;
