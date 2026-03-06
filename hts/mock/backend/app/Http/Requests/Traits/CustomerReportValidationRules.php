<?php

namespace App\Http\Requests\Traits;

use Carbon\Carbon;
use Illuminate\Contracts\Validation\Validator;

trait CustomerReportValidationRules
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'cumulative_period_from' => ['required', 'date'],
            'cumulative_period_to' => ['required', 'date', 'after_or_equal:cumulative_period_from'],
            'business_days' => ['required', 'integer', 'min:1', 'max:31'],
            'working_days' => ['required', 'integer', 'min:1', 'max:31'],
            'include_aggregated' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'cumulative_period_from.required' => '累計期間開始日は必須です',
            'cumulative_period_from.date' => '累計期間開始日は正しい日付形式で入力してください',
            'cumulative_period_to.required' => '累計期間終了日は必須です',
            'cumulative_period_to.date' => '累計期間終了日は正しい日付形式で入力してください',
            'cumulative_period_to.after_or_equal' => '累計期間終了日は開始日以降の日付を指定してください',
            'business_days.required' => '営業日数は必須です',
            'business_days.integer' => '営業日数は整数で入力してください',
            'business_days.min' => '営業日数は1以上で入力してください',
            'business_days.max' => '営業日数は31以下で入力してください',
            'working_days.required' => '稼働日数は必須です',
            'working_days.integer' => '稼働日数は整数で入力してください',
            'working_days.min' => '稼働日数は1以上で入力してください',
            'working_days.max' => '稼働日数は31以下で入力してください',
            'include_aggregated.boolean' => '集計済み含むは真偽値で入力してください',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'cumulative_period_from' => '累計期間開始日',
            'cumulative_period_to' => '累計期間終了日',
            'business_days' => '営業日数',
            'working_days' => '稼働日数',
            'include_aggregated' => '集計済み含む',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $periodTo = $this->input('cumulative_period_to');

            if ($periodTo) {
                try {
                    $lastDayOfMonth = Carbon::parse($periodTo)->endOfMonth()->day;
                    $businessDays = $this->input('business_days');
                    $workingDays = $this->input('working_days');

                    if ($businessDays !== null && $businessDays > $lastDayOfMonth) {
                        $validator->errors()->add(
                            'business_days',
                            '営業日数は累計期間終了月の月末日以下で入力してください'
                        );
                    }

                    if ($workingDays !== null && $workingDays > $lastDayOfMonth) {
                        $validator->errors()->add(
                            'working_days',
                            '稼働日数は累計期間終了月の月末日以下で入力してください'
                        );
                    }
                } catch (\Exception $e) {
                    // 日付パースに失敗した場合は、rulesのdateバリデーションでエラーになる
                }
            }
        });
    }
}
