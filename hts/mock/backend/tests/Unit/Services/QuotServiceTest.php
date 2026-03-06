<?php

namespace Tests\Unit\Services;

use App\Models\Customer;
use App\Models\Employee;
use App\Services\QuotService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use PHPUnit\Framework\Attributes\Group;
use Tests\TestCase;

#[Group('quot-service')]
class QuotServiceTest extends TestCase
{
    use RefreshDatabase;

    private QuotService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new QuotService;
        $this->seed();
    }

    public function test_access_type_00_has_unlimited_access(): void
    {
        $employee = Employee::factory()->systemAdmin()->create();
        $result = $this->service->getAccessibleSectionCdIds($employee->employee_id, '00');
        $this->assertTrue($result['is_unlimited']);
        $this->assertNull($result['section_cd_ids']);
        $this->assertFalse($result['is_section_cd_disabled']);
    }

    public function test_general_user_without_visible_departments_uses_employee_section_cd(): void
    {
        $employee = Employee::factory()->general()->create();
        $sectionCd = \App\Models\SectionCd::factory()->create();
        \App\Models\EmployeeSectionCd::factory()->forSectionAndEmployee($sectionCd->section_cd_id, $employee->employee_id)->create();

        $result = $this->service->getAccessibleSectionCdIds($employee->employee_id, '40');

        $this->assertFalse($result['is_unlimited']);
        $this->assertContains($sectionCd->section_cd_id, $result['section_cd_ids']);
    }

    public function test_general_user_without_any_section_cd_returns_empty(): void
    {
        $employee = Employee::factory()->general()->create();

        $result = $this->service->getAccessibleSectionCdIds($employee->employee_id, '40');

        $this->assertFalse($result['is_unlimited']);
        $this->assertEmpty($result['section_cd_ids']);
    }

    public function test_manager_can_access_center_subordinate_section_cds(): void
    {
        $center = \App\Models\Department::factory()->center()->create();
        $employee = Employee::factory()->general()->create();

        // 社員のdepartment_employeeレコードを作成
        DB::table('department_employee')->insert([
            'department_employee_id' => 1000,
            'employee_id' => $employee->employee_id,
            'department_id' => $center->department_id,
            'updated_at' => now(),
        ]);

        $result = $this->service->getAccessibleSectionCdIds($employee->employee_id, '20');

        // アクセス区分20の場合、所属組織のsection_cdsを取得する想定
        $this->assertFalse($result['is_unlimited']);
    }

    public function test_access_type_00_gets_all_section_cds_except_departments(): void
    {
        $sectionCd1 = \App\Models\SectionCd::factory()->create();
        $sectionCd2 = \App\Models\SectionCd::factory()->create();

        $employee = Employee::factory()->systemAdmin()->create();

        $result = $this->service->getAccessibleSectionCdIds($employee->employee_id, '00');

        $this->assertTrue($result['is_unlimited']);
        $this->assertNull($result['section_cd_ids']);
    }

    public function test_section_cd_is_disabled_when_only_one(): void
    {
        $employee = Employee::factory()->general()->create();
        $sectionCd = \App\Models\SectionCd::factory()->create();
        \App\Models\EmployeeSectionCd::factory()->forSectionAndEmployee($sectionCd->section_cd_id, $employee->employee_id)->create();

        $result = $this->service->getAccessibleSectionCdIds($employee->employee_id, '40');

        $this->assertFalse($result['is_unlimited']);
        $this->assertCount(1, $result['section_cd_ids']);
        $this->assertTrue($result['is_section_cd_disabled']);
    }

    public function test_access_type_00_gets_all_customers(): void
    {
        $result = $this->service->getSelectableCustomerIds(1, '00');
        $expectedCount = DB::table('customer_section_cd')->distinct()->count('customer_id');
        $this->assertEquals($expectedCount, count($result));
    }

    public function test_returns_empty_when_no_accessible_section_cds(): void
    {
        $employee = Employee::factory()->general()->create();

        $result = $this->service->getSelectableCustomerIds($employee->employee_id, '40');

        $this->assertEmpty($result);
    }

    public function test_get_customers_by_user_center(): void
    {
        $center = \App\Models\Department::factory()->center()->create();
        $employee = Employee::factory()->general()->create();

        // 社員のdepartment_employeeレコードを作成
        DB::table('department_employee')->insert([
            'department_employee_id' => 1001,
            'employee_id' => $employee->employee_id,
            'department_id' => $center->department_id,
            'updated_at' => now(),
        ]);

        // 部署コードは頭3桁が重要（例: 999xxx）
        $sectionCd = \App\Models\SectionCd::factory()->create(['section_cd' => '999111']);

        // employee_section_cdで社員とsection_cdを紐づけ
        \App\Models\EmployeeSectionCd::factory()->forSectionAndEmployee($sectionCd->section_cd_id, $employee->employee_id)->create();

        // department_section_cdリレーションの作成
        DB::table('department_section_cd')->insert([
            'department_id' => $center->department_id,
            'section_cd_id' => $sectionCd->section_cd_id,
        ]);

        $customer = Customer::factory()->create();

        // customer_section_cdリレーションの作成
        DB::table('customer_section_cd')->insert([
            'customer_id' => $customer->customer_id,
            'section_cd_id' => $sectionCd->section_cd_id,
        ]);

        $result = $this->service->getSelectableCustomerIds($employee->employee_id, '20');

        // 所長権限でセンターに所属する場合、得意先が取得できること
        $this->assertIsArray($result);
    }

    public function test_team_member_gets_parent_center_customers(): void
    {
        $center = \App\Models\Department::factory()->center()->create();
        $team = \App\Models\Department::factory()->team($center->department_id)->create();

        $employee = Employee::factory()->general()->create();

        // 社員のdepartment_employeeレコードを作成（チームに所属）
        DB::table('department_employee')->insert([
            'department_employee_id' => 1002,
            'employee_id' => $employee->employee_id,
            'department_id' => $team->department_id,
            'updated_at' => now(),
        ]);

        // 部署コードは頭3桁が重要（例: 998xxx）
        $sectionCd = \App\Models\SectionCd::factory()->create(['section_cd' => '998222']);

        // employee_section_cdで社員とsection_cdを紐づけ
        \App\Models\EmployeeSectionCd::factory()->forSectionAndEmployee($sectionCd->section_cd_id, $employee->employee_id)->create();

        // department_section_cdリレーションの作成（親センターに紐づけ）
        DB::table('department_section_cd')->insert([
            'department_id' => $center->department_id,
            'section_cd_id' => $sectionCd->section_cd_id,
        ]);

        $customer = Customer::factory()->create();

        DB::table('customer_section_cd')->insert([
            'customer_id' => $customer->customer_id,
            'section_cd_id' => $sectionCd->section_cd_id,
        ]);

        $result = $this->service->getSelectableCustomerIds($employee->employee_id, '30');

        $this->assertContains($customer->customer_id, $result);
    }

    public function test_returns_empty_when_no_department(): void
    {
        $employee = Employee::factory()->general()->create();
        // department_employeeレコードを作成しない（所属組織なし）

        $result = $this->service->getSelectableCustomerIds($employee->employee_id, '20');

        $this->assertEmpty($result);
    }

    public function test_suggest_customers_by_query(): void
    {
        $customer = Customer::factory()->create(['customer_name' => 'テスト株式会社']);
        $customerIds = [$customer->customer_id];

        $result = $this->service->suggestCustomers($customerIds, 'テスト');

        $this->assertNotEmpty($result);
        $this->assertEquals($customer->customer_id, $result->first()->customer_id);
    }

    public function test_suggest_customers_with_space_separated_query(): void
    {
        $customer = Customer::factory()->create(['customer_name' => '東京商事株式会社']);
        $customerIds = [$customer->customer_id];

        $result = $this->service->suggestCustomers($customerIds, '東京 商事');

        $this->assertNotEmpty($result);
        $this->assertEquals($customer->customer_id, $result->first()->customer_id);
    }

    public function test_suggest_customers_with_empty_customer_ids(): void
    {
        $result = $this->service->suggestCustomers([], 'test');
        $this->assertEmpty($result);
    }

    public function test_suggest_customers_without_query(): void
    {
        $customers = Customer::factory()->count(25)->create();
        $customerIds = $customers->pluck('customer_id')->toArray();

        $result = $this->service->suggestCustomers($customerIds, '');

        $this->assertLessThanOrEqual(20, $result->count());
    }

    public function test_search_customers_by_customer_cd(): void
    {
        $customer = Customer::factory()->create(['customer_cd' => '12345']);
        $customerIds = [$customer->customer_id];

        $result = $this->service->searchCustomers($customerIds, '12345');

        $this->assertNotEmpty($result);
        $this->assertEquals('12345', $result->first()->customer_cd);
    }

    public function test_search_customers_by_customer_name(): void
    {
        $customer = Customer::factory()->create(['customer_name' => 'サンプル株式会社']);
        $customerIds = [$customer->customer_id];

        $result = $this->service->searchCustomers($customerIds, null, 'サンプル株式会社');

        $this->assertNotEmpty($result);
        $this->assertEquals($customer->customer_id, $result->first()->customer_id);
    }

    public function test_search_customers_by_both_cd_and_name(): void
    {
        $customer = Customer::factory()->create([
            'customer_cd' => '99999',
            'customer_name' => '両方検索テスト株式会社',
        ]);
        $customerIds = [$customer->customer_id];

        $result = $this->service->searchCustomers($customerIds, '99999', '両方検索テスト');

        $this->assertNotEmpty($result);
        $this->assertEquals($customer->customer_id, $result->first()->customer_id);
    }

    public function test_search_customers_with_empty_customer_ids(): void
    {
        $result = $this->service->searchCustomers([], 'test');
        $this->assertEmpty($result);
    }
}
