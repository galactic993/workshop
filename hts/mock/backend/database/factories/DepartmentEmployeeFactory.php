<?php

namespace Database\Factories;

use App\Models\Department;
use App\Models\DepartmentEmployee;
use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DepartmentEmployee>
 */
class DepartmentEmployeeFactory extends Factory
{
    protected $model = DepartmentEmployee::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'department_employee_id' => $this->faker->unique()->numberBetween(100000, 999999),
            'department_id' => Department::factory(),
            'employee_id' => Employee::factory(),
        ];
    }

    /**
     * 特定の組織と社員を指定
     */
    public function forDepartmentAndEmployee(int $departmentId, int $employeeId): static
    {
        return $this->state(fn (array $attributes) => [
            'department_id' => $departmentId,
            'employee_id' => $employeeId,
        ]);
    }
}
