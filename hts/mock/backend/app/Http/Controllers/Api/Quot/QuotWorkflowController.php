<?php

namespace App\Http\Controllers\Api\Quot;

use App\Enums\AccessType;
use App\Http\Requests\QuotRegisterRequest;
use App\Http\Requests\QuotRejectRequest;
use App\Http\Responses\QuotResponse;
use App\Models\Department;
use App\Models\Employee;
use App\Models\Quot;
use App\Services\QuotActionService;
use App\Services\QuotService;
use Illuminate\Http\JsonResponse;

class QuotWorkflowController extends BaseQuotController
{
    private QuotActionService $actionService;

    public function __construct(QuotService $quotService, QuotActionService $actionService)
    {
        parent::__construct($quotService);
        $this->actionService = $actionService;
    }

    /**
     * 見積承認API
     */
    public function approve(int $quotId): JsonResponse
    {
        if ($response = $this->requireApprovalPermission()) {
            return $response;
        }

        $quot = Quot::find($quotId);

        if (! $quot) {
            return QuotResponse::notFound();
        }

        if ($response = $this->requireQuotAccess($quot, '承認')) {
            return $response;
        }

        try {
            $this->actionService->approve($quot, $this->getEmployeeId());

            return QuotResponse::success('承認しました');
        } catch (\InvalidArgumentException $e) {
            return QuotResponse::badRequest($e->getMessage());
        }
    }

    /**
     * 見積承認取消API
     */
    public function cancelApprove(int $quotId): JsonResponse
    {
        if ($response = $this->requireApprovalPermission()) {
            return $response;
        }

        $quot = Quot::find($quotId);

        if (! $quot) {
            return QuotResponse::notFound();
        }

        if ($response = $this->requireQuotAccess($quot, '承認取消')) {
            return $response;
        }

        try {
            $this->actionService->cancelApproval($quot);

            return QuotResponse::success('承認を取り消しました');
        } catch (\InvalidArgumentException $e) {
            return QuotResponse::badRequest($e->getMessage());
        }
    }

    /**
     * 制作見積依頼API
     */
    public function requestProduction(int $quotId): JsonResponse
    {
        $quot = Quot::find($quotId);

        if (! $quot) {
            return QuotResponse::notFound();
        }

        if ($response = $this->requireQuotAccess($quot, '制作見積依頼')) {
            return $response;
        }

        try {
            $this->actionService->requestProduction($quot);

            return QuotResponse::success('制作見積依頼を行いました');
        } catch (\InvalidArgumentException $e) {
            return QuotResponse::badRequest($e->getMessage());
        } catch (\Exception $e) {
            return QuotResponse::serverError('制作見積依頼に失敗しました');
        }
    }

    /**
     * 制作見積受取API
     */
    public function receiveProdQuot(int $quotId): JsonResponse
    {
        $quot = Quot::find($quotId);

        if (! $quot) {
            return QuotResponse::notFound();
        }

        if ($response = $this->requireQuotAccess($quot, '制作見積受取')) {
            return $response;
        }

        try {
            $this->actionService->receiveProdQuot($quot);

            return QuotResponse::success('制作見積を受け取りました');
        } catch (\InvalidArgumentException $e) {
            return QuotResponse::badRequest($e->getMessage());
        } catch (\Exception $e) {
            return QuotResponse::serverError('制作見積の受け取りに失敗しました');
        }
    }

    /**
     * 差戻しAPI
     */
    public function reject(QuotRejectRequest $request, int $quotId): JsonResponse
    {
        $quot = Quot::find($quotId);

        if (! $quot) {
            return QuotResponse::notFound();
        }

        if ($response = $this->requireQuotAccess($quot, '差戻し')) {
            return $response;
        }

        try {
            $this->actionService->reject($quot, $request->validated()['remand_reason']);

            return QuotResponse::success('差戻しを行いました');
        } catch (\InvalidArgumentException $e) {
            return QuotResponse::badRequest($e->getMessage());
        } catch (\RuntimeException $e) {
            return QuotResponse::notFound($e->getMessage());
        } catch (\Exception $e) {
            return QuotResponse::serverError('差戻しに失敗しました');
        }
    }

