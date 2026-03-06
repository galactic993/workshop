<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\EmployeeSectionCd;
use App\Models\SectionCd;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EmployeeSectionCd>
 */
class EmployeeSectionCdFactory extends Factory
{
    protected $model = EmployeeSectionCd::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'section_cd_id' => SectionCd::factory(),
            'employee_id' => Employee::factory(),
            'section_cd' => function (array $attributes) {
                return SectionCd::find($attributes['section_cd_id'])?->section_cd;
            },
            'employee_cd' => function (array $attributes) {
                return Employee::find($attributes['employee_id'])?->employee_cd;
            },
        ];
    }

    /**
     * 特定の部署コードIDと社員IDを指定
     */
    public function forSectionAndEmployee(int $sectionCdId, int $employeeId): static
    {
        return $this->state(function (array $attributes) use ($sectionCdId, $employeeId) {
            $sectionCd = SectionCd::find($sectionCdId);
            $employee = Employee::find($employeeId);

            return [
                'section_cd_id' => $sectionCdId,
                'employee_id' => $employeeId,
                'section_cd' => $sectionCd?->section_cd,
                'employee_cd' => $employee?->employee_cd,
            ];
        });
    }
}
