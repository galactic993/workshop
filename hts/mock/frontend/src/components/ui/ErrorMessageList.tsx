'use client';

import { useEffect, useRef } from 'react';

interface ErrorMessageListProps {
  /** エラーメッセージの配列 */
  messages: string[];
  /** クラス名（任意） */
  className?: string;
  /** メッセージ追加時に自動スクロールするか（デフォルト: true） */
  autoScroll?: boolean;
}

/**
 * エラーメッセージリストコンポーネント
 * 複数のエラーメッセージを1つのボックス内にリスト形式で表示
 * メッセージが追加されると自動的にスクロールして表示
 */
export default function ErrorMessageList({
  messages,
  className = '',
  autoScroll = true,
}: ErrorMessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevMessagesRef = useRef<string[]>([]);

  // メッセージが変更されたときに自動スクロール
  useEffect(() => {
    if (autoScroll && messages.length > 0) {
      // メッセージの内容が変わった場合にスクロール
      const hasChanged =
        messages.length !== prevMessagesRef.current.length ||
        messages.some((m, i) => m !== prevMessagesRef.current[i]);
      if (hasChanged) {
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    prevMessagesRef.current = [...messages];
  }, [messages, autoScroll]);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`rounded-md border border-red-300 bg-red-50 p-4 ${className}`}
      role="alert"
    >
      <div className="flex items-start">
        <svg
          className="mr-2 h-5 w-5 flex-shrink-0 text-red-600"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-700">エラーが発生しました</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-700">
            {messages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
