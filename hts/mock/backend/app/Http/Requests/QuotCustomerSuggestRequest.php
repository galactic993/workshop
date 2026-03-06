<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class QuotCustomerSuggestRequest extends FormRequest
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
            'query' => ['required', 'string', 'min:1', 'max:100'],
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
            'query.required' => '検索クエリを入力してください',
            'query.min' => '1文字以上で入力してください',
            'query.max' => '100文字以内で入力してください',
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
            'query' => '検索クエリ',
        ];
    }
}
