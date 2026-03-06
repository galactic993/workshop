'use client';

import { useCallback, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomerSearchResponse } from '@/components/forms/CustomerSelectDialog';
import CustomerSelectField, {
  CustomerSuggestResponse,
} from '@/components/forms/CustomerSelectField';
import SuggestInput from '@/components/ui/SuggestInput';
import TruncateWithTooltip from '@/components/ui/TruncateWithTooltip';
import { getQuots, getQuotDetail } from '@/lib/quot/list';
import { QuotListItem, QuotDetail, QuotOperation, QUOT_STATUS } from '@/lib/quot/types';
import { SelectedCustomer } from '@/lib/types';
import {
  quotSearchSchema,
  type QuotSearchFormData,
  quotSearchDefaultValues,
} from '@/schemas/quotSearchSchema';
import QuotDetailModal from './QuotDetailModal';

/**
 * 流用データの型定義
 */
export interface ReuseQuotData {
  /** 流用元見積ID */
  quot_id: number;
  /** 得意先ID */
  customer_id: number | null;
  /** 得意先コード */
  customer_cd: string | null;
  /** 得意先名 */
  customer_name: string | null;
  /** 見積得意先名（諸口用） */
  quot_customer_name: string | null;
  /** センターID */
  center_id: number | null;
  /** 作業部門別見積 */
  quot_operations: QuotOperation[];
  /** 件名 */
  quot_subject: string | null;
  /** 品名 */
  prod_name: string | null;
  /** 見積概要 */
  quot_summary: string | null;
  /** 伝達事項 */
  message: string | null;
}

interface QuotReuseModalProps {
  /** モーダルの表示/非表示 */
  isOpen: boolean;
  /** モーダルを閉じるハンドラ */
  onClose: () => void;
  /** ログインユーザーの部署コード */
  sectionCd: string;
  /** 見積選択時のコールバック */
  onSelect: (data: ReuseQuotData) => void;
  /** 得意先サジェストAPI */
  customerSuggestFn: (query: string) => Promise<CustomerSuggestResponse>;
  /** 得意先検索API（ダイアログ用） */
  customerSearchFn: (customerCd?: string, customerName?: string) => Promise<CustomerSearchResponse>;
  /** 見積件名サジェストAPI */
  quotSubjectSuggestFn: (query: string) => Promise<string[]>;
  /** 品名サジェストAPI */
  prodNameSuggestFn: (query: string) => Promise<string[]>;
  /** エラー表示コールバック */
  onError: (message: string) => void;
}

/** ラベルの共通幅 */
const LABEL_WIDTH = 'w-28';

/**
 * 流用作成モーダルコンポーネント
 * 流用元の見積を検索・選択するためのモーダル
 * 部署コードは自身の部署コード限定、ステータスは発行済固定
 */
