'use client';

import { FormHTMLAttributes, forwardRef, useCallback } from 'react';

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  /**
   * Enterキーによるサブミットを許可するかどうか
   * @default false
   */
  allowEnterSubmit?: boolean;
}

/**
 * Enterキーによるサブミットを無効化したFormコンポーネント
 *
 * デフォルトでEnterキーによるフォーム送信を防止します。
 * allowEnterSubmit={true} を指定すると、通常のフォーム動作になります。
 */
const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ allowEnterSubmit = false, onKeyDown, children, ...props }, ref) => {
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLFormElement>) => {
        // Enterキーでのサブミットを防止（allowEnterSubmit=falseの場合）
        if (
          !allowEnterSubmit &&
          e.key === 'Enter' &&
          (e.target as HTMLElement).tagName !== 'TEXTAREA' &&
          (e.target as HTMLElement).tagName !== 'BUTTON'
        ) {
          e.preventDefault();
        }

        // 元のonKeyDownがあれば呼び出す
        onKeyDown?.(e);
      },
      [allowEnterSubmit, onKeyDown]
    );

    return (
      <form ref={ref} onKeyDown={handleKeyDown} {...props}>
        {children}
      </form>
    );
  }
);

Form.displayName = 'Form';

export default Form;
