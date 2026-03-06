<?php

namespace App\Http\Controllers\Api\Quot;

use App\Http\Controllers\Controller;
use App\Services\QuotService;
use App\Traits\AuthenticatesQuotRequests;
use App\Traits\ChecksQuotAccess;

abstract class BaseQuotController extends Controller
{
    use AuthenticatesQuotRequests;
    use ChecksQuotAccess;

    protected QuotService $quotService;

    public function __construct(QuotService $quotService)
    {
        $this->quotService = $quotService;
    }

    /**
     * QuotServiceを取得（ChecksQuotAccessトレイトで使用）
     */
    protected function getQuotService(): QuotService
    {
        return $this->quotService;
    }
}
