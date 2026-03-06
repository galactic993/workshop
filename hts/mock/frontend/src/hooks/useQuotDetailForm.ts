import { useState, useEffect, useCallback } from 'react';
import { useForm, UseFormReturn, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Center } from '@/lib/centers';
import { QuotDetail, QuotCustomerSuggestion, QUOT_STATUS, PROD_QUOT_STATUS } from '@/lib/quot';
import { quotAmountSchema, QuotAmountFormData } from '@/schemas/quotAmountSchema';
import {
  quotCreateSchema,
  QuotCreateFormData,
  quotCreateDefaultValues,
  MISC_CUSTOMER_CD,
} from '@/schemas/quotCreateSchema';

/**
 * サーバーのフィールド名からフォームのフィールド名へのマッピング
 */
const SERVER_TO_FORM_FIELD_MAP: Record<string, Path<QuotCreateFormData> | null> = {
  prod_name: 'prod_name',
  customer_id: 'customer_id',
  customer_name: 'customer_name',
  quot_subject: 'quot_subject',
  quot_summary: 'quot_summary',
  message: 'message',
  reference_doc_path: 'reference_doc_path',
  center_id: 'center_id',
  submission_method: 'submission_method',
  // customer_cd は表示用なのでエラーセット対象外
  customer_cd: null,
};

/**
 * useQuotDetailForm フックのオプション
 */
interface UseQuotDetailFormOptions {
  detailData: QuotDetail | null;
  centers: Center[];
  isNew: boolean;
}

/**
 * useQuotDetailForm フックの戻り値
 */
interface UseQuotDetailFormReturn {
  // フォーム
  createForm: UseFormReturn<QuotCreateFormData>;
  quotAmountForm: UseFormReturn<QuotAmountFormData>;
  // 得意先
  selectedCustomer: QuotCustomerSuggestion | null;
  setSelectedCustomer: (customer: QuotCustomerSuggestion | null) => void;
  handleCustomerChange: (customer: QuotCustomerSuggestion | null) => void;
  // バリデーション
  setServerValidationErrors: (errors: Record<string, string[]>) => boolean;
}

/**
 * 見積詳細画面のフォーム状態を管理するカスタムフック
 */
export const useQuotDetailForm = ({
  detailData,
  centers,
  isNew,
}: UseQuotDetailFormOptions): UseQuotDetailFormReturn => {
  // 新規作成フォーム
  const createForm = useForm<QuotCreateFormData>({
    resolver: zodResolver(quotCreateSchema),
    defaultValues: quotCreateDefaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  // 見積金額フォーム
  const quotAmountForm = useForm<QuotAmountFormData>({
    resolver: zodResolver(quotAmountSchema),
    defaultValues: { amounts: [] },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  // 得意先選択状態
  const [selectedCustomer, setSelectedCustomer] = useState<QuotCustomerSuggestion | null>(null);

  /**
   * サーバーからのバリデーションエラーをフォームにセット
   */
  const setServerValidationErrors = useCallback(
    (serverErrors: Record<string, string[]>): boolean => {
      let hasFieldError = false;
      Object.entries(serverErrors).forEach(([serverField, messages]) => {
        const formField = SERVER_TO_FORM_FIELD_MAP[serverField];
        if (formField && messages.length > 0) {
          createForm.setError(formField, { message: messages[0] });
          hasFieldError = true;
        }
      });
      return hasFieldError;
    },
    [createForm]
  );

  /**
   * 得意先変更ハンドラ
   */
  const handleCustomerChange = useCallback(
    (customer: QuotCustomerSuggestion | null) => {
      setSelectedCustomer(customer);
      if (customer) {
        createForm.setValue('customer_id', customer.customer_id, { shouldDirty: true });
        createForm.setValue('customer_cd', customer.customer_cd, { shouldDirty: true });
        // 諸口以外の場合は得意先名をクリア
        if (customer.customer_cd !== MISC_CUSTOMER_CD) {
          createForm.setValue('customer_name', '', { shouldDirty: true });
        }
        createForm.trigger('customer_id');
      } else {
        createForm.setValue('customer_id', undefined as unknown as number, { shouldDirty: true });
        createForm.setValue('customer_cd', undefined, { shouldDirty: true });
        createForm.setValue('customer_name', '', { shouldDirty: true });
      }
    },
    [createForm, setSelectedCustomer]
  );

  // 詳細データがある場合、フォームに初期値を設定（すべてのステータスで共通）
  useEffect(() => {
    if (detailData && centers.length > 0) {
      // 得意先情報をセット
      if (detailData.customer_id && detailData.customer_cd && detailData.customer_name) {
        setSelectedCustomer({
          customer_id: detailData.customer_id,
          customer_cd: detailData.customer_cd,
          customer_name: detailData.customer_name,
        });
      }
      // センターIDを名前から逆引き
      const matchedCenter = centers.find((c) => c.department_name === detailData.center_name);
      // reset()で初期値を設定（isDirtyを正しく検知するため）
      createForm.reset({
        customer_id: detailData.customer_id || 0,
        customer_cd: detailData.customer_cd || '',
        customer_name:
          detailData.customer_cd === MISC_CUSTOMER_CD ? detailData.quot_customer_name || '' : '',
        quot_subject: detailData.quot_subject || '',
        prod_name: detailData.prod_name || '',
        quot_summary: detailData.quot_summary || '',
        message: detailData.message || '',
        submission_method: detailData.submission_method || '',
        reference_doc_path: detailData.reference_doc_path || '',
        center_id: matchedCenter?.department_id || 0,
        quot_amount: detailData.quot_amount ?? undefined,
        quot_doc_path: detailData.quot_doc_path || '',
        is_lost: detailData.quot_result === '20',
        lost_reason: detailData.lost_reason || '',
      });
    }
  }, [detailData, centers, createForm]);

  // 制作見積ステータスが制作見積済(20)の場合、見積金額フォームに初期値を設定
  useEffect(() => {
    if (
      detailData &&
      detailData.prod_quot_status === PROD_QUOT_STATUS.COMPLETED &&
      detailData.quot_status === QUOT_STATUS.DRAFT &&
      detailData.prod_quot_operations.length > 0
    ) {
      const amounts = detailData.prod_quot_operations.map((op) => ({
        operation_id: op.operation_id,
        quot_amount: 0,
      }));
      quotAmountForm.reset({ amounts });
    }
  }, [detailData, quotAmountForm]);

  // ステータスが承認待ち(10)以降の場合、見積金額フォームに登録済みの値を設定
  useEffect(() => {
    if (
      detailData &&
      (
        [QUOT_STATUS.PENDING_APPROVAL, QUOT_STATUS.APPROVED, QUOT_STATUS.ISSUED] as string[]
      ).includes(detailData.quot_status) &&
      detailData.quot_operations.length > 0
    ) {
      const amounts = detailData.quot_operations.map((op) => ({
        operation_id: op.operation_id,
        quot_amount: op.quot_amount,
      }));
      quotAmountForm.reset({ amounts });
    }
  }, [detailData, quotAmountForm]);

  return {
    createForm,
    quotAmountForm,
    selectedCustomer,
    setSelectedCustomer,
    handleCustomerChange,
    setServerValidationErrors,
  };
};
