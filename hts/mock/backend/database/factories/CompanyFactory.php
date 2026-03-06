<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\CustomerGroup;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Company>
 */
class CompanyFactory extends Factory
{
    protected $model = Company::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'company_id' => $this->faker->unique()->numberBetween(1000, 999999),
            'customer_group_id' => CustomerGroup::factory(),
            'company_name' => mb_substr($this->faker->company, 0, 50),
        ];
    }

    /**
     * 特定の得意先グループIDを指定
     */
    public function forCustomerGroup(int $customerGroupId): static
    {
        return $this->state(fn (array $attributes) => [
            'customer_group_id' => $customerGroupId,
        ]);
    }
}
