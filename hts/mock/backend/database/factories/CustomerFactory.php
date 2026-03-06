<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Customer>
 */
class CustomerFactory extends Factory
{
    protected $model = Customer::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // customer_cd は5桁の数字
        $customerCd = $this->faker->unique()->numerify('#####');

        // payment_type は '00','10','20' のいずれか
        $paymentTypes = ['00', '10', '20'];

        // tax_rounded_type は '0','1' のいずれか
        $taxRoundedTypes = ['0', '1'];

        // fee_beare_type は '0','1' のいずれか
        $feeBeareTypes = ['0', '1'];

        // discount_flag は '0','1' のいずれか（または null）
        $discountFlags = ['0', '1', null];

        return [
            'customer_cd' => $customerCd,
            'customer_name' => mb_substr($this->faker->company, 0, 30),
            'customer_name_kana' => mb_substr($this->faker->kanaName, 0, 50),
            'company_id' => Company::factory(),
            'postal_cd' => $this->faker->postcode,
            'address1' => mb_substr($this->faker->address, 0, 50),
            'address2' => mb_substr($this->faker->secondaryAddress, 0, 50),
            'representative_name' => $this->faker->name,
            'phone_number' => $this->faker->phoneNumber,
            'fax_number' => $this->faker->optional()->phoneNumber,
            'email' => $this->faker->optional()->safeEmail,
            'is_inspection' => $this->faker->boolean,
            'inspection_term_months' => $this->faker->optional()->randomElement(['1', '2', '3']),
            'inspection_date' => $this->faker->optional()->randomElement(['10', '15', '20', '25', '31']),
            'payment_term_months' => $this->faker->randomElement(['1', '2', '3']),
            'payment_date' => $this->faker->randomElement(['10', '15', '20', '25', '31']),
            'payment_type' => $this->faker->randomElement($paymentTypes),
            'tax_rounded_type' => $this->faker->randomElement($taxRoundedTypes),
            'fee_beare_type' => $this->faker->randomElement($feeBeareTypes),
            'credit_limit' => $this->faker->numberBetween(1000000, 100000000),
            'order_limit' => $this->faker->numberBetween(500000, 50000000),
            'discount_flag' => $this->faker->randomElement($discountFlags),
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
     * 検収あり（is_inspection = true）の状態
     */
    public function withInspection(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_inspection' => true,
            'inspection_term_months' => $this->faker->randomElement(['1', '2', '3']),
            'inspection_date' => $this->faker->randomElement(['10', '15', '20', '25', '31']),
        ]);
    }

    /**
     * 検収なし（is_inspection = false）の状態
     */
    public function withoutInspection(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_inspection' => false,
            'inspection_term_months' => null,
            'inspection_date' => null,
        ]);
    }

    /**
     * 特定の会社団体IDを指定
     */
    public function forCompany(int $companyId): static
    {
        return $this->state(fn (array $attributes) => [
            'company_id' => $companyId,
        ]);
    }
}
