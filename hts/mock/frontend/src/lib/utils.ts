import React from 'react';

/**
 * input要素のrefとreact-hook-formのregisterを併用するためのヘルパー
 * 複数のrefを1つにマージする
 */
export const mergeRefs = <T>(...refs: (React.Ref<T> | undefined)[]) => {
  return (node: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref && 'current' in ref) {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    });
  };
};

/**
 * 表示件数の選択肢
 */
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

/**
 * 初期表示の件数
 */
export const INITIAL_DISPLAY_COUNT = 10;
