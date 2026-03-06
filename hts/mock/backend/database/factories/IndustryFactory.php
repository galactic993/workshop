<?php

namespace Database\Factories;

use App\Models\Industry;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Industry>
 */
class IndustryFactory extends Factory
{
    protected $model = Industry::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'industry_id' => $this->faker->unique()->numberBetween(1000, 999999),
            'industry_name' => $this->faker->unique()->words(2, true).'_'.$this->faker->unique()->numberBetween(1000, 999999),
        ];
    }
}
