<?php

namespace App\Http\Requests;

use App\Models\Quot;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class QuotCreateRequest extends FormRequest
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
            'prod_name' => ['nullable', 'string', 'max:50'],
            'customer_id' => ['required', 'integer', 'min:1', 'exists:customers,customer_id'],
            'customer_name' => ['nullable', 'string', 'max:120'],
            'quot_subject' => ['nullable', 'string', 'max:50'],
            'quot_summary' => ['nullable', 'string', 'max:2000'],
            'message' => ['nullable', 'string', 'max:2000'],
            'reference_doc_path' => ['nullable', 'string', 'max:255'],
            'center_id' => ['nullable', 'integer', 'min:1', 'exists:departments,department_id'],
            'submission_method' => ['required', 'string', 'in:'.Quot::SUBMISSION_UNDECIDED.','.Quot::SUBMISSION_EMAIL.','.Quot::SUBMISSION_POST.','.Quot::SUBMISSION_HAND],
            'base_quot_id' => ['nullable', 'integer', 'min:1', 'exists:quots,quot_id'],
            'operations' => ['nullable', 'array'],
            'operations.*.operation_id' => ['required_with:operations', 'integer', 'min:1', 'exists:operations,operation_id'],
            'operations.*.cost' => ['required_with:operations', 'integer', 'min:0'],
            'operations.*.quot_amount' => ['required_with:operations', 'integer', 'min:0'],
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
            'prod_name.max' => '50文字以内で入力してください',
            'customer_id.required' => '得意先を選択してください',
            'customer_id.exists' => '得意先が存在しません',
            'customer_name.required' => '諸口の場合は得意先名を入力してください',
            'customer_name.max' => '120文字以内で入力してください',
            'quot_subject.required' => '見積件名を入力してください',
            'quot_subject.max' => '50文字以内で入力してください',
            'quot_summary.required' => '見積概要を入力してください',
            'quot_summary.max' => '2000文字以内で入力してください',
            'message.required' => '伝達事項を入力してください',
            'message.max' => '2000文字以内で入力してください',
            'reference_doc_path.required' => '参考資料パスを入力してください',
            'reference_doc_path.max' => '255文字以内で入力してください',
            'center_id.required' => '主管センターを選択してください',
            'center_id.exists' => '有効な値を選択してください',
            'submission_method.required' => '提出方法を選択してください',
            'submission_method.in' => '有効な値を選択してください',
        ];
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => $validator->errors()->first(),
            'errors' => $validator->errors(),
        ], 422));
    }
}
