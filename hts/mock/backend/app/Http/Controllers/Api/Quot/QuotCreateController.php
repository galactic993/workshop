<?php

namespace App\Http\Controllers\Api\Quot;

use App\Http\Requests\QuotCreateRequest;
use App\Http\Requests\QuotUpdateRequest;
use App\Http\Responses\QuotResponse;
use App\Models\Customer;
use App\Models\DepartmentSectionCd;
use App\Models\EmployeeSectionCd;
use App\Models\Quot;
use App\Models\QuotOperation;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class QuotCreateController extends BaseQuotController
{
    /**
     * 見積新規登録API
     */
    public function store(QuotCreateRequest $request): JsonResponse
    {
        $employeeId = session('employee_id');

        // 社員の部署コードIDを取得
        $employeeSectionCd = EmployeeSectionCd::where('employee_id', $employeeId)->first();

        if (! $employeeSectionCd) {
            return QuotResponse::badRequest('社員の部署情報が見つかりません');
        }

        $sectionCdId = $employeeSectionCd->section_cd_id;

        // センターの部署コードIDを取得（任意）
        $centerId = $request->input('center_id');
        $centerSectionCdId = null;

        if ($centerId) {
            $departmentSectionCd = DepartmentSectionCd::where('department_id', $centerId)->first();

            if (! $departmentSectionCd) {
                return QuotResponse::badRequest('センターの部署情報が見つかりません');
            }

            $centerSectionCdId = $departmentSectionCd->section_cd_id;
        }

        // 得意先コードを取得
        $customerId = $request->input('customer_id');
        $customer = Customer::find($customerId);

        if (! $customer) {
            return QuotResponse::badRequest('得意先が見つかりません');
        }

        // 見積書No採番（CCCCCYYMMNNN形式：得意先コード5桁 + 年2桁 + 月2桁 + 連番3桁）
        $customerCd = $customer->customer_cd;
        $year = date('y');
        $month = date('m');
        $prefix = $customerCd.$year.$month;

        // 同一得意先・年月の最大連番を取得（3桁対応）
        $maxNumber = Quot::where('quot_number', 'like', $prefix.'%')
            ->selectRaw('MAX(CAST(SUBSTRING(quot_number, 10, 3) AS INTEGER)) as max_num')
            ->value('max_num');

        $nextNumber = ($maxNumber ?? 0) + 1;
        $quotNumber = $prefix.str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

        DB::beginTransaction();
        try {
            $quot = Quot::create([
                'section_cd_id' => $sectionCdId,
                'employee_id' => $employeeId,
                'base_quot_id' => $request->input('base_quot_id'),
                'quot_number' => $quotNumber,
                'prod_name' => $request->input('prod_name'),
                'customer_id' => $customerId,
                'customer_name' => $request->input('customer_name'),
                'quot_subject' => $request->input('quot_subject'),
                'quot_summary' => $request->input('quot_summary'),
                'message' => $request->input('message'),
                'reference_doc_path' => $request->input('reference_doc_path'),
                'center_section_cd_id' => $centerSectionCdId,
                'submission_method' => $request->input('submission_method'),
                'quot_status' => Quot::STATUS_DRAFT,
                'prod_quot_status' => Quot::PROD_STATUS_BEFORE_REQUEST,
            ]);

            // 作業部門別見積を保存（流用作成時）
            $operations = $request->input('operations');
            if (! empty($operations)) {
                foreach ($operations as $operation) {
                    QuotOperation::create([
                        'quot_id' => $quot->quot_id,
                        'operation_id' => $operation['operation_id'],
                        'cost' => $operation['cost'],
                        'quot_amount' => $operation['quot_amount'],
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'quot_id' => $quot->quot_id,
                'quot_number' => $quot->quot_number,
                'message' => '登録しました',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return QuotResponse::serverError('登録に失敗しました');
        }
    }

    /**
     * 見積更新API（ステータス00:登録済の場合のみ）
     */
    public function update(int $quotId, QuotUpdateRequest $request): JsonResponse
    {
        $quot = Quot::find($quotId);

        if (! $quot) {
            return QuotResponse::notFound();
        }

        if ($quot->quot_status !== Quot::STATUS_DRAFT) {
            return QuotResponse::badRequest('作成中の見積のみ更新できます');
        }

        if ($response = $this->requireQuotAccess($quot, '更新')) {
            return $response;
        }

        // センターの部署コードIDを取得（任意）
        $centerId = $request->input('center_id');
        $centerSectionCdId = null;

        if ($centerId) {
            $departmentSectionCd = DepartmentSectionCd::where('department_id', $centerId)->first();

            if (! $departmentSectionCd) {
                return QuotResponse::badRequest('センターの部署情報が見つかりません');
            }

            $centerSectionCdId = $departmentSectionCd->section_cd_id;
        }

        DB::beginTransaction();
        try {
            $quot->update([
                'prod_name' => $request->input('prod_name'),
                'customer_id' => $request->input('customer_id'),
                'customer_name' => $request->input('customer_name'),
                'quot_subject' => $request->input('quot_subject'),
                'quot_summary' => $request->input('quot_summary'),
                'message' => $request->input('message'),
                'reference_doc_path' => $request->input('reference_doc_path'),
                'center_section_cd_id' => $centerSectionCdId,
                'submission_method' => $request->input('submission_method'),
                'base_quot_id' => $request->input('base_quot_id'),
            ]);

            // 作業部門別見積を更新（流用作成時）
            $operations = $request->input('operations');
            if ($operations !== null) {
                // 既存の作業部門別見積を削除
                QuotOperation::where('quot_id', $quotId)->delete();

                // 新しい作業部門別見積を作成
                foreach ($operations as $operation) {
                    QuotOperation::create([
                        'quot_id' => $quotId,
                        'operation_id' => $operation['operation_id'],
                        'cost' => $operation['cost'],
                        'quot_amount' => $operation['quot_amount'],
                    ]);
                }
            }

            DB::commit();

            return QuotResponse::success('更新しました');
        } catch (\Exception $e) {
            DB::rollBack();

            return QuotResponse::serverError('更新に失敗しました');
        }
    }

    /**
     * 見積削除API（ステータス00:登録済の場合のみ）
     */
    public function destroy(int $quotId): JsonResponse
    {
        $quot = Quot::find($quotId);

        if (! $quot) {
            return QuotResponse::notFound();
        }

        if ($quot->quot_status !== Quot::STATUS_DRAFT) {
            return QuotResponse::badRequest('作成中の見積のみ削除できます');
        }

        if ($response = $this->requireQuotAccess($quot, '削除')) {
            return $response;
        }

        DB::beginTransaction();
        try {
            $quot->delete();

            DB::commit();

            return QuotResponse::success('削除しました');
        } catch (\Exception $e) {
            DB::rollBack();

            return QuotResponse::serverError('削除に失敗しました');
        }
    }
}
