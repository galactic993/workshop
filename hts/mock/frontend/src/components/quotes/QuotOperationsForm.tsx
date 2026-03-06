'use client';

import { useEffect, useState, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProdQuotOperation, QuotOperation } from '@/lib/quot';
import { QuotAmountFormData } from '@/schemas/quotAmountSchema';

interface QuotOperationsFormProps {
  /**
   * 制作見積作業部門データ（quot_operationsがない場合の入力フォーム生成用）
   */
  prodQuotOperations?: ProdQuotOperation[];

  /**
   * 見積作業部門データ（既存データがある場合）
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
   * タイトルテキスト（デフォルト: '【見積】'）
   */
  title?: string;
}

/**
 * 見積金額フォームコンポーネント
 *
 * 見積作業部門別の金額入力・表示を行う。
 * quot_operationsがある場合はそれを表示/編集、
 * ない場合はprod_quot_operationsから入力フォームを生成。
 */
export function QuotOperationsForm({
  prodQuotOperations = [],
  quotOperations = [],
  form,
  isEditable,
  title = '【見積】',
}: QuotOperationsFormProps) {
  // 表示するデータを決定
  // - quot_operationsがある場合はそれを使用
  // - ない場合はprod_quot_operationsから新規入力用に生成
  const hasQuotOperations = quotOperations.length > 0;
  const hasProdQuotOperations = prodQuotOperations.length > 0;

  // 金額の状態管理（表示用）
  const [amounts, setAmounts] = useState<number[]>([]);
  const [inputValues, setInputValues] = useState<string[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // 操作データの安定したキーを生成（内容が変わった時のみuseEffectを再実行）
  const operationsKey = useMemo(() => {
    if (hasQuotOperations) {
      return quotOperations.map((op) => `${op.operation_id}-${op.quot_amount}`).join(',');
    } else if (hasProdQuotOperations) {
      return prodQuotOperations.map((op) => `${op.operation_id}-${op.prod_quot_cost}`).join(',');
    }
    return '';
  }, [hasQuotOperations, quotOperations, hasProdQuotOperations, prodQuotOperations]);

  // 初期値設定
  useEffect(() => {
    if (hasQuotOperations) {
      // quot_operationsを使用する場合（既存データ）
      const initialAmounts = quotOperations.map((op) => op.quot_amount);
      setAmounts(initialAmounts);
      setInputValues(initialAmounts.map((amt) => formatCurrency(amt)));
    } else if (hasProdQuotOperations) {
      // prod_quot_operationsから新規入力フォームを生成
      // 初期値は0
      const initialAmounts = prodQuotOperations.map(() => 0);
      setAmounts(initialAmounts);
      setInputValues(initialAmounts.map((amt) => formatCurrency(amt)));
    } else {
      setAmounts([]);
      setInputValues([]);
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

  // 表示するデータがない場合は何も表示しない
  if (!hasQuotOperations && !hasProdQuotOperations) {
    return null;
  }

  // quot_operationsがある場合はそのデータを表示
  // ない場合はprod_quot_operationsからフォームを生成
  const displayData = hasQuotOperations ? quotOperations : prodQuotOperations;

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
                見積金額
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {displayData.map((item, index) => {
              // 基準価格の取得
              // - quot_operationsの場合はcost
              // - prod_quot_operationsの場合はprod_quot_cost
              const baseCost = hasQuotOperations
                ? 'cost' in item
                  ? (item as QuotOperation).cost
                  : 0
                : 'prod_quot_cost' in item
                  ? (item as ProdQuotOperation).prod_quot_cost
                  : 0;

              return (
                <tr key={`quot-op-${item.operation_id}-${index}`}>
                  <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900">
                    {item.operation_cd ?? '-'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900">
                    {item.operation_name ?? '-'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-right text-sm text-gray-900">
                    {formatCurrency(baseCost)}
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
