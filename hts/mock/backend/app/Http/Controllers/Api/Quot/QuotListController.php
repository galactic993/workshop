<?php

namespace App\Http\Controllers\Api\Quot;

use App\Http\Requests\QuotSearchRequest;
use App\Http\Requests\QuotSuggestRequest;
use App\Http\Responses\QuotResponse;
use App\Models\DepartmentSectionCd;
use App\Models\Quot;
use App\Models\SectionCd;
use Illuminate\Http\JsonResponse;

class QuotListController extends BaseQuotController
{
    /**
     * 見積一覧取得API
     */
    public function index(QuotSearchRequest $request): JsonResponse
    {
        $accessInfo = $this->getAccessInfo();

        // クエリ構築
        $query = Quot::query()
            ->with(['customer:customer_id,customer_cd,customer_name']);

        // アクセス制御による部署コードフィルタリング
        if (! $accessInfo['is_unlimited']) {
            if (empty($accessInfo['section_cd_ids'])) {
                return $this->emptyResponse($request, $accessInfo);
            }
            $query->whereIn('section_cd_id', $accessInfo['section_cd_ids']);
        }

        // 部署コード検索（'all' の場合は全部署検索のためスキップ）
        $sectionCd = $request->input('section_cd');
        if (! empty($sectionCd) && $sectionCd !== 'all') {
            $sectionCdId = SectionCd::where('section_cd', $sectionCd)
                ->value('section_cd_id');

            if ($sectionCdId) {
                if (! $accessInfo['is_unlimited'] && ! in_array($sectionCdId, $accessInfo['section_cd_ids'])) {
                    return $this->emptyResponse($request, $accessInfo);
                }
                $query->where('section_cd_id', $sectionCdId);
            } else {
                return $this->emptyResponse($request, $accessInfo);
            }
        }

        // 各種検索条件
        $this->applySearchFilters($query, $request);

        // ページネーション
        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 10);

        // ソート
        $dbSortField = $this->getSortField($request->input('sort_field', 'quot_id'));
        $dbSortOrder = $request->input('sort_order', 'desc') === 'asc' ? 'asc' : 'desc';

        // 総件数取得
        $total = $query->count();
        $totalPages = (int) ceil($total / $perPage);

        // データ取得
        $quotes = $query
            ->orderBy($dbSortField, $dbSortOrder)
            ->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get();

