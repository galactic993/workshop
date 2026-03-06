import { useEffect, useRef, useState } from 'react';

/**
 * デバウンス処理を行うカスタムフック
 * @param callback 実行する関数
 * @param delay 遅延時間（ミリ秒）
 * @returns デバウンスされた関数を呼び出すトリガー関数
 */
export function useDebounce<T extends (...args: Parameters<T>) => void>(
  callback: T,
  delay: number
): T {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef<T>(callback);

  // callbackの最新版を保持
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const debouncedFunction = ((...args: Parameters<T>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }) as T;

  return debouncedFunction;
}

/**
 * 値のデバウンスを行うカスタムフック
 * @param value 対象の値
 * @param delay 遅延時間（ミリ秒）
 * @returns デバウンスされた値
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}
