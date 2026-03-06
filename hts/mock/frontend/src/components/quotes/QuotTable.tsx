'use client';

import Pagination from '@/components/ui/Pagination';
import TruncateWithTooltip from '@/components/ui/TruncateWithTooltip';
import { QuotListItem, QuotSortField, PROD_QUOT_STATUS } from '@/lib/quot';
import { SortOrder } from '@/lib/types';
import { PAGE_SIZE_OPTIONS } from '@/lib/utils';
import { QUOT_STATUS_CODE, QUOT_STATUS_LABEL } from '@/schemas/quotSearchSchema';

interface QuotTableProps {
  quotes: QuotListItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  listLoading: boolean;
  sortField: QuotSortField | null;
  sortOrder: SortOrder;
  onSortToggle: (field: QuotSortField) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  /** 見積Noクリック時のハンドラ */
  onQuotNumberClick?: (quoteId: number) => void;
  /** 選択ボタンクリック時のハンドラ */
  onSelectClick?: (quoteId: number) => void;
  /** 受取ボタンクリック時のハンドラ（制作見積済の場合） */
  onReceiveClick?: (quoteId: number) => void;
}

/**
 * ソート可能なテーブルヘッダー
 */
function SortableHeader({
  field,
  label,
  currentSortField,
  sortOrder,
  onSort,
  align = 'left',
}: {
  field: QuotSortField;
  label: string;
  currentSortField: QuotSortField | null;
  sortOrder: SortOrder;
  onSort: (field: QuotSortField) => void;
  align?: 'left' | 'right';
}) {
  const isActive = currentSortField === field;
  const justifyClass = align === 'right' ? 'justify-end' : '';

  return (
    <th
      className="cursor-pointer px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
      onClick={() => onSort(field)}
    >
      <div className={`flex items-center gap-1 ${justifyClass}`}>
        {label}
        {isActive && <span className="text-gray-400">{sortOrder === 'asc' ? '▲' : '▼'}</span>}
      </div>
    </th>
  );
}

/** ステータス別の色クラスマップ */
const STATUS_COLOR_MAP: Record<string, string> = {
  [QUOT_STATUS_CODE.ISSUED]: 'bg-green-100 text-green-800',
  [QUOT_STATUS_CODE.APPROVED]: 'bg-blue-100 text-blue-800',
  [QUOT_STATUS_CODE.PENDING_APPROVAL]: 'bg-yellow-100 text-yellow-800',
};

/**
 * ステータスバッジ
 */
function StatusBadge({ status }: { status: string }) {
  const colorClass = STATUS_COLOR_MAP[status] ?? 'bg-gray-100 text-gray-800';

  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${colorClass}`}>
      {QUOT_STATUS_LABEL[status as keyof typeof QUOT_STATUS_LABEL] || status}
    </span>
  );
}

/**
 * 見積一覧テーブルコンポーネント
 */
export default function QuotTable({
  quotes,
  totalCount,
  totalPages,
  currentPage,
  pageSize,
  listLoading,
  sortField,
  sortOrder,
  onSortToggle,
  onPageChange,
  onPageSizeChange,
  onQuotNumberClick,
  onSelectClick,
  onReceiveClick,
}: QuotTableProps) {
  return (
    <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {/* ヘッダー */}
      <div className="mb-4 flex items-center justify-between">
        {/* 左側: 件数表示 */}
        <div className="text-sm text-gray-600">
          {totalCount}件
          {totalCount > 0 && (
            <span className="ml-1">
              ({(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalCount)}
              件を表示中)
            </span>
          )}
        </div>

        {/* 右側: 表示件数選択 */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">表示件数:</span>
          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="appearance-none rounded-md border border-gray-300 py-1 pl-3 pr-8 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}件
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <span className="text-xs text-gray-500">▼</span>
            </div>
          </div>
        </div>
      </div>

      {/* 一覧テーブル */}
      {quotes.length === 0 && !listLoading ? (
        <div className="py-8 text-center text-sm text-gray-500">該当する見積がありません</div>
      ) : (
        <div className={`overflow-x-auto ${listLoading ? 'opacity-50 pointer-events-none' : ''}`}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <SortableHeader
                  field="quote_no"
                  label="見積書No"
                  currentSortField={sortField}
                  sortOrder={sortOrder}
                  onSort={onSortToggle}
                />
                <SortableHeader
                  field="customer_name"
                  label="得意先名"
                  currentSortField={sortField}
                  sortOrder={sortOrder}
                  onSort={onSortToggle}
                />
                <SortableHeader
                  field="quot_subject"
                  label="見積件名"
                  currentSortField={sortField}
                  sortOrder={sortOrder}
                  onSort={onSortToggle}
                />
                <SortableHeader
                  field="prod_name"
                  label="品名"
                  currentSortField={sortField}
                  sortOrder={sortOrder}
                  onSort={onSortToggle}
                />
                <SortableHeader
                  field="amount"
                  label="見積金額"
                  currentSortField={sortField}
                  sortOrder={sortOrder}
                  onSort={onSortToggle}
                />
                <SortableHeader
                  field="quot_status"
                  label="ステータス"
                  currentSortField={sortField}
                  sortOrder={sortOrder}
                  onSort={onSortToggle}
                />
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {quotes.map((quote) => (
                <tr key={quote.quote_id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-blue-600">
                    <button
                      type="button"
                      className="hover:underline"
                      onClick={() => onQuotNumberClick?.(quote.quote_id)}
                    >
                      {quote.quote_no}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <TruncateWithTooltip text={quote.customer_name} maxWidth="max-w-40" />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <TruncateWithTooltip text={quote.quot_subject} maxWidth="max-w-48" />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <TruncateWithTooltip text={quote.product_name} maxWidth="max-w-40" />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-700">
                    {quote.amount != null
                      ? `¥${Number(quote.amount).toLocaleString('ja-JP')}`
                      : '-'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <StatusBadge status={quote.quot_status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-center text-sm">
                    {quote.prod_quot_status === PROD_QUOT_STATUS.COMPLETED ? (
                      <button
                        type="button"
                        className="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                        onClick={() => onReceiveClick?.(quote.quote_id)}
                      >
                        受取
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        onClick={() => onSelectClick?.(quote.quote_id)}
                      >
                        選択
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ページネーション */}
      <div className="mt-4">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
    </div>
  );
}
