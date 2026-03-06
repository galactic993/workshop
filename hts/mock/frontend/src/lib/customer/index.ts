/**
 * 得意先関連API
 *
 * 得意先ドメインのAPI関数・型定義を集約してエクスポート
 * 共通型（SortOrder等）は @/lib/types からインポートしてください
 */

// 型定義
export * from './types';

// API関数
export {
  suggestCustomers,
  searchCustomers,
  getSectionCustomers,
  deleteSectionCustomer,
  addSectionCustomer,
} from './api';
