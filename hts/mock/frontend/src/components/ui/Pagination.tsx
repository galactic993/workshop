'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

/**
 * ページネーションコンポーネント
 * 前後ボタンと省略記号付きのページ番号を表示
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  // ページ番号リストを生成
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisiblePages + 2) {
      // 全ページ表示
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 先頭ページ
      pages.push(1);

      // 省略記号または中間ページ
      if (currentPage <= 3) {
        // 先頭付近
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
      } else if (currentPage >= totalPages - 2) {
        // 末尾付近
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages - 1; i++) {
          pages.push(i);
        }
      } else {
        // 中間
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
      }

      // 末尾ページ
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-1">
      {/* 前へボタン */}
      <button
        type="button"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        &lt;
      </button>

      {/* ページ番号ボタン */}
      {pages.map((page, index) =>
        typeof page === 'number' ? (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`min-w-[32px] rounded-md border px-3 py-1 text-sm font-medium ${
              currentPage === page
                ? 'border-blue-500 bg-blue-500 text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={`ellipsis-${index}`} className="px-2 py-1 text-sm text-gray-500">
            {page}
          </span>
        )
      )}

      {/* 次へボタン */}
      <button
        type="button"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        &gt;
      </button>
    </div>
  );
}
