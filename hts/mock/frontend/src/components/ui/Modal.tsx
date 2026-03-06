'use client';

import { ReactNode, useEffect, useRef } from 'react';

interface ModalProps {
  /** モーダルの表示/非表示 */
  isOpen: boolean;
  /** モーダルを閉じるハンドラ */
  onClose: () => void;
  /** モーダルタイトル */
  title: string;
  /** モーダル本体のコンテンツ */
  children: ReactNode;
  /** フッター部分のコンテンツ */
  footer?: ReactNode;
  /** モーダルの最大幅（デフォルト: max-w-md） */
  maxWidth?: string;
  /** z-indexクラス（デフォルト: z-50） */
  zIndexClass?: string;
  /** オーバーレイクリックで閉じるか（デフォルト: true） */
  closeOnOverlayClick?: boolean;
}

/**
 * 汎用モーダルコンポーネント
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'max-w-md',
  zIndexClass = 'z-50',
  closeOnOverlayClick = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // ESCキーで閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // モーダル表示時にフォーカスを移動
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={`fixed inset-0 ${zIndexClass} flex items-center justify-center`}>
      {/* オーバーレイ */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* モーダル本体 */}
      <div
        ref={modalRef}
        className={`relative z-10 w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">閉じる</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* コンテンツ */}
        <div className="px-6 py-4">{children}</div>

        {/* フッター */}
        {footer && (
          <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">{footer}</div>
        )}
      </div>
    </div>
  );
}
