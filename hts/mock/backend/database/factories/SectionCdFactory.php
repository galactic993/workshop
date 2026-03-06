<?php

namespace Database\Factories;

use App\Models\SectionCd;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SectionCd>
 */
class SectionCdFactory extends Factory
{
    protected $model = SectionCd::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // 部署コードは6桁の数字
        $sectionCd = $this->faker->unique()->numerify('######');

        // 経費区分は '23','25','29','30','60' のいずれか
        $expenseCategories = ['23', '25', '29', '30', '60'];

        return [
            'section_cd_id' => $this->faker->unique()->numberBetween(100000, 999999),
            'section_cd' => $sectionCd,
            'section_name' => mb_substr($this->faker->company, 0, 30),
            'expense_category' => $this->faker->randomElement($expenseCategories),
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
     * 特定の経費区分を指定
     */
    public function expenseCategory(string $category): static
    {
        return $this->state(fn (array $attributes) => [
            'expense_category' => $category,
        ]);
    }
}
