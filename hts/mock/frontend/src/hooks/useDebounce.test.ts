import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useDebounce, useDebouncedValue } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('デバウンスされたコールバックが遅延後に実行される', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 300));

    // コールバックを呼び出す
    act(() => {
      result.current('test');
    });

    // まだ呼び出されていない
    expect(callback).not.toHaveBeenCalled();

    // 300ms経過
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // 呼び出される
    expect(callback).toHaveBeenCalledWith('test');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('連続して呼び出すと最後の呼び出しのみ実行される', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 300));

    // 連続して呼び出す
    act(() => {
      result.current('first');
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    act(() => {
      result.current('second');
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    act(() => {
      result.current('third');
    });

    // まだ呼び出されていない
    expect(callback).not.toHaveBeenCalled();

    // 300ms経過
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // 最後の呼び出しのみ実行される
    expect(callback).toHaveBeenCalledWith('third');
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('初期値を返す', () => {
    const { result } = renderHook(() => useDebouncedValue('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('遅延後に新しい値を返す', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: 'initial' },
    });

    expect(result.current).toBe('initial');

    // 値を変更
    rerender({ value: 'updated' });

    // まだ古い値
    expect(result.current).toBe('initial');

    // 300ms経過
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // 新しい値になる
    expect(result.current).toBe('updated');
  });

  it('連続して値が変わると最後の値になる', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'b' });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'c' });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'd' });

    // まだ 'a'
    expect(result.current).toBe('a');

    // 300ms経過
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // 最終的に 'd'
    expect(result.current).toBe('d');
  });
});
