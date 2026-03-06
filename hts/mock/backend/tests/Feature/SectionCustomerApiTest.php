<?php

namespace Tests\Feature;

use Tests\TestCase;

class SectionCustomerApiTest extends TestCase
{
    // ========================================
    // GET /api/customers/suggest
    // ========================================

    /**
     * 未認証ユーザーは得意先サジェストを取得できない
     */
    public function test_unauthenticated_user_cannot_access_customer_suggest(): void
    {
        $response = $this->getJson('/api/customers/suggest?center_id=1');

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'ログインしてください',
            ]);
    }

    /**
     * 認証済みユーザーは得意先サジェストを取得できる
     */
    public function test_authenticated_user_can_access_customer_suggest(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/customers/suggest?center_id=1');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'customers',
            ])
            ->assertJson([
                'success' => true,
            ]);
    }

    /**
     * 得意先サジェストでcenter_idは必須
     */
    public function test_customer_suggest_requires_center_id(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/customers/suggest');

        $response->assertStatus(422);
    }

    /**
     * 得意先サジェストでquery検索が動作する
     */
    public function test_customer_suggest_query_search(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/customers/suggest?center_id=1&query=test');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'customers',
            ]);
    }

    /**
     * 得意先サジェストでcustomer_cd検索が動作する
     */
    public function test_customer_suggest_customer_cd_search(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/customers/suggest?center_id=1&customer_cd=001');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'customers',
            ]);
    }

    /**
     * 得意先サジェストでcustomer_name検索が動作する
     */
    public function test_customer_suggest_customer_name_search(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/customers/suggest?center_id=1&customer_name=テスト');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'customers',
            ]);
    }

    // ========================================
    // GET /api/customers/section-customers
    // ========================================

    /**
     * 未認証ユーザーは部署別得意先一覧を取得できない
     */
    public function test_unauthenticated_user_cannot_access_section_customers(): void
    {
        $response = $this->getJson('/api/customers/section-customers?center_id=1');

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'ログインしてください',
            ]);
    }

    /**
     * 認証済みユーザーは部署別得意先一覧を取得できる
     */
    public function test_authenticated_user_can_access_section_customers(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/customers/section-customers?center_id=1');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'customers',
                'total',
                'page',
                'per_page',
                'total_pages',
            ])
            ->assertJson([
                'success' => true,
            ]);
    }

    /**
     * 部署別得意先一覧でcenter_idは必須
     */
    public function test_section_customers_requires_center_id(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/customers/section-customers');

        $response->assertStatus(422);
    }

    /**
     * 部署別得意先一覧のページネーションパラメータが正しく動作する
     */
    public function test_section_customers_pagination_parameters(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/customers/section-customers?center_id=1&page=1&per_page=25');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'page' => 1,
                'per_page' => 25,
            ]);
    }

    /**
     * 部署別得意先一覧でソート順（asc）が動作する
     */
    public function test_section_customers_sort_order_asc(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/customers/section-customers?center_id=1&sort_order=asc');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    /**
     * 部署別得意先一覧でソート順（desc）が動作する
     */
    public function test_section_customers_sort_order_desc(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/customers/section-customers?center_id=1&sort_order=desc');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    /**
     * 部署別得意先一覧で無効なper_pageはバリデーションエラー
     */
    public function test_section_customers_invalid_per_page(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/customers/section-customers?center_id=1&per_page=999');

        $response->assertStatus(422);
    }

    /**
     * 部署別得意先一覧で無効なsort_orderはバリデーションエラー
     */
    public function test_section_customers_invalid_sort_order(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/customers/section-customers?center_id=1&sort_order=invalid');

        $response->assertStatus(422);
    }

    // ========================================
    // POST /api/customers/section-customers
    // ========================================

    /**
     * 未認証ユーザーは部署別得意先を追加できない
     */
    public function test_unauthenticated_user_cannot_add_section_customer(): void
    {
        $response = $this->postJson('/api/customers/section-customers', [
            'center_id' => 1,
            'customer_id' => 1,
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'ログインしてください',
            ]);
    }

    /**
     * 権限のないユーザーは部署別得意先を追加できない
     */
    public function test_user_without_permission_cannot_add_section_customer(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '40', // 一般
            'permissions' => [], // 権限なし
        ])->postJson('/api/customers/section-customers', [
            'center_id' => 1,
            'customer_id' => 1,
        ]);

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'この操作を行う権限がありません',
            ]);
    }

    /**
     * アクセス区分00（全て）のユーザーは部署別得意先追加APIにアクセスできる
     */
    public function test_user_with_access_type_00_can_access_add_section_customer(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00', // 全て
            'permissions' => [],
        ])->postJson('/api/customers/section-customers', [
            'center_id' => 1,
            'customer_id' => 1,
        ]);

        // 200, 404（得意先が見つからない）, 409（既に登録済み）のいずれか
        $this->assertContains($response->status(), [200, 404, 409]);
    }

    /**
     * sales.orders.customer権限を持つユーザーは部署別得意先追加APIにアクセスできる
     */
    public function test_user_with_customer_permission_can_access_add_section_customer(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '40', // 一般
            'permissions' => ['sales.orders.customer'],
        ])->postJson('/api/customers/section-customers', [
            'center_id' => 1,
            'customer_id' => 1,
        ]);

        // 権限チェックを通過することを確認（403ではない）
        $this->assertNotEquals(403, $response->status());
    }

    /**
     * 部署別得意先追加でcenter_idは必須
     */
    public function test_add_section_customer_requires_center_id(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson('/api/customers/section-customers', [
            'customer_id' => 1,
        ]);

        $response->assertStatus(422);
    }

    /**
     * 部署別得意先追加でcustomer_idは必須
     */
    public function test_add_section_customer_requires_customer_id(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson('/api/customers/section-customers', [
            'center_id' => 1,
        ]);

        $response->assertStatus(422);
    }

    // ========================================
    // DELETE /api/customers/section-customers
    // ========================================

    /**
     * 未認証ユーザーは部署別得意先を削除できない
     */
    public function test_unauthenticated_user_cannot_delete_section_customer(): void
    {
        $response = $this->deleteJson('/api/customers/section-customers', [
            'center_id' => 1,
            'customer_id' => 1,
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'ログインしてください',
            ]);
    }

    /**
     * 権限のないユーザーは部署別得意先を削除できない
     */
    public function test_user_without_permission_cannot_delete_section_customer(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '40', // 一般
            'permissions' => [], // 権限なし
        ])->deleteJson('/api/customers/section-customers', [
            'center_id' => 1,
            'customer_id' => 1,
        ]);

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'この操作を行う権限がありません',
            ]);
    }

    /**
     * アクセス区分00（全て）のユーザーは部署別得意先削除APIにアクセスできる
     */
    public function test_user_with_access_type_00_can_access_delete_section_customer(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00', // 全て
            'permissions' => [],
        ])->deleteJson('/api/customers/section-customers', [
            'center_id' => 1,
            'customer_id' => 1,
        ]);

        // 200, 404（データが見つからない）のいずれか
        $this->assertContains($response->status(), [200, 404]);
    }

    /**
     * sales.orders.customer権限を持つユーザーは部署別得意先削除APIにアクセスできる
     */
    public function test_user_with_customer_permission_can_access_delete_section_customer(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '40', // 一般
            'permissions' => ['sales.orders.customer'],
        ])->deleteJson('/api/customers/section-customers', [
            'center_id' => 1,
            'customer_id' => 1,
        ]);

        // 権限チェックを通過することを確認（403ではない）
        $this->assertNotEquals(403, $response->status());
    }

    /**
     * 部署別得意先削除でcenter_idは必須
     */
    public function test_delete_section_customer_requires_center_id(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->deleteJson('/api/customers/section-customers', [
            'customer_id' => 1,
        ]);

        $response->assertStatus(422);
    }

    /**
     * 部署別得意先削除でcustomer_idは必須
     */
    public function test_delete_section_customer_requires_customer_id(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->deleteJson('/api/customers/section-customers', [
            'center_id' => 1,
        ]);

        $response->assertStatus(422);
    }

    /**
     * 存在しないセンターで削除しようとすると404
     */
    public function test_delete_section_customer_nonexistent_center(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->deleteJson('/api/customers/section-customers', [
            'center_id' => 99999,
            'customer_id' => 1,
        ]);

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
            ]);
    }
}
