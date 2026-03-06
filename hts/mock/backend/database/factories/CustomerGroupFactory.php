<?php

namespace Database\Factories;

use App\Models\CustomerGroup;
use App\Models\Industry;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CustomerGroup>
 */
class CustomerGroupFactory extends Factory
{
    protected $model = CustomerGroup::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_group_id' => $this->faker->unique()->numberBetween(1000, 999999),
            'industry_id' => Industry::factory(),
            'customer_group_name' => mb_substr($this->faker->company.'-'.$this->faker->unique()->randomNumber(5), 0, 40),
        ];
    }

    /**
     * 特定の業種IDを指定
     */
    public function forIndustry(int $industryId): static
    {
        return $this->state(fn (array $attributes) => [
            'industry_id' => $industryId,
        ]);
    }
}
