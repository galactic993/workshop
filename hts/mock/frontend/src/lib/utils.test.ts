import { describe, it, expect, vi } from 'vitest';
import { mergeRefs, PAGE_SIZE_OPTIONS, INITIAL_DISPLAY_COUNT } from './utils';

describe('mergeRefs', () => {
  it('複数のコールバックrefを呼び出す', () => {
    const ref1 = vi.fn();
    const ref2 = vi.fn();
    const merged = mergeRefs(ref1, ref2);

    const node = document.createElement('div');
    merged(node);

    expect(ref1).toHaveBeenCalledWith(node);
    expect(ref2).toHaveBeenCalledWith(node);
  });

  it('MutableRefObjectのcurrentを設定する', () => {
    const ref1 = { current: null as HTMLDivElement | null };
    const ref2 = { current: null as HTMLDivElement | null };
    const merged = mergeRefs(ref1, ref2);

    const node = document.createElement('div');
    merged(node);

    expect(ref1.current).toBe(node);
    expect(ref2.current).toBe(node);
  });

  it('undefinedのrefをスキップする', () => {
    const ref1 = vi.fn();
    const merged = mergeRefs(ref1, undefined);

    const node = document.createElement('div');
    merged(node);

    expect(ref1).toHaveBeenCalledWith(node);
  });

  it('コールバックとオブジェクトrefを混在できる', () => {
    const callbackRef = vi.fn();
    const objectRef = { current: null as HTMLDivElement | null };
    const merged = mergeRefs(callbackRef, objectRef);

    const node = document.createElement('div');
    merged(node);

    expect(callbackRef).toHaveBeenCalledWith(node);
    expect(objectRef.current).toBe(node);
  });
});

describe('PAGE_SIZE_OPTIONS', () => {
  it('正しい選択肢を含む', () => {
    expect(PAGE_SIZE_OPTIONS).toEqual([10, 25, 50, 100]);
  });

  it('配列は読み取り専用', () => {
    expect(PAGE_SIZE_OPTIONS).toHaveLength(4);
  });
});

describe('INITIAL_DISPLAY_COUNT', () => {
  it('初期表示件数が10', () => {
    expect(INITIAL_DISPLAY_COUNT).toBe(10);
  });
});
