import api, { getApiErrorInfo } from './api';

/**
 * 基本的なAPIレスポンスの型定義
 */
export interface ApiResponse<T = void> {
  success: boolean;
  message?: string;
  data?: T;
}

/**
 * APIエラーレスポンスの型定義
 */
interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * 共通エラーハンドリング関数
 * @param error キャッチしたエラー
 * @param options オプション設定
 * @returns エラーレスポンスまたはnull（再スローが必要な場合）
 */
function handleApiError<T>(
  error: unknown,
  options?: { defaultResponse?: Partial<T>; includeErrors?: boolean }
): (ApiErrorResponse & Partial<T>) | null {
  // 認証・権限エラーの処理
  const errorInfo = getApiErrorInfo(error);
  if (errorInfo) {
    return {
      success: false,
      message: errorInfo.message,
      ...options?.defaultResponse,
    } as ApiErrorResponse & Partial<T>;
  }

  // その他のAxiosエラー（422, 500等）の処理
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as {
      response?: {
        data?: { success?: boolean; message?: string; errors?: Record<string, string[]> };
      };
    };
    const responseData = axiosError.response?.data;
    return {
      success: false,
      message: responseData?.message || 'サーバーエラーが発生しました',
      ...(options?.includeErrors && responseData?.errors ? { errors: responseData.errors } : {}),
      ...options?.defaultResponse,
    } as ApiErrorResponse & Partial<T>;
  }

  // ハンドリングできないエラーはnullを返す（呼び出し側で再スロー）
  return null;
}

/**
 * エラーハンドリング付きGETリクエスト
 * @param url APIエンドポイント
 * @param params クエリパラメータ
 * @param defaultResponse エラー時のデフォルトレスポンス
 */
export async function apiGet<T>(
  url: string,
  params?: Record<string, unknown>,
  defaultResponse?: Partial<T>
): Promise<T & { success: boolean; message?: string }> {
  try {
    // undefinedやnullのパラメータを除外
    const filteredParams = params
      ? Object.fromEntries(
          Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
        )
      : undefined;

    const response = await api.get<T & { success: boolean; message?: string }>(url, {
      params: filteredParams,
    });
    return response.data;
  } catch (error) {
    const errorResponse = handleApiError<T>(error, { defaultResponse });
    if (errorResponse) {
      return errorResponse as T & { success: boolean; message?: string };
    }
    throw error;
  }
}

/**
 * エラーハンドリング付きPOSTリクエスト
 * @param url APIエンドポイント
 * @param data リクエストボディ
 */
export async function apiPost<T = void>(
  url: string,
  data?: unknown
): Promise<{ success: boolean; message?: string; errors?: Record<string, string[]> } & T> {
  try {
    const response = await api.post<
      { success: boolean; message?: string; errors?: Record<string, string[]> } & T
    >(url, data);
    return response.data;
  } catch (error) {
    const errorResponse = handleApiError<T>(error, { includeErrors: true });
    if (errorResponse) {
      return errorResponse as {
        success: boolean;
        message?: string;
        errors?: Record<string, string[]>;
      } & T;
    }
    throw error;
  }
}

/**
 * エラーハンドリング付きPUTリクエスト
 * @param url APIエンドポイント
 * @param data リクエストボディ
 */
export async function apiPut<T = void>(
  url: string,
  data?: unknown
): Promise<{ success: boolean; message?: string; errors?: Record<string, string[]> } & T> {
  try {
    const response = await api.put<
      { success: boolean; message?: string; errors?: Record<string, string[]> } & T
    >(url, data);
    return response.data;
  } catch (error) {
    const errorResponse = handleApiError<T>(error, { includeErrors: true });
    if (errorResponse) {
      return errorResponse as {
        success: boolean;
        message?: string;
        errors?: Record<string, string[]>;
      } & T;
    }
    throw error;
  }
}

/**
 * エラーハンドリング付きDELETEリクエスト
 * @param url APIエンドポイント
 * @param data リクエストボディ
 */
export async function apiDelete<T = void>(
  url: string,
  data?: unknown
): Promise<{ success: boolean; message?: string } & T> {
  try {
    const response = await api.delete<{ success: boolean; message?: string } & T>(url, {
      data,
    });
    return response.data;
  } catch (error) {
    const errorResponse = handleApiError<T>(error);
    if (errorResponse) {
      return errorResponse as { success: boolean; message?: string } & T;
    }
    throw error;
  }
}

/**
 * Blobダウンロード用POSTリクエスト
 * @param url APIエンドポイント
 * @param data リクエストボディ
 * @param defaultFileName デフォルトファイル名
 */
export async function apiDownload(
  url: string,
  data?: unknown,
  defaultFileName: string = 'download.xlsx'
): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await api.post(url, data ?? {}, {
      responseType: 'blob',
    });

    // Content-Dispositionヘッダーからファイル名を取得
    const contentDisposition = response.headers['content-disposition'];
    let fileName = defaultFileName;
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (fileNameMatch && fileNameMatch[1]) {
        fileName = fileNameMatch[1].replace(/['"]/g, '');
      }
    }

    // Blobからダウンロードリンクを作成
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

    return { success: true };
  } catch (error) {
    // エラーレスポンスがBlobの場合、JSONに変換して読み取る
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: Blob; status?: number } };
      if (axiosError.response?.data instanceof Blob) {
        try {
          const text = await axiosError.response.data.text();
          const errorData = JSON.parse(text);
          return {
            success: false,
            message: errorData.message || 'ダウンロードに失敗しました',
          };
        } catch {
          // JSONパースに失敗した場合
        }
      }
    }
    const errorInfo = getApiErrorInfo(error);
    if (errorInfo) {
      return {
        success: false,
        message: errorInfo.message,
      };
    }
    return {
      success: false,
      message: 'ダウンロードに失敗しました',
    };
  }
}
