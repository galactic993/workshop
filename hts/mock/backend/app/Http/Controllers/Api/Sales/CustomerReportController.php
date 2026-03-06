<?php

namespace App\Http\Controllers\Api\Sales;

use App\Http\Controllers\Controller;
use App\Http\Requests\CustomerReportExportRequest;
use App\Services\PdfGeneratorService;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CustomerReportController extends Controller
{
    private PdfGeneratorService $pdfGeneratorService;

    public function __construct(PdfGeneratorService $pdfGeneratorService)
    {
        $this->pdfGeneratorService = $pdfGeneratorService;
    }

    /**
     * 受注週報（得意先別）PDF出力API
     *
     * 空のPDFを生成して返す（将来実装で内容を追加）
     */
    public function export(CustomerReportExportRequest $request): StreamedResponse
    {
        // TODO: 将来実装予定
        // リクエストパラメータを取得（将来の実装で使用）
        // $cumulativePeriodFrom = $request->input('cumulative_period_from');
        // $cumulativePeriodTo = $request->input('cumulative_period_to');
        // $businessDays = $request->input('business_days');
        // $workingDays = $request->input('working_days');
        // $includeAggregated = $request->boolean('include_aggregated', false);

        $pdfContent = $this->pdfGeneratorService->generatePlaceholderPdf('受注週報（得意先別）');
        $fileName = '受注週報_得意先別.pdf';

        return response()->streamDownload(
            function () use ($pdfContent) {
                echo $pdfContent;
            },
            $fileName,
            [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="'.$fileName.'"',
            ]
        );
    }
}
