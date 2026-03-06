<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerReportApiTest extends TestCase
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
    // PDF出力API（export）テスト
    // ===============================

    /**
     * 未認証ユーザーはPDF出力APIにアクセスできない
     */
    public function test_unauthenticated_user_cannot_access_export(): void
    {
        $response = $this->postJson('/api/sales/orders/customer-report/export', $this->validRequestData());

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
        ])->postJson('/api/sales/orders/customer-report/export', $this->validRequestData());

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
        ])->postJson('/api/sales/orders/customer-report/export', $this->validRequestData());

        $response->assertStatus(200)
            ->assertHeader('Content-Type', 'application/pdf');
    }

    /**
     * sales.orders.customer-report権限を持つユーザーはPDF出力APIにアクセスできる
     */
    public function test_user_with_customer_report_permission_can_access_export(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '40',
            'permissions' => ['sales.orders.customer-report'],
        ])->postJson('/api/sales/orders/customer-report/export', $this->validRequestData());

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
        ])->postJson('/api/sales/orders/customer-report/export', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['cumulative_period_from', 'cumulative_period_to', 'business_days', 'working_days']);
    }
}
