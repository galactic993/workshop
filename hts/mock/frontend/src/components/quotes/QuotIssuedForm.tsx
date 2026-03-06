'use client';

import { UseFormReturn } from 'react-hook-form';
import { QuotStatus60FormData } from '@/schemas/quotStatus60Schema';

interface QuotIssuedFormProps {
  /**
   * React Hook Form のフォームインスタンス
   */
  form: UseFormReturn<QuotStatus60FormData>;

  /**
   * 編集可否フラグ（true: 編集可、false: 読み取り専用）
   */
  isEditable: boolean;
}

/**
 * 見積発行済み状態更新フォームコンポーネント
 *
 * 発行済み（ステータス30）の見積に対する更新フォームを提供します。
 * - 見積書格納先
 * - 失注フラグ
 * - 失注理由（失注時のみ表示）
 *
 * isEditableプロパティで編集可否を制御します。
 */
export default function QuotIssuedForm({ form, isEditable }: QuotIssuedFormProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form;

  // 失注フラグの監視
  const isLost = watch('is_lost');

  return (
    <div className="space-y-4">
      {/* 見積書格納先 */}
      <div className="flex items-start gap-4">
        <label
          htmlFor="status60_quot_doc_path"
          className="w-28 shrink-0 pt-2 text-sm font-medium text-gray-700"
        >
          見積書格納先 <span className="text-red-500">*</span>
        </label>
        <div className="w-1/2">
          <input
            id="status60_quot_doc_path"
            type="text"
            {...register('quot_doc_path')}
            disabled={!isEditable}
            className={`block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
              errors.quot_doc_path
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            } ${!isEditable ? 'cursor-not-allowed bg-gray-100' : ''}`}
          />
          {errors.quot_doc_path && (
            <p className="mt-1 text-sm text-red-600">{errors.quot_doc_path.message}</p>
          )}
        </div>
      </div>

      {/* 失注 */}
      <div className="flex items-start gap-4">
        <label
          htmlFor="status60_is_lost"
          className="w-28 shrink-0 pt-2 text-sm font-medium text-gray-700"
        >
          失注
        </label>
        <div className="flex items-center pt-2">
          <input
            id="status60_is_lost"
            type="checkbox"
            {...register('is_lost', {
              onChange: (e) => {
                // 失注チェックが外れた場合、失注理由をクリア
                if (!e.target.checked) {
                  setValue('lost_reason', '');
                }
              },
            })}
            disabled={!isEditable}
            className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
              !isEditable ? 'cursor-not-allowed' : ''
            }`}
          />
        </div>
      </div>

      {/* 失注理由（失注チェック時のみ表示） */}
      {isLost && (
        <div className="flex items-start gap-4">
          <label
            htmlFor="status60_lost_reason"
            className="w-28 shrink-0 pt-2 text-sm font-medium text-gray-700"
          >
            失注理由
          </label>
          <div className="flex-1">
            <textarea
              id="status60_lost_reason"
              rows={4}
              {...register('lost_reason')}
              disabled={!isEditable}
              className={`block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                errors.lost_reason
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              } ${!isEditable ? 'cursor-not-allowed bg-gray-100' : ''}`}
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
