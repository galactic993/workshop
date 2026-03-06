import { useState, useCallback, useMemo } from 'react';
import { useForm, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getQuots, getSectionCds, QuotListItem, QuotSortField, SectionCdOption } from '@/lib/quot';
import { SortOrder } from '@/lib/types';
import { INITIAL_DISPLAY_COUNT } from '@/lib/utils';
import {
  quotSearchSchema,
  type QuotSearchFormData,
  quotSearchDefaultValues,
  SECTION_CD_ALL,
  STATUS_ALL,
} from '@/schemas/quotSearchSchema';

/**
 * サーバーのフィールド名からフォームのフィールド名へのマッピング
 */
const SERVER_TO_FORM_FIELD_MAP: Record<string, Path<QuotSearchFormData> | null> = {
  section_cd: 'section_cd',
  quote_no: 'quote_no',
  quote_date_from: 'quote_date_from',
  quote_date_to: 'quote_date_to',
  quot_subject: 'quot_subject',
  customer_id: 'customer',
  product_name: 'product_name',
  status: 'status',
  // 以下はフォームに対応するフィールドがないため無視
  page: null,
  per_page: null,
  sort_field: null,
  sort_order: null,
};

interface UseQuotSearchOptions {
  user: { access_type: string | null; permissions?: string[] | null } | null;
}

interface UseQuotSearchReturn {
  // フォーム関連
  form: ReturnType<typeof useForm<QuotSearchFormData>>;
  // 一覧データ
  quotes: QuotListItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  listLoading: boolean;
  // 部署コード関連
  sectionCdOptions: SectionCdOption[];
  isSectionCdDisabled: boolean;
  sectionCdLoading: boolean;
  // ソート
  sortField: QuotSortField | null;
  sortOrder: SortOrder;
  // エラー
  errors: string[];
  /** エラーメッセージを追加 */
  addError: (message: string) => void;
  // ハンドラー
  onSubmit: (data: QuotSearchFormData) => void;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
  handleSortToggle: (field: QuotSortField) => void;
  handleClear: () => void;
  /** 現在の条件で一覧を再取得 */
  refetch: () => void;
}

/**
 * 見積検索・一覧取得のカスタムフック
 */
