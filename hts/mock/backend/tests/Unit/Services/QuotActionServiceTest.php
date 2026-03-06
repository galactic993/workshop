<?php

namespace Tests\Unit\Services;

use App\Models\ProdQuot;
use App\Models\ProdQuotOperation;
use App\Models\Quot;
use App\Models\QuotIssueLog;
use App\Models\QuotOperation;
use App\Services\QuotActionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuotActionServiceTest extends TestCase
{
    use RefreshDatabase;

    private QuotActionService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new QuotActionService;
        $this->seed();
    }

    /**
     * 承認テスト - 正常系
     */
    public function test_approve_changes_status_to_approved(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_PENDING_APPROVAL,
        ]);
        $employeeId = 1;

        $this->service->approve($quot, $employeeId);

        $this->assertEquals(Quot::STATUS_APPROVED, $quot->fresh()->quot_status);
        $this->assertEquals($employeeId, $quot->fresh()->approved_by);
        $this->assertNotNull($quot->fresh()->approved_at);
    }

    /**
     * 承認テスト - 異常系（ステータス不正）
     */
    public function test_approve_throws_exception_for_invalid_status(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_DRAFT,
        ]);

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('承認待ちの見積のみ承認できます');

        $this->service->approve($quot, 1);
    }

    /**
     * 承認取消テスト - 正常系
     */
    public function test_cancel_approval_changes_status_to_pending(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_APPROVED,
            'approved_by' => 1,
            'approved_at' => now(),
        ]);

        $this->service->cancelApproval($quot);

        $this->assertEquals(Quot::STATUS_PENDING_APPROVAL, $quot->fresh()->quot_status);
        $this->assertNull($quot->fresh()->approved_by);
        $this->assertNull($quot->fresh()->approved_at);
    }

    /**
     * 承認取消テスト - 異常系（ステータス不正）
     */
    public function test_cancel_approval_throws_exception_for_invalid_status(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_PENDING_APPROVAL,
        ]);

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('承認済の見積のみ取消できます');

        $this->service->cancelApproval($quot);
    }

    /**
     * 制作見積依頼テスト - 正常系
     */
    public function test_request_production_creates_prod_quot(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_DRAFT,
            'prod_quot_status' => Quot::PROD_STATUS_BEFORE_REQUEST,
        ]);

        $prodQuot = $this->service->requestProduction($quot);

        $this->assertInstanceOf(ProdQuot::class, $prodQuot);
        $this->assertEquals($quot->quot_id, $prodQuot->quot_id);
        $this->assertEquals(0, $prodQuot->cost);
        $this->assertEquals(ProdQuot::STATUS_NOT_STARTED, $prodQuot->prod_quot_status);
        $this->assertEquals(1, $prodQuot->version);
        $this->assertEquals(Quot::PROD_STATUS_REQUESTED, $quot->fresh()->prod_quot_status);
    }

    /**
     * 制作見積依頼テスト - 異常系（ステータス不正）
     */
    public function test_request_production_throws_exception_for_invalid_status(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_PENDING_APPROVAL,
            'prod_quot_status' => Quot::PROD_STATUS_BEFORE_REQUEST,
        ]);

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('作成中・制作見積依頼前の見積のみ制作見積依頼できます');

        $this->service->requestProduction($quot);
    }

    /**
     * 登録取消テスト - 正常系
     */
    public function test_cancel_register_deletes_quot_operations(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_PENDING_APPROVAL,
            'prod_quot_status' => Quot::PROD_STATUS_RECEIVED,
            'quot_amount' => 100000,
        ]);

        $operations = \App\Models\Operation::take(3)->get();
        foreach ($operations as $operation) {
            QuotOperation::factory()->create([
                'quot_id' => $quot->quot_id,
                'operation_id' => $operation->operation_id,
            ]);
        }

        $this->service->cancelRegister($quot);

        $this->assertEquals(Quot::STATUS_DRAFT, $quot->fresh()->quot_status);
        $this->assertEquals(Quot::PROD_STATUS_COMPLETED, $quot->fresh()->prod_quot_status);
        $this->assertNull($quot->fresh()->quot_amount);
        $this->assertEquals(0, QuotOperation::where('quot_id', $quot->quot_id)->count());
    }

    /**
     * 登録取消テスト - 異常系（ステータス不正）
     */
    public function test_cancel_register_throws_exception_for_invalid_status(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_APPROVED,
        ]);

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('承認待ちの見積のみ登録取消できます');

        $this->service->cancelRegister($quot);
    }

    /**
     * 金額更新テスト - 異常系（ステータス不正）
     */
    public function test_update_amounts_throws_exception_for_invalid_status(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_APPROVED,
        ]);

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('承認待ちの見積のみ更新できます');

        $this->service->updateAmounts($quot, []);
    }

    /**
     * 差戻しテスト - 正常系（承認待ち）
     */
    public function test_reject_changes_status_to_production_in_progress(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_PENDING_APPROVAL,
            'prod_quot_status' => Quot::PROD_STATUS_COMPLETED,
        ]);
        $prodQuot = ProdQuot::factory()->create([
            'quot_id' => $quot->quot_id,
            'prod_quot_status' => ProdQuot::STATUS_COMPLETED,
            'version' => 1,
        ]);

        $this->service->reject($quot, 'テスト差戻し理由');

        $quot->refresh();
        $prodQuot->refresh();
        $this->assertEquals(Quot::PROD_STATUS_REQUESTED, $quot->prod_quot_status);
        $this->assertEquals(ProdQuot::STATUS_REJECTED, $prodQuot->prod_quot_status);
        $this->assertEquals(2, $prodQuot->version);

        // 差戻しログが作成されていることを確認
        $returnLog = \App\Models\ProdQuotReturnLog::where('prod_quot_id', $prodQuot->prod_quot_id)->first();
        $this->assertNotNull($returnLog);
        $this->assertEquals(1, $returnLog->previous_version);
        $this->assertEquals(2, $returnLog->next_version);
        $this->assertEquals('テスト差戻し理由', $returnLog->remand_reason);
    }

    /**
     * 差戻しテスト - 異常系（ステータス不正）
     */
    public function test_reject_throws_exception_for_invalid_status(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_DRAFT,
            'prod_quot_status' => Quot::PROD_STATUS_REQUESTED,
        ]);

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('承認待ちまたは承認済の見積のみ差戻しできます');

        $this->service->reject($quot, '差戻し理由');
    }

    /**
     * 差戻しテスト - 異常系（制作見積が見つからない）
     */
    public function test_reject_throws_exception_when_prod_quot_not_found(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_PENDING_APPROVAL,
            'prod_quot_status' => Quot::PROD_STATUS_COMPLETED,
        ]);
        // ProdQuotを作成しない

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('制作見積が見つかりません');

        $this->service->reject($quot, '差戻し理由');
    }

    /**
     * 登録テスト - 正常系
     */
    public function test_register_changes_status_to_pending_approval(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_DRAFT,
            'prod_quot_status' => Quot::PROD_STATUS_COMPLETED,
        ]);
        $prodQuot = ProdQuot::factory()->create([
            'quot_id' => $quot->quot_id,
        ]);
        $operation = \App\Models\Operation::first();
        $prodQuotOperation = ProdQuotOperation::factory()->create([
            'prod_quot_id' => $prodQuot->prod_quot_id,
            'operation_id' => $operation->operation_id,
        ]);

        $amounts = [
            [
                'operation_id' => $operation->operation_id,
                'cost' => $prodQuotOperation->prod_quot_cost ?? 80000,
                'quot_amount' => 100000,
            ],
        ];

        $this->service->register($quot, $amounts);

        $quot->refresh();
        $this->assertEquals(Quot::STATUS_PENDING_APPROVAL, $quot->quot_status);
        $this->assertEquals(Quot::PROD_STATUS_RECEIVED, $quot->prod_quot_status);
        $this->assertEquals(100000, $quot->quot_amount);

        // QuotOperationが作成されていることを確認
        $quotOperation = QuotOperation::where('quot_id', $quot->quot_id)->first();
        $this->assertNotNull($quotOperation);
        $this->assertEquals(100000, $quotOperation->quot_amount);
    }

    /**
     * 登録テスト - 異常系（ステータス不正）
     */
    public function test_register_throws_exception_for_invalid_status(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_DRAFT,
            'prod_quot_status' => Quot::PROD_STATUS_REQUESTED,
        ]);

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('制作見積済の見積のみ登録できます');

        $this->service->register($quot, []);
    }

    /**
     * 登録テスト - 異常系（制作見積が見つからない）
     */
    public function test_register_throws_exception_when_prod_quot_not_found(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_DRAFT,
            'prod_quot_status' => Quot::PROD_STATUS_COMPLETED,
        ]);
        // ProdQuotを作成しない

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('制作見積が見つかりません');

        $this->service->register($quot, []);
    }

    /**
     * 登録テスト - 複数の作業部門で正しく合計金額が計算される
     */
    public function test_register_calculates_total_amount_correctly(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_DRAFT,
            'prod_quot_status' => Quot::PROD_STATUS_COMPLETED,
        ]);
        ProdQuot::factory()->create([
            'quot_id' => $quot->quot_id,
        ]);

        $operations = \App\Models\Operation::take(2)->get();
        $operation1 = $operations[0];
        $operation2 = $operations[1];

        // 複数の作業部門でテスト
        $amounts = [
            [
                'operation_id' => $operation1->operation_id,
                'cost' => 50000,
                'quot_amount' => 60000,
            ],
            [
                'operation_id' => $operation2->operation_id,
                'cost' => 30000,
                'quot_amount' => 40000,
            ],
        ];

        $this->service->register($quot, $amounts);

        $quot->refresh();
        $this->assertEquals(100000, $quot->quot_amount); // 60000 + 40000
        $this->assertEquals(2, QuotOperation::where('quot_id', $quot->quot_id)->count());
    }

    /**
     * 金額更新テスト - 正常系
     */
    public function test_update_amounts_updates_quot_operations(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_PENDING_APPROVAL,
            'quot_amount' => 100000,
        ]);
        $prodQuot = ProdQuot::factory()->create([
            'quot_id' => $quot->quot_id,
        ]);
        $operation = \App\Models\Operation::first();
        $prodQuotOperation = ProdQuotOperation::factory()->create([
            'prod_quot_id' => $prodQuot->prod_quot_id,
            'operation_id' => $operation->operation_id,
        ]);
        QuotOperation::factory()->create([
            'quot_id' => $quot->quot_id,
            'operation_id' => $operation->operation_id,
            'quot_amount' => 100000,
        ]);

        $amounts = [
            [
                'operation_id' => $operation->operation_id,
                'quot_amount' => 150000,
            ],
        ];

        $this->service->updateAmounts($quot, $amounts);

        $quot->refresh();
        $this->assertEquals(150000, $quot->quot_amount);

        $quotOperation = QuotOperation::where('quot_id', $quot->quot_id)->first();
        $this->assertEquals(150000, $quotOperation->quot_amount);
    }

    /**
     * 発行テスト - 正常系
     */
    public function test_issue_changes_status_to_issued(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_APPROVED,
        ]);
        $employeeId = 1;

        $filePath = $this->service->issue($quot, $employeeId);

        $this->assertFileExists($filePath);
        $this->assertEquals(Quot::STATUS_ISSUED, $quot->fresh()->quot_status);
        $this->assertNotNull($quot->fresh()->quot_on);
        $this->assertEquals(1, QuotIssueLog::where('quot_id', $quot->quot_id)->count());

        // クリーンアップ
        @unlink($filePath);
    }

    /**
     * 発行テスト - 異常系（ステータス不正）
     */
    public function test_issue_throws_exception_for_invalid_status(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_PENDING_APPROVAL,
        ]);

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('承認済の見積のみ発行できます');

        $this->service->issue($quot, 1);
    }

    /**
     * 再発行テスト - 正常系
     */
    public function test_reissue_creates_new_issue_log(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_ISSUED,
            'quot_on' => '2026-01-01',
        ]);
        $employeeId = 1;

        // 最初の発行ログ
        QuotIssueLog::factory()->create([
            'quot_id' => $quot->quot_id,
        ]);

        $filePath = $this->service->reissue($quot, $employeeId);

        $this->assertFileExists($filePath);
        $this->assertEquals(2, QuotIssueLog::where('quot_id', $quot->quot_id)->count());

        // クリーンアップ
        @unlink($filePath);
    }

    /**
     * 再発行テスト - 異常系（ステータス不正）
     */
    public function test_reissue_throws_exception_for_invalid_status(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_APPROVED,
        ]);

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('発行済の見積のみ再発行できます');

        $this->service->reissue($quot, 1);
    }
}
