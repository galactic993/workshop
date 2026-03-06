<?php

namespace Database\Factories;

use App\Models\Department;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Department>
 */
class DepartmentFactory extends Factory
{
    protected $model = Department::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // department_category は '00','10','20' のいずれか
        $departmentCategories = ['00', '10', '20'];

        // デフォルトはセンター（is_center = true）
        return [
            'department_id' => $this->faker->unique()->numberBetween(100000, 999999),
            'department_name' => mb_substr($this->faker->company, 0, 30),
            'is_center' => true,
            'display_name' => mb_substr($this->faker->companySuffix, 0, 6),
            'display_order' => $this->faker->unique()->numberBetween(1000, 32000),
            'center_id' => null,
            'department_category' => $this->faker->randomElement($departmentCategories),
        ];
    }

    /**
     * センター（is_center = true）の状態
     */
    public function center(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_center' => true,
            'display_name' => mb_substr($this->faker->companySuffix, 0, 6),
            'display_order' => $this->faker->unique()->numberBetween(1000, 32000),
            'center_id' => null,
        ]);
    }

    /**
     * チーム（is_center = false）の状態
     * 親センターIDを指定する必要があります
     */
    public function team(?int $centerId = null): static
    {
        return $this->state(fn (array $attributes) => [
            'is_center' => false,
            'display_name' => null,
            'display_order' => null,
            'center_id' => $centerId,
        ]);
    }

    /**
     * スタッフ部門（department_category = '00'）
     */
    public function staff(): static
    {
        return $this->state(fn (array $attributes) => [
            'department_category' => '00',
        ]);
    }

    /**
     * 営業部門（department_category = '10'）
     */
    public function sales(): static
    {
        return $this->state(fn (array $attributes) => [
            'department_category' => '10',
        ]);
    }

    /**
     * 制作部門（department_category = '20'）
     */
    public function production(): static
    {
        return $this->state(fn (array $attributes) => [
            'department_category' => '20',
        ]);
    }
}
