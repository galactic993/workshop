<?php

namespace Database\Factories;

use App\Models\Operation;
use App\Models\Quot;
use App\Models\QuotOperation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\QuotOperation>
 */
class QuotOperationFactory extends Factory
{
    protected $model = QuotOperation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $cost = $this->faker->numberBetween(10000, 100000);

        return [
            'quot_id' => Quot::factory(),
            'operation_id' => Operation::factory(),
            'cost' => $cost,
            'quot_amount' => (int) ($cost * 1.25), // 25%マージン
        ];
    }
}
