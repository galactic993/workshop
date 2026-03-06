<?php

namespace App\Http\Requests;

use App\Http\Requests\Traits\SectionReportValidationRules;
use Illuminate\Foundation\Http\FormRequest;

class SectionReportAggregateRequest extends FormRequest
{
    use SectionReportValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
}
