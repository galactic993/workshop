import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

// エラーをスローするテスト用コンポーネント
const ThrowError = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('テストエラー');
  }
  return <div>正常コンテンツ</div>;
};

// エラーログを抑制
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('ErrorBoundary', () => {
  describe('正常時', () => {
    it('子コンポーネントを正常に表示する', () => {
      render(
        <ErrorBoundary>
          <div>子コンテンツ</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('子コンテンツ')).toBeInTheDocument();
    });

    it('エラーがない場合、フォールバックは表示されない', () => {
      render(
        <ErrorBoundary fallback={<div>フォールバック</div>}>
          <div>子コンテンツ</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('子コンテンツ')).toBeInTheDocument();
      expect(screen.queryByText('フォールバック')).not.toBeInTheDocument();
    });
  });

  describe('エラー発生時', () => {
    it('エラー発生時にデフォルトのフォールバックUIを表示する', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
      expect(screen.getByText('テストエラー')).toBeInTheDocument();
    });

    it('カスタムフォールバックが指定されている場合はそれを表示する', () => {
      render(
        <ErrorBoundary fallback={<div>カスタムエラー画面</div>}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('カスタムエラー画面')).toBeInTheDocument();
      expect(screen.queryByText('エラーが発生しました')).not.toBeInTheDocument();
    });

    it('onErrorコールバックが呼ばれる', () => {
      const onError = vi.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'テストエラー' }),
        expect.objectContaining({ componentStack: expect.any(String) })
      );
    });
  });

  describe('再試行ボタン', () => {
    it('デフォルトで再試行ボタンが表示される', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByRole('button', { name: '再試行' })).toBeInTheDocument();
    });

    it('canRetry=false の場合、再試行ボタンは表示されない', () => {
      render(
        <ErrorBoundary canRetry={false}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.queryByRole('button', { name: '再試行' })).not.toBeInTheDocument();
    });

    it('再試行ボタンクリックでエラー状態がリセットされる', async () => {
      const user = userEvent.setup();
      let shouldThrow = true;

      const ConditionalError = () => {
        if (shouldThrow) {
          throw new Error('テストエラー');
        }
        return <div>復帰しました</div>;
      };

      render(
        <ErrorBoundary>
          <ConditionalError />
        </ErrorBoundary>
      );

      expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();

      // エラーを発生させない状態に変更
      shouldThrow = false;

      // 再試行ボタンをクリック
      const retryButton = screen.getByRole('button', { name: '再試行' });
      await user.click(retryButton);

      // 正常なコンテンツが表示される
      expect(screen.getByText('復帰しました')).toBeInTheDocument();
      expect(screen.queryByText('エラーが発生しました')).not.toBeInTheDocument();
    });
  });

  describe('エラーメッセージ表示', () => {
    it('エラーメッセージがない場合はデフォルトメッセージを表示', () => {
      const NoMessageError = () => {
        throw new Error();
      };

      render(
        <ErrorBoundary>
          <NoMessageError />
        </ErrorBoundary>
      );

      expect(screen.getByText('予期せぬエラーが発生しました')).toBeInTheDocument();
    });

    it('エラーメッセージがある場合はそれを表示', () => {
      const CustomMessageError = () => {
        throw new Error('カスタムエラーメッセージ');
      };

      render(
        <ErrorBoundary>
          <CustomMessageError />
        </ErrorBoundary>
      );

      expect(screen.getByText('カスタムエラーメッセージ')).toBeInTheDocument();
    });
  });

  describe('console.error', () => {
    it('エラー発生時にconsole.errorが呼ばれる', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(console.error).toHaveBeenCalled();
    });
  });
});
