'use client';

interface PageFooterProps {
  lastUpdated?: string;
  version?: string;
}

/**
 * ページフッターコンポーネント
 * 最終更新日とバージョン情報を表示
 */
export default function PageFooter({
  lastUpdated = '2025/12/22',
  version = '1.0.0',
}: PageFooterProps) {
  return (
    <div className="mt-auto pt-4 text-right text-xs text-gray-400">
      最終更新: {lastUpdated} / Ver.{version}
    </div>
  );
}
