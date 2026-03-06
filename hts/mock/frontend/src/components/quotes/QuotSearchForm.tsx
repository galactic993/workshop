'use client';

import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { CustomerSearchResponse } from '@/components/forms/CustomerSelectDialog';
import CustomerSelectField, {
  CustomerSuggestResponse,
} from '@/components/forms/CustomerSelectField';
import SuggestInput from '@/components/ui/SuggestInput';
import { SectionCdOption } from '@/lib/quot';
import { SelectedCustomer } from '@/lib/types';
import {
  type QuotSearchFormData,
  QUOT_STATUS_OPTIONS,
  SECTION_CD_ALL,
} from '@/schemas/quotSearchSchema';

/**
 * 見積検索フォームのProps
 */
interface QuotSearchFormProps {
  /** React Hook Formのregister関数 */
  register: UseFormRegister<QuotSearchFormData>;
  /** フォームのバリデーションエラー */
  errors: FieldErrors<QuotSearchFormData>;
  /** React Hook Formのwatch関数 */
  watch: UseFormWatch<QuotSearchFormData>;
  /** React Hook FormのsetValue関数 */
  setValue: UseFormSetValue<QuotSearchFormData>;
  /** 部署コード選択肢 */
  sectionCdOptions: SectionCdOption[];
  /** 部署コードセレクトの無効化フラグ */
  isSectionCdDisabled: boolean;
  /** 部署コード読み込み中フラグ */
  sectionCdLoading: boolean;
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
  /** フォームクリアボタンのコールバック */
  onClear: () => void;
}

/** ラベルの共通幅 */
const LABEL_WIDTH = 'w-28';

/**
 * 見積検索フォームコンポーネント
 */
export default function QuotSearchForm({
  register,
  errors,
  watch,
  setValue,
  sectionCdOptions,
  isSectionCdDisabled,
  sectionCdLoading,
  customerSuggestFn,
  customerSearchFn,
  quotSubjectSuggestFn,
  prodNameSuggestFn,
  onError,
  onClear,
}: QuotSearchFormProps) {
  // 得意先の値を取得
  const customer = watch('customer');

  // 得意先変更ハンドラー
  const handleCustomerChange = (newCustomer: SelectedCustomer | null) => {
    setValue('customer', newCustomer, { shouldValidate: false });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        {/* 1. 部署コード */}
        <div className="flex items-start">
          <label
            htmlFor="section_cd"
            className={`${LABEL_WIDTH} shrink-0 pt-2 text-sm font-medium text-gray-700`}
          >
            部署コード
          </label>
          <div className="w-96">
            <div className="relative">
              <select
                id="section_cd"
                {...register('section_cd')}
                disabled={isSectionCdDisabled || sectionCdLoading}
                className={`block w-full appearance-none rounded-md border py-2 pl-3 pr-10 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                  errors.section_cd
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                } ${isSectionCdDisabled || sectionCdLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              >
                {sectionCdLoading ? (
                  <option value="">読み込み中...</option>
                ) : (
                  <>
                    {!isSectionCdDisabled && <option value={SECTION_CD_ALL}>全て</option>}
                    {sectionCdOptions.map((option) => (
                      <option key={option.section_cd_id} value={option.section_cd}>
                        {option.section_cd} {option.section_name}
                      </option>
                    ))}
                  </>
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 text-xs">▼</span>
              </div>
            </div>
            {errors.section_cd && (
              <p className="mt-1 text-sm text-red-600">{errors.section_cd.message}</p>
            )}
          </div>
        </div>

        {/* 2. ステータス */}
        <div className="flex items-center">
          <label className={`${LABEL_WIDTH} shrink-0 text-sm font-medium text-gray-700`}>
            ステータス
          </label>
          <div className="flex flex-wrap items-center gap-4">
            {QUOT_STATUS_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  {...register('status')}
                  value={option.value}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 3. 見積書No */}
        <div className="flex items-start">
          <label
            htmlFor="quote_no"
            className={`${LABEL_WIDTH} shrink-0 pt-2 text-sm font-medium text-gray-700`}
          >
            見積書No
          </label>
          <div className="w-96">
            <input
              id="quote_no"
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

        {/* 4. 得意先 */}
        <div className="flex items-start">
          <label className={`${LABEL_WIDTH} shrink-0 pt-2 text-sm font-medium text-gray-700`}>
            得意先
          </label>
          <div className="w-96">
            <CustomerSelectField
              value={customer ?? null}
              onChange={handleCustomerChange}
              suggestFn={customerSuggestFn}
              searchFn={customerSearchFn}
              onError={onError}
              id="customer"
            />
          </div>
        </div>

        {/* 5. 見積日（期間） */}
        <div className="flex items-start">
          <label className={`${LABEL_WIDTH} shrink-0 pt-2 text-sm font-medium text-gray-700`}>
            見積日
          </label>
          <div className="w-96">
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

        {/* 6. 見積件名 */}
        <div className="flex items-start">
          <label
            htmlFor="quot_subject"
            className={`${LABEL_WIDTH} shrink-0 pt-2 text-sm font-medium text-gray-700`}
          >
            見積件名
          </label>
          <div className="w-96">
            <SuggestInput
              id="quot_subject"
              value={watch('quot_subject') || ''}
              onChange={(value) => setValue('quot_subject', value, { shouldValidate: false })}
              suggestFn={quotSubjectSuggestFn}
              hasError={!!errors.quot_subject}
              emptyMessage="該当する見積がありません"
            />
            {errors.quot_subject && (
              <p className="mt-1 text-sm text-red-600">{errors.quot_subject.message}</p>
            )}
          </div>
        </div>

        {/* 7. 品名 + ボタン */}
        <div className="flex items-start">
          <label
            htmlFor="product_name"
            className={`${LABEL_WIDTH} shrink-0 pt-2 text-sm font-medium text-gray-700`}
          >
            品名
          </label>
          <div className="w-96">
            <SuggestInput
              id="product_name"
              value={watch('product_name') || ''}
              onChange={(value) => setValue('product_name', value, { shouldValidate: false })}
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
              onClick={onClear}
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
  );
}
