'use client';

import { UseFormReturn } from 'react-hook-form';
import CustomerSelectField from '@/components/forms/CustomerSelectField';
import { QuotFieldState } from '@/hooks/useQuotFieldState';
import { Center } from '@/lib/centers';
import { QuotCustomerSuggestion } from '@/lib/quot';
import {
  QuotCreateFormData,
  SUBMISSION_METHOD_OPTIONS,
  MISC_CUSTOMER_CD,
} from '@/schemas/quotCreateSchema';

interface QuotDetailFormProps {
  /** react-hook-form のフォームインスタンス */
  form: UseFormReturn<QuotCreateFormData>;
  /** 得意先選択状態 */
  selectedCustomer: QuotCustomerSuggestion | null;
  /** 得意先変更ハンドラ */
  onCustomerChange: (customer: QuotCustomerSuggestion | null) => void;
  /** 得意先サジェスト検索関数 */
  suggestCustomersFn: (
    query: string
  ) => Promise<{ success: boolean; customers: QuotCustomerSuggestion[] }>;
  /** 得意先ダイアログ検索関数 */
  searchCustomersFn: (
    customerCd?: string,
    customerName?: string
  ) => Promise<{ success: boolean; customers: QuotCustomerSuggestion[]; message?: string }>;
  /** センター一覧 */
  centers: Center[];
  /** センター読み込み中 */
  centersLoading: boolean;
  /** エラー追加用コールバック */
  onError: (message: string) => void;
  /** フィールド単位の編集可否状態 */
  fieldState: QuotFieldState;
}

/**
 * 見積基本情報フォームコンポーネント
 *
 * 見積の基本情報（得意先、件名、品名、概要、提出方法、参考資料、主管センター、伝達事項）
 * の入力フォームを提供します。
 *
 * 新規登録と更新の両方で共通利用可能で、isEditableプロパティで編集可否を制御します。
 */
