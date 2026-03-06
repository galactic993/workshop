<?php

namespace App\Http\Requests;

use App\Services\QuotService;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class QuotSearchRequest extends FormRequest
{
    public function __construct(
        private readonly QuotService $quotService
    ) {
        parent::__construct();
    }

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
            'section_cd' => ['required', 'string'],
            'quote_no' => ['nullable', 'string', 'max:12', 'regex:/^[0-9]*$/'],
            'quote_date_from' => ['nullable', 'date'],
            'quote_date_to' => ['nullable', 'date', 'after_or_equal:quote_date_from'],
            'quot_subject' => ['nullable', 'string', 'max:50'],
            'customer_id' => ['nullable', 'integer', 'min:1'],
            'product_name' => ['nullable', 'string', 'max:50'],
            'status' => ['required', 'string', 'in:all,00,10,20,30'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'in:10,25,50,100'],
            'sort_field' => ['nullable', 'string', 'in:quote_no,customer_name,quot_subject,prod_name,amount,quot_status'],
            'sort_order' => ['nullable', 'string', 'in:asc,desc'],
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
            'section_cd.required' => '部署を選択してください',
            'quote_no.max' => '12桁以内で入力してください',
            'quote_no.regex' => '半角数字で入力してください',
            'quote_date_to.after_or_equal' => '開始日 ≦ 終了日となるように入力してください',
            'quot_subject.max' => '50文字以内で入力してください',
            'product_name.max' => '50文字以内で入力してください',
            'status.required' => '有効な値を選択してください',
            'status.in' => '有効な値を選択してください',
            'page.min' => '1以上で入力してください',
            'per_page.in' => '10, 25, 50, 100のいずれかを指定してください',
            'sort_field.in' => 'ソートフィールドの値が不正です',
            'sort_order.in' => 'ソート順の値が不正です',
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
            'section_cd' => '部署コード',
            'quote_no' => '見積書No',
            'quote_date_from' => '見積日（開始）',
            'quote_date_to' => '見積日（終了）',
            'quot_subject' => '見積件名',
            'customer_id' => '得意先ID',
            'product_name' => '品名',
            'status' => 'ステータス',
            'page' => 'ページ番号',
            'per_page' => '表示件数',
            'sort_field' => 'ソートフィールド',
            'sort_order' => 'ソート順',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $sectionCd = $this->input('section_cd');

            // 基本バリデーションでエラーがある場合はスキップ
            if ($validator->errors()->has('section_cd')) {
                return;
            }

            // 'all' の場合は有効
            if ($sectionCd === 'all') {
                return;
            }

            // ユーザーが選択可能な部署コード一覧を取得
            $user = $this->user();
            if (! $user) {
                return;
            }

            $employee = $user->employee;
            if (! $employee) {
                return;
            }

            $result = $this->quotService->getSelectableSectionCds(
                $employee->employee_id,
                $user->access_type
            );

            // 選択肢に含まれているかチェック
            $validSectionCds = array_column($result['section_cds'], 'section_cd');
            if (! in_array($sectionCd, $validSectionCds, true)) {
                $validator->errors()->add('section_cd', '有効な値を選択してください');
            }
        });
    }
}
