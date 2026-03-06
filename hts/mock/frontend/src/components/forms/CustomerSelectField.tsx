'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useDebouncedValue } from '@/hooks/useDebounce';
import { SelectedCustomer } from '@/lib/types';
import CustomerSelectDialog, {
  CustomerOption,
  CustomerSearchResponse,
} from './CustomerSelectDialog';

/**
 * サジェスト候補の型定義
 */
export interface CustomerSuggestion {
  customer_id: number;
  customer_cd: string;
  customer_name: string;
}

/**
 * サジェストAPIレスポンスの型定義
 */
export interface CustomerSuggestResponse {
  success: boolean;
  customers: CustomerSuggestion[];
}

interface CustomerSelectFieldProps {
  /** 選択された得意先 */
  value: SelectedCustomer | null;
  /** 選択変更時のコールバック */
  onChange: (customer: SelectedCustomer | null) => void;
  /** サジェスト検索API */
  suggestFn: (query: string) => Promise<CustomerSuggestResponse>;
  /** ダイアログ検索API */
  searchFn: (customerCd?: string, customerName?: string) => Promise<CustomerSearchResponse>;
  /** エラー表示用コールバック */
  onError?: (message: string) => void;
  /** 無効化フラグ */
  disabled?: boolean;
  /** エラーメッセージ */
  error?: string;
  /** プレースホルダー */
  placeholder?: string;
  /** フィールドID */
  id?: string;
}

/**
 * 得意先選択フィールドコンポーネント
 * サジェスト機能とダイアログ選択を統合したシンプルなコンポーネント
 */
export default function CustomerSelectField({
  value,
  onChange,
  suggestFn,
  searchFn,
  onError,
  disabled = false,
  error,
  placeholder = '',
  id = 'customer-select',
}: CustomerSelectFieldProps) {
  // 入力値（サジェスト検索用）
  const [inputValue, setInputValue] = useState('');
  // サジェスト関連の状態
  const [suggestions, setSuggestions] = useState<CustomerSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  // キーボードナビゲーション用のハイライトインデックス
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  // ダイアログ
  const [dialogOpen, setDialogOpen] = useState(false);
  // refs
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // デバウンス処理
  const debouncedInputValue = useDebouncedValue(inputValue, 300);

  // サジェスト検索
  const searchSuggestions = useCallback(
    async (query: string) => {
      try {
        setSuggestionsLoading(true);
        const response = await suggestFn(query);
        if (response.success) {
          setSuggestions(response.customers);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (err) {
        console.error('得意先検索エラー:', err);
        setSuggestions([]);
        setShowSuggestions(false);
        if (onError) {
          onError('得意先の取得に失敗しました。時間を空けて再度お試しください');
        }
      } finally {
        setSuggestionsLoading(false);
      }
    },
    [suggestFn, onError]
  );

  // デバウンス後にサジェスト検索を実行
  useEffect(() => {
    // 選択済みの場合は検索しない
    if (value) return;

    if (debouncedInputValue && debouncedInputValue.length >= 1) {
      searchSuggestions(debouncedInputValue);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedInputValue, value, searchSuggestions]);

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
    setInputValue(e.target.value);
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
          handleSelectFromSuggestion(suggestions[highlightedIndex]);
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
  const handleSelectFromSuggestion = (customer: CustomerSuggestion) => {
    onChange({
      customer_id: customer.customer_id,
      customer_cd: customer.customer_cd,
      customer_name: customer.customer_name,
    });
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // ダイアログから選択
  const handleSelectFromDialog = (customer: CustomerOption) => {
    onChange({
      customer_id: customer.customer_id,
      customer_cd: customer.customer_cd,
      customer_name: customer.customer_name,
    });
    setInputValue('');
  };

  // 選択をクリア
  const handleClear = () => {
    onChange(null);
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // 入力フォーカス時
  const handleInputFocus = () => {
    if (suggestions.length > 0 && !value) {
      setShowSuggestions(true);
    }
  };

  // 選択済みの場合はタグ表示
  if (value) {
    return (
      <div className="flex items-center gap-2">
        <div
          className={`flex flex-1 items-center gap-2 rounded-md border px-3 py-2 ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
          }`}
        >
          <span className="flex-1 truncate text-sm text-gray-900">{value.customer_name}</span>
          {!disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="flex h-5 w-5 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600"
              aria-label="選択をクリア"
            >
              <span className="text-lg leading-none">&times;</span>
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          disabled={disabled}
          className="whitespace-nowrap rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          得意先選択
        </button>

        <CustomerSelectDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSelect={handleSelectFromDialog}
          searchFn={searchFn}
          onError={onError}
        />
      </div>
    );
  }

  // 未選択の場合は入力フィールド表示
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className={`block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
            error
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
                {suggestions.map((customer, index) => (
                  <li
                    key={customer.customer_id}
                    role="option"
                    aria-selected={index === highlightedIndex}
                    onClick={() => handleSelectFromSuggestion(customer)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`cursor-pointer px-4 py-2 text-sm ${
                      index === highlightedIndex ? 'bg-blue-100' : 'hover:bg-blue-50'
                    }`}
                  >
                    <span className="font-medium text-gray-900">{customer.customer_cd}</span>
                    <span className="ml-2 text-gray-600">{customer.customer_name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">該当する得意先がありません</div>
            )}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => setDialogOpen(true)}
        disabled={disabled}
        className="whitespace-nowrap rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        得意先選択
      </button>

      <CustomerSelectDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSelect={handleSelectFromDialog}
        searchFn={searchFn}
        onError={onError}
      />
    </div>
  );
}
