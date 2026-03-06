<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // テスト前にレート制限をクリア
        RateLimiter::clear('login');
        RateLimiter::clear('login-account');
    }

    /**
     * 正しい認証情報でログインできる
     */
    public function test_user_can_login_with_valid_credentials(): void
    {
        $sectionCd = \App\Models\SectionCd::factory()->create([
            'section_cd_id' => 9000001,
            'section_cd' => '888101',
        ]);
        $employee = \App\Models\Employee::factory()->general()->recycle($sectionCd)->create([
            'employee_id' => 9000001,
            'employee_cd' => '777101',
        ]);
        \App\Models\EmployeeSectionCd::factory()
            ->recycle($sectionCd)
            ->recycle($employee)
            ->forSectionAndEmployee($sectionCd->section_cd_id, $employee->employee_id)
            ->create();

        $response = $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class)
            ->withHeaders([
                'Referer' => 'http://localhost',
            ])->postJson('/api/login', [
                'section_cd' => '888101',
                'employee_cd' => '777101',
            ]);

        // エラー時の内容を確認
        if ($response->status() !== 200) {
            dump($response->json());
        }

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'success',
                'user' => [
                    'employee_id',
                    'employee_cd',
                    'employee_name',
                    'section_cd',
                    'section_name',
                    'access_type',
                    'roles',
                    'permissions',
                ],
            ]);
    }

    /**
     * 不正な認証情報でログインできない
     */
    public function test_user_cannot_login_with_invalid_credentials(): void
    {
        $response = $this->postJson('/api/login', [
            'section_cd' => 'invalid',
            'employee_cd' => 'invalid',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => '部署コードまたは社員コードが正しくありません',
            ]);
    }

    /**
     * バリデーションエラーが返される
     */
    public function test_login_validation_error(): void
    {
        $response = $this->postJson('/api/login', [
            'section_cd' => '',
            'employee_cd' => '',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ])
            ->assertJsonStructure([
                'errors' => ['section_cd', 'employee_cd'],
            ]);
    }

    /**
     * IPアドレス単位のレート制限が機能する（10回/分）
     */
    public function test_login_rate_limit_by_ip(): void
    {
        // 異なるアカウントで10回リクエスト（アカウント単位の制限を回避）
        for ($i = 0; $i < 10; $i++) {
            $response = $this->postJson('/api/login', [
                'section_cd' => "invalid_{$i}",
                'employee_cd' => "invalid_{$i}",
            ]);

            $response->assertStatus(401);
        }

        // 11回目はIP単位のレート制限に引っかかる
        $response = $this->postJson('/api/login', [
            'section_cd' => 'invalid_new',
            'employee_cd' => 'invalid_new',
        ]);

        $response->assertStatus(429)
            ->assertJson([
                'success' => false,
                'message' => 'ログイン試行回数が多すぎます。しばらく待ってから再度お試しください。',
            ]);
    }

    /**
     * アカウント単位のレート制限が機能する（5回/分）
     */
    public function test_login_rate_limit_by_account(): void
    {
        $sectionCd = '262111';
        $employeeCd = 'wrong_code';

        // 5回までは許可される
        for ($i = 0; $i < 5; $i++) {
            $response = $this->postJson('/api/login', [
                'section_cd' => $sectionCd,
                'employee_cd' => $employeeCd,
            ]);

            $response->assertStatus(401);
        }

        // 6回目はレート制限される
        $response = $this->postJson('/api/login', [
            'section_cd' => $sectionCd,
            'employee_cd' => $employeeCd,
        ]);

        $response->assertStatus(429)
            ->assertJson([
                'success' => false,
                'message' => 'このアカウントへのログイン試行回数が多すぎます。しばらく待ってから再度お試しください。',
            ]);
    }

    /**
     * 異なるアカウントは別々にカウントされる
     */
    public function test_rate_limit_is_per_account(): void
    {
        // アカウントAで5回試行
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/login', [
                'section_cd' => 'account_a',
                'employee_cd' => 'invalid',
            ]);
        }

        // アカウントBは別カウントなのでまだ通る
        $response = $this->postJson('/api/login', [
            'section_cd' => 'account_b',
            'employee_cd' => 'invalid',
        ]);

        // 401（認証エラー）であり、429（レート制限）ではない
        $response->assertStatus(401);
    }

    /**
     * ログアウトが正常に動作する
     */
    public function test_user_can_logout(): void
    {
        // セッションデータを設定してログイン状態を模倣
        $session = [
            'employee_id' => 1,
            'employee_cd' => '000001',
            'employee_name' => 'テストユーザー',
            'access_type' => '40',
            'permissions' => [],
        ];

        // ログアウトリクエスト
        $response = $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class)
            ->withSession($session)
            ->withHeaders([
                'Referer' => 'http://localhost',
            ])->postJson('/api/logout');

        // レスポンス検証
        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'ログアウトしました',
            ]);
    }

    /**
     * 認証状態を確認できる（未認証）
     */
    public function test_auth_check_returns_unauthenticated(): void
    {
        $response = $this->getJson('/api/auth/check');

        $response->assertStatus(200)
            ->assertJson([
                'authenticated' => false,
            ]);
    }

    /**
     * 認証状態を確認できる（認証済み）
     */
    public function test_auth_check_returns_authenticated(): void
    {
        // セッションを直接設定してログイン状態を模倣
        $response = $this->withSession([
            'employee_id' => 1,
            'employee_cd' => '000001',
            'employee_name' => 'テストユーザー',
            'section_cd' => '000000',
            'section_name' => 'テスト部署',
            'access_type' => '00',
            'roles' => [],
            'permissions' => [],
            'visible_departments' => [],
        ])->getJson('/api/auth/check');

        $response->assertStatus(200)
            ->assertJson([
                'authenticated' => true,
            ])
            ->assertJsonStructure([
                'authenticated',
                'user' => [
                    'employee_id',
                    'employee_cd',
                    'employee_name',
                    'section_cd',
                ],
            ]);
    }

    /**
     * 削除済み社員ではログインできない
     */
    public function test_user_cannot_login_with_deleted_employee(): void
    {
        $sectionCd = \App\Models\SectionCd::factory()->create([
            'section_cd_id' => 9000002,
            'section_cd' => '888102',
        ]);
        $employee = \App\Models\Employee::factory()->deleted()->recycle($sectionCd)->create([
            'employee_id' => 9000002,
            'employee_cd' => '777102',
        ]);
        \App\Models\EmployeeSectionCd::factory()
            ->recycle($sectionCd)
            ->recycle($employee)
            ->forSectionAndEmployee($sectionCd->section_cd_id, $employee->employee_id)
            ->create();

        $response = $this->postJson('/api/login', [
            'section_cd' => '888102',
            'employee_cd' => '777102',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => '部署コードまたは社員コードが正しくありません',
            ]);
    }

    /**
     * 無効な部署コードではログインできない
     *
     * 認証条件:
     * - 部署コード + 社員コードの組み合わせが存在すること
     * - 社員が有効であること（deleted_flag が '1' でない）
     * - 部署コードが有効であること（deleted_flag が '1' でない）
     */
    public function test_user_cannot_login_with_deleted_section_cd(): void
    {
        $sectionCd = \App\Models\SectionCd::factory()->deleted()->create([
            'section_cd_id' => 9000003,
            'section_cd' => '888103',
        ]);
        $employee = \App\Models\Employee::factory()->general()->recycle($sectionCd)->create([
            'employee_id' => 9000003,
            'employee_cd' => '777103',
        ]);
        \App\Models\EmployeeSectionCd::factory()
            ->recycle($sectionCd)
            ->recycle($employee)
            ->forSectionAndEmployee($sectionCd->section_cd_id, $employee->employee_id)
            ->create();

        $response = $this->postJson('/api/login', [
            'section_cd' => '888103',
            'employee_cd' => '777103',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => '部署コードまたは社員コードが正しくありません',
            ]);
    }
}
