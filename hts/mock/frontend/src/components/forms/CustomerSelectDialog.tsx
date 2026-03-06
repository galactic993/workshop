'use client';

import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Form from '@/components/ui/Form';
import TruncateWithTooltip from '@/components/ui/TruncateWithTooltip';
import { BaseCustomer } from '@/lib/types';

/**
 * 得意先候補の型定義
 */
export interface CustomerOption extends BaseCustomer {}

/**
 * 検索関数のレスポンス型
 */
export interface CustomerSearchResponse {
  success: boolean;
  customers: CustomerOption[];
  message?: string;
}

/**
 * 検索フォームのスキーマ（デフォルト）
 * 得意先コードは半角数字のみ許容
 */
export const customerSelectSearchSchema = z.object({
  customer_cd: z
    .string()
    .regex(/^[0-9]*$/, '半角数字で入力してください')
    .max(5, '5桁以内で入力してください')
    .optional()
    .or(z.literal('')),
  customer_name: z.string().max(100, '100文字以内で入力してください').optional().or(z.literal('')),
});

type CustomerSelectSearchData = z.infer<typeof customerSelectSearchSchema>;

/**
 * フィールドラベルの設定
 */
export interface FieldLabels {
  /** コード入力欄のラベル */
  code: string;
  /** 名称入力欄のラベル */
  name: string;
}

const DEFAULT_FIELD_LABELS: FieldLabels = {
  code: '得意先コード',
  name: '得意先名',
};

interface CustomerSelectDialogProps {
  /** ダイアログの開閉状態 */
  isOpen: boolean;
  /** ダイアログを閉じるコールバック */
  onClose: () => void;
  /** 得意先選択時のコールバック */
  onSelect: (customer: CustomerOption) => void;
  /** 検索関数 */
  searchFn: (customerCd?: string, customerName?: string) => Promise<CustomerSearchResponse>;
  /** エラー時のコールバック（任意） */
  onError?: (message: string) => void;
  /** バリデーションスキーマ（任意） */
  validationSchema?: z.ZodSchema;
  /** ダイアログのタイトル（任意、デフォルト: "得意先選択"） */
  title?: string;
  /** フィールドラベル（任意） */
  fieldLabels?: Partial<FieldLabels>;
  /** コード入力欄の最大文字数（任意、デフォルト: 5） */
  codeMaxLength?: number;
}

/**
 * 得意先選択ダイアログコンポーネント
 * 検索フォームと検索結果一覧を表示し、得意先を選択できる
 */
export default function CustomerSelectDialog({
  isOpen,
  onClose,
  onSelect,
  searchFn,
  onError,
  validationSchema = customerSelectSearchSchema,
  title = '得意先選択',
  fieldLabels: customLabels,
  codeMaxLength = 5,
}: CustomerSelectDialogProps) {
  // フィールドラベルをマージ
  const fieldLabels: FieldLabels = {
    ...DEFAULT_FIELD_LABELS,
    ...customLabels,
  };
  // ポータル用のマウント状態
  const [mounted, setMounted] = useState(false);
  // 検索結果の状態
  const [searchResults, setSearchResults] = useState<CustomerOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerOption | null>(null);
  const [searchExecuted, setSearchExecuted] = useState(false);

  // クライアントサイドでのみポータルを有効化
  useEffect(() => {
    setMounted(true);
  }, []);

  // React Hook Form のセットアップ
  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerSelectSearchData>({
    resolver: zodResolver(validationSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      customer_cd: '',
      customer_name: '',
    },
  });

  const searchCd = watch('customer_cd');
  const searchName = watch('customer_name');

  // 検索実行
  const handleSearch = useCallback(async () => {
    try {
      setIsLoading(true);
      setSelectedCustomer(null);
      setSearchExecuted(true);

      const response = await searchFn(searchCd || undefined, searchName || undefined);

      if (response && response.success) {
        setSearchResults(response.customers);
      } else {
        setSearchResults([]);
        if (response?.message && onError) {
          onError(response.message);
        }
      }
    } catch (error) {
      console.error('得意先検索エラー:', error);
      setSearchResults([]);
      if (onError) {
        onError('得意先の取得に失敗しました。時間を空けて再度お試しください');
      }
    } finally {
      setIsLoading(false);
    }
  }, [searchCd, searchName, searchFn, onError]);

  // ダイアログを閉じる
  const handleClose = useCallback(() => {
    reset({ customer_cd: '', customer_name: '' });
    setSearchResults([]);
    setSelectedCustomer(null);
    setSearchExecuted(false);
    onClose();
  }, [reset, onClose]);

  // 選択確定
  const handleConfirm = useCallback(() => {
    if (!selectedCustomer) return;
    onSelect(selectedCustomer);
    handleClose();
  }, [selectedCustomer, onSelect, handleClose]);

  if (!isOpen || !mounted) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* オーバーレイ */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleClose} />
      {/* ダイアログ */}
      <div className="relative z-10 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>

        {/* 検索フォーム */}
        <Form onSubmit={handleSubmit(handleSearch)} className="mt-4 space-y-3">
          <div>
            <label htmlFor="select-customer-cd" className="block text-sm font-medium text-gray-700">
              {fieldLabels.code}
            </label>
            <input
              {...register('customer_cd')}
              id="select-customer-cd"
              type="text"
              maxLength={codeMaxLength}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                errors.customer_cd
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            {errors.customer_cd && (
              <p className="mt-1 text-sm text-red-600">{errors.customer_cd.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="select-customer-name"
              className="block text-sm font-medium text-gray-700"
            >
              {fieldLabels.name}
            </label>
            <input
              {...register('customer_name')}
              id="select-customer-name"
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? '検索中...' : '検索'}
            </button>
          </div>
        </Form>

        {/* 検索結果（検索実行後のみ表示） */}
        {searchExecuted && (
          <div className="mt-4 max-h-60 overflow-y-auto rounded-md border border-gray-200">
            {isLoading ? (
              <div className="py-4 text-center text-sm text-gray-500">検索中...</div>
            ) : searchResults.length === 0 ? (
              <div className="py-4 text-center text-sm text-gray-500">
                該当する得意先がありません
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {searchResults.map((customer) => (
                  <label
                    key={customer.customer_id}
                    className="flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="select-customer"
                      checked={selectedCustomer?.customer_id === customer.customer_id}
                      onChange={() => setSelectedCustomer(customer)}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="flex items-center text-sm">
                      <span className="font-medium text-gray-900">{customer.customer_cd}</span>
                      <TruncateWithTooltip
                        text={customer.customer_name}
                        maxWidth="max-w-48"
                        className="ml-2 text-gray-600"
                      />
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ボタン */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedCustomer}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            選択
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
