'use client';

interface ConfirmDialogProps {
  /** ダイアログの表示/非表示 */
  isOpen: boolean;
  /** ダイアログタイトル */
  title: string;
  /** ダイアログ本文 */
  message: string;
  /** 確認ボタンのラベル */
  confirmLabel?: string;
  /** キャンセルボタンのラベル */
  cancelLabel?: string;
  /** 確認ボタンのスタイル */
  confirmVariant?: 'primary' | 'danger';
  /** 確認ボタンクリック時のハンドラ */
  onConfirm: () => void;
  /** キャンセルボタンクリック時のハンドラ */
  onCancel: () => void;
  /** 処理中かどうか */
  loading?: boolean;
  /** z-indexクラス（デフォルト: z-50） */
  zIndexClass?: string;
}

/**
 * 確認ダイアログコンポーネント
 */
export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = '確認',
  cancelLabel = 'キャンセル',
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
  loading = false,
  zIndexClass = 'z-50',
}: ConfirmDialogProps) {
  if (!isOpen) {
    return null;
  }

  const confirmButtonClass =
    confirmVariant === 'danger'
      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
      : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';

  return (
    <div className={`fixed inset-0 ${zIndexClass} flex items-center justify-center`}>
      {/* オーバーレイ */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onCancel} aria-hidden="true" />

      {/* ダイアログ本体 */}
      <div
        className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        {/* タイトル */}
        <h2 id="dialog-title" className="mb-4 text-lg font-semibold text-gray-900">
          {title}
        </h2>

        {/* 本文 */}
        <p className="mb-6 whitespace-pre-line text-sm text-gray-600">{message}</p>

        {/* ボタン */}
        <div className="flex justify-end gap-3">
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
            className={`rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${confirmButtonClass}`}
          >
            {loading ? '処理中...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
