'use client';

import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TruncateWithTooltipProps {
  /** 表示するテキスト */
  text: string | null | undefined;
  /** 最大幅（Tailwindクラス）例: "max-w-48", "max-w-64" */
  maxWidth?: string;
  /** 追加のCSSクラス */
  className?: string;
}

/**
 * テキストを省略表示し、ホバー時にツールチップで全文を表示するコンポーネント
 * ツールチップはPortalでbodyに描画し、overflow: autoコンテナの影響を受けない
 */
export default function TruncateWithTooltip({
  text,
  maxWidth = 'max-w-48',
  className = '',
}: TruncateWithTooltipProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  // テキストが省略されているかチェック
  useEffect(() => {
    const element = textRef.current;
    if (element) {
      setIsTruncated(element.scrollWidth > element.clientWidth);
    }
  }, [text]);

  // ホバー時にツールチップの位置を計算
  const handleMouseEnter = () => {
    if (textRef.current && isTruncated) {
      const rect = textRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.bottom + 4, // 4px margin
        left: rect.left,
      });
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  if (!text) {
    return <span className={className}>-</span>;
  }

  return (
    <span
      className={`inline-block ${maxWidth} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span ref={textRef} className="block truncate">
        {text}
      </span>
      {isTruncated &&
        isHovered &&
        typeof document !== 'undefined' &&
        createPortal(
          <span
            style={{
              position: 'fixed',
              top: tooltipPosition.top,
              left: tooltipPosition.left,
              zIndex: 9999,
            }}
            className="
              max-w-xs px-2 py-1
              bg-white text-gray-700 text-xs rounded border border-gray-200 shadow-md
              whitespace-normal break-words
            "
          >
            {text}
          </span>,
          document.body
        )}
    </span>
  );
}
