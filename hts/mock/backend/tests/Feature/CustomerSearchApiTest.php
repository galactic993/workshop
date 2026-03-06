<?php

namespace Tests\Feature;

use Tests\TestCase;

class CustomerSearchApiTest extends TestCase
{
    // ========================================
    // GET /api/quotes/customers/suggest
    // ========================================

    /**
     * 未認証ユーザーは得意先サジェストを取得できない
     */
    public function test_unauthenticated_user_cannot_access_quote_customer_suggest(): void
    {
        $response = $this->getJson('/api/quotes/customers/suggest');

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'ログインしてください',
            ]);
    }

    /**
     * 権限のないユーザーは得意先サジェストを取得できない
     */
    public function test_user_without_permission_cannot_access_quote_customer_suggest(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '40', // 一般
            'permissions' => [], // 権限なし
        ])->getJson('/api/quotes/customers/suggest');

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'アクセス権限がありません',
            ]);
    }

    /**
     * アクセス区分00（全て）のユーザーは得意先サジェストを取得できる
     */
    public function test_user_with_access_type_00_can_access_quote_customer_suggest(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00', // 全て
            'permissions' => [],
        ])->getJson('/api/quotes/customers/suggest?query=test');

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
     * sales.quotes.create権限を持つユーザーは得意先サジェストを取得できる
     */
    public function test_user_with_quotes_permission_can_access_quote_customer_suggest(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '40', // 一般
            'permissions' => ['sales.quotes.create'],
        ])->getJson('/api/quotes/customers/suggest?query=test');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'customers',
            ]);
    }

    /**
     * 得意先サジェストでqueryパラメータは必須
     */
    public function test_quote_customer_suggest_requires_query(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/quotes/customers/suggest');

        $response->assertStatus(422);
    }

    /**
     * 得意先サジェストでquery検索が動作する
     */
    public function test_quote_customer_suggest_query_search(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/quotes/customers/suggest?query=test');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'customers',
            ]);
    }

    /**
     * 得意先サジェストでスペース区切りのAND検索が動作する
     */
    public function test_quote_customer_suggest_space_separated_query(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/quotes/customers/suggest?query=test%20company');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'customers',
            ]);
    }

    // ========================================
    // GET /api/quotes/customers/search
    // ========================================

    /**
     * 未認証ユーザーは得意先検索を実行できない
     */
    public function test_unauthenticated_user_cannot_access_quote_customer_search(): void
    {
        $response = $this->getJson('/api/quotes/customers/search');

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'ログインしてください',
            ]);
    }

    /**
     * 権限のないユーザーは得意先検索を実行できない
     */
    public function test_user_without_permission_cannot_access_quote_customer_search(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '40', // 一般
            'permissions' => [], // 権限なし
        ])->getJson('/api/quotes/customers/search');

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'アクセス権限がありません',
            ]);
    }

    /**
     * アクセス区分00（全て）のユーザーは得意先検索を実行できる
     */
    public function test_user_with_access_type_00_can_access_quote_customer_search(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00', // 全て
            'permissions' => [],
        ])->getJson('/api/quotes/customers/search');

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
     * sales.quotes.create権限を持つユーザーは得意先検索を実行できる
     */
    public function test_user_with_quotes_permission_can_access_quote_customer_search(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '40', // 一般
            'permissions' => ['sales.quotes.create'],
        ])->getJson('/api/quotes/customers/search');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'customers',
            ]);
    }

    /**
     * 得意先検索でcustomer_cdパラメータが動作する
     */
    public function test_quote_customer_search_by_customer_cd(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/quotes/customers/search?customer_cd=001');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'customers',
            ]);
    }

    /**
     * 得意先検索でcustomer_nameパラメータが動作する
     */
    public function test_quote_customer_search_by_customer_name(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/quotes/customers/search?customer_name=テスト');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'customers',
            ]);
    }

    /**
     * 得意先検索で両方のパラメータを指定できる（AND条件）
     */
    public function test_quote_customer_search_with_both_parameters(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/quotes/customers/search?customer_cd=001&customer_name=テスト');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'customers',
            ]);
    }

    /**
     * 得意先検索の結果にはcustomer_id, customer_cd, customer_nameが含まれる
     */
    public function test_quote_customer_search_response_structure(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/quotes/customers/search');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        // レスポンスの customers が配列であることを確認
        $data = $response->json();
        $this->assertIsArray($data['customers']);

        // 結果がある場合は各項目のキーを確認
        if (count($data['customers']) > 0) {
            $this->assertArrayHasKey('customer_id', $data['customers'][0]);
            $this->assertArrayHasKey('customer_cd', $data['customers'][0]);
            $this->assertArrayHasKey('customer_name', $data['customers'][0]);
        }
    }

    /**
     * 得意先サジェストの結果にはcustomer_id, customer_cd, customer_nameが含まれる
     */
    public function test_quote_customer_suggest_response_structure(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/quotes/customers/suggest?query=test');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        // レスポンスの customers が配列であることを確認
        $data = $response->json();
        $this->assertIsArray($data['customers']);

        // 結果がある場合は各項目のキーを確認
        if (count($data['customers']) > 0) {
            $this->assertArrayHasKey('customer_id', $data['customers'][0]);
            $this->assertArrayHasKey('customer_cd', $data['customers'][0]);
            $this->assertArrayHasKey('customer_name', $data['customers'][0]);
        }
    }
}
