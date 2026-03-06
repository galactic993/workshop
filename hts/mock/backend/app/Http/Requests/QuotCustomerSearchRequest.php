<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class QuotCustomerSearchRequest extends FormRequest
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
            'customer_cd' => ['nullable', 'string', 'max:5', 'regex:/^[0-9]*$/'],
            'customer_name' => ['nullable', 'string', 'max:100'],
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
            'customer_cd.max' => '5桁以内で入力してください',
            'customer_cd.regex' => '半角数字で入力してください',
            'customer_name.max' => '100文字以内で入力してください',
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
            'customer_cd' => '得意先コード',
            'customer_name' => '得意先名',
        ];
    }
}
