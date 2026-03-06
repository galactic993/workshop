<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    protected $model = Employee::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // employee_cd は6桁の数字
        $employeeCd = $this->faker->unique()->numerify('######');

        // access_type は '00','10','20','30','40' のいずれか
        $accessTypes = ['00', '10', '20', '30', '40'];

        return [
            'employee_id' => $this->faker->unique()->numberBetween(100000, 999999),
            'employee_cd' => $employeeCd,
            'employee_name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'access_type' => $this->faker->randomElement($accessTypes),
            'deleted_flag' => '0',
        ];
    }

    /**
     * 削除済み（deleted_flag = '1'）の状態
     */
    public function deleted(): static
    {
        return $this->state(fn (array $attributes) => [
            'deleted_flag' => '1',
        ]);
    }

    /**
     * システム管理者（access_type = '00'）
     */
    public function systemAdmin(): static
    {
        return $this->state(fn (array $attributes) => [
            'access_type' => '00',
        ]);
    }

    /**
     * 参照権限（access_type = '10'）
     */
    public function viewOnly(): static
    {
        return $this->state(fn (array $attributes) => [
            'access_type' => '10',
        ]);
    }

    /**
     * 所長権限（access_type = '20'）
     */
    public function director(): static
    {
        return $this->state(fn (array $attributes) => [
            'access_type' => '20',
        ]);
    }

    /**
     * リーダー権限（access_type = '30'）
     */
    public function leader(): static
    {
        return $this->state(fn (array $attributes) => [
            'access_type' => '30',
        ]);
    }

    /**
     * 一般権限（access_type = '40'）
     */
    public function general(): static
    {
        return $this->state(fn (array $attributes) => [
            'access_type' => '40',
        ]);
    }
}
