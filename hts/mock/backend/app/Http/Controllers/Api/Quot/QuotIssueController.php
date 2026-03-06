<?php

namespace App\Http\Controllers\Api\Quot;

use App\Http\Responses\QuotResponse;
use App\Models\Quot;
use App\Services\QuotActionService;
use App\Services\QuotService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class QuotIssueController extends BaseQuotController
{
    private QuotActionService $actionService;

    public function __construct(QuotService $quotService, QuotActionService $actionService)
    {
        parent::__construct($quotService);
        $this->actionService = $actionService;
    }

    /**
     * 見積発行API（Excel形式）
     */
    public function issue(int $quotId): JsonResponse|BinaryFileResponse
    {
        $quot = Quot::find($quotId);

        if (! $quot) {
            return QuotResponse::notFound();
        }

        if ($response = $this->requireQuotAccess($quot, '発行')) {
            return $response;
        }

        try {
            $tempFilePath = $this->actionService->issue($quot, $this->getEmployeeId());
            $fileName = basename($tempFilePath);

            return response()->download($tempFilePath, $fileName, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ])->deleteFileAfterSend(true);
        } catch (\InvalidArgumentException $e) {
            return QuotResponse::badRequest($e->getMessage());
        } catch (\Exception $e) {
            return QuotResponse::serverError('発行処理に失敗しました');
        }
    }

    /**
     * 見積書再発行API
     */
    public function reissue(int $quotId): JsonResponse|BinaryFileResponse
    {
        $quot = Quot::find($quotId);

        if (! $quot) {
            return QuotResponse::notFound();
        }

        if ($response = $this->requireQuotAccess($quot, '再発行')) {
            return $response;
        }

        try {
            $tempFilePath = $this->actionService->reissue($quot, $this->getEmployeeId());
            $fileName = basename($tempFilePath);

            return response()->download($tempFilePath, $fileName, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ])->deleteFileAfterSend(true);
        } catch (\InvalidArgumentException $e) {
            return QuotResponse::badRequest($e->getMessage());
        } catch (\Exception $e) {
            return QuotResponse::serverError('再発行処理に失敗しました');
        }
    }

    /**
     * ステータス60更新API
     */
    public function updateStatus60(int $quotId, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'quot_doc_path' => 'required|string|max:255',
            'is_lost' => 'required|boolean',
            'lost_reason' => 'nullable|string|max:2000',
        ], [
            'quot_doc_path.required' => '見積書格納先を入力してください',
            'quot_doc_path.max' => '255文字以内で入力してください',
            'lost_reason.max' => '2000文字以内で入力してください',
        ]);

        if ($validated['is_lost'] && empty($validated['lost_reason'])) {
            return QuotResponse::validationError('失注理由を入力してください', [
                'lost_reason' => ['失注理由を入力してください'],
            ]);
        }

        $quot = Quot::find($quotId);

        if (! $quot) {
            return QuotResponse::notFound();
        }

        if ($quot->quot_status !== Quot::STATUS_ISSUED) {
            return QuotResponse::badRequest('発行済の見積のみ更新できます');
        }

        if ($response = $this->requireQuotAccess($quot, '更新')) {
            return $response;
        }

        try {
            DB::beginTransaction();

            $quot->quot_doc_path = $validated['quot_doc_path'];

            if ($validated['is_lost']) {
                $quot->quot_result = Quot::RESULT_LOST;
                $quot->lost_reason = $validated['lost_reason'];
            } else {
                $quot->quot_result = Quot::RESULT_UNDETERMINED;
                $quot->lost_reason = null;
            }

            $quot->save();

            DB::commit();

            return QuotResponse::success('更新しました');
        } catch (\Exception $e) {
            DB::rollBack();

            return QuotResponse::serverError('更新に失敗しました');
        }
    }
}