export default function QuotDetailForm({
  form,
  selectedCustomer,
  onCustomerChange,
  suggestCustomersFn,
  searchCustomersFn,
  centers,
  centersLoading,
  onError,
  fieldState,
}: QuotDetailFormProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form;

  // 失注フラグの監視
  const isLost = watch('is_lost');

  // 非活性時のスタイルクラス
  const getInputClass = (isEditable: boolean, hasError: boolean) => {
    const baseClass =
      'block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 sm:text-sm';
    const errorClass = hasError
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
    const disabledClass = !isEditable ? 'bg-gray-100 cursor-not-allowed' : '';
    return `${baseClass} ${errorClass} ${disabledClass}`;
  };

  return (
    <div className="space-y-4">
      {/* 得意先 */}
      <div className="flex items-start gap-4">
        <label className="w-28 shrink-0 pt-2 text-sm font-medium text-gray-700">
          得意先 {fieldState.isCustomerEditable && <span className="text-red-500">*</span>}
        </label>
        <div className="w-1/2">
          <CustomerSelectField
            value={selectedCustomer}
            onChange={onCustomerChange}
            suggestFn={suggestCustomersFn}
            searchFn={searchCustomersFn}
            onError={onError}
            disabled={!fieldState.isCustomerEditable}
            error={errors.customer_id?.message}
            id="customer"
          />
          {errors.customer_id && (
            <p className="mt-1 text-sm text-red-600">{errors.customer_id.message}</p>
          )}
        </div>
      </div>

      {/* 得意先名（諸口の場合のみ表示） */}
      {selectedCustomer?.customer_cd === MISC_CUSTOMER_CD && (
        <div className="flex items-start gap-4">
          <label
            htmlFor="customer_name"
            className="w-28 shrink-0 pt-2 text-sm font-medium text-gray-700"
          >
            得意先名
          </label>
          <div className="w-1/2">
            <input
              id="customer_name"
              type="text"
              {...register('customer_name')}
              disabled={!fieldState.isCustomerNameEditable}
              className={getInputClass(fieldState.isCustomerNameEditable, !!errors.customer_name)}
            />
            {errors.customer_name && (
              <p className="mt-1 text-sm text-red-600">{errors.customer_name.message}</p>
            )}
          </div>
        </div>
      )}

      {/* 見積件名 */}
      <div className="flex items-start gap-4">
        <label
          htmlFor="quot_subject"
          className="w-28 shrink-0 pt-2 text-sm font-medium text-gray-700"
        >
          見積件名
        </label>
        <div className="w-1/2">
          <input
            id="quot_subject"
            type="text"
            {...register('quot_subject')}
            disabled={!fieldState.isSubjectEditable}
            className={getInputClass(fieldState.isSubjectEditable, !!errors.quot_subject)}
          />
          {errors.quot_subject && (
            <p className="mt-1 text-sm text-red-600">{errors.quot_subject.message}</p>
          )}
        </div>
      </div>

      {/* 品名 */}
      <div className="flex items-start gap-4">
        <label htmlFor="prod_name" className="w-28 shrink-0 pt-2 text-sm font-medium text-gray-700">
          品名
        </label>
        <div className="w-1/2">
          <input
            id="prod_name"
            type="text"
            {...register('prod_name')}
            disabled={!fieldState.isProdNameEditable}
            className={getInputClass(fieldState.isProdNameEditable, !!errors.prod_name)}
          />
          {errors.prod_name && (
            <p className="mt-1 text-sm text-red-600">{errors.prod_name.message}</p>
          )}
        </div>
      </div>

      {/* 見積概要 */}
      <div className="flex items-start gap-4">
        <label
          htmlFor="quot_summary"
          className="w-28 shrink-0 pt-2 text-sm font-medium text-gray-700"
        >
          見積概要
        </label>
        <div className="flex-1">
          <textarea
            id="quot_summary"
            rows={4}
            {...register('quot_summary')}
            disabled={!fieldState.isSummaryEditable}
            className={getInputClass(fieldState.isSummaryEditable, !!errors.quot_summary)}
          />
          {errors.quot_summary && (
            <p className="mt-1 text-sm text-red-600">{errors.quot_summary.message}</p>
          )}
        </div>
      </div>

      {/* 見積金額 */}
      <div className="flex items-start gap-4">
        <label
          htmlFor="quot_amount"
          className="w-28 shrink-0 pt-2 text-sm font-medium text-gray-700"
        >
          見積金額
        </label>
        <div className="w-1/2">
          <input
            id="quot_amount"
            type="text"
            {...register('quot_amount', {
              setValueAs: (v) =>
                v === '' || v === null ? undefined : Number(String(v).replace(/[^0-9]/g, '')),
            })}
            disabled={!fieldState.isQuotAmountEditable}
            className={getInputClass(fieldState.isQuotAmountEditable, !!errors.quot_amount)}
          />
          {errors.quot_amount && (
            <p className="mt-1 text-sm text-red-600">{errors.quot_amount.message}</p>
          )}
        </div>
      </div>

      {/* 提出方法 */}
      <div className="flex items-start gap-4">
        <label
          htmlFor="submission_method"
          className="w-28 shrink-0 pt-2 text-sm font-medium text-gray-700"
        >
          提出方法
        </label>
        <div className="w-1/2">
          <div className="relative">
            <select
              id="submission_method"
              {...register('submission_method')}
              disabled={!fieldState.isSubmissionMethodEditable}
              className={`block w-full appearance-none rounded-md border bg-white px-3 py-2 pr-10 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                errors.submission_method
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              } ${!fieldState.isSubmissionMethodEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            >
              {SUBMISSION_METHOD_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-xs text-gray-500">▼</span>
            </div>
          </div>
          {errors.submission_method && (
            <p className="mt-1 text-sm text-red-600">{errors.submission_method.message}</p>
          )}
        </div>
      </div>

      {/* 参考資料 */}
      <div className="flex items-start gap-4">
        <label
          htmlFor="reference_doc_path"
          className="w-28 shrink-0 pt-2 text-sm font-medium text-gray-700"
        >
          参考資料
        </label>
        <div className="w-1/2">
          <input
            id="reference_doc_path"
            type="text"
            {...register('reference_doc_path')}
            disabled={!fieldState.isReferenceDocEditable}
            className={getInputClass(
              fieldState.isReferenceDocEditable,
              !!errors.reference_doc_path
            )}
          />
          {errors.reference_doc_path && (
            <p className="mt-1 text-sm text-red-600">{errors.reference_doc_path.message}</p>
          )}
        </div>
      </div>

      {/* 主管センター */}
      <div className="flex items-start gap-4">
        <label htmlFor="center_id" className="w-28 shrink-0 pt-2 text-sm font-medium text-gray-700">
          主管センター
        </label>
        <div className="w-1/2">
          {centersLoading ? (
            <p className="pt-2 text-sm text-gray-500">読み込み中...</p>
          ) : (
            <>
              <div className="relative">
                <select
                  id="center_id"
                  {...register('center_id', {
                    setValueAs: (v) => (v === '' ? undefined : Number(v)),
                  })}
                  disabled={!fieldState.isCenterEditable}
                  className={`block w-full appearance-none rounded-md border bg-white px-3 py-2 pr-10 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                    errors.center_id
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  } ${!fieldState.isCenterEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                >
                  <option value="">選択してください</option>
                  {centers.map((center) => (
                    <option key={center.department_id} value={center.department_id}>
                      {center.department_name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-xs text-gray-500">▼</span>
                </div>
              </div>
              {errors.center_id && (
                <p className="mt-1 text-sm text-red-600">{errors.center_id.message}</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* 伝達事項 */}
      <div className="flex items-start gap-4">
        <label htmlFor="message" className="w-28 shrink-0 pt-2 text-sm font-medium text-gray-700">
          伝達事項
        </label>
        <div className="flex-1">
          <textarea
            id="message"
            rows={4}
            {...register('message')}
            disabled={!fieldState.isNoteEditable}
            className={getInputClass(fieldState.isNoteEditable, !!errors.message)}
          />
          {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
        </div>
      </div>

      {/* 見積書格納先 */}
      <div className="flex items-start gap-4">
        <label
          htmlFor="quot_doc_path"
          className="w-28 shrink-0 pt-2 text-sm font-medium text-gray-700"
        >
          格納先
        </label>
        <div className="w-1/2">
          <input
            id="quot_doc_path"
            type="text"
            {...register('quot_doc_path')}
            disabled={!fieldState.isStoragePathEditable}
            className={getInputClass(fieldState.isStoragePathEditable, !!errors.quot_doc_path)}
          />
          {errors.quot_doc_path && (
            <p className="mt-1 text-sm text-red-600">{errors.quot_doc_path.message}</p>
          )}
        </div>
      </div>

      {/* 失注 */}
      <div className="flex items-start gap-4">
        <label htmlFor="is_lost" className="w-28 shrink-0 pt-2 text-sm font-medium text-gray-700">
          失注
        </label>
        <div className="flex items-center pt-2">
          <input
            id="is_lost"
            type="checkbox"
            {...register('is_lost', {
              onChange: (e) => {
                // 失注チェックが外れた場合、失注理由をクリア
                if (!e.target.checked) {
                  setValue('lost_reason', '');
                }
              },
            })}
            disabled={!fieldState.isLostInfoEditable}
            className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
              !fieldState.isLostInfoEditable ? 'cursor-not-allowed' : ''
            }`}
          />
        </div>
      </div>

      {/* 失注理由（失注チェック時のみ表示） */}
      {isLost && (
        <div className="flex items-start gap-4">
          <label
            htmlFor="lost_reason"
            className="w-28 shrink-0 pt-2 text-sm font-medium text-gray-700"
          >
            失注理由
          </label>
          <div className="flex-1">
            <textarea
              id="lost_reason"
              rows={4}
              {...register('lost_reason')}
              disabled={!fieldState.isLostInfoEditable}
              className={getInputClass(fieldState.isLostInfoEditable, !!errors.lost_reason)}
            />
            {errors.lost_reason && (
              <p className="mt-1 text-sm text-red-600">{errors.lost_reason.message}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
