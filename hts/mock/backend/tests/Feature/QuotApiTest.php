<?php

namespace Tests\Feature;

use App\Models\Quot;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuotApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    /**
     * 未認証ユーザーは見積一覧を取得できない
     */
    public function test_unauthenticated_user_cannot_access_quotes(): void
    {
        $response = $this->getJson('/api/quotes');

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'ログインしてください',
            ]);
    }

    /**
     * 未認証ユーザーはアクセス情報を取得できない
     */
    public function test_unauthenticated_user_cannot_access_access_info(): void
    {
        $response = $this->getJson('/api/quotes/access-info');

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'ログインしてください',
            ]);
    }

    /**
     * 未認証ユーザーは得意先サジェストを取得できない
     */
    public function test_unauthenticated_user_cannot_access_customer_suggest(): void
    {
        $response = $this->getJson('/api/quotes/customers/suggest');

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'ログインしてください',
            ]);
    }

    /**
     * 未認証ユーザーは得意先検索を実行できない
     */
    public function test_unauthenticated_user_cannot_access_customer_search(): void
    {
        $response = $this->getJson('/api/quotes/customers/search');

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'ログインしてください',
            ]);
    }

    /**
     * 権限のないユーザーは見積一覧を取得できない
     */
    public function test_user_without_permission_cannot_access_quotes(): void
    {
        // employee_idはあるが、権限なしのセッション
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '40', // 一般
            'permissions' => [], // 権限なし
        ])->getJson('/api/quotes');

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'アクセス権限がありません',
            ]);
    }

    /**
     * アクセス区分00（全て）のユーザーは見積一覧を取得できる
     */
    public function test_user_with_access_type_00_can_access_quotes(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00', // 全て
            'permissions' => [],
        ])->getJson('/api/quotes?section_cd=all&status=all');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'quotes',
                'total',
                'page',
                'per_page',
                'total_pages',
                'access_info' => [
                    'default_section_cd',
                    'is_section_cd_disabled',
                ],
            ]);
    }

    /**
     * sales.quotes.create権限を持つユーザーは見積一覧を取得できる
     */
    public function test_user_with_quotes_permission_can_access_quotes(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '40', // 一般
            'permissions' => ['sales.quotes.create'],
        ])->getJson('/api/quotes?section_cd=all&status=all');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    /**
     * 見積一覧のページネーションパラメータが正しく動作する
     */
    public function test_quotes_pagination_parameters(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/quotes?section_cd=all&status=all&page=1&per_page=25');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'page' => 1,
                'per_page' => 25,
            ]);
    }

    /**
     * アクセス情報を取得できる
     */
    public function test_access_info_endpoint(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/quotes/access-info');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'access_info' => [
                    'default_section_cd',
                    'is_section_cd_disabled',
                ],
            ]);
    }

    /**
     * 得意先サジェスト検索が動作する
     */
    public function test_customer_suggest_endpoint(): void
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
     * 得意先検索が動作する
     */
    public function test_customer_search_endpoint(): void
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
     * 見積一覧の検索パラメータが正しく動作する
     */
    public function test_quotes_search_parameters(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/quotes?section_cd=all&status=00&quote_no=000012501001');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    /**
     * 見積一覧の見積件名検索が正しく動作する
     */
    public function test_quotes_search_by_quot_subject(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/quotes?section_cd=all&status=all&quot_subject=テスト');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    /**
     * 見積一覧のソートパラメータが正しく動作する
     */
    public function test_quotes_sort_parameters(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/quotes?section_cd=all&status=all&sort_field=quote_no&sort_order=asc');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    // ===============================
    // 承認・承認取消テスト
    // ===============================

    /**
     * 未認証ユーザーは見積を承認できない
     */
    public function test_unauthenticated_user_cannot_approve_quote(): void
    {
        $response = $this->postJson('/api/quotes/1/approve');

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'ログインしてください',
            ]);
    }

    /**
     * 権限のないユーザーは見積を承認できない
     */
    public function test_user_without_permission_cannot_approve_quote(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '40', // 一般
            'permissions' => ['sales.quotes.create'],
        ])->postJson('/api/quotes/1/approve');

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => '権限がありません',
            ]);
    }

    /**
     * アクセス区分00（全て）のユーザーは見積を承認できる
     */
    public function test_user_with_access_type_00_can_approve_quote(): void
    {
        $sectionCd = \App\Models\SectionCd::first();
        $employee = \App\Models\Employee::factory()->systemAdmin()->create();
        $customer = \App\Models\Customer::factory()->create();
        $center = \App\Models\Department::factory()->center()->create();

        $quot = \App\Models\Quot::factory()->create([
            'quot_status' => \App\Models\Quot::STATUS_PENDING_APPROVAL,
            'employee_id' => $employee->employee_id,
            'customer_id' => $customer->customer_id,
            'section_cd_id' => $sectionCd->section_cd_id,
            'center_section_cd_id' => $sectionCd->section_cd_id,
        ]);

        $response = $this->withSession([
            'employee_id' => $employee->employee_id,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson("/api/quotes/{$quot->quot_id}/approve");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => '承認しました',
            ]);

        // データベースの確認
        $quot->refresh();
        $this->assertEquals(\App\Models\Quot::STATUS_APPROVED, $quot->quot_status);
        $this->assertEquals($employee->employee_id, $quot->approved_by);
        $this->assertNotNull($quot->approved_at);
    }

    /**
     * アクセス区分20（所長）のユーザーは見積を承認できる
     */
    public function test_user_with_access_type_20_can_approve_quote(): void
    {
        // センターの部署コードを取得（組織別部署コードに登録済み）
        $centerSectionCd = \App\Models\SectionCd::first();
        $center = \App\Models\Department::factory()->center()->create();
        $employee = \App\Models\Employee::factory()->general()->create();
        \App\Models\DepartmentEmployee::factory()->forDepartmentAndEmployee(
            $center->department_id,
            $employee->employee_id
        )->create();
        // センターの部署コードを組織に関連付ける
        \App\Models\DepartmentSectionCd::create([
            'department_id' => $center->department_id,
            'section_cd_id' => $centerSectionCd->section_cd_id,
        ]);
        // 見積用の部署コードを作成（センターの部署コードと同じ頭3桁）
        $quotSectionCd = \App\Models\SectionCd::factory()->create([
            'section_cd' => substr($centerSectionCd->section_cd, 0, 3).'999',
        ]);
        $customer = \App\Models\Customer::factory()->create();

        $quot = \App\Models\Quot::factory()->create([
            'quot_status' => \App\Models\Quot::STATUS_PENDING_APPROVAL,
            'employee_id' => $employee->employee_id,
            'customer_id' => $customer->customer_id,
            'section_cd_id' => $quotSectionCd->section_cd_id,
            'center_section_cd_id' => $centerSectionCd->section_cd_id,
        ]);

        $response = $this->withSession([
            'employee_id' => $employee->employee_id,
            'access_type' => '20',
            'permissions' => ['sales.quotes.create'],
        ])->postJson("/api/quotes/{$quot->quot_id}/approve");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => '承認しました',
            ]);

        // データベースの確認
        $quot->refresh();
        $this->assertEquals(\App\Models\Quot::STATUS_APPROVED, $quot->quot_status);
        $this->assertEquals($employee->employee_id, $quot->approved_by);
    }

    /**
     * 存在しない見積は承認できない
     */
    public function test_cannot_approve_non_existent_quote(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson('/api/quotes/999999/approve');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => '見積が見つかりません',
            ]);
    }

    /**
     * 承認待ち以外のステータスは承認できない
     */
    public function test_cannot_approve_non_pending_quote(): void
    {
        $employee = \App\Models\Employee::factory()->systemAdmin()->create();
        $customer = \App\Models\Customer::factory()->create();
        $center = \App\Models\Department::factory()->center()->create();

        $quot = \App\Models\Quot::factory()->create([
            'quot_status' => \App\Models\Quot::STATUS_APPROVED,
            'employee_id' => $employee->employee_id,
            'customer_id' => $customer->customer_id,
        ]);

        $response = $this->withSession([
            'employee_id' => $employee->employee_id,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson("/api/quotes/{$quot->quot_id}/approve");

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => '承認待ちの見積のみ承認できます',
            ]);
    }

    /**
     * 未認証ユーザーは見積を承認取消できない
     */
    public function test_unauthenticated_user_cannot_cancel_approve_quote(): void
    {
        $response = $this->postJson('/api/quotes/1/cancel-approve');

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'ログインしてください',
            ]);
    }

    /**
     * 権限のないユーザーは見積を承認取消できない
     */
    public function test_user_without_permission_cannot_cancel_approve_quote(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '40', // 一般
            'permissions' => ['sales.quotes.create'],
        ])->postJson('/api/quotes/1/cancel-approve');

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => '権限がありません',
            ]);
    }

    /**
     * アクセス区分00のユーザーは承認取消できる
     */
    public function test_user_with_access_type_00_can_cancel_approve_quote(): void
    {
        $sectionCd = \App\Models\SectionCd::first();
        $employee = \App\Models\Employee::factory()->systemAdmin()->create();
        $customer = \App\Models\Customer::factory()->create();
        $center = \App\Models\Department::factory()->center()->create();

        $quot = \App\Models\Quot::factory()->create([
            'quot_status' => \App\Models\Quot::STATUS_APPROVED,
            'employee_id' => $employee->employee_id,
            'customer_id' => $customer->customer_id,
            'section_cd_id' => $sectionCd->section_cd_id,
            'center_section_cd_id' => $sectionCd->section_cd_id,
            'approved_by' => $employee->employee_id,
            'approved_at' => now(),
        ]);

        $response = $this->withSession([
            'employee_id' => $employee->employee_id,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson("/api/quotes/{$quot->quot_id}/cancel-approve");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => '承認を取り消しました',
            ]);

        // データベースの確認
        $quot->refresh();
        $this->assertEquals(\App\Models\Quot::STATUS_PENDING_APPROVAL, $quot->quot_status);
        $this->assertNull($quot->approved_by);
        $this->assertNull($quot->approved_at);
    }

    /**
     * 存在しない見積は承認取消できない
     */
    public function test_cannot_cancel_approve_non_existent_quote(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson('/api/quotes/999999/cancel-approve');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => '見積が見つかりません',
            ]);
    }

    /**
     * 承認済以外のステータスは承認取消できない
     */
    public function test_cannot_cancel_approve_non_approved_quote(): void
    {
        $employee = \App\Models\Employee::factory()->systemAdmin()->create();
        $customer = \App\Models\Customer::factory()->create();
        $center = \App\Models\Department::factory()->center()->create();

        $quot = \App\Models\Quot::factory()->create([
            'quot_status' => \App\Models\Quot::STATUS_PENDING_APPROVAL,
            'employee_id' => $employee->employee_id,
            'customer_id' => $customer->customer_id,
        ]);

        $response = $this->withSession([
            'employee_id' => $employee->employee_id,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson("/api/quotes/{$quot->quot_id}/cancel-approve");

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => '承認済の見積のみ取消できます',
            ]);
    }

    // ===============================
    // 新規登録モーダル用APIテスト
    // ===============================

    /**
     * 未認証ユーザーは新規登録用得意先サジェストを取得できない
     */
    public function test_unauthenticated_user_cannot_access_customer_suggest_for_create(): void
    {
        $response = $this->getJson('/api/quotes/customers/suggest-for-create');

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'ログインしてください',
            ]);
    }

    /**
     * 未認証ユーザーは新規登録用得意先検索を取得できない
     */
    public function test_unauthenticated_user_cannot_access_customer_search_for_create(): void
    {
        $response = $this->getJson('/api/quotes/customers/search-for-create');

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'ログインしてください',
            ]);
    }

    /**
     * 新規登録用得意先サジェストが動作する
     */
    public function test_customer_suggest_for_create_endpoint(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/quotes/customers/suggest-for-create?query=test');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'customers',
            ]);
    }

    /**
     * 新規登録用得意先検索が動作する
     */
    public function test_customer_search_for_create_endpoint(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/quotes/customers/search-for-create?customer_cd=001');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'customers',
            ]);
    }

    /**
     * 権限のないユーザーは新規登録用得意先サジェストを取得できない
     */
    public function test_user_without_permission_cannot_access_customer_suggest_for_create(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '40', // 一般
            'permissions' => [], // 権限なし
        ])->getJson('/api/quotes/customers/suggest-for-create');

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'アクセス権限がありません',
            ]);
    }

    /**
     * 新規登録用得意先サジェストはスペース区切りでAND検索できる
     */
    public function test_customer_suggest_for_create_with_space_separated_query(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/quotes/customers/suggest-for-create?query=東京 商事');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    /**
     * 新規登録用得意先サジェストは最大20件まで返す
     */
    public function test_customer_suggest_for_create_returns_max_20(): void
    {
        // queryパラメータは1文字以上必須
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/quotes/customers/suggest-for-create?query=a');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $data = $response->json();
        $this->assertLessThanOrEqual(20, count($data['customers']));
    }

    /**
     * 新規登録用得意先検索は得意先コードと得意先名の両方で検索できる
     */
    public function test_customer_search_for_create_with_both_params(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/quotes/customers/search-for-create?customer_cd=001&customer_name=商事');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    /**
     * 新規登録用得意先検索は最大100件まで返す
     */
    public function test_customer_search_for_create_returns_max_100(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->getJson('/api/quotes/customers/search-for-create');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $data = $response->json();
        $this->assertLessThanOrEqual(100, count($data['customers']));
    }

    // ===============================
    // 見積新規登録APIテスト
    // ===============================

    /**
     * 未認証ユーザーは見積を登録できない
     */
    public function test_unauthenticated_user_cannot_create_quote(): void
    {
        $response = $this->postJson('/api/quotes', [
            'prod_name' => 'テスト商品',
            'customer_id' => 1,
            'quot_subject' => 'テスト件名',
            'quot_summary' => 'テスト概要',
            'center_section_cd_id' => 1,
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'ログインしてください',
            ]);
    }

    /**
     * 権限のないユーザーは見積を登録できない
     */
    public function test_user_without_permission_cannot_create_quote(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '40', // 一般
            'permissions' => [], // 権限なし
        ])->postJson('/api/quotes', [
            'prod_name' => 'テスト商品',
            'customer_id' => 1,
            'quot_subject' => 'テスト件名',
            'quot_summary' => 'テスト概要',
            'center_section_cd_id' => 1,
        ]);

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'アクセス権限がありません',
            ]);
    }

    /**
     * バリデーションエラー（品名なし）
     */
    public function test_create_quote_validation_error_prod_name(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson('/api/quotes', [
            'prod_name' => '', // 空
            'customer_id' => 1,
            'quot_subject' => 'テスト件名',
            'quot_summary' => 'テスト概要',
            'center_section_cd_id' => 1,
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ]);
    }

    /**
     * バリデーションエラー（得意先なし）
     */
    public function test_create_quote_validation_error_customer_id(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson('/api/quotes', [
            'prod_name' => 'テスト商品',
            // customer_id なし
            'quot_subject' => 'テスト件名',
            'quot_summary' => 'テスト概要',
            'center_section_cd_id' => 1,
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ]);
    }

    /**
     * 正常に見積を登録できる
     */
    public function test_user_can_create_quote(): void
    {
        $sectionCd = \App\Models\SectionCd::first();
        $employee = \App\Models\Employee::factory()->systemAdmin()->create();
        \App\Models\EmployeeSectionCd::create([
            'employee_id' => $employee->employee_id,
            'section_cd_id' => $sectionCd->section_cd_id,
        ]);

        $customer = \App\Models\Customer::factory()->create();
        $center = \App\Models\Department::factory()->center()->create();
        \App\Models\DepartmentSectionCd::create([
            'department_id' => $center->department_id,
            'section_cd_id' => $sectionCd->section_cd_id,
        ]);

        $response = $this->withSession([
            'employee_id' => $employee->employee_id,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson('/api/quotes', [
            'prod_name' => 'テスト商品',
            'customer_id' => $customer->customer_id,
            'quot_subject' => 'テスト見積件名',
            'quot_summary' => 'テスト見積概要',
            'center_id' => $center->department_id,
            'submission_method' => '00',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => '登録しました',
            ])
            ->assertJsonStructure([
                'success',
                'quot_id',
                'quot_number',
                'message',
            ]);

        // 見積書No形式の確認（CCCCCYYMMNNN形式）
        $data = $response->json();
        $this->assertMatchesRegularExpression('/^[0-9]{12}$/', $data['quot_number']);
    }

    /**
     * 見積登録時にステータスが00（登録済）になる
     */
    public function test_created_quote_has_registered_status(): void
    {
        $sectionCd = \App\Models\SectionCd::first();
        $employee = \App\Models\Employee::factory()->systemAdmin()->create();
        \App\Models\EmployeeSectionCd::create([
            'employee_id' => $employee->employee_id,
            'section_cd_id' => $sectionCd->section_cd_id,
        ]);

        $customer = \App\Models\Customer::factory()->create();
        $center = \App\Models\Department::factory()->center()->create();
        \App\Models\DepartmentSectionCd::create([
            'department_id' => $center->department_id,
            'section_cd_id' => $sectionCd->section_cd_id,
        ]);

        $response = $this->withSession([
            'employee_id' => $employee->employee_id,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson('/api/quotes', [
            'prod_name' => 'テスト商品ステータス確認',
            'customer_id' => $customer->customer_id,
            'quot_subject' => 'テスト見積件名',
            'quot_summary' => 'テスト見積概要',
            'center_id' => $center->department_id,
            'submission_method' => '00',
        ]);

        $response->assertStatus(200);

        $data = $response->json();
        $quot = \App\Models\Quot::find($data['quot_id']);

        $this->assertEquals('00', $quot->quot_status);
        $this->assertEquals($employee->employee_id, $quot->employee_id);
    }

    // ===============================
    // 制作見積依頼APIテスト
    // ===============================

    /**
     * 未認証ユーザーは制作見積依頼できない
     */
    public function test_unauthenticated_user_cannot_request_production(): void
    {
        $response = $this->postJson('/api/quotes/1/request-production');

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'ログインしてください',
            ]);
    }

    /**
     * 権限のないユーザーは制作見積依頼できない
     */
    public function test_user_without_permission_cannot_request_production(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '40', // 一般
            'permissions' => [], // 権限なし
        ])->postJson('/api/quotes/1/request-production');

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'アクセス権限がありません',
            ]);
    }

    /**
     * 存在しない見積は制作見積依頼できない
     */
    public function test_cannot_request_production_non_existent_quote(): void
    {
        $response = $this->withSession([
            'employee_id' => 1,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson('/api/quotes/999999/request-production');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => '見積が見つかりません',
            ]);
    }

    /**
     * 登録済以外のステータスは制作見積依頼できない
     */
    public function test_cannot_request_production_non_registered_quote(): void
    {
        $employee = \App\Models\Employee::factory()->systemAdmin()->create();
        $customer = \App\Models\Customer::factory()->create();
        $center = \App\Models\Department::factory()->center()->create();

        $quot = \App\Models\Quot::factory()->create([
            'quot_status' => '10',
            'employee_id' => $employee->employee_id,
            'customer_id' => $customer->customer_id,
        ]);

        $response = $this->withSession([
            'employee_id' => $employee->employee_id,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson("/api/quotes/{$quot->quot_id}/request-production");

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => '作成中・制作見積依頼前の見積のみ制作見積依頼できます',
            ]);
    }

    /**
     * 正常に制作見積依頼できる
     */
    public function test_user_can_request_production(): void
    {
        $employee = \App\Models\Employee::factory()->systemAdmin()->create();
        $customer = \App\Models\Customer::factory()->create();
        $center = \App\Models\Department::factory()->center()->create();

        $quot = \App\Models\Quot::factory()->create([
            'quot_status' => '00',
            'employee_id' => $employee->employee_id,
            'customer_id' => $customer->customer_id,
        ]);

        $response = $this->withSession([
            'employee_id' => $employee->employee_id,
            'access_type' => '00',
            'permissions' => [],
        ])->postJson("/api/quotes/{$quot->quot_id}/request-production");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => '制作見積依頼を行いました',
            ]);

        // データベースの確認（見積ステータスは変更されず、制作見積ステータスのみ更新）
        $quot->refresh();
        $this->assertEquals('00', $quot->quot_status);
        $this->assertEquals(Quot::PROD_STATUS_REQUESTED, $quot->prod_quot_status);

        // 制作見積レコードが作成されたことを確認
        $prodQuot = \App\Models\ProdQuot::where('quot_id', $quot->quot_id)->first();
        $this->assertNotNull($prodQuot);
        $this->assertEquals(0, $prodQuot->cost);
        $this->assertEquals('00', $prodQuot->prod_quot_status);
        $this->assertEquals(1, $prodQuot->version);
    }

    /**
     * sales.quotes.create権限を持つユーザーは制作見積依頼できる
     */
    public function test_user_with_quotes_permission_can_request_production(): void
    {
        $employee = \App\Models\Employee::factory()->general()->create();
        $customer = \App\Models\Customer::factory()->create();
        $sectionCd = \App\Models\SectionCd::first();

        // 社員別部署コードを設定してアクセス権を付与
        \App\Models\EmployeeSectionCd::factory()->create([
            'employee_id' => $employee->employee_id,
            'section_cd_id' => $sectionCd->section_cd_id,
        ]);

        $quot = \App\Models\Quot::factory()->create([
            'quot_status' => '00',
            'employee_id' => $employee->employee_id,
            'customer_id' => $customer->customer_id,
            'section_cd_id' => $sectionCd->section_cd_id,
        ]);

        $response = $this->withSession([
            'employee_id' => $employee->employee_id,
            'access_type' => '40',
            'permissions' => ['sales.quotes.create'],
        ])->postJson("/api/quotes/{$quot->quot_id}/request-production");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => '制作見積依頼を行いました',
            ]);

        // データベース確認
        $quot->refresh();
        $this->assertEquals('00', $quot->quot_status);
        $this->assertEquals(Quot::PROD_STATUS_REQUESTED, $quot->prod_quot_status);
    }

    /**
     * 未認証ユーザーは差戻しできない
     */
    public function test_unauthenticated_user_cannot_reject_quote(): void
    {
        $response = $this->postJson('/api/quotes/1/reject', [
            'remand_reason' => '差戻し理由',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'ログインしてください',
            ]);
    }

    /**
     * 差戻し理由は必須
     */
    public function test_reject_quote_validation_error_remand_reason(): void
    {
        // 全権限ユーザーとしてログイン
        $this->withSession([
            'employee_id' => 1,
            'section_cd_id' => 1,
            'access_type' => '00',
        ]);

        $response = $this->postJson('/api/quotes/1/reject', [
            'remand_reason' => '',
        ]);

        $response->assertStatus(422)
            ->assertJsonFragment([
                'success' => false,
            ]);
    }

    /**
     * 存在しない見積は差戻しできない
     */
    public function test_cannot_reject_non_existent_quote(): void
    {
        $this->withSession([
            'employee_id' => 1,
            'section_cd_id' => 1,
            'access_type' => '00',
        ]);

        $response = $this->postJson('/api/quotes/99999/reject', [
            'remand_reason' => '差戻し理由',
        ]);

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => '見積が見つかりません',
            ]);
    }

    /**
     * 承認待ちまたは承認済以外の見積は差戻しできない
     */
    public function test_cannot_reject_non_production_completed_quote(): void
    {
        $employee = \App\Models\Employee::factory()->systemAdmin()->create();
        $customer = \App\Models\Customer::factory()->create();
        $center = \App\Models\Department::factory()->center()->create();

        $quot = \App\Models\Quot::factory()->create([
            'quot_status' => '00',
            'employee_id' => $employee->employee_id,
            'customer_id' => $customer->customer_id,
        ]);

        $response = $this->withSession([
            'employee_id' => $employee->employee_id,
            'section_cd_id' => 1,
            'access_type' => '00',
        ])->postJson("/api/quotes/{$quot->quot_id}/reject", [
            'remand_reason' => '差戻し理由',
        ]);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => '承認待ちまたは承認済の見積のみ差戻しできます',
            ]);
    }

    /**
     * 承認待ちの見積を差戻しできる
     */
    public function test_user_can_reject_quote(): void
    {
        $employee = \App\Models\Employee::factory()->systemAdmin()->create();
        $customer = \App\Models\Customer::factory()->create();
        $center = \App\Models\Department::factory()->center()->create();

        $quot = \App\Models\Quot::factory()->create([
            'quot_status' => '10',
            'prod_quot_status' => '20',
            'employee_id' => $employee->employee_id,
            'customer_id' => $customer->customer_id,
        ]);

        $prodQuot = \App\Models\ProdQuot::factory()->create([
            'quot_id' => $quot->quot_id,
            'prod_quot_status' => '20',
            'version' => 1,
        ]);

        $response = $this->withSession([
            'employee_id' => $employee->employee_id,
            'section_cd_id' => 1,
            'access_type' => '00',
        ])->postJson("/api/quotes/{$quot->quot_id}/reject", [
            'remand_reason' => 'テスト差戻し理由',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => '差戻しを行いました',
            ]);

        // 見積の制作見積ステータスが制作見積依頼済(10)に変更されていることを確認
        $quot->refresh();
        $this->assertEquals('10', $quot->prod_quot_status);

        // 制作見積のステータスが差戻(50)に変更されていることを確認
        $prodQuot->refresh();
        $this->assertEquals('50', $prodQuot->prod_quot_status);

        // 制作見積のバージョンが+1されていることを確認
        $this->assertEquals(2, $prodQuot->version);

        // 制作見積差戻管理のレコードが作成されていることを確認
        $returnLog = \App\Models\ProdQuotReturnLog::where('prod_quot_id', $prodQuot->prod_quot_id)
            ->orderBy('prod_quot_return_log_id', 'desc')
            ->first();
        $this->assertNotNull($returnLog);
        $this->assertEquals(1, $returnLog->previous_version);
        $this->assertEquals(2, $returnLog->next_version);
        $this->assertEquals('テスト差戻し理由', $returnLog->remand_reason);
    }
}