    /**
     * 見積登録API（ステータス00から10へ）
     *
     * 作成中の見積を承認待ちに登録する
     * 作業部門別見積レコードが存在する場合のみ実行可能
     */
    public function registerDraft(int $quotId): JsonResponse
    {
        $quot = Quot::find($quotId);

        if (! $quot) {
            return QuotResponse::notFound();
        }

        if ($response = $this->requireQuotAccess($quot, '登録')) {
            return $response;
        }

        try {
            $this->actionService->registerDraft($quot);

            return QuotResponse::success('見積を登録しました');
        } catch (\InvalidArgumentException $e) {
            return QuotResponse::badRequest($e->getMessage());
        } catch (\Exception $e) {
            return QuotResponse::serverError('見積登録に失敗しました');
        }
    }

    /**
     * 見積登録API（ステータス30から40へ）
     */
    public function register(QuotRegisterRequest $request, int $quotId): JsonResponse
    {
        $quot = Quot::find($quotId);

        if (! $quot) {
            return QuotResponse::notFound();
        }

        if ($response = $this->requireQuotAccess($quot, '登録')) {
            return $response;
        }

        try {
            $this->actionService->register($quot, $request->validated()['amounts']);

            return QuotResponse::success('見積を登録しました');
        } catch (\InvalidArgumentException $e) {
            return QuotResponse::badRequest($e->getMessage());
        } catch (\RuntimeException $e) {
            return QuotResponse::notFound($e->getMessage());
        } catch (\Exception $e) {
            return QuotResponse::serverError('見積登録に失敗しました');
        }
    }

    /**
     * 見積登録取消API（ステータス40から30へ）
     */
    public function cancelRegister(int $quotId): JsonResponse
    {
        $quot = Quot::find($quotId);

        if (! $quot) {
            return QuotResponse::notFound();
        }

        if ($response = $this->requireQuotAccess($quot, '登録取消')) {
            return $response;
        }

        try {
            $this->actionService->cancelRegister($quot);

            return QuotResponse::success('登録を取り消しました');
        } catch (\InvalidArgumentException $e) {
            return QuotResponse::badRequest($e->getMessage());
        } catch (\Exception $e) {
            return QuotResponse::serverError('登録取消に失敗しました');
        }
    }

    /**
     * 見積金額更新API（ステータス40）
     */
    public function updateAmounts(QuotRegisterRequest $request, int $quotId): JsonResponse
    {
        $quot = Quot::find($quotId);

        if (! $quot) {
            return QuotResponse::notFound();
        }

        if ($response = $this->requireQuotAccess($quot, '金額更新')) {
            return $response;
        }

        try {
            $this->actionService->updateAmounts($quot, $request->validated()['amounts']);

            return QuotResponse::success('見積を更新しました');
        } catch (\InvalidArgumentException $e) {
            return QuotResponse::badRequest($e->getMessage());
        } catch (\Exception $e) {
            return QuotResponse::serverError('見積更新に失敗しました');
        }
    }

    /**
     * センターの所長一覧取得API
     */
    public function getCenterManagers(int $centerId): JsonResponse
    {
        // センター（組織）の存在確認
        $center = Department::find($centerId);

        if (! $center) {
            return QuotResponse::notFound('センターが見つかりません');
        }

        // センターに所属する所長を取得
        $managers = Employee::whereHas('departmentEmployee', function ($query) use ($centerId) {
            $query->where('department_id', $centerId);
        })
            ->where('access_type', AccessType::MANAGER->value)
            ->select('employee_id', 'employee_cd', 'employee_name', 'email')
            ->get();

        return response()->json([
            'success' => true,
            'managers' => $managers,
        ]);
    }
}
