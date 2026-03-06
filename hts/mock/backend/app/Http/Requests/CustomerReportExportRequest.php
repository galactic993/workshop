<?php

namespace App\Http\Requests;

use App\Http\Requests\Traits\CustomerReportValidationRules;
use Illuminate\Foundation\Http\FormRequest;

class CustomerReportExportRequest extends FormRequest
{
    use CustomerReportValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
}
