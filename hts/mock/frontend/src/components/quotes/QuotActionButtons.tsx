'use client';

import { useQuotButtonState, QuotButtonState } from '@/hooks/useQuotButtonState';

/**
 * 見積アクションボタン群のprops
 */
export interface QuotActionButtonsProps {
  /** 見積ステータス */
  quotStatus: string | null;
  /** 制作見積ステータス */
  prodQuotStatus: string | null;
  /** 新規作成モードかどうか */
  isNew: boolean;
  /** 承認権限の有無 */
  hasApprovePermission: boolean;
  /** 各種クリックハンドラ */
  handlers: QuotActionHandlers;
  /** ローディング状態 */
  loading?: QuotActionLoadingState;
  /** フォームのダーティ状態 */
  formDirtyStates?: QuotFormDirtyState;
  /** 制作見積依頼ボタンの活性状態を上書き（hookの判定をオーバーライド） */
  canRequestProdQuotOverride?: boolean;
  /** 見積作業部門レコードが存在するか（流用作成判定用） */
  hasQuotOperations?: boolean;
}

/**
 * ボタンクリックハンドラの型定義
 */
export interface QuotActionHandlers {
  /** 一覧に戻る */
  onBack: () => void;
  /** 作成（新規） */
  onCreate?: () => void;
  /** 更新（作成中・一時保存） */
  onUpdate?: () => void;
  /** 登録（作成中→承認待ち） */
  onRegisterDraft?: () => void;
  /** 削除 */
  onDelete?: () => void;
  /** 制作見積依頼 */
  onRequestProdQuot?: () => void;
  /** 見積登録（承認依頼） */
  onRegister?: () => void;
  /** 承認 */
  onApprove?: () => void;
  /** 差戻し */
  onReject?: () => void;
  /** 登録取消 */
  onCancelRegister?: () => void;
  /** 承認取消 */
  onCancelApprove?: () => void;
  /** 発行 */
  onIssue?: () => void;
  /** 金額更新 */
  onUpdateAmount?: () => void;
  /** 再発行 */
  onReissue?: () => void;
  /** 発行済更新 */
  onUpdateIssued?: () => void;
}

/**
 * ローディング状態の型定義
 */
export interface QuotActionLoadingState {
  /** 更新中 */
  updating?: boolean;
  /** 登録中 */
  registering?: boolean;
  /** 削除中 */
  deleting?: boolean;
  /** 承認処理中 */
  approving?: boolean;
  /** 発行中 */
  issuing?: boolean;
}

/**
 * フォームのダーティ状態の型定義
 */
export interface QuotFormDirtyState {
  /** 作成フォームのダーティ状態 */
  createFormDirty?: boolean;
  /** 見積金額フォームのダーティ状態 */
  quotAmountFormDirty?: boolean;
}

/**
 * 見積画面のステータス別アクションボタン群コンポーネント
 *
 * useQuotButtonStateフックを使用してボタンの表示・有効化を制御し、
 * 各ステータスに応じた適切なアクションボタンを表示します。
 *
 * @param props - ボタン表示制御とハンドラのprops
 * @returns アクションボタン群のJSX
 *
 * @example
 * ```tsx
 * <QuotActionButtons
 *   quotStatus="00"
 *   prodQuotStatus="10"
 *   isNew={false}
 *   hasApprovePermission={true}
 *   handlers={{
 *     onBack: () => router.push('/sales/quotes'),
 *     onUpdate: handleUpdate,
 *     onDelete: handleDelete,
 *     onRequestProdQuot: handleRequestProdQuot,
 *   }}
 *   loading={{ updating: isUpdating }}
 *   formDirtyStates={{ createFormDirty: isDirty }}
 * />
 * ```
 */
