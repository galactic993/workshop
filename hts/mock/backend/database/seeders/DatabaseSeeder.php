<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // マスタデータの投入
        $this->call([
            SectionCdSeeder::class,
            EmployeeSeeder::class,
            EmployeeSectionCdSeeder::class,
            DepartmentSeeder::class,
            DepartmentEmployeeSeeder::class,
            DepartmentSectionCdSeeder::class,
            VisibleDepartmentSeeder::class,
            PermissionSeeder::class,
            RoleSeeder::class,
            PermissionRoleSeeder::class,
            EmployeeRoleSeeder::class,
            IndustrySeeder::class,
            CustomerGroupSeeder::class,
            CompanySeeder::class,
            CustomerSeeder::class,
            CustomerSectionCdSeeder::class,
            OperationSeeder::class,
            ProcesCdSeeder::class,
            QuotSeeder::class,
            ProdQuotSeeder::class,
            ProdQuotRequestSeeder::class,
            ProdQuotDetailSeeder::class,
            ProdQuotOperationSeeder::class,
            QuotOperationSeeder::class,
            QuotIssueLogSeeder::class,
        ]);
    }
}
