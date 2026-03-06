'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PageFooter from '@/components/layout/PageFooter';
import Sidebar from '@/components/layout/Sidebar';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Form from '@/components/ui/Form';
import MessageDialog from '@/components/ui/MessageDialog';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import api from '@/lib/api';
import { canAccessOrderImport } from '@/lib/permissions';
import { orderImportSchema, type OrderImportFormData } from '@/schemas/orderImportSchema';

/** 受注取込APIのレスポンス型 */
interface OrderImportResponse {
  success: boolean;
  errors?: string[];
  data?: {
    first_order_cd: string;
    row_count: number;
  };
}

/**
 * ファイルサイズを適切な単位でフォーマット
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes}B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)}KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

/** ラベルの共通幅 */
const LABEL_WIDTH = 'w-40';

/**
 * 受注情報取込ページ
 * アクセス区分 00 または sales.orders.import 権限を持つユーザーのみアクセス可能
 */
export default function OrderImportPage() {
  const { user, loading } = useAuthGuard({
    permissionChecker: canAccessOrderImport,
  });

  // 選択されたファイル情報の状態
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: number } | null>(null);

  // ダイアログ関連の状態
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [importing, setImporting] = useState(false);

  // エラーログ関連の状態
  const [errorLogs, setErrorLogs] = useState<string[]>([]);

  // React Hook Form のセットアップ
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitted },
  } = useForm<OrderImportFormData>({
    resolver: zodResolver(orderImportSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  // registerからonChangeを取り出して拡張
  const fileRegister = register('file');

  // ファイル選択時のハンドラ
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile({ name: file.name, size: file.size });
    } else {
      setSelectedFile(null);
    }
    // React Hook FormのonChangeも呼び出す
    fileRegister.onChange(e);
  };

  // メッセージダイアログを表示
  const showMessageDialog = useCallback((message: string) => {
    setMessageContent(message);
    setMessageDialogOpen(true);
  }, []);

  // メッセージダイアログを閉じる
  const closeMessageDialog = useCallback(() => {
    setMessageDialogOpen(false);
  }, []);

  // 取込ボタンクリック（バリデーション実行）
  const onSubmit = () => {
    setConfirmDialogOpen(true);
  };

  // 確認ダイアログキャンセル
  const handleImportCancel = useCallback(() => {
    setConfirmDialogOpen(false);
  }, []);

  // 取込実行
  const handleImportConfirm = useCallback(async () => {
    setConfirmDialogOpen(false);
    setImporting(true);
    setErrorLogs([]); // 前回のエラーログをクリア

    try {
      // ファイル入力要素から直接ファイルを取得
      const fileInput = document.getElementById('file') as HTMLInputElement;
      const file = fileInput?.files?.[0];

      if (!file) {
        showMessageDialog('ファイルを選択してください。');
        return;
      }

      // FormDataを作成
      const formData = new FormData();
      formData.append('file', file);

      // API呼び出し（FormDataの場合、Content-Typeはaxiosが自動設定）
      const response = await api.post<OrderImportResponse>('/api/orders/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = response.data;

      if (result.success) {
        // 成功時
        const firstOrderCd = result.data?.first_order_cd ?? '';
        const rowCount = result.data?.row_count ?? 0;
        showMessageDialog(
          `${firstOrderCd}から${rowCount}件の工番を発行しました。\n受注登録画面で必ず受注内容の更新をしてください。`
        );
      } else {
        // バリデーションエラー時
        if (result.errors && result.errors.length > 0) {
          setErrorLogs(result.errors);
        }
        showMessageDialog('受注情報の取り込みに失敗しました。\nエラーログを確認してください。');
      }
    } catch (error) {
      console.error('取込エラー:', error);
      showMessageDialog('受注情報の取込に失敗しました。\n時間を空けて再度お試しください。');
    } finally {
      setImporting(false);
    }
  }, [showMessageDialog]);

  // エラーログをクリップボードにコピー
  const handleCopyErrorLogs = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(errorLogs.join('\n'));
    } catch (error) {
      console.error('クリップボードへのコピーに失敗:', error);
    }
  }, [errorLogs]);

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
  const canAccess = canAccessOrderImport(user.access_type, user.permissions || []);
  if (!canAccess) {
    return null;
  }

  // ボタンの無効化判定（取込中のみ無効）
  const isButtonDisabled = importing;

  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      <Sidebar />
      <main className="flex-1 bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">受注情報取込</h1>

          {/* フォームカード */}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="space-y-4">
                {/* 取込データ */}
                <div className="flex items-center">
                  <span className={`${LABEL_WIDTH} shrink-0 text-sm font-medium text-gray-700`}>
                    【取込データ】
                  </span>
                  <div className="flex flex-1 items-center gap-4">
                    {/* ファイル情報表示エリア */}
                    <div className="min-w-48 text-sm">
                      {selectedFile ? (
                        <span className="text-gray-900">
                          {selectedFile.name} ({formatFileSize(selectedFile.size)})
                        </span>
                      ) : (
                        <span className="text-gray-400">ファイル未選択</span>
                      )}
                    </div>
                    {/* 非表示のファイルinput */}
                    <input
                      id="file"
                      type="file"
                      accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      {...fileRegister}
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                    {/* ファイル選択ボタン */}
                    <label
                      htmlFor="file"
                      className="cursor-pointer rounded-md bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
                    >
                      ファイルを選択
                    </label>
                    {/* 取込ボタン（右端固定） */}
                    <button
                      type="submit"
                      disabled={isButtonDisabled}
                      className="ml-auto rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {importing ? '取込中...' : '取込'}
                    </button>
                  </div>
                </div>
                {/* 取込データのエラーメッセージ */}
                {errors.file && (
                  <div className="flex">
                    <div className={`${LABEL_WIDTH} shrink-0`} />
                    <p className="text-sm text-red-600">{errors.file.message}</p>
                  </div>
                )}

                {/* エラーログ表示 */}
                {errorLogs.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">【エラーログ】</span>
                      <button
                        type="button"
                        onClick={handleCopyErrorLogs}
                        className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      >
                        コピー
                      </button>
                    </div>
                    <textarea
                      readOnly
                      value={errorLogs.join('\n')}
                      className="h-32 w-full resize-none rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          </Form>

          <PageFooter version="1.0.0" lastUpdated="2026/01/30" />
        </div>
      </main>

      {/* 取込確認ダイアログ */}
      <ConfirmDialog
        isOpen={confirmDialogOpen}
        title="受注情報取込"
        message={'受注情報を取り込んで工番取得処理を実行します。\nよろしいですか？'}
        confirmLabel="取込"
        cancelLabel="キャンセル"
        onConfirm={handleImportConfirm}
        onCancel={handleImportCancel}
        loading={importing}
      />

      {/* メッセージダイアログ */}
      <MessageDialog
        isOpen={messageDialogOpen}
        title="受注情報取込"
        message={messageContent}
        onClose={closeMessageDialog}
      />
    </div>
  );
}