export function useQuotSearch({ user }: UseQuotSearchOptions): UseQuotSearchReturn {
  // 検索条件の状態
  const [pageSize, setPageSize] = useState<number>(INITIAL_DISPLAY_COUNT);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState<QuotSearchFormData | null>(null);

  // ソート関連の状態
  const [sortField, setSortField] = useState<QuotSortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // エラー状態
  const [errors, setErrors] = useState<string[]>([]);

  // エラーメッセージを追加
  const addError = useCallback((message: string) => {
    setErrors((prev) => [...prev, message]);
  }, []);

  // React Hook Form のセットアップ
  const form = useForm<QuotSearchFormData>({
    resolver: zodResolver(quotSearchSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: quotSearchDefaultValues,
  });

  const { setValue, reset, setError } = form;

  // 部署コード一覧を取得（TanStack Query）
  const {
    data: sectionCdsData,
    isLoading: sectionCdLoading,
    error: sectionCdsError,
  } = useQuery({
    queryKey: ['quotSectionCds'],
    queryFn: getSectionCds,
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5分間はキャッシュを使用
  });

  const sectionCdOptions = useMemo(
    () => sectionCdsData?.section_cds ?? [],
    [sectionCdsData?.section_cds]
  );
  const isSectionCdDisabled = sectionCdsData?.is_disabled ?? false;

  // success: false のレスポンスをエラーとして処理
  if (sectionCdsData && !sectionCdsData.success) {
    const message = sectionCdsData.message || '部署コードの取得に失敗しました';
    if (!errors.includes(message)) {
      setErrors((prev) => [...prev, message]);
    }
  }

  // 部署コード取得エラーの管理
  if (sectionCdsError && !errors.some((e) => e.includes('部署コード'))) {
    // 401/403はインターセプターで処理済みなのでスキップ
    if (
      !axios.isAxiosError(sectionCdsError) ||
      (sectionCdsError.response?.status !== 401 && sectionCdsError.response?.status !== 403)
    ) {
      setErrors((prev) => [
        ...prev,
        '部署コードの取得に失敗しました。時間を空けて再度お試しください',
      ]);
    }
  }

  // 見積一覧取得の検索パラメータを構築
  const quotsQueryParams = useMemo(() => {
    const sectionCd = searchParams?.section_cd || SECTION_CD_ALL;
    const status = searchParams?.status || STATUS_ALL;
    return {
      section_cd: sectionCd,
      quote_no: searchParams?.quote_no || undefined,
      quote_date_from: searchParams?.quote_date_from || undefined,
      quote_date_to: searchParams?.quote_date_to || undefined,
      quot_subject: searchParams?.quot_subject || undefined,
      customer_id: searchParams?.customer?.customer_id || undefined,
      product_name: searchParams?.product_name || undefined,
      status,
      page: currentPage,
      per_page: pageSize,
      sort_field: sortField || undefined,
      sort_order: sortField ? sortOrder : undefined,
    };
  }, [searchParams, currentPage, pageSize, sortField, sortOrder]);

  // 見積一覧を取得（TanStack Query）
  const {
    data: quotsData,
    isLoading: listLoading,
    error: quotsError,
    refetch,
  } = useQuery({
    queryKey: ['quots', quotsQueryParams],
    queryFn: () => getQuots(quotsQueryParams),
    enabled: !!user,
    staleTime: 0, // 常に最新のデータを取得
  });

  const quotes = quotsData?.quotes ?? [];
  const totalCount = quotsData?.total ?? 0;
  const totalPages = quotsData?.total_pages ?? 0;

  // success: false のレスポンスをエラーとして処理
  if (quotsData && !quotsData.success) {
    const message = quotsData.message || '一覧の取得に失敗しました';
    if (!errors.includes(message)) {
      setErrors((prev) => [...prev, message]);
    }
  }

  // 見積一覧取得エラーの管理
  if (quotsError && !errors.some((e) => e.includes('見積情報'))) {
    // 422 バリデーションエラー: フィールド別エラーをフォームにセット
    if (axios.isAxiosError(quotsError) && quotsError.response?.status === 422) {
      const serverErrors = quotsError.response.data?.errors as Record<string, string[]> | undefined;
      if (serverErrors) {
        Object.entries(serverErrors).forEach(([serverField, messages]) => {
          const formField = SERVER_TO_FORM_FIELD_MAP[serverField];
          if (formField && messages.length > 0) {
            setError(formField, { message: messages[0] });
          }
        });
      }
    }
    // 401/403はインターセプターで処理済みなのでスキップ
    else if (
      !axios.isAxiosError(quotsError) ||
      (quotsError.response?.status !== 401 && quotsError.response?.status !== 403)
    ) {
      setErrors((prev) => [
        ...prev,
        '見積情報の取得に失敗しました。時間を空けて再度お試しください',
      ]);
    }
  }

  // 部署コードが1つのみの場合は自動選択
  if (sectionCdOptions.length === 1 && form.getValues('section_cd') === SECTION_CD_ALL) {
    setValue('section_cd', sectionCdOptions[0].section_cd);
  }

  // 検索実行
  const onSubmit = useCallback(
    (data: QuotSearchFormData) => {
      // 部署コードの選択肢バリデーション
      const sectionCd = data.section_cd;
      if (sectionCd !== SECTION_CD_ALL) {
        const isValidSectionCd = sectionCdOptions.some((option) => option.section_cd === sectionCd);
        if (!isValidSectionCd) {
          setError('section_cd', { message: '有効な値を選択してください' });
          return;
        }
      }

      setSearchParams(data);
      setCurrentPage(1);
      setPageSize(INITIAL_DISPLAY_COUNT);
    },
    [sectionCdOptions, setError]
  );

  // ページ変更時
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  // 表示件数変更時
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  }, []);

  // ソート切り替え
  const handleSortToggle = useCallback(
    (field: QuotSortField) => {
      let newSortOrder: SortOrder = 'asc';
      if (sortField === field) {
        newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      }
      setSortField(field);
      setSortOrder(newSortOrder);
      setCurrentPage(1);
    },
    [sortField, sortOrder]
  );

  // クリアボタン
  const handleClear = useCallback(() => {
    // 選択肢が1つのみ（非活性）の場合はその値を維持、それ以外は 'all'
    const resetValues = {
      ...quotSearchDefaultValues,
      section_cd:
        isSectionCdDisabled && sectionCdOptions.length === 1
          ? sectionCdOptions[0].section_cd
          : SECTION_CD_ALL,
    };
    reset(resetValues);
  }, [isSectionCdDisabled, sectionCdOptions, reset]);

  return {
    form,
    quotes,
    totalCount,
    totalPages,
    currentPage,
    pageSize,
    listLoading,
    sectionCdOptions,
    isSectionCdDisabled,
    sectionCdLoading,
    sortField,
    sortOrder,
    errors,
    addError,
    onSubmit,
    handlePageChange,
    handlePageSizeChange,
    handleSortToggle,
    handleClear,
    refetch,
  };
}
