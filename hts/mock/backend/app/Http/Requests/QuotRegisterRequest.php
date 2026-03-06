<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class QuotRegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'amounts' => ['required', 'array', 'min:1'],
            'amounts.*.prod_quot_operation_id' => ['required', 'integer', 'exists:prod_quot_operations,prod_quot_operation_id'],
            'amounts.*.quot_amount' => ['required', 'numeric', 'min:0', 'max:999999999999'],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'amounts.required' => '見積金額を入力してください',
            'amounts.array' => '見積金額の形式が正しくありません',
            'amounts.min' => '見積金額を入力してください',
            'amounts.*.prod_quot_operation_id.required' => '作業部門別制作見積IDは必須です',
            'amounts.*.prod_quot_operation_id.integer' => '作業部門別制作見積IDは整数で入力してください',
            'amounts.*.prod_quot_operation_id.exists' => '作業部門別制作見積が存在しません',
            'amounts.*.quot_amount.required' => '見積金額を入力してください',
            'amounts.*.quot_amount.numeric' => '見積金額は数値で入力してください',
            'amounts.*.quot_amount.min' => '見積金額は0以上で入力してください',
            'amounts.*.quot_amount.max' => '見積金額は12桁以内で入力してください',
        ];
    }
}
