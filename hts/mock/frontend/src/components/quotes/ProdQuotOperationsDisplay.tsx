'use client';

import { ProdQuotOperation } from '@/lib/quot';

interface ProdQuotOperationsDisplayProps {
  /**
   * 制作見積作業部門データ
   */
  prodQuotOperations: ProdQuotOperation[];

  /**
   * タイトルテキスト（デフォルト: '【制作見積】'）
   */
  title?: string;
}

/**
 * 制作見積表示コンポーネント（読み取り専用）
 *
 * 制作見積作業部門別の金額を表示する。
 * 編集機能なし、表示のみ。
 */
export function ProdQuotOperationsDisplay({
  prodQuotOperations,
  title = '【制作見積】',
}: ProdQuotOperationsDisplayProps) {
  /**
   * 金額フォーマット
   */
  const formatCurrency = (value: number): string => {
    return `¥${value.toLocaleString('ja-JP')}`;
  };

  /**
   * 合計金額計算
   */
  const totalAmount = prodQuotOperations.reduce((sum, op) => sum + op.prod_quot_cost, 0);

  // 操作データがない場合は何も表示しない
  if (prodQuotOperations.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <span className="block text-sm font-medium text-gray-700">{title}</span>
      <div className="mt-2 overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="whitespace-nowrap px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                style={{ width: '140px' }}
              >
                作業部門コード
              </th>
              <th
                scope="col"
                className="whitespace-nowrap px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                style={{ width: '200px' }}
              >
                作業部門
              </th>
              <th
                scope="col"
                className="whitespace-nowrap px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                style={{ width: '150px' }}
              >
                基準価格
              </th>
              <th
                scope="col"
                className="whitespace-nowrap px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                style={{ width: '150px' }}
              >
                制作見積金額
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {prodQuotOperations.map((item, index) => (
              <tr key={`prod-op-${item.operation_id}-${index}`}>
                <td
                  className="whitespace-nowrap px-4 py-2 text-sm text-gray-900"
                  style={{ width: '140px' }}
                >
                  {item.operation_cd ?? '-'}
                </td>
                <td
                  className="whitespace-nowrap px-4 py-2 text-sm text-gray-900"
                  style={{ width: '200px' }}
                >
                  {item.operation_name ?? '-'}
                </td>
                <td
                  className="whitespace-nowrap px-4 py-2 text-right text-sm text-gray-900"
                  style={{ width: '150px' }}
                >
                  {/* 空のカラム（基準価格に相当） */}
                </td>
                <td
                  className="whitespace-nowrap px-4 py-2 text-right text-sm text-gray-900"
                  style={{ width: '150px' }}
                >
                  {formatCurrency(item.prod_quot_cost)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td
                colSpan={3}
                className="whitespace-nowrap px-4 py-2 text-right text-sm font-bold text-gray-900"
              >
                合計金額
              </td>
              <td
                className="whitespace-nowrap px-4 py-2 text-right text-sm font-bold text-gray-900"
                style={{ width: '150px' }}
              >
                {formatCurrency(totalAmount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
