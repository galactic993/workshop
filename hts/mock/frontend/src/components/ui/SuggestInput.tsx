'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useDebouncedValue } from '@/hooks/useDebounce';

interface SuggestInputProps {
  /** 入力値 */
  value: string;
  /** 値変更時のコールバック */
  onChange: (value: string) => void;
  /** サジェスト取得関数 */
  suggestFn: (query: string) => Promise<string[]>;
  /** プレースホルダー */
  placeholder?: string;
  /** 無効化フラグ */
  disabled?: boolean;
  /** エラーがあるかどうか */
  hasError?: boolean;
  /** フィールドID */
  id?: string;
  /** 追加のクラス名 */
  className?: string;
  /** 該当なし時のメッセージ */
  emptyMessage?: string;
}

/**
 * サジェスト機能付きテキスト入力コンポーネント
 * 上下キー + エンターキーで選択、Escapeで閉じる
 */
export default function SuggestInput({
  value,
  onChange,
  suggestFn,
  placeholder = '',
  disabled = false,
  hasError = false,
  id,
  className = '',
  emptyMessage = '該当する候補がありません',
}: SuggestInputProps) {
  // サジェスト関連の状態
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  // キーボードナビゲーション用のハイライトインデックス
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  // refs
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // デバウンス処理
  const debouncedValue = useDebouncedValue(value, 300);

  // サジェスト検索
  const searchSuggestions = useCallback(
    async (query: string) => {
      try {
        setSuggestionsLoading(true);
        const results = await suggestFn(query);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (err) {
        console.error('サジェスト検索エラー:', err);
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    },
    [suggestFn]
  );

  // デバウンス後にサジェスト検索を実行
  useEffect(() => {
    if (debouncedValue && debouncedValue.length >= 1) {
      searchSuggestions(debouncedValue);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedValue, searchSuggestions]);

  // サジェスト候補が変わったらハイライトをリセット
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions]);

  // サジェストリスト外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 入力変更時
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // キーボード操作
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSelect(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // サジェストから選択
  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // 入力フォーカス時
  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        id={id}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete="off"
        className={`block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
          hasError
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      />
      {/* サジェストリスト */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg"
        >
          {suggestionsLoading ? (
            <div className="px-4 py-2 text-sm text-gray-500">検索中...</div>
          ) : suggestions.length > 0 ? (
            <ul role="listbox">
              {suggestions.map((suggestion, index) => (
                <li
                  key={`${suggestion}-${index}`}
                  role="option"
                  aria-selected={index === highlightedIndex}
                  onClick={() => handleSelect(suggestion)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`cursor-pointer px-4 py-2 text-sm ${
                    index === highlightedIndex ? 'bg-blue-100' : 'hover:bg-blue-50'
                  }`}
                >
                  <span className="text-gray-900">{suggestion}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">{emptyMessage}</div>
          )}
        </div>
      )}
    </div>
  );
}
