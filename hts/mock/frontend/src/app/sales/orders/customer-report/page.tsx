'use client';

import { useState, useCallback, useEffect } from 'react';
import { useForm, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PageFooter from '@/components/layout/PageFooter';
import Sidebar from '@/components/layout/Sidebar';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Form from '@/components/ui/Form';
import MessageDialog from '@/components/ui/MessageDialog';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import api from '@/lib/api';
import { apiPost } from '@/lib/apiHelpers';
import { getCenters, Center } from '@/lib/centers';
import { canAccessCustomerReport } from '@/lib/permissions';
import { customerReportSchema, type CustomerReportFormData } from '@/schemas/customerReportSchema';

/**
 * サーバーのフィールド名からフォームのフィールド名へのマッピング
 */
const SERVER_TO_FORM_FIELD_MAP: Record<string, Path<CustomerReportFormData> | null> = {
  center_id: 'center_id',
  cumulative_period_from: 'cumulative_period_from',
  cumulative_period_to: 'cumulative_period_to',
  business_days: 'business_days',
  working_days: 'working_days',
  include_aggregated: 'include_aggregated',
};

/** ラベルの共通幅 */
const LABEL_WIDTH = 'w-40';

/** 入力エリア全体の共通幅 */
const INPUT_AREA_WIDTH = 'w-72';

/**
 * 現在の日付から初期値を計算
 */
function getInitialValues(): CustomerReportFormData {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  const day = now.getDate();

  // 現在月の1日
  const firstDayOfMonth = new Date(year, month, 1);
  // 現在月の日数
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 日付をYYYY-MM-DD形式に変換（input[type="date"]用）
  const formatDate = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  return {
    center_id: '',
    cumulative_period_from: formatDate(firstDayOfMonth),
    cumulative_period_to: formatDate(now),
    business_days: String(daysInMonth),
    working_days: String(day),
    include_aggregated: false,
  };
}

/**
 * 受注週報（得意先別）ページ
 * アクセス区分 00 または sales.orders.customer-report 権限を持つユーザーのみアクセス可能
 */
export default function CustomerReportPage() {
  const { user, loading } = useAuthGuard({
    permissionChecker: canAccessCustomerReport,
  });

  // センター関連の状態
  const [centers, setCenters] = useState<Center[]>([]);
  const [centersLoading, setCentersLoading] = useState(true);

  // ダイアログ関連の状態
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [exporting, setExporting] = useState(false);

  // React Hook Form のセットアップ
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    setError,
    formState: { errors },
  } = useForm<CustomerReportFormData>({
    resolver: zodResolver(customerReportSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: getInitialValues(),
  });

  /**
   * サーバーからのバリデーションエラーをフォームにセット
   */
  const setServerValidationErrors = useCallback(
    (serverErrors: Record<string, string[]>): boolean => {
      let hasFieldError = false;
      Object.entries(serverErrors).forEach(([serverField, messages]) => {
        const formField = SERVER_TO_FORM_FIELD_MAP[serverField];
        if (formField && messages.length > 0) {
          setError(formField, { type: 'server', message: messages[0] });
          hasFieldError = true;
        }
      });
      return hasFieldError;
    },
    [setError]
  );

  // メッセージダイアログを表示
  const showMessageDialog = useCallback((message: string) => {
    setMessageContent(message);
    setMessageDialogOpen(true);
  }, []);

  // メッセージダイアログを閉じる
  const closeMessageDialog = useCallback(() => {
    setMessageDialogOpen(false);
  }, []);

  // センター一覧を取得
  useEffect(() => {
    const fetchCenters = async () => {
      if (!user) return;

      try {
        setCentersLoading(true);
        const response = await getCenters();
        if (response.success) {
          setCenters(response.centers);
          // 選択肢が1つの場合は自動選択
          if (response.centers.length === 1) {
            setValue('center_id', String(response.centers[0].department_id));
          }
        }
      } catch (error) {
        console.error('センター取得エラー:', error);
        showMessageDialog('センターの取得に失敗しました。\n時間を空けて再度お試しください');
      } finally {
        setCentersLoading(false);
      }
    };

    if (user && !loading) {
      fetchCenters();
    }
  }, [user, loading, setValue, showMessageDialog]);

  // 出力ボタンクリック（バリデーション実行）
  const onSubmitExport = () => {
    setExportDialogOpen(true);
  };

  // 出力確認ダイアログキャンセル
  const handleExportCancel = useCallback(() => {
    setExportDialogOpen(false);
  }, []);

  // 出力実行
  const handleExportConfirm = useCallback(async () => {
    setExportDialogOpen(false);
    setExporting(true);

    try {
      const values = getValues();

      // API呼び出し
      const response = await api.post(
        '/api/sales/orders/customer-report/export',
        {
          center_id: parseInt(values.center_id, 10),
          cumulative_period_from: values.cumulative_period_from,
          cumulative_period_to: values.cumulative_period_to,
          business_days: parseInt(values.business_days, 10),
          working_days: parseInt(values.working_days, 10),
          include_aggregated: values.include_aggregated,
        },
        {
          responseType: 'blob',
        }
      );

      // PDFダウンロード処理
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = '受注週報_得意先別.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      showMessageDialog('受注週報(得意先別)を出力しました');
    } catch (error) {
      console.error('PDF出力エラー:', error);

      // エラーレスポンスがBlobの場合、JSONに変換して読み取る
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: {
            data?: Blob;
            status?: number;
          };
        };
        if (axiosError.response?.data instanceof Blob) {
          try {
            const text = await axiosError.response.data.text();
            const errorData = JSON.parse(text) as {
              success?: boolean;
              message?: string;
              errors?: Record<string, string[]>;
            };
            // サーバーバリデーションエラーをフォームにセット
            if (errorData.errors) {
              setServerValidationErrors(errorData.errors);
            }
            // 一般エラーメッセージを表示
            showMessageDialog(
              errorData.message ||
                '受注週報(得意先別)の出力に失敗しました。\n時間を空けて再度お試しください'
            );
            return;
          } catch {
            // JSONパースに失敗した場合はデフォルトメッセージ
          }
        }
      }

      showMessageDialog('受注週報(得意先別)の出力に失敗しました。\n時間を空けて再度お試しください');
    } finally {
      setExporting(false);
    }
  }, [getValues, showMessageDialog, setServerValidationErrors]);

  // ローディング中
  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-120px)]">
        <Sidebar />
        <main className="flex-1 bg-gray-50 px-4 py-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-lg text-gray-600">読み込み中...</p>
          </div>
        </main>
      </div>
    );
  }

  // 未認証の場合
  if (!user) {
    return null;
  }

  // 権限チェック（リダイレクト処理中の表示防止）
  const canAccess = canAccessCustomerReport(user.access_type, user.permissions || []);
  if (!canAccess) {
    return null;
  }

  // センターが1つの場合は非活性化
  const isCenterSelectDisabled = centers.length === 1;

  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      <Sidebar />
      <main className="flex-1 bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">受注週報（得意先別）</h1>

          {/* フォームカード */}
          <Form onSubmit={handleSubmit(onSubmitExport)}>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="space-y-4">
                {/* 1. センター選択 */}
                <div className="flex items-start">
                  <label
                    htmlFor="center-select"
                    className={`${LABEL_WIDTH} shrink-0 pt-2 text-sm font-medium text-gray-700`}
                  >
                    【センター】
                  </label>
                  <div className={INPUT_AREA_WIDTH}>
                    {centersLoading ? (
                      <p className="py-2 text-sm text-gray-500">読み込み中...</p>
                    ) : (
                      <select
                        id="center-select"
                        {...register('center_id')}
                        disabled={isCenterSelectDisabled}
                        className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                          errors.center_id
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        } ${isCenterSelectDisabled ? 'cursor-not-allowed bg-gray-100' : ''}`}
                      >
                        {!isCenterSelectDisabled && <option value="">選択してください</option>}
                        {centers.map((center) => (
                          <option key={center.department_id} value={center.department_id}>
                            {center.department_name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                {/* センター選択のエラーメッセージ */}
                {errors.center_id && (
                  <div className="flex">
                    <div className={`${LABEL_WIDTH} shrink-0`} />
                    <p className="text-sm text-red-600">{errors.center_id.message}</p>
                  </div>
                )}

                {/* 2. 累計期間 */}
                <div className="flex items-start">
                  <label
                    className={`${LABEL_WIDTH} shrink-0 pt-2 text-sm font-medium text-gray-700`}
                  >
                    【累計期間】
                  </label>
                  <div className={`${INPUT_AREA_WIDTH} flex items-center gap-2`}>
                    <span className="shrink-0 py-2 text-sm text-gray-900">
                      {getValues('cumulative_period_from')?.replace(/-/g, '/')}
                    </span>
                    <span className="shrink-0 text-sm text-gray-600">～</span>
                    <input
                      id="cumulative_period_to"
                      type="date"
                      min="1990-01-01"
                      max="2099-12-31"
                      {...register('cumulative_period_to')}
                      className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                        errors.cumulative_period_to
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    />
                  </div>
                </div>
                {/* 累計期間のエラーメッセージ */}
                {errors.cumulative_period_to && (
                  <div className="flex">
                    <div className={`${LABEL_WIDTH} shrink-0`} />
                    <p className="text-sm text-red-600">{errors.cumulative_period_to.message}</p>
                  </div>
                )}

                {/* 3. 営業日数 */}
                <div className="flex items-start">
                  <label
                    htmlFor="business_days"
                    className={`${LABEL_WIDTH} shrink-0 pt-2 text-sm font-medium text-gray-700`}
                  >
                    【営業日数】
                  </label>
                  <div className={`${INPUT_AREA_WIDTH} flex items-center gap-2`}>
                    <input
                      id="business_days"
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      {...register('business_days')}
                      className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                        errors.business_days
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    />
                    <span className="shrink-0 text-sm text-gray-600">日</span>
                  </div>
                </div>
                {/* 営業日数のエラーメッセージ */}
                {errors.business_days && (
                  <div className="flex">
                    <div className={`${LABEL_WIDTH} shrink-0`} />
                    <p className="text-sm text-red-600">{errors.business_days.message}</p>
                  </div>
                )}

                {/* 4. 稼働日数 */}
                <div className="flex items-start">
                  <label
                    htmlFor="working_days"
                    className={`${LABEL_WIDTH} shrink-0 pt-2 text-sm font-medium text-gray-700`}
                  >
                    【稼働日数】
                  </label>
                  <div className={`${INPUT_AREA_WIDTH} flex items-center gap-2`}>
                    <input
                      id="working_days"
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      {...register('working_days')}
                      className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                        errors.working_days
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    />
                    <span className="shrink-0 text-sm text-gray-600">日</span>
                  </div>
                </div>
                {/* 稼働日数のエラーメッセージ */}
                {errors.working_days && (
                  <div className="flex">
                    <div className={`${LABEL_WIDTH} shrink-0`} />
                    <p className="text-sm text-red-600">{errors.working_days.message}</p>
                  </div>
                )}

                {/* 5. 集計済データ出力 + ボタン群 */}
                <div className="flex items-center">
                  <label
                    htmlFor="include_aggregated"
                    className={`${LABEL_WIDTH} shrink-0 text-sm font-medium text-gray-700`}
                  >
                    【集計済データ出力】
                  </label>
                  <div className={`${INPUT_AREA_WIDTH} flex items-center`}>
                    <input
                      id="include_aggregated"
                      type="checkbox"
                      {...register('include_aggregated')}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-auto flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={exporting}
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {exporting ? '出力中...' : '出力'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Form>

          <PageFooter version="1.0.1" lastUpdated="2026/02/02" />
        </div>
      </main>

      {/* 出力確認ダイアログ */}
      <ConfirmDialog
        isOpen={exportDialogOpen}
        title="受注週報(得意先別)"
        message={'受注週報(得意先別)を出力します。\nよろしいですか？'}
        confirmLabel="出力"
        cancelLabel="キャンセル"
        onConfirm={handleExportConfirm}
        onCancel={handleExportCancel}
        loading={exporting}
      />

      {/* メッセージダイアログ */}
      <MessageDialog
        isOpen={messageDialogOpen}
        title="受注週報(得意先別)"
        message={messageContent}
        onClose={closeMessageDialog}
      />
    </div>
  );
}
