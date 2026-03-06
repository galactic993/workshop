<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Employee;
use App\Models\Quot;
use App\Models\SectionCd;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Quot>
 */
class QuotFactory extends Factory
{
    protected $model = Quot::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'section_cd_id' => SectionCd::factory(),
            'employee_id' => Employee::factory(),
            'base_quot_id' => null,
            'quot_number' => $this->faker->unique()->numerify('00001######'),
            'prod_name' => $this->faker->words(3, true),
            'customer_id' => Customer::factory(),
            'customer_name' => null,
            'quot_subject' => mb_substr($this->faker->sentence, 0, 50),
            'quot_summary' => $this->faker->paragraph,
            'reference_doc_path' => null,
            'center_section_cd_id' => SectionCd::factory(),
            'approved_by' => null,
            'approved_at' => null,
            'quot_status' => Quot::STATUS_DRAFT,
            'prod_quot_status' => Quot::PROD_STATUS_BEFORE_REQUEST,
            'quot_amount' => null,
            'submission_method' => Quot::SUBMISSION_UNDECIDED,
            'quot_on' => null,
            'quot_doc_path' => null,
            'quot_result' => Quot::RESULT_UNDETERMINED,
            'lost_reason' => null,
        ];
    }

    /**
     * 作成中ステータス
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'quot_status' => Quot::STATUS_DRAFT,
            'prod_quot_status' => Quot::PROD_STATUS_BEFORE_REQUEST,
        ]);
    }

    /**
     * 制作見積依頼済みステータス
     */
    public function productionRequested(): static
    {
        return $this->state(fn (array $attributes) => [
            'quot_status' => Quot::STATUS_DRAFT,
            'prod_quot_status' => Quot::PROD_STATUS_REQUESTED,
        ]);
    }

    /**
     * 制作見積済ステータス
     */
    public function productionCompleted(): static
    {
        return $this->state(fn (array $attributes) => [
            'quot_status' => Quot::STATUS_DRAFT,
            'prod_quot_status' => Quot::PROD_STATUS_COMPLETED,
        ]);
    }

    /**
     * 制作見積受取済ステータス
     */
    public function productionReceived(): static
    {
        return $this->state(fn (array $attributes) => [
            'quot_status' => Quot::STATUS_DRAFT,
            'prod_quot_status' => Quot::PROD_STATUS_RECEIVED,
        ]);
    }

    /**
     * 承認待ちステータス
     */
    public function pendingApproval(): static
    {
        return $this->state(fn (array $attributes) => [
            'quot_status' => Quot::STATUS_PENDING_APPROVAL,
            'prod_quot_status' => Quot::PROD_STATUS_RECEIVED,
            'quot_amount' => $this->faker->numberBetween(10000, 1000000),
        ]);
    }

    /**
     * 承認済ステータス
     */
    public function approved(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'quot_status' => Quot::STATUS_APPROVED,
                'prod_quot_status' => Quot::PROD_STATUS_RECEIVED,
                'quot_amount' => $this->faker->numberBetween(10000, 1000000),
                'approved_by' => Employee::factory(),
                'approved_at' => now(),
            ];
        });
    }

    /**
     * 発行済ステータス
     */
    public function issued(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'quot_status' => Quot::STATUS_ISSUED,
                'prod_quot_status' => Quot::PROD_STATUS_RECEIVED,
                'quot_amount' => $this->faker->numberBetween(10000, 1000000),
                'approved_by' => Employee::factory(),
                'approved_at' => now(),
                'quot_on' => now()->toDateString(),
            ];
        });
    }
}
