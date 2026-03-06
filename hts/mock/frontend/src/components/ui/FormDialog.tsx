'use client';

import { ReactNode } from 'react';

interface FormDialogProps {
  /** ダイアログの表示/非表示 */
  isOpen: boolean;
  /** ダイアログタイトル */
  title: string;
  /** ダイアログ説明文 */
  description?: string;
  /** フォームフィールド */
  children: ReactNode;
  /** 確認ボタンのラベル */
  confirmLabel?: string;
  /** キャンセルボタンのラベル */
  cancelLabel?: string;
  /** 確認ボタンクリック時のハンドラ */
  onConfirm: () => void;
  /** キャンセルボタンクリック時のハンドラ */
  onCancel: () => void;
  /** 処理中かどうか */
  loading?: boolean;
  /** z-indexクラス（デフォルト: z-[60]） */
  zIndexClass?: string;
}

/**
 * フォーム付きダイアログコンポーネント
 */
export default function FormDialog({
  isOpen,
  title,
  description,
  children,
  confirmLabel = '確認',
  cancelLabel = 'キャンセル',
  onConfirm,
  onCancel,
  loading = false,
  zIndexClass = 'z-[60]',
}: FormDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={`fixed inset-0 ${zIndexClass} flex items-center justify-center`}>
      {/* オーバーレイ */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onCancel} aria-hidden="true" />

      {/* ダイアログ本体 */}
      <div
        className="relative z-10 w-full max-w-md rounded-lg bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-dialog-title"
      >
        {/* ヘッダー */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 id="form-dialog-title" className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
        </div>

        {/* 本文 */}
        <div className="px-6 py-4">
          {description && <p className="mb-4 text-sm text-gray-700">{description}</p>}
          <div className="space-y-4">{children}</div>
        </div>

        {/* フッター */}
        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? '処理中...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
