<?php

namespace Database\Factories;

use App\Models\ProdQuot;
use App\Models\Quot;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProdQuot>
 */
class ProdQuotFactory extends Factory
{
    protected $model = ProdQuot::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'quot_id' => Quot::factory(),
            'cost' => $this->faker->numberBetween(10000, 500000),
            'prod_quot_status' => ProdQuot::STATUS_NOT_STARTED,
            'version' => 1,
        ];
    }

    /**
     * 未着手ステータス
     */
    public function notStarted(): static
    {
        return $this->state(fn (array $attributes) => [
            'prod_quot_status' => ProdQuot::STATUS_NOT_STARTED,
        ]);
    }

    /**
     * 作業中ステータス
     */
    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'prod_quot_status' => ProdQuot::STATUS_IN_PROGRESS,
        ]);
    }

    /**
     * 完了ステータス
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'prod_quot_status' => ProdQuot::STATUS_COMPLETED,
        ]);
    }

    /**
     * 差戻しステータス
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'prod_quot_status' => ProdQuot::STATUS_REJECTED,
        ]);
    }
}
