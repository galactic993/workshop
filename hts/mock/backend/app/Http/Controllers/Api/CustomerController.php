<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\DepartmentSectionCd;
use App\Services\PermissionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
    /**
     * コンストラクタ
     */
    public function __construct(
        private PermissionService $permissionService
    ) {}

    /**
     * 得意先サジェスト検索
     *
     * 指定されたセンターに紐づく部署コードに、まだ紐づいていない得意先を検索する
     */
    public function suggest(Request $request): JsonResponse
    {
        // バリデーション
        $request->validate([
            'center_id' => 'required|integer',
            'query' => 'nullable|string|max:100',
            'customer_cd' => 'nullable|string|max:50',
            'customer_name' => 'nullable|string|max:100',
        ]);

        $centerId = $request->input('center_id');
        $query = $request->input('query', '');
        $customerCd = $request->input('customer_cd', '');
        $customerName = $request->input('customer_name', '');

        // センターに紐づく部署コードIDを取得
        $sectionCdIds = DepartmentSectionCd::where('department_id', $centerId)
            ->pluck('section_cd_id')
            ->toArray();

        if (empty($sectionCdIds)) {
            return response()->json([
                'success' => true,
                'customers' => [],
            ]);
        }

        // 既にセンターの部署コードに紐づいている得意先IDを取得
        $existingCustomerIds = \DB::table('customer_section_cd')
            ->whereIn('section_cd_id', $sectionCdIds)
            ->pluck('customer_id')
            ->toArray();

        // 得意先を検索（既に紐づいている得意先は除外）
        // グローバルスコープにより有効なレコードのみ取得
        $customersQuery = Customer::query();

        if (! empty($existingCustomerIds)) {
            $customersQuery->whereNotIn('customer_id', $existingCustomerIds);
        }

        // 検索クエリがある場合はフィルタリング
        if (! empty($query)) {
            // スペース（半角・全角）で分割して各単語でAND検索
            $keywords = preg_split('/[\s\x{3000}]+/u', trim($query));
            foreach ($keywords as $keyword) {
                if (! empty($keyword)) {
                    $customersQuery->where(function ($q) use ($keyword) {
                        $q->where('customer_cd', 'like', "%{$keyword}%")
                            ->orWhere('customer_name', 'like', "%{$keyword}%");
                    });
                }
            }
        }

        // 得意先コード検索（個別パラメータ）
        if (! empty($customerCd)) {
            $customersQuery->where('customer_cd', 'like', "%{$customerCd}%");
        }

        // 得意先名検索（個別パラメータ）
        if (! empty($customerName)) {
            $customersQuery->where('customer_name', 'like', "%{$customerName}%");
        }

        // 最大20件まで取得
        $customers = $customersQuery
            ->orderBy('customer_cd')
            ->limit(20)
            ->get(['customer_id', 'customer_cd', 'customer_name']);

        return response()->json([
            'success' => true,
            'customers' => $customers->map(function ($customer) {
                return [
                    'customer_id' => $customer->customer_id,
                    'customer_cd' => $customer->customer_cd,
                    'customer_name' => $customer->customer_name,
                ];
            }),
        ]);
    }

    /**
     * 部署別得意先一覧取得
     *
     * 指定されたセンターに紐づく部署コードに紐づいている得意先を一覧取得する
     */
    public function sectionCustomers(Request $request): JsonResponse
    {
        // バリデーション
        $request->validate([
            'center_id' => 'required|integer',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|in:10,25,50,100',
            'sort_field' => 'nullable|string|in:customer_cd,customer_name',
            'sort_order' => 'nullable|string|in:asc,desc',
        ]);

        $centerId = $request->input('center_id');
        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 10);
        $sortField = $request->input('sort_field', 'customer_cd');
        $sortOrder = $request->input('sort_order', 'asc');

        // センターに紐づく部署コードIDを取得
        $sectionCdIds = DepartmentSectionCd::where('department_id', $centerId)
            ->pluck('section_cd_id')
            ->toArray();

        if (empty($sectionCdIds)) {
            return response()->json([
                'success' => true,
                'customers' => [],
                'total' => 0,
                'page' => $page,
                'per_page' => $perPage,
                'total_pages' => 0,
            ]);
        }

        // 部署コードに紐づいている得意先を取得（ページネーション付き）
        // グローバルスコープにより有効なレコードのみ取得
        $query = Customer::query()
            ->whereHas('sectionCds', function ($q) use ($sectionCdIds) {
                $q->whereIn('section_cds.section_cd_id', $sectionCdIds);
            });

        // 総件数を取得
        $total = $query->count();
        $totalPages = (int) ceil($total / $perPage);

        // ソート適用
        $query->orderBy($sortField, $sortOrder);

        // ページネーション適用
        $customers = $query
            ->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get();

        return response()->json([
            'success' => true,
            'customers' => $customers->map(function ($customer) {
                return [
                    'customer_id' => $customer->customer_id,
                    'customer_cd' => $customer->customer_cd,
                    'customer_name' => $customer->customer_name,
                ];
            }),
            'total' => $total,
            'page' => (int) $page,
            'per_page' => (int) $perPage,
            'total_pages' => $totalPages,
        ]);
    }

    /**
     * 部署別得意先の削除
     *
     * 指定されたセンターの部署コードから得意先の紐づけを削除する
     */
    public function deleteSectionCustomer(Request $request): JsonResponse
    {
        // 権限チェック
        if (! $this->permissionService->canAccessSectionCustomer()) {
            return response()->json([
                'success' => false,
                'message' => 'この操作を行う権限がありません',
            ], 403);
        }

        // バリデーション
        $request->validate([
            'center_id' => 'required|integer',
            'customer_id' => 'required|integer',
        ]);

        $centerId = $request->input('center_id');
        $customerId = $request->input('customer_id');

        // センターに紐づく部署コードIDを取得
        $sectionCdIds = DepartmentSectionCd::where('department_id', $centerId)
            ->pluck('section_cd_id')
            ->toArray();

        if (empty($sectionCdIds)) {
            return response()->json([
                'success' => false,
                'message' => 'センターに紐づく部署コードが見つかりません',
            ], 404);
        }

        try {
            $deletedCount = DB::transaction(function () use ($customerId, $sectionCdIds) {
                return DB::table('customer_section_cd')
                    ->where('customer_id', $customerId)
                    ->whereIn('section_cd_id', $sectionCdIds)
                    ->delete();
            });

            if ($deletedCount === 0) {
                return response()->json([
                    'success' => false,
                    'message' => '削除対象のデータが見つかりません',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => '削除しました',
                'deleted_count' => $deletedCount,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => '削除処理に失敗しました',
            ], 500);
        }
    }

    /**
     * 部署別得意先の追加
     *
     * 指定されたセンターの部署コードに得意先を紐づける
     */
    public function addSectionCustomer(Request $request): JsonResponse
    {
        // 権限チェック
        if (! $this->permissionService->canAccessSectionCustomer()) {
            return response()->json([
                'success' => false,
                'message' => 'この操作を行う権限がありません',
            ], 403);
        }

        // バリデーション
        $request->validate([
            'center_id' => 'required|integer',
            'customer_id' => 'required|integer',
        ]);

        $centerId = $request->input('center_id');
        $customerId = $request->input('customer_id');

        // 得意先の存在チェック（グローバルスコープにより有効なレコードのみ対象）
        $customer = Customer::where('customer_id', $customerId)
            ->first();

        if (! $customer) {
            return response()->json([
                'success' => false,
                'message' => '指定された得意先が見つかりません',
            ], 404);
        }

        // センターに紐づく部署コードIDを取得
        $sectionCdIds = DepartmentSectionCd::where('department_id', $centerId)
            ->pluck('section_cd_id')
            ->toArray();

        if (empty($sectionCdIds)) {
            return response()->json([
                'success' => false,
                'message' => 'センターに紐づく部署コードが見つかりません',
            ], 404);
        }

        // 既に紐づいているかチェック
        $existingCount = DB::table('customer_section_cd')
            ->where('customer_id', $customerId)
            ->whereIn('section_cd_id', $sectionCdIds)
            ->count();

        if ($existingCount > 0) {
            return response()->json([
                'success' => false,
                'message' => 'この得意先は既に登録されています',
            ], 409);
        }

        try {
            $insertedCount = DB::transaction(function () use ($customerId, $sectionCdIds) {
                $now = now();
                $records = [];

                foreach ($sectionCdIds as $sectionCdId) {
                    $records[] = [
                        'section_cd_id' => $sectionCdId,
                        'customer_id' => $customerId,
                        'updated_at' => $now,
                    ];
                }

                DB::table('customer_section_cd')->insert($records);

                return count($records);
            });

            return response()->json([
                'success' => true,
                'message' => '登録しました',
                'inserted_count' => $insertedCount,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => '登録処理に失敗しました',
            ], 500);
        }
    }
}
