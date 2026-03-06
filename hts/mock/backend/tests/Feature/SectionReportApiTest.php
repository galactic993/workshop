<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SectionReportApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    /**
     * 有効なリクエストデータ
     */
    private function validRequestData(): array
    {
        return [
            'cumulative_period_from' => '2026-01-01',
            'cumulative_period_to' => '2026-01-31',
            'business_days' => 20,
            'working_days' => 18,
            'include_aggregated' => false,
        ];
    }

    // ===============================
    // 集計API（aggregate）テスト
    // ===============================

    /**
     * 未認証ユーザーは集計APIにアクセスできない
     */
    public function test_unauthenticated_user_cannot_access_aggregate(): void
    {
        $response = $this->postJson('/api/sales/orders/section-report/aggregate', $this->validRequestData());

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'ログインしてください',
            ]);
    }

    /**
     * 権限のないユーザーは集計APIにアクセスできない
     */
    public function test_user_without_permission_cannot_access_aggregate(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '40', // 一般
            'permissions' => [],
        ])->postJson('/api/sales/orders/section-report/aggregate', $this->validRequestData());

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'アクセス権限がありません',
            ]);
    }

    /**
     * アクセス区分00（全て）のユーザーは集計APIにアクセスできる
     */
    public function test_user_with_access_type_00_can_access_aggregate(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson('/api/sales/orders/section-report/aggregate', $this->validRequestData());

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => '集計が完了しました',
            ]);
    }

    /**
     * sales.orders.section-report権限を持つユーザーは集計APIにアクセスできる
     */
    public function test_user_with_section_report_permission_can_access_aggregate(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '40',
            'permissions' => ['sales.orders.section-report'],
        ])->postJson('/api/sales/orders/section-report/aggregate', $this->validRequestData());

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    /**
     * 集計API - 累計期間開始日が必須
     */
    public function test_aggregate_validation_cumulative_period_from_required(): void
    {
        $data = $this->validRequestData();
        unset($data['cumulative_period_from']);

        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson('/api/sales/orders/section-report/aggregate', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['cumulative_period_from']);
    }

    /**
     * 集計API - 累計期間終了日が必須
     */
    public function test_aggregate_validation_cumulative_period_to_required(): void
    {
        $data = $this->validRequestData();
        unset($data['cumulative_period_to']);

        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson('/api/sales/orders/section-report/aggregate', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['cumulative_period_to']);
    }

    /**
     * 集計API - 営業日数が必須
     */
    public function test_aggregate_validation_business_days_required(): void
    {
        $data = $this->validRequestData();
        unset($data['business_days']);

        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson('/api/sales/orders/section-report/aggregate', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['business_days']);
    }

    /**
     * 集計API - 稼働日数が必須
     */
    public function test_aggregate_validation_working_days_required(): void
    {
        $data = $this->validRequestData();
        unset($data['working_days']);

        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson('/api/sales/orders/section-report/aggregate', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['working_days']);
    }

    /**
     * 集計API - 営業日数は1以上
     */
    public function test_aggregate_validation_business_days_min(): void
    {
        $data = $this->validRequestData();
        $data['business_days'] = 0;

        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson('/api/sales/orders/section-report/aggregate', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['business_days']);
    }

    /**
     * 集計API - 営業日数は31以下
     */
    public function test_aggregate_validation_business_days_max(): void
    {
        $data = $this->validRequestData();
        $data['business_days'] = 32;

        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson('/api/sales/orders/section-report/aggregate', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['business_days']);
    }

    /**
     * 集計API - 営業日数は累計期間終了月の月末日以下
     */
    public function test_aggregate_validation_business_days_month_end(): void
    {
        $data = $this->validRequestData();
        $data['cumulative_period_to'] = '2025-02-28'; // 2月は28日まで
        $data['business_days'] = 29;

        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson('/api/sales/orders/section-report/aggregate', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['business_days']);
    }

    /**
     * 集計API - 稼働日数は累計期間終了月の月末日以下
     */
    public function test_aggregate_validation_working_days_month_end(): void
    {
        $data = $this->validRequestData();
        $data['cumulative_period_to'] = '2025-02-28';
        $data['working_days'] = 29;

        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson('/api/sales/orders/section-report/aggregate', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['working_days']);
    }

    // ===============================
    // PDF出力API（export）テスト
    // ===============================

    /**
     * 未認証ユーザーはPDF出力APIにアクセスできない
     */
    public function test_unauthenticated_user_cannot_access_export(): void
    {
        $response = $this->postJson('/api/sales/orders/section-report/export', $this->validRequestData());

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'ログインしてください',
            ]);
    }

    /**
     * 権限のないユーザーはPDF出力APIにアクセスできない
     */
    public function test_user_without_permission_cannot_access_export(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '40',
            'permissions' => [],
        ])->postJson('/api/sales/orders/section-report/export', $this->validRequestData());

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'アクセス権限がありません',
            ]);
    }

    /**
     * アクセス区分00（全て）のユーザーはPDF出力APIにアクセスできる
     */
    public function test_user_with_access_type_00_can_access_export(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson('/api/sales/orders/section-report/export', $this->validRequestData());

        $response->assertStatus(200)
            ->assertHeader('Content-Type', 'application/pdf');
    }

    /**
     * sales.orders.section-report権限を持つユーザーはPDF出力APIにアクセスできる
     */
    public function test_user_with_section_report_permission_can_access_export(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '40',
            'permissions' => ['sales.orders.section-report'],
        ])->postJson('/api/sales/orders/section-report/export', $this->validRequestData());

        $response->assertStatus(200)
            ->assertHeader('Content-Type', 'application/pdf');
    }

    /**
     * PDF出力API - バリデーションエラー
     */
    public function test_export_validation_error(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson('/api/sales/orders/section-report/export', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['cumulative_period_from', 'cumulative_period_to', 'business_days', 'working_days']);
    }
}
