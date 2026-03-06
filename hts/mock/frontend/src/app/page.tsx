'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PageFooter from '@/components/layout/PageFooter';
import Sidebar from '@/components/layout/Sidebar';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ErrorMessageList from '@/components/ui/ErrorMessageList';
import Form from '@/components/ui/Form';
import MessageDialog from '@/components/ui/MessageDialog';
import { loginSchema, type LoginFormData, LOGIN_ERROR_MESSAGES } from '@/schemas/loginSchema';
import { useAuthErrorStore } from '@/stores/authErrorStore';
import { useAuthStore } from '@/stores/authStore';

export default function Home() {
  const { user, loading, login, refreshAuth } = useAuthStore();
  const { errors: authErrors, clearErrors: clearAuthErrors } = useAuthErrorStore();
  const [apiErrors, setApiErrors] = useState<string[]>([]);

  // エラーサンプル用のstate
  const [showConfirmDialogError, setShowConfirmDialogError] = useState(false);
  const [showMessageDialogError, setShowMessageDialogError] = useState(false);
  const [showConfirmScreenError, setShowConfirmScreenError] = useState(false);
  const [screenErrors, setScreenErrors] = useState<string[]>([]);

  // React Hook Form のセットアップ
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  /**
   * 初回レンダリング時に認証状態を確認
   */
  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  /**
   * ログインフォーム送信処理
   */
  const onSubmit = async (data: LoginFormData) => {
    // 前回のエラーをクリア
    clearAuthErrors();
    setApiErrors([]);

    try {
      const result = await login(data.section_cd, data.employee_cd);

      if (!result.success) {
        setApiErrors([result.message || LOGIN_ERROR_MESSAGES.GENERAL]);
      }
    } catch {
      setApiErrors([LOGIN_ERROR_MESSAGES.RETRY]);
    }
  };

  /**
   * 入力フィールドのフォーマット（数字のみ、6桁まで）
   */
  const formatInput = (value: string, field: 'section_cd' | 'employee_cd'): void => {
    const formatted = value.replace(/[^\d]/g, '').slice(0, 6);
    setValue(field, formatted, { shouldValidate: false });
  };

  // ローディング中
  if (loading) {
    return (
      <main className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600">読み込み中...</p>
        </div>
      </main>
    );
  }

  // 未認証の場合: ログインフォームを表示
  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-120px)] flex-col bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md space-y-8">
            <div>
              <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                ログイン
              </h1>
            </div>

            {/* エラーメッセージ（認証エラー + APIエラー） */}
            <ErrorMessageList messages={[...authErrors, ...apiErrors]} />

            <Form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4 rounded-md shadow-sm">
                {/* 部署コード */}
                <div>
                  <label htmlFor="section-cd" className="block text-sm font-medium text-gray-700">
                    部署コード
                  </label>
                  <input
                    id="section-cd"
                    type="text"
                    inputMode="numeric"
                    {...register('section_cd')}
                    onChange={(e) => formatInput(e.target.value, 'section_cd')}
                    className={`mt-1 block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                      errors.section_cd
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                    maxLength={6}
                    disabled={isSubmitting}
                  />
                  {errors.section_cd && (
                    <p className="mt-1 text-sm text-red-600">{errors.section_cd.message}</p>
                  )}
                </div>

                {/* 社員コード */}
                <div>
                  <label htmlFor="employee-cd" className="block text-sm font-medium text-gray-700">
                    社員コード
                  </label>
                  <input
                    id="employee-cd"
                    type="text"
                    inputMode="numeric"
                    {...register('employee_cd')}
                    onChange={(e) => formatInput(e.target.value, 'employee_cd')}
                    className={`mt-1 block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                      errors.employee_cd
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                    maxLength={6}
                    disabled={isSubmitting}
                  />
                  {errors.employee_cd && (
                    <p className="mt-1 text-sm text-red-600">{errors.employee_cd.message}</p>
                  )}
                </div>
              </div>

              {/* ログインボタン */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? 'ログイン中...' : 'ログイン'}
                </button>
              </div>
            </Form>
          </div>
        </div>
        <PageFooter version="1.0.3" lastUpdated="2026/01/26" />
      </div>
    );
  }

  // 認証済みの場合: サイドメニュー + メインエリアを表示
  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      {/* サイドメニュー */}
      <Sidebar />

      {/* メインエリア */}
      <main className="flex-1 bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          {/* エラーメッセージ（権限エラー等 + 画面エラーサンプル） */}
          <ErrorMessageList messages={[...authErrors, ...screenErrors]} className="mb-4" />

          {/* デバッグ情報 */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">ユーザー情報（デバッグ）</h2>
            <dl className="space-y-3">
              <div className="flex">
                <dt className="w-40 flex-shrink-0 font-medium text-gray-600">社員名:</dt>
                <dd className="text-gray-900">
                  {user.employee_cd} {user.employee_name}
                </dd>
              </div>
              <div className="flex">
                <dt className="w-40 flex-shrink-0 font-medium text-gray-600">社員別部署コード:</dt>
                <dd className="text-gray-900">
                  {user.section_cd} {user.section_name}
                </dd>
              </div>
              <div className="flex">
                <dt className="w-40 flex-shrink-0 font-medium text-gray-600">所属センター:</dt>
                <dd className="text-gray-900">{user.center_name || '（未設定）'}</dd>
              </div>
              <div className="flex">
                <dt className="w-40 flex-shrink-0 font-medium text-gray-600">所属チーム:</dt>
                <dd className="text-gray-900">{user.team_name || '（なし）'}</dd>
              </div>
              <div className="flex">
                <dt className="w-40 flex-shrink-0 font-medium text-gray-600">アクセス区分:</dt>
                <dd className="text-gray-900">{user.access_type || '（未設定）'}</dd>
              </div>
              <div className="flex">
                <dt className="w-40 flex-shrink-0 font-medium text-gray-600">役割:</dt>
                <dd className="text-gray-900">
                  {user.roles && user.roles.length > 0 ? user.roles.join(', ') : '（なし）'}
                </dd>
              </div>
              <div className="flex">
                <dt className="w-40 flex-shrink-0 font-medium text-gray-600">権限:</dt>
                <dd className="text-gray-900">
                  {user.permissions && user.permissions.length > 0
                    ? user.permissions.join(', ')
                    : '（なし）'}
                </dd>
              </div>
              <div className="flex">
                <dt className="w-40 flex-shrink-0 font-medium text-gray-600">参照可能組織:</dt>
                <dd className="text-gray-900">
                  {user.visible_departments && user.visible_departments.length > 0
                    ? user.visible_departments.map((d) => d.department_name).join(', ')
                    : '（なし）'}
                </dd>
              </div>
            </dl>
          </div>

          {/* エラーサンプルボタン */}
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">エラー表示サンプル</h2>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmDialogError(true)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                エラー（ダイアログ）
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmScreenError(true)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                エラー（画面）
              </button>
            </div>
          </div>

          <PageFooter version="1.0.3" lastUpdated="2026/01/26" />
        </div>
      </main>

      {/* エラー（ダイアログ）- 確認ダイアログ */}
      <ConfirmDialog
        isOpen={showConfirmDialogError}
        title="エラー - ダイアログ"
        message="テストエラーを発生させます。よろしいですか？"
        confirmLabel="はい"
        onConfirm={() => {
          setShowConfirmDialogError(false);
          setShowMessageDialogError(true);
        }}
        onCancel={() => setShowConfirmDialogError(false)}
      />

      {/* エラー（ダイアログ）- エラーメッセージダイアログ */}
      <MessageDialog
        isOpen={showMessageDialogError}
        title="エラー - ダイアログ"
        message={'テストエラーが発生しました。\n時間を空けて再度お試しください。'}
        onClose={() => setShowMessageDialogError(false)}
      />

      {/* エラー（画面）- 確認ダイアログ */}
      <ConfirmDialog
        isOpen={showConfirmScreenError}
        title="エラー - 画面"
        message="テストエラーを発生させます。よろしいですか？"
        confirmLabel="はい"
        onConfirm={() => {
          setShowConfirmScreenError(false);
          setScreenErrors(['テストエラーが発生しました。時間を空けて再度お試しください。']);
        }}
        onCancel={() => setShowConfirmScreenError(false)}
      />
    </div>
  );
}