export default function QuotReuseModal({
  isOpen,
  onClose,
  sectionCd,
  onSelect,
  customerSuggestFn,
  customerSearchFn,
  quotSubjectSuggestFn,
  prodNameSuggestFn,
  onError,
}: QuotReuseModalProps) {
  // 検索結果の状態
  const [searchResults, setSearchResults] = useState<QuotListItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedQuot, setSelectedQuot] = useState<QuotListItem | null>(null);

  // 詳細モーダルの状態
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailData, setDetailData] = useState<QuotDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // 検索フォーム
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<QuotSearchFormData>({
    resolver: zodResolver(quotSearchSchema),
    defaultValues: {
      ...quotSearchDefaultValues,
      // 部署コードとステータスは固定値（APIに送信時に設定）
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  // 選択確定中フラグ
  const [isConfirming, setIsConfirming] = useState(false);

  // モーダルが閉じられた際に状態をリセット
  useEffect(() => {
    if (!isOpen) {
      reset(quotSearchDefaultValues);
      setSearchResults([]);
      setIsSearching(false);
      setHasSearched(false);
      setSelectedQuot(null);
      setDetailModalOpen(false);
      setDetailData(null);
      setDetailLoading(false);
      setIsConfirming(false);
    }
  }, [isOpen, reset]);

  // 得意先の値を取得
  const customer = watch('customer');

  // 得意先変更ハンドラー
  const handleCustomerChange = useCallback(
    (newCustomer: SelectedCustomer | null) => {
      setValue('customer', newCustomer, { shouldValidate: false });
    },
    [setValue]
  );

  // 検索ハンドラ
  const onSubmit = useCallback(
    async (data: QuotSearchFormData) => {
      setIsSearching(true);
      setHasSearched(true);
      setSelectedQuot(null);
      try {
        // 部署コードは自身の部署コード、ステータスは発行済（30）固定で検索
        const response = await getQuots({
          section_cd: sectionCd,
          status: QUOT_STATUS.ISSUED,
          quote_no: data.quote_no || undefined,
          customer_id: data.customer?.customer_id ?? undefined,
          quote_date_from: data.quote_date_from || undefined,
          quote_date_to: data.quote_date_to || undefined,
          quot_subject: data.quot_subject || undefined,
          product_name: data.product_name || undefined,
          per_page: 100, // 十分な件数を取得
        });

        if (response.success) {
          setSearchResults(response.quotes);
        } else {
          onError(response.message || '検索に失敗しました');
          setSearchResults([]);
        }
      } catch {
        onError('検索中にエラーが発生しました');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [sectionCd, onError]
  );

  // クリアハンドラ（検索結果は維持し、入力値のみクリア）
  const handleClear = useCallback(() => {
    reset(quotSearchDefaultValues);
  }, [reset]);

  // 選択確定ハンドラ
  const handleConfirm = useCallback(async () => {
    if (!selectedQuot) return;

    setIsConfirming(true);
    try {
      // 詳細を取得して流用データを抽出
      const response = await getQuotDetail(selectedQuot.quote_id);
      if (response.success && response.quot) {
        const quot = response.quot;
        onSelect({
          quot_id: quot.quot_id,
          customer_id: quot.customer_id,
          customer_cd: quot.customer_cd,
          customer_name: quot.customer_name,
          quot_customer_name: quot.quot_customer_name,
          center_id: quot.center_id,
          quot_operations: quot.quot_operations || [],
          quot_subject: quot.quot_subject,
          prod_name: quot.prod_name,
          quot_summary: quot.quot_summary,
          message: quot.message,
        });
        onClose();
      } else {
        onError(response.message || '見積詳細の取得に失敗しました');
      }
    } catch {
      onError('見積詳細の取得中にエラーが発生しました');
    } finally {
      setIsConfirming(false);
    }
  }, [selectedQuot, onSelect, onClose, onError]);

  // 詳細モーダルを開くハンドラ
  const handleOpenDetail = useCallback(
    async (quotId: number) => {
      setDetailModalOpen(true);
      setDetailLoading(true);
      setDetailData(null);
      try {
        const response = await getQuotDetail(quotId);
        if (response.success && response.quot) {
          setDetailData(response.quot);
        } else {
          onError(response.message || '詳細情報の取得に失敗しました');
          setDetailModalOpen(false);
        }
      } catch {
        onError('詳細情報の取得中にエラーが発生しました');
        setDetailModalOpen(false);
      } finally {
        setDetailLoading(false);
      }
    },
    [onError]
  );

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
        aria-labelledby="reuse-modal-title"
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 id="reuse-modal-title" className="text-lg font-semibold text-gray-900">
            流用作成
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
          {/* 検索フォーム */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="space-y-3">
                {/* 1. 見積書No */}
                <div className="flex items-start">
                  <label
                    htmlFor="reuse_quote_no"
                    className={`${LABEL_WIDTH} shrink-0 pt-2 text-sm font-medium text-gray-700`}
                  >
                    見積書No
                  </label>
                  <div className="w-80">
                    <input
                      id="reuse_quote_no"
                      type="text"
                      {...register('quote_no')}
                      className={`block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                        errors.quote_no
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    />
                    {errors.quote_no && (
                      <p className="mt-1 text-sm text-red-600">{errors.quote_no.message}</p>
                    )}
                  </div>
                </div>

                {/* 2. 得意先 */}
                <div className="flex items-start">
                  <label
                    className={`${LABEL_WIDTH} shrink-0 pt-2 text-sm font-medium text-gray-700`}
                  >
                    得意先
                  </label>
                  <div className="w-80">
                    <CustomerSelectField
                      value={customer ?? null}
                      onChange={handleCustomerChange}
                      suggestFn={customerSuggestFn}
                      searchFn={customerSearchFn}
                      onError={onError}
                      id="reuse_customer"
                    />
                  </div>
                </div>

                {/* 3. 見積日（期間） */}
                <div className="flex items-start">
                  <label
                    className={`${LABEL_WIDTH} shrink-0 pt-2 text-sm font-medium text-gray-700`}
                  >
                    見積日
                  </label>
                  <div className="w-80">
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        min="1990-01-01"
                        max="2099-12-31"
                        {...register('quote_date_from')}
                        className="block flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                      />
                      <span className="text-gray-500">～</span>
                      <input
                        type="date"
                        min="1990-01-01"
                        max="2099-12-31"
                        {...register('quote_date_to')}
                        className={`block flex-1 rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                          errors.quote_date_to
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        }`}
                      />
                    </div>
                    {errors.quote_date_to && (
                      <p className="mt-1 text-sm text-red-600">{errors.quote_date_to.message}</p>
                    )}
                  </div>
                </div>

                {/* 4. 見積件名 */}
                <div className="flex items-start">
                  <label
                    htmlFor="reuse_quot_subject"
                    className={`${LABEL_WIDTH} shrink-0 pt-2 text-sm font-medium text-gray-700`}
                  >
                    見積件名
                  </label>
                  <div className="w-80">
                    <SuggestInput
                      id="reuse_quot_subject"
                      value={watch('quot_subject') || ''}
                      onChange={(value) =>
                        setValue('quot_subject', value, { shouldValidate: false })
                      }
                      suggestFn={quotSubjectSuggestFn}
                      hasError={!!errors.quot_subject}
                      emptyMessage="該当する見積がありません"
                    />
                    {errors.quot_subject && (
                      <p className="mt-1 text-sm text-red-600">{errors.quot_subject.message}</p>
                    )}
                  </div>
                </div>

                {/* 5. 品名 + ボタン */}
                <div className="flex items-start">
                  <label
                    htmlFor="reuse_product_name"
                    className={`${LABEL_WIDTH} shrink-0 pt-2 text-sm font-medium text-gray-700`}
                  >
                    品名
                  </label>
                  <div className="w-80">
                    <SuggestInput
                      id="reuse_product_name"
                      value={watch('product_name') || ''}
                      onChange={(value) =>
                        setValue('product_name', value, { shouldValidate: false })
                      }
                      suggestFn={prodNameSuggestFn}
                      hasError={!!errors.product_name}
                      emptyMessage="該当する見積がありません"
                    />
                    {errors.product_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.product_name.message}</p>
                    )}
                  </div>
                  <div className="ml-auto flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleClear}
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      クリア
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      検索
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* 検索結果一覧（検索実行後のみ表示） */}
          {hasSearched && (
            <div className="mt-4 rounded-md border border-gray-200">
              {isSearching ? (
                <div className="py-4 text-center text-sm text-gray-500">検索中...</div>
              ) : searchResults.length === 0 ? (
                <div className="py-4 text-center text-sm text-gray-500">
                  該当する見積がありません
                </div>
              ) : (
                <>
                  {/* ヘッダー */}
                  <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-50 px-4 py-2">
                    <span className="h-4 w-4 shrink-0" />
                    <span className="flex flex-1 items-center gap-4 text-xs font-medium text-gray-500">
                      <span className="w-28 shrink-0">見積書No</span>
                      <span className="w-40 shrink-0">得意先</span>
                      <span className="w-48 shrink-0">見積件名</span>
                      <span className="w-40 shrink-0">品名</span>
                      <span className="w-36 shrink-0">見積金額</span>
                    </span>
                  </div>
                  {/* 一覧 */}
                  <div className="max-h-52 divide-y divide-gray-200 overflow-y-auto">
                    {searchResults.map((quot) => (
                      <label
                        key={quot.quote_id}
                        className="flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-gray-50"
                      >
                        <input
                          type="radio"
                          name="select-quot"
                          checked={selectedQuot?.quote_id === quot.quote_id}
                          onChange={() => setSelectedQuot(quot)}
                          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="flex flex-1 items-center gap-4 text-sm">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleOpenDetail(quot.quote_id);
                            }}
                            className="w-28 shrink-0 text-left font-medium text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {quot.quote_no}
                          </button>
                          <TruncateWithTooltip
                            text={quot.customer_name}
                            maxWidth="w-40"
                            className="text-gray-600"
                          />
                          <TruncateWithTooltip
                            text={quot.quot_subject || '-'}
                            maxWidth="w-48"
                            className="text-gray-600"
                          />
                          <TruncateWithTooltip
                            text={quot.product_name || '-'}
                            maxWidth="w-40"
                            className="text-gray-600"
                          />
                          <span className="w-36 shrink-0 text-right text-gray-900">
                            {quot.amount != null ? `¥${quot.amount.toLocaleString()}` : '-'}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedQuot || isConfirming}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isConfirming ? '処理中...' : '選択'}
          </button>
        </div>
      </div>

      {/* 詳細モーダル（流用作成モーダルの上に表示） */}
      {detailModalOpen && (
        <div className="fixed inset-0 z-[60]">
          <QuotDetailModal
            isOpen={detailModalOpen}
            onClose={() => setDetailModalOpen(false)}
            data={detailData}
            loading={detailLoading}
          />
        </div>
      )}
    </div>
  );
}
