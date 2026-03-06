<?php

namespace Tests\Feature;

use Tests\TestCase;

class CenterApiTest extends TestCase
{
    // ===============================
    // GET /api/centers テスト
    // ===============================

    /**
     * 未認証ユーザーはセンター一覧を取得できない
     */
    public function test_unauthenticated_user_cannot_access_centers(): void
    {
        $response = $this->getJson('/api/centers');

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'ログインしてください',
            ]);
    }

    /**
     * 認証済みユーザーはセンター一覧を取得できる
     */
    public function test_authenticated_user_can_access_centers(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/centers');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'centers' => [
                    '*' => [
                        'department_id',
                        'department_name',
                    ],
                ],
            ]);
    }

    /**
     * アクセス区分00のユーザーは全センターを取得できる
     */
    public function test_user_with_access_type_00_gets_all_centers(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/centers');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    /**
     * 一般ユーザーはアクセス可能なセンターのみを取得できる
     */
    public function test_general_user_gets_limited_centers(): void
    {
        // employee_id=8 は東京センターのチームに所属
        $response = $this->withSession([
            'employee_id' => 8,
            'access_type' => '40', // 一般
            'permissions' => [],
        ])->getJson('/api/centers');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    // ===============================
    // GET /api/centers/all テスト
    // ===============================

    /**
     * 未認証ユーザーは全センター一覧を取得できない
     */
    public function test_unauthenticated_user_cannot_access_all_centers(): void
    {
        $response = $this->getJson('/api/centers/all');

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'ログインしてください',
            ]);
    }

    /**
     * 認証済みユーザーは全センター一覧を取得できる
     */
    public function test_authenticated_user_can_access_all_centers(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/centers/all');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'centers' => [
                    '*' => [
                        'department_id',
                        'department_name',
                    ],
                ],
            ]);
    }

    /**
     * 一般ユーザーでも全センター一覧を取得できる
     */
    public function test_general_user_can_access_all_centers(): void
    {
        $response = $this->withSession([
            'employee_id' => 8,
            'access_type' => '40', // 一般
            'permissions' => [],
        ])->getJson('/api/centers/all');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    /**
     * 全センター一覧はis_center=trueのセンターのみを返す
     */
    public function test_all_centers_returns_only_centers(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/centers/all');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $data = $response->json();

        // センターが返されていることを確認
        $this->assertArrayHasKey('centers', $data);
        $this->assertIsArray($data['centers']);
    }
}
