<?php

namespace Database\Factories;

use App\Models\Operation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Operation>
 */
class OperationFactory extends Factory
{
    protected $model = Operation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // operation_cd は3桁の数字（100-999の範囲でランダムに選択）
        $operationCd = $this->faker->numberBetween(100, 999);

        return [
            'operation_cd' => $operationCd,
            'operation_name' => mb_substr($this->faker->word, 0, 30),
        ];
    }
}
