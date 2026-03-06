'use client';

interface MessageDialogProps {
  /** ダイアログの表示/非表示 */
  isOpen: boolean;
  /** ダイアログタイトル */
  title: string;
  /** ダイアログ本文 */
  message: string;
  /** 閉じるボタンのラベル */
  closeLabel?: string;
  /** 閉じるボタンクリック時のハンドラ */
  onClose: () => void;
  /** z-indexクラス（デフォルト: z-50） */
  zIndexClass?: string;
}

/**
 * メッセージダイアログコンポーネント
 * 閉じるボタンのみを持つシンプルなダイアログ
 */
export default function MessageDialog({
  isOpen,
  title,
  message,
  closeLabel = '閉じる',
  onClose,
  zIndexClass = 'z-50',
}: MessageDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={`fixed inset-0 ${zIndexClass} flex items-center justify-center`}>
      {/* オーバーレイ */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} aria-hidden="true" />

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
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            {closeLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
