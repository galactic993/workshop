<?php

namespace Tests\Feature;

use App\Models\Quot;
use App\Models\QuotIssueLog;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuotIssueApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    // ===============================
    // 見積発行APIテスト
    // ===============================

    /**
     * 未認証ユーザーは見積を発行できない
     */
    public function test_unauthenticated_user_cannot_issue_quote(): void
    {
        $response = $this->postJson('/api/quotes/1/issue');

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'ログインしてください',
            ]);
    }

    /**
     * 権限のないユーザーは見積を発行できない
     */
    public function test_user_without_permission_cannot_issue_quote(): void
    {
        $quot = Quot::where('quot_status', Quot::STATUS_APPROVED)->first();

        if (! $quot) {
            $quot = Quot::factory()->create([
                'quot_status' => Quot::STATUS_APPROVED,
            ]);
        }

        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '40', // 一般
            'permissions' => [], // 権限なし
        ])->postJson("/api/quotes/{$quot->quot_id}/issue");

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'アクセス権限がありません',
            ]);
    }

    /**
     * 存在しない見積は発行できない
     */
    public function test_cannot_issue_non_existent_quote(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson('/api/quotes/999999/issue');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => '見積が見つかりません',
            ]);
    }

    /**
     * 承認済以外のステータスは発行できない
     */
    public function test_cannot_issue_non_approved_quote(): void
    {
        $quot = Quot::where('quot_status', Quot::STATUS_PENDING_APPROVAL)->first();

        if (! $quot) {
            $quot = Quot::factory()->create([
                'quot_status' => Quot::STATUS_PENDING_APPROVAL,
            ]);
        }

        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson("/api/quotes/{$quot->quot_id}/issue");

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => '承認済の見積のみ発行できます',
            ]);
    }

    /**
     * 正常に見積を発行できる
     */
    public function test_user_can_issue_quote(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_APPROVED,
        ]);

        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson("/api/quotes/{$quot->quot_id}/issue");

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // ステータスが発行済に変更されていることを確認
        $quot->refresh();
        $this->assertEquals(Quot::STATUS_ISSUED, $quot->quot_status);
        $this->assertNotNull($quot->quot_on);

        // 発行ログが作成されていることを確認
        $this->assertEquals(1, QuotIssueLog::where('quot_id', $quot->quot_id)->count());
    }

    /**
     * sales.quotes.issue権限を持つユーザーは見積を発行できる
     */
    public function test_user_with_quotes_permission_can_issue_quote(): void
    {
        $sectionCd = \App\Models\SectionCd::factory()->create();
        $employee = \App\Models\Employee::factory()->create([
            'access_type' => '40', // 一般
        ]);

        // employee_section_cd テーブルに関連付けを作成
        \DB::table('employee_section_cd')->insert([
            'section_cd_id' => $sectionCd->section_cd_id,
            'employee_id' => $employee->employee_id,
            'updated_at' => now(),
        ]);

        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_APPROVED,
            'employee_id' => $employee->employee_id,
            'section_cd_id' => $sectionCd->section_cd_id,
        ]);

        $response = $this->withSession([
            'employee_id' => $employee->employee_id,
            'access_type' => '40', // 一般
            'permissions' => ['sales.quotes.issue'],
        ])->postJson("/api/quotes/{$quot->quot_id}/issue");

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }

    // ===============================
    // 見積再発行APIテスト
    // ===============================

    /**
     * 未認証ユーザーは見積を再発行できない
     */
    public function test_unauthenticated_user_cannot_reissue_quote(): void
    {
        $response = $this->postJson('/api/quotes/1/reissue');

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'ログインしてください',
            ]);
    }

    /**
     * 存在しない見積は再発行できない
     */
    public function test_cannot_reissue_non_existent_quote(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson('/api/quotes/999999/reissue');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => '見積が見つかりません',
            ]);
    }

    /**
     * 発行済以外のステータスは再発行できない
     */
    public function test_cannot_reissue_non_issued_quote(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_APPROVED,
        ]);

        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson("/api/quotes/{$quot->quot_id}/reissue");

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => '発行済の見積のみ再発行できます',
            ]);
    }

    /**
     * 正常に見積を再発行できる
     */
    public function test_user_can_reissue_quote(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_ISSUED,
            'quot_on' => '2026-01-01',
        ]);

        // 最初の発行ログを作成
        QuotIssueLog::factory()->create([
            'quot_id' => $quot->quot_id,
        ]);

        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson("/api/quotes/{$quot->quot_id}/reissue");

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // 発行ログが追加されていることを確認
        $this->assertEquals(2, QuotIssueLog::where('quot_id', $quot->quot_id)->count());
    }

    // ===============================
    // ステータス60更新APIテスト
    // ===============================

    /**
     * 未認証ユーザーはステータス60更新できない
     */
    public function test_unauthenticated_user_cannot_update_status60(): void
    {
        $response = $this->postJson('/api/quotes/1/update-status60', [
            'quot_doc_path' => '/path/to/document.xlsx',
            'is_lost' => false,
            'lost_reason' => null,
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'ログインしてください',
            ]);
    }

    /**
     * 存在しない見積はステータス60更新できない
     */
    public function test_cannot_update_status60_non_existent_quote(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson('/api/quotes/999999/update-status60', [
            'quot_doc_path' => '/path/to/document.xlsx',
            'is_lost' => false,
            'lost_reason' => null,
        ]);

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => '見積が見つかりません',
            ]);
    }

    /**
     * 発行済以外のステータスはステータス60更新できない
     */
    public function test_cannot_update_status60_non_issued_quote(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_APPROVED,
        ]);

        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson("/api/quotes/{$quot->quot_id}/update-status60", [
            'quot_doc_path' => '/path/to/document.xlsx',
            'is_lost' => false,
            'lost_reason' => null,
        ]);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => '発行済の見積のみ更新できます',
            ]);
    }

    /**
     * 見積書格納先は必須
     */
    public function test_update_status60_requires_quot_doc_path(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_ISSUED,
        ]);

        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson("/api/quotes/{$quot->quot_id}/update-status60", [
            // quot_doc_path なし
            'is_lost' => false,
            'lost_reason' => null,
        ]);

        $response->assertStatus(422);
    }

    /**
     * 失注の場合は失注理由が必須
     */
    public function test_update_status60_requires_lost_reason_when_lost(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_ISSUED,
        ]);

        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson("/api/quotes/{$quot->quot_id}/update-status60", [
            'quot_doc_path' => '/path/to/document.xlsx',
            'is_lost' => true,
            'lost_reason' => '', // 空の失注理由
        ]);

        $response->assertStatus(422)
            ->assertJsonFragment([
                'message' => '失注理由を入力してください',
            ]);
    }

    /**
     * 正常にステータス60更新できる（未確定）
     */
    public function test_user_can_update_status60_undetermined(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_ISSUED,
        ]);

        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson("/api/quotes/{$quot->quot_id}/update-status60", [
            'quot_doc_path' => '/path/to/document.xlsx',
            'is_lost' => false,
            'lost_reason' => null,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => '更新しました',
            ]);

        $quot->refresh();
        $this->assertEquals('/path/to/document.xlsx', $quot->quot_doc_path);
        $this->assertEquals(Quot::RESULT_UNDETERMINED, $quot->quot_result);
        $this->assertNull($quot->lost_reason);
    }

    /**
     * 正常にステータス60更新できる（失注）
     */
    public function test_user_can_update_status60_lost(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_ISSUED,
        ]);

        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson("/api/quotes/{$quot->quot_id}/update-status60", [
            'quot_doc_path' => '/path/to/document.xlsx',
            'is_lost' => true,
            'lost_reason' => '価格競争で敗退',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => '更新しました',
            ]);

        $quot->refresh();
        $this->assertEquals('/path/to/document.xlsx', $quot->quot_doc_path);
        $this->assertEquals(Quot::RESULT_LOST, $quot->quot_result);
        $this->assertEquals('価格競争で敗退', $quot->lost_reason);
    }

    /**
     * 見積書格納先の最大文字数バリデーション
     */
    public function test_update_status60_quot_doc_path_max_length(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_ISSUED,
        ]);

        $longPath = str_repeat('a', 256);

        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson("/api/quotes/{$quot->quot_id}/update-status60", [
            'quot_doc_path' => $longPath,
            'is_lost' => false,
            'lost_reason' => null,
        ]);

        $response->assertStatus(422);
    }

    /**
     * 失注理由の最大文字数バリデーション
     */
    public function test_update_status60_lost_reason_max_length(): void
    {
        $quot = Quot::factory()->create([
            'quot_status' => Quot::STATUS_ISSUED,
        ]);

        $longReason = str_repeat('あ', 2001);

        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson("/api/quotes/{$quot->quot_id}/update-status60", [
            'quot_doc_path' => '/path/to/document.xlsx',
            'is_lost' => true,
            'lost_reason' => $longReason,
        ]);

        $response->assertStatus(422);
    }
}
