'use client';

import TruncateWithTooltip from '@/components/ui/TruncateWithTooltip';
import { QuotDetail, PROD_QUOT_STATUS } from '@/lib/quot';

interface QuotDetailModalProps {
  /** モーダルの表示/非表示 */
  isOpen: boolean;
  /** モーダルを閉じるハンドラ */
  onClose: () => void;
  /** 見積詳細データ */
  data: QuotDetail | null;
  /** ローディング中かどうか */
  loading: boolean;
}

/**
 * 見積金額のフォーマット（円記号 + 3桁区切り）
 */
const formatCurrency = (value: number): string => {
  return `¥${value.toLocaleString('ja-JP')}`;
};

/**
 * 見積詳細モーダルコンポーネント
 */
export default function QuotDetailModal({ isOpen, onClose, data, loading }: QuotDetailModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* オーバーレイ */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} aria-hidden="true" />

      {/* モーダル本体 */}
      <div
        className="relative z-10 max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-lg bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-modal-title"
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 id="detail-modal-title" className="text-lg font-semibold text-gray-900">
            詳細情報
          </h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">閉じる</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* コンテンツ */}
        <div className="px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
            </div>
          ) : data ? (
            <div className="space-y-3">
              {/* 基本情報 */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                {/* 部署 */}
                <div className="flex items-center">
                  <span className="w-36 shrink-0 text-sm font-medium text-gray-700">【部署】</span>
                  <span className="text-sm text-gray-900">
                    {data.section_cd} {data.section_name}
                  </span>
                </div>
                {/* 担当者 */}
                <div className="flex items-center">
                  <span className="w-36 shrink-0 text-sm font-medium text-gray-700">
                    【担当者】
                  </span>
                  <span className="text-sm text-gray-900">{data.employee_name ?? '-'}</span>
                </div>
                {/* 見積書No */}
                <div className="flex items-center">
                  <span className="w-36 shrink-0 text-sm font-medium text-gray-700">
                    【見積書No】
                  </span>
                  <span className="text-sm text-gray-900">{data.quot_number}</span>
                </div>
                {/* 得意先 */}
                <div className="flex items-center">
                  <span className="w-36 shrink-0 text-sm font-medium text-gray-700">
                    【得意先】
                  </span>
                  <TruncateWithTooltip
                    text={`${data.customer_cd} ${data.customer_name}`}
                    maxWidth="max-w-64"
                    className="text-sm text-gray-900"
                  />
                </div>
                {/* 見積件名 */}
                <div className="flex items-center">
                  <span className="w-36 shrink-0 text-sm font-medium text-gray-700">
                    【見積件名】
                  </span>
                  <TruncateWithTooltip
                    text={data.quot_subject}
                    maxWidth="max-w-64"
                    className="text-sm text-gray-900"
                  />
                </div>
                {/* 品名 */}
                <div className="flex items-center">
                  <span className="w-36 shrink-0 text-sm font-medium text-gray-700">【品名】</span>
                  <TruncateWithTooltip
                    text={data.prod_name}
                    maxWidth="max-w-64"
                    className="text-sm text-gray-900"
                  />
                </div>
                {/* 主管センター */}
                <div className="flex items-center">
                  <span className="w-36 shrink-0 text-sm font-medium text-gray-700">
                    【主管センター】
                  </span>
                  <span className="text-sm text-gray-900">{data.center_name ?? '-'}</span>
                </div>
                {/* 空欄（主管センターの右側） */}
                <div />
                {/* ステータス */}
                <div className="flex items-center">
                  <span className="w-36 shrink-0 text-sm font-medium text-gray-700">
                    【ステータス】
                  </span>
                  <span className="text-sm text-gray-900">{data.status_label}</span>
                </div>
                {/* 制作見積ステータス */}
                <div className="flex items-center">
                  <span className="w-36 shrink-0 text-sm font-medium text-gray-700">
                    【制作見積ステータス】
                  </span>
                  <span className="text-sm text-gray-900">
                    {data.prod_quot_status_label ?? '-'}
                  </span>
                </div>
                {/* 見積金額 */}
                <div className="flex items-center">
                  <span className="w-36 shrink-0 text-sm font-medium text-gray-700">
                    【見積金額】
                  </span>
                  <span className="text-sm text-gray-900">
                    {data.quot_amount != null
                      ? `¥${Number(data.quot_amount).toLocaleString('ja-JP')}`
                      : '-'}
                  </span>
                </div>
                {/* 見積日 */}
                <div className="flex items-center">
                  <span className="w-36 shrink-0 text-sm font-medium text-gray-700">
                    【見積日】
                  </span>
                  <span className="text-sm text-gray-900">
                    {data.quot_on?.replace(/-/g, '/') ?? '-'}
                  </span>
                </div>
                {/* 提出方法 */}
                <div className="flex items-center">
                  <span className="w-36 shrink-0 text-sm font-medium text-gray-700">
                    【提出方法】
                  </span>
                  <span className="text-sm text-gray-900">
                    {data.submission_method_label || '-'}
                  </span>
                </div>
                {/* 見積結果 */}
                <div className="flex items-center">
                  <span className="w-36 shrink-0 text-sm font-medium text-gray-700">
                    【見積結果】
                  </span>
                  <span className="text-sm text-gray-900">{data.quot_result_label || '-'}</span>
                </div>
                {/* 参考資料 */}
                <div className="flex items-center">
                  <span className="w-36 shrink-0 text-sm font-medium text-gray-700">
                    【参考資料】
                  </span>
                  <TruncateWithTooltip
                    text={data.reference_doc_path}
                    maxWidth="max-w-64"
                    className="text-sm text-gray-900"
                  />
                </div>
                {/* 見積書格納先 */}
                <div className="flex items-center">
                  <span className="w-36 shrink-0 text-sm font-medium text-gray-700">
                    【見積書格納先】
                  </span>
                  <TruncateWithTooltip
                    text={data.quot_doc_path}
                    maxWidth="max-w-64"
                    className="text-sm text-gray-900"
                  />
                </div>
              </div>

              {/* 見積概要 */}
              <div className="mt-4">
                <span className="block text-sm font-medium text-gray-700">【見積概要】</span>
                <p className="mt-1 whitespace-pre-wrap rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900">
                  {data.quot_summary ?? '-'}
                </p>
              </div>

              {/* 失注理由（失注理由に値がある場合のみ表示） */}
              {data.lost_reason && (
                <div className="mt-4">
                  <span className="block text-sm font-medium text-gray-700">【失注理由】</span>
                  <p className="mt-1 whitespace-pre-wrap rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900">
                    {data.lost_reason}
                  </p>
                </div>
              )}

              {/* 制作見積（制作見積受取済かつ作業部門別制作見積レコードがある場合のみ表示） */}
              {data.prod_quot_operations.length > 0 &&
                data.prod_quot_status === PROD_QUOT_STATUS.RECEIVED && (
                  <div className="mt-6">
                    <span className="block text-sm font-medium text-gray-700">【制作見積】</span>
                    <div className="mt-2 overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                              作業部門コード
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                              作業内容
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                              基準価格
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {data.prod_quot_operations.map((item) => (
                            <tr key={item.prod_quot_operation_id}>
                              <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900">
                                {item.operation_cd ?? '-'}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                <TruncateWithTooltip
                                  text={item.operation_name}
                                  maxWidth="max-w-40"
                                />
                              </td>
                              <td className="whitespace-nowrap px-4 py-2 text-right text-sm text-gray-900">
                                {formatCurrency(item.prod_quot_cost)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                          <tr>
                            <td
                              colSpan={2}
                              className="px-4 py-2 text-right text-sm font-medium text-gray-700"
                            >
                              合計金額
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-right text-sm font-bold text-gray-900">
                              {formatCurrency(
                                data.prod_quot_operations.reduce(
                                  (sum, item) => sum + item.prod_quot_cost,
                                  0
                                )
                              )}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}

              {/* 見積（作業部門別見積レコードがある場合のみ表示） */}
              {data.quot_operations.length > 0 && (
                <div className="mt-6">
                  <span className="block text-sm font-medium text-gray-700">【見積】</span>
                  <div className="mt-2 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                            作業部門コード
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                            作業内容
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                            基準価格
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                            見積金額
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {data.quot_operations.map((item) => (
                          <tr key={item.operation_id}>
                            <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900">
                              {item.operation_cd ?? '-'}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              <TruncateWithTooltip text={item.operation_name} maxWidth="max-w-40" />
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-right text-sm text-gray-900">
                              {formatCurrency(item.cost)}
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-right text-sm text-gray-900">
                              {formatCurrency(item.quot_amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td
                            colSpan={2}
                            className="px-4 py-2 text-right text-sm font-medium text-gray-700"
                          >
                            合計金額
                          </td>
                          <td className="whitespace-nowrap px-4 py-2 text-right text-sm font-bold text-gray-900">
                            {formatCurrency(
                              data.quot_operations.reduce((sum, op) => sum + op.cost, 0)
                            )}
                          </td>
                          <td className="whitespace-nowrap px-4 py-2 text-right text-sm font-bold text-gray-900">
                            {formatCurrency(
                              data.quot_operations.reduce((sum, op) => sum + op.quot_amount, 0)
                            )}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-gray-500">データを取得できませんでした</p>
          )}
        </div>

        {/* フッター */}
        <div className="flex justify-end border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
