<?php

namespace App\Http\Controllers\Api\Quot;

use App\Http\Requests\QuotCustomerSearchRequest;
use App\Http\Requests\QuotCustomerSuggestRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;

class QuotCustomerController extends BaseQuotController
{
    /**
     * 得意先サジェスト検索（見積ページ用）
     *
     * 自身が参照可能な部署コードのセンターに紐づく部署別得意先から検索
     */
    public function suggest(QuotCustomerSuggestRequest $request): JsonResponse
    {
        $customerIds = $this->quotService->getSelectableCustomerIds(
            $this->getEmployeeId(),
            $this->getAccessType()
        );

        $customers = $this->quotService->suggestCustomers(
            $customerIds,
            $request->input('query', '')
        );

        return response()->json([
            'success' => true,
            'customers' => $this->formatCustomers($customers),
        ]);
    }

    /**
     * 得意先検索（見積ページ用・得意先選択ダイアログ）
     *
     * 自身が参照可能な部署コードのセンターに紐づく部署別得意先から検索
     */
    public function search(QuotCustomerSearchRequest $request): JsonResponse
    {
        $customerIds = $this->quotService->getSelectableCustomerIds(
            $this->getEmployeeId(),
            $this->getAccessType()
        );

        $customers = $this->quotService->searchCustomers(
            $customerIds,
            $request->input('customer_cd'),
            $request->input('customer_name')
        );

        return response()->json([
            'success' => true,
            'customers' => $this->formatCustomers($customers),
        ]);
    }

    /**
     * 得意先サジェスト検索（新規登録モーダル用）
     *
     * ログインユーザーの所属センターに紐づく部署別得意先から検索
     * アクセス権限に関わらず一律のロジック
     */
    public function suggestForCreate(QuotCustomerSuggestRequest $request): JsonResponse
    {
        $customerIds = $this->quotService->getCustomerIdsByUserCenter($this->getEmployeeId());

        $customers = $this->quotService->suggestCustomers(
            $customerIds,
            $request->input('query', '')
        );

        return response()->json([
            'success' => true,
            'customers' => $this->formatCustomers($customers),
        ]);
    }

    /**
     * 得意先検索（新規登録モーダル用・得意先選択ダイアログ）
     *
     * ログインユーザーの所属センターに紐づく部署別得意先から検索
     * アクセス権限に関わらず一律のロジック
     */
    public function searchForCreate(QuotCustomerSearchRequest $request): JsonResponse
    {
        $customerIds = $this->quotService->getCustomerIdsByUserCenter($this->getEmployeeId());

        $customers = $this->quotService->searchCustomers(
            $customerIds,
            $request->input('customer_cd'),
            $request->input('customer_name')
        );

        return response()->json([
            'success' => true,
            'customers' => $this->formatCustomers($customers),
        ]);
    }

    /**
     * 得意先コレクションをAPIレスポンス形式に変換
     */
    private function formatCustomers(Collection $customers): array
    {
        return $customers->map(fn ($customer) => [
            'customer_id' => $customer->customer_id,
            'customer_cd' => $customer->customer_cd,
            'customer_name' => $customer->customer_name,
        ])->toArray();
    }
}
