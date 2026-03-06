'use client';

import { useEffect, useState, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProdQuotOperation, QuotOperation } from '@/lib/quot';
import { QuotAmountFormData } from '@/schemas/quotAmountSchema';

interface QuotAmountFormProps {
  /**
   * 制作見積作業部門データ（読み取り専用表示用）
   */
  prodQuotOperations?: ProdQuotOperation[];

  /**
   * 見積作業部門データ（編集可能時の初期値用）
   */
  quotOperations?: QuotOperation[];

  /**
   * React Hook Form の formインスタンス
   */
  form: UseFormReturn<QuotAmountFormData>;

  /**
   * 編集可否
   * - true: 入力フィールドを表示
   * - false: 読み取り専用表示
   */
  isEditable: boolean;

  /**
   * タイトルテキスト（デフォルト: '見積金額'）
   */
  title?: string;
}

/**
 * 見積金額フォームコンポーネント
 *
 * 制作見積作業部門別の金額入力・表示を行う。
 * 編集モードと読み取り専用モードをサポート。
 */
export function QuotAmountForm({
  prodQuotOperations = [],
  quotOperations = [],
  form,
  isEditable,
  title = '見積金額',
}: QuotAmountFormProps) {
  // quotOperationsを使用するかどうかの判定
  // - 編集可能時はquotOperationsを使用
  // - 読み取り専用時は、quotOperationsがあればそれを使用、なければprodQuotOperationsを使用
  const useQuotOperations = isEditable || quotOperations.length > 0;
  const operations = useQuotOperations ? quotOperations : prodQuotOperations;

  // 金額の状態管理（表示用）
  const [amounts, setAmounts] = useState<number[]>([]);
  const [inputValues, setInputValues] = useState<string[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // 操作データの安定したキーを生成（内容が変わった時のみuseEffectを再実行）
  const operationsKey = useMemo(() => {
    if (useQuotOperations) {
      return quotOperations.map((op) => `${op.operation_id}-${op.quot_amount}`).join(',');
    } else {
      return prodQuotOperations.map((op) => `${op.operation_id}-${op.prod_quot_cost}`).join(',');
    }
  }, [useQuotOperations, quotOperations, prodQuotOperations]);

  // 初期値設定
  useEffect(() => {
    if (operations.length === 0) {
      setAmounts([]);
      setInputValues([]);
      return;
    }

    if (useQuotOperations) {
      // quotOperationsを使用する場合
      const initialAmounts = quotOperations.map((op) => op.quot_amount);
      setAmounts(initialAmounts);
      setInputValues(initialAmounts.map((amt) => formatCurrency(amt)));
    } else {
      // prodQuotOperationsを使用する場合
      const initialAmounts = prodQuotOperations.map((op) => op.prod_quot_cost);
      setAmounts(initialAmounts);
      setInputValues(initialAmounts.map((amt) => formatCurrency(amt)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operationsKey]);

  /**
   * 金額フォーマット
   */
  const formatCurrency = (value: number): string => {
    return `¥${value.toLocaleString('ja-JP')}`;
  };

  /**
   * 金額入力変更ハンドラ
   */
  const handleAmountChange = (index: number, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    const newInputValues = [...inputValues];
    newInputValues[index] = numericValue;
    setInputValues(newInputValues);

    const amount = numericValue === '' ? 0 : parseInt(numericValue, 10);
    const newAmounts = [...amounts];
    newAmounts[index] = amount;
    setAmounts(newAmounts);

    // フォームの値も更新
    form.setValue(`amounts.${index}.quot_amount`, amount, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  /**
   * フォーカス時ハンドラ
   */
  const handleFocus = (index: number) => {
    setFocusedIndex(index);
    const newInputValues = [...inputValues];
    newInputValues[index] = amounts[index].toString();
    setInputValues(newInputValues);
  };

  /**
   * フォーカスアウト時ハンドラ
   */
  const handleBlur = (index: number) => {
    setFocusedIndex(null);
    const newInputValues = [...inputValues];
    newInputValues[index] = formatCurrency(amounts[index]);
    setInputValues(newInputValues);
  };

  /**
   * 合計金額計算
   */
  const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0);

  // 操作データがない場合は何も表示しない
  if (operations.length === 0) {
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
              >
                作業部門コード
              </th>
              <th
                scope="col"
                className="whitespace-nowrap px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                作業部門
              </th>
              <th
                scope="col"
                className="whitespace-nowrap px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                制作見積金額
              </th>
              <th
                scope="col"
                className="whitespace-nowrap px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                見積金額
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {operations.map((item, index) => {
              // 制作見積金額の取得（quotOperations使用時はcost、prodQuotOperations使用時はprod_quot_cost）
              const prodQuotCost = useQuotOperations
                ? 'cost' in item
                  ? item.cost
                  : 0
                : 'prod_quot_cost' in item
                  ? item.prod_quot_cost
                  : 0;

              return (
                <tr key={`op-${item.operation_id}-${index}`}>
                  <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900">
                    {item.operation_cd ?? '-'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900">
                    {item.operation_name ?? '-'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-right text-sm text-gray-900">
                    {formatCurrency(prodQuotCost)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-right text-sm text-gray-900">
                    {isEditable ? (
                      <div>
                        <input
                          type="text"
                          value={
                            focusedIndex === index
                              ? inputValues[index]
                              : formatCurrency(amounts[index] ?? 0)
                          }
                          onChange={(e) => handleAmountChange(index, e.target.value)}
                          onFocus={() => handleFocus(index)}
                          onBlur={() => handleBlur(index)}
                          className={`w-28 rounded-md border px-2 py-1 text-right text-sm focus:outline-none focus:ring-1 ${
                            form.formState.errors.amounts?.[index]?.quot_amount
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                          }`}
                        />
                        {form.formState.errors.amounts?.[index]?.quot_amount && (
                          <p className="mt-1 text-xs text-red-600">
                            {form.formState.errors.amounts[index]?.quot_amount?.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      formatCurrency(amounts[index] ?? 0)
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td
                colSpan={3}
                className="whitespace-nowrap px-4 py-2 text-right text-sm font-bold text-gray-900"
              >
                合計金額
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-right text-sm font-bold text-gray-900">
                {formatCurrency(totalAmount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