export function QuotActionButtons({
  quotStatus,
  prodQuotStatus,
  isNew,
  hasApprovePermission,
  handlers,
  loading = {},
  formDirtyStates = {},
  canRequestProdQuotOverride,
  hasQuotOperations = false,
}: QuotActionButtonsProps) {
  const buttonState = useQuotButtonState({
    quotStatus,
    prodQuotStatus,
    isNew,
    hasApprovePermission,
  });

  // 制作見積依頼ボタンの活性状態（オーバーライドが指定されていればそれを使用）
  const canRequestProdQuot =
    canRequestProdQuotOverride !== undefined
      ? canRequestProdQuotOverride
      : buttonState.canRequestProdQuot;

  return (
    <div className="mt-6 flex justify-end gap-3">
      {/* 一覧に戻るボタン（常に表示） */}
      <button
        type="button"
        onClick={handlers.onBack}
        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        一覧に戻る
      </button>

      {/* 新規作成ボタン */}
      {buttonState.canCreate && handlers.onCreate && (
        <button
          type="button"
          onClick={handlers.onCreate}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          作成
        </button>
      )}

      {/* 作成中の更新ボタン */}
      {buttonState.canUpdate && handlers.onUpdate && (
        <>
          {/* 削除ボタン */}
          {buttonState.canDelete && handlers.onDelete && (
            <button
              type="button"
              onClick={handlers.onDelete}
              disabled={loading.deleting}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
            >
              削除
            </button>
          )}

          <button
            type="button"
            onClick={handlers.onUpdate}
            disabled={loading.updating}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            一時保存
          </button>

          {/* 登録ボタン（ステータス00、かつquot_operationsレコードが存在する場合のみ表示） */}
          {hasQuotOperations && handlers.onRegisterDraft && (
            <button
              type="button"
              onClick={handlers.onRegisterDraft}
              disabled={loading.registering}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              登録
            </button>
          )}

          {/* 制作見積依頼ボタン */}
          {canRequestProdQuot && handlers.onRequestProdQuot && (
            <button
              type="button"
              onClick={handlers.onRequestProdQuot}
              disabled={formDirtyStates.createFormDirty}
              className={`rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                formDirtyStates.createFormDirty
                  ? 'cursor-not-allowed bg-gray-400'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              }`}
            >
              制作見積依頼
            </button>
          )}
        </>
      )}

      {/* 制作見積済の登録ボタン（見積登録） */}
      {buttonState.canRegister && handlers.onRegister && (
        <>
          {/* 差戻しボタン */}
          {handlers.onReject && (
            <button
              type="button"
              onClick={handlers.onReject}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              差戻し
            </button>
          )}

          <button
            type="button"
            onClick={handlers.onRegister}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            登録
          </button>
        </>
      )}

      {/* 承認待ちのボタン群 */}
      {quotStatus === '10' && !isNew && (
        <>
          {/* 登録取消ボタン */}
          {buttonState.canCancelRegister && handlers.onCancelRegister && (
            <button
              type="button"
              onClick={handlers.onCancelRegister}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              登録取消
            </button>
          )}

          {/* 金額更新ボタン */}
          {buttonState.canUpdateAmount && handlers.onUpdateAmount && (
            <button
              type="button"
              onClick={handlers.onUpdateAmount}
              disabled={loading.updating}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              更新
            </button>
          )}

          {/* 承認ボタン */}
          {buttonState.canApprove && handlers.onApprove && (
            <button
              type="button"
              onClick={handlers.onApprove}
              disabled={formDirtyStates.quotAmountFormDirty || loading.approving}
              className={`rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                formDirtyStates.quotAmountFormDirty || loading.approving
                  ? 'cursor-not-allowed bg-gray-400'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              }`}
            >
              承認
            </button>
          )}
        </>
      )}

      {/* 承認済のボタン群 */}
      {quotStatus === '20' && !isNew && (
        <>
          {/* 承認取消ボタン */}
          {buttonState.canCancelApprove && handlers.onCancelApprove && (
            <button
              type="button"
              onClick={handlers.onCancelApprove}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              承認取消
            </button>
          )}

          {/* 金額更新ボタン */}
          {buttonState.canUpdateAmount && handlers.onUpdateAmount && (
            <button
              type="button"
              onClick={handlers.onUpdateAmount}
              disabled={loading.updating}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              更新
            </button>
          )}

          {/* 発行ボタン */}
          {buttonState.canIssue && handlers.onIssue && (
            <button
              type="button"
              onClick={handlers.onIssue}
              disabled={loading.issuing}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              発行
            </button>
          )}
        </>
      )}

      {/* 発行済のボタン群 */}
      {quotStatus === '30' && !isNew && (
        <>
          {/* 発行済更新ボタン */}
          {buttonState.canUpdateIssued && handlers.onUpdateIssued && (
            <button
              type="button"
              onClick={handlers.onUpdateIssued}
              disabled={loading.updating}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              更新
            </button>
          )}

          {/* 再発行ボタン */}
          {buttonState.canReissue && handlers.onReissue && (
            <button
              type="button"
              onClick={handlers.onReissue}
              disabled={loading.issuing}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              再発行
            </button>
          )}
        </>
      )}
    </div>
  );
}
