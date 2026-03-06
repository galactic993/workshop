<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Quot;
use App\Models\QuotIssueLog;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\QuotIssueLog>
 */
class QuotIssueLogFactory extends Factory
{
    protected $model = QuotIssueLog::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'quot_id' => Quot::factory(),
            'issued_at' => now(),
            'issued_by' => Employee::factory(),
            'file_name' => $this->faker->word.'.xlsx',
        ];
    }
}
