'use client';

import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  /** 子コンポーネント */
  children: ReactNode;
  /** カスタムフォールバックUI */
  fallback?: ReactNode;
  /** エラー発生時のコールバック */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** リトライ可能かどうか */
  canRetry?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * エラーバウンダリコンポーネント
 * 子コンポーネントで発生したエラーをキャッチし、フォールバックUIを表示
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // カスタムフォールバックが指定されている場合はそれを使用
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // デフォルトのエラーUI
      return (
        <div className="flex min-h-[200px] items-center justify-center">
          <div className="rounded-lg bg-red-50 p-6 text-center">
            <div className="mb-2 text-lg font-semibold text-red-800">エラーが発生しました</div>
            <p className="mb-4 text-sm text-red-600">
              {this.state.error?.message || '予期せぬエラーが発生しました'}
            </p>
            {this.props.canRetry !== false && (
              <button
                onClick={this.handleRetry}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                再試行
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