        return response()->json([
            'success' => true,
            'quotes' => $quotes->map(fn ($quote) => $this->formatQuoteForList($quote)),
            'total' => $total,
            'page' => (int) $page,
            'per_page' => (int) $perPage,
            'total_pages' => $totalPages,
            'access_info' => [
                'default_section_cd' => $accessInfo['default_section_cd'],
                'is_section_cd_disabled' => $accessInfo['is_section_cd_disabled'],
            ],
        ]);
    }

    /**
     * 見積詳細取得API
     */
    public function show(int $quotId): JsonResponse
    {
        $quot = Quot::with([
            'sectionCd:section_cd_id,section_cd,section_name',
            'employee:employee_id,employee_name',
            'customer:customer_id,customer_cd,customer_name',
            'centerSectionCd:section_cd_id,section_name',
            'prodQuots.prodQuotOperations.operation',
            'quotOperations.operation',
        ])->find($quotId);

        if (! $quot) {
            return QuotResponse::notFound();
        }

        if ($response = $this->requireQuotAccess($quot, '閲覧')) {
            return $response;
        }

        return response()->json([
            'success' => true,
            'quot' => $this->formatQuoteDetail($quot),
        ]);
    }

    /**
     * アクセス情報取得API
     */
    public function accessInfo(): JsonResponse
    {
        $accessInfo = $this->getAccessInfo();

        return response()->json([
            'success' => true,
            'access_info' => [
                'default_section_cd' => $accessInfo['default_section_cd'],
                'is_section_cd_disabled' => $accessInfo['is_section_cd_disabled'],
            ],
        ]);
    }

    /**
     * 選択可能な部署コード一覧を取得（プルダウン用）
     */
    public function getSectionCds(): JsonResponse
    {
        $result = $this->quotService->getSelectableSectionCds(
            $this->getEmployeeId(),
            $this->getAccessType()
        );

        return response()->json([
            'success' => true,
            'section_cds' => $result['section_cds'],
            'is_disabled' => $result['is_disabled'],
        ]);
    }

    /**
     * 見積件名・品名サジェスト検索API
     */
    public function suggest(QuotSuggestRequest $request): JsonResponse
    {
        $accessInfo = $this->getAccessInfo();
        $field = $request->input('field');
        $query = $request->input('query');

        // クエリ構築
        $quotsQuery = Quot::query()
            ->select($field)
            ->distinct()
            ->whereNotNull($field)
            ->where($field, '!=', '');

        // アクセス制御
        if (! $accessInfo['is_unlimited']) {
            if (empty($accessInfo['section_cd_ids'])) {
                return response()->json([
                    'success' => true,
                    'suggestions' => [],
                ]);
            }
            $quotsQuery->whereIn('section_cd_id', $accessInfo['section_cd_ids']);
        }

        // 検索条件（部分一致）
        $quotsQuery->where($field, 'like', '%'.$query.'%');

        // 結果取得（上限20件）
        $suggestions = $quotsQuery
            ->orderBy($field)
            ->limit(20)
            ->pluck($field)
            ->toArray();

        return response()->json([
            'success' => true,
            'suggestions' => $suggestions,
        ]);
    }

    /**
     * 検索条件をクエリに適用
     */
    private function applySearchFilters($query, QuotSearchRequest $request): void
    {
        if ($quoteNo = $request->input('quote_no')) {
            $query->where('quot_number', 'like', '%'.$quoteNo.'%');
        }

        if ($quoteDateFrom = $request->input('quote_date_from')) {
            $query->where('quot_on', '>=', $quoteDateFrom);
        }

        if ($quoteDateTo = $request->input('quote_date_to')) {
            $query->where('quot_on', '<=', $quoteDateTo);
        }

        if ($quotSubject = $request->input('quot_subject')) {
            $query->where('quot_subject', 'like', '%'.$quotSubject.'%');
        }

        if ($customerId = $request->input('customer_id')) {
            $query->where('quots.customer_id', $customerId);
        }

        if ($productName = $request->input('product_name')) {
            $query->where('prod_name', 'like', '%'.$productName.'%');
        }

        // ステータス検索（'all' の場合は全ステータス検索のためスキップ）
        $status = $request->input('status');
        if (! empty($status) && $status !== 'all') {
            $query->where('quot_status', $status);
        }
    }

    /**
     * ソートフィールドを取得
     */
    private function getSortField(string $sortField): string
    {
        return match ($sortField) {
            'quote_no' => 'quot_number',
            'customer_name' => 'customer_name',
            'quot_subject' => 'quot_subject',
            'prod_name' => 'prod_name',
            'amount' => 'quot_amount',
            'quot_status' => 'quot_status',
            default => 'quot_id',
        };
    }

    /**
     * 空のレスポンスを返す
     */
    private function emptyResponse(QuotSearchRequest $request, array $accessInfo): JsonResponse
    {
        return response()->json([
            'success' => true,
            'quotes' => [],
            'total' => 0,
            'page' => (int) $request->input('page', 1),
            'per_page' => (int) $request->input('per_page', 10),
            'total_pages' => 0,
            'access_info' => [
                'default_section_cd' => $accessInfo['default_section_cd'],
                'is_section_cd_disabled' => $accessInfo['is_section_cd_disabled'],
            ],
        ]);
    }

    /**
     * 一覧用に見積をフォーマット
     */
    private function formatQuoteForList(Quot $quote): array
    {
        $displayCustomerName = ! empty($quote->customer_name)
            ? $quote->customer_name
            : ($quote->customer?->customer_name ?? '');

        return [
            'quote_id' => $quote->quot_id,
            'quote_no' => $quote->quot_number,
            'customer_name' => $displayCustomerName,
            'quot_subject' => $quote->quot_subject,
            'product_name' => $quote->prod_name,
            'amount' => $quote->quot_amount,
            'quot_status' => $quote->quot_status,
            'status_label' => $quote->status_label,
            'prod_quot_status' => $quote->prod_quot_status,
        ];
    }

    /**
     * 詳細用に見積をフォーマット
     */
    private function formatQuoteDetail(Quot $quot): array
    {
        $displayCustomerName = ! empty($quot->customer_name)
            ? $quot->customer_name
            : $quot->customer?->customer_name;

        $prodQuotOperations = [];
        $prodQuot = $quot->prodQuots->first();
        if ($prodQuot) {
            $prodQuotOperations = $prodQuot->prodQuotOperations->map(fn ($op) => [
                'prod_quot_operation_id' => $op->prod_quot_operation_id,
                'operation_id' => $op->operation_id,
                'operation_cd' => $op->operation?->operation_cd,
                'operation_name' => $op->operation?->operation_name,
                'prod_quot_cost' => (int) $op->prod_quot_cost,
            ])->values()->toArray();
        }

        $quotOperations = $quot->quotOperations->map(fn ($op) => [
            'quot_operation_id' => $op->quot_operation_id,
            'operation_id' => $op->operation_id,
            'operation_cd' => $op->operation?->operation_cd,
            'operation_name' => $op->operation?->operation_name,
            'cost' => (int) $op->cost,
            'quot_amount' => (int) $op->quot_amount,
        ])->values()->toArray();

        return [
            'quot_id' => $quot->quot_id,
            'quot_number' => $quot->quot_number,
            'section_cd' => $quot->sectionCd?->section_cd,
            'section_name' => $quot->sectionCd?->section_name,
            'employee_name' => $quot->employee?->employee_name,
            'customer_id' => $quot->customer_id,
            'customer_cd' => $quot->customer?->customer_cd,
            'customer_name' => $displayCustomerName,
            'quot_customer_name' => $quot->customer_name,
            'prod_name' => $quot->prod_name,
            'quot_subject' => $quot->quot_subject,
            'quot_summary' => $quot->quot_summary,
            'reference_doc_path' => $quot->reference_doc_path,
            'center_id' => $quot->center_section_cd_id
                ? DepartmentSectionCd::where('section_cd_id', $quot->center_section_cd_id)->value('department_id')
                : null,
            'center_name' => $quot->centerSectionCd?->section_name,
            'quot_status' => $quot->quot_status,
            'status_label' => $quot->status_label,
            'prod_quot_status' => $quot->prod_quot_status,
            'prod_quot_status_label' => $quot->prod_quot_status_label,
            'quot_on' => $quot->quot_on?->format('Y-m-d'),
            'quot_doc_path' => $quot->quot_doc_path,
            'quot_amount' => $quot->quot_amount,
            'submission_method' => $quot->submission_method,
            'submission_method_label' => $quot->submission_method_label,
            'quot_result' => $quot->quot_result,
            'quot_result_label' => $quot->quot_result_label,
            'lost_reason' => $quot->lost_reason,
            'message' => $quot->message,
            'prod_quot_operations' => $prodQuotOperations,
            'quot_operations' => $quotOperations,
        ];
    }
}
