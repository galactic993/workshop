<?php

namespace Database\Factories;

use App\Models\Operation;
use App\Models\ProdQuot;
use App\Models\ProdQuotOperation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProdQuotOperation>
 */
class ProdQuotOperationFactory extends Factory
{
    protected $model = ProdQuotOperation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'prod_quot_id' => ProdQuot::factory(),
            'operation_id' => Operation::factory(),
            'prod_quot_cost' => $this->faker->numberBetween(10000, 100000),
        ];
    }
}
