<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CenterController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\DebugController;
use App\Http\Controllers\Api\OrderImportController;
use App\Http\Controllers\Api\Quot\QuotCreateController;
use App\Http\Controllers\Api\Quot\QuotCustomerController;
use App\Http\Controllers\Api\Quot\QuotIssueController;
use App\Http\Controllers\Api\Quot\QuotListController;
use App\Http\Controllers\Api\Quot\QuotWorkflowController;
use App\Http\Controllers\Api\Sales\CustomerReportController;
use App\Http\Controllers\Api\Sales\SectionReportController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// 認証不要のルート
Route::post('/login', [AuthController::class, 'login'])
    ->middleware(['throttle:login', 'throttle:login-account']);
Route::get('/auth/check', [AuthController::class, 'check']);
Route::post('/logout', [AuthController::class, 'logout']);

// 認証必要のルート
Route::middleware('authenticated')->group(function () {
    Route::get('/centers', [CenterController::class, 'index']);
    Route::get('/centers/all', [CenterController::class, 'all']);
    Route::get('/centers/quot', [CenterController::class, 'quot']);
    Route::get('/customers/suggest', [CustomerController::class, 'suggest']);
    Route::get('/customers/section-customers', [CustomerController::class, 'sectionCustomers']);
    Route::post('/customers/section-customers', [CustomerController::class, 'addSectionCustomer']);
    Route::delete('/customers/section-customers', [CustomerController::class, 'deleteSectionCustomer']);

    // 受注取込API
    Route::post('/orders/import', [OrderImportController::class, 'import']);
});

// 見積API（認証＋見積権限）
Route::middleware(['authenticated', 'quot.permission'])->group(function () {
    // 一覧・詳細（QuotListController）
    Route::get('/quotes', [QuotListController::class, 'index']);
    Route::get('/quotes/access-info', [QuotListController::class, 'accessInfo']);
    Route::get('/quotes/section-cds', [QuotListController::class, 'getSectionCds']);
    Route::get('/quotes/suggest', [QuotListController::class, 'suggest']);
    Route::get('/quotes/{quotId}', [QuotListController::class, 'show']);

    // 得意先検索（QuotCustomerController）
    Route::get('/quotes/customers/suggest', [QuotCustomerController::class, 'suggest']);
    Route::get('/quotes/customers/search', [QuotCustomerController::class, 'search']);
    Route::get('/quotes/customers/suggest-for-create', [QuotCustomerController::class, 'suggestForCreate']);
    Route::get('/quotes/customers/search-for-create', [QuotCustomerController::class, 'searchForCreate']);

    // センターの所長一覧取得（QuotWorkflowController）
    Route::get('/quotes/center-managers/{centerId}', [QuotWorkflowController::class, 'getCenterManagers']);

    // 作成・更新・削除（QuotCreateController）
    Route::post('/quotes', [QuotCreateController::class, 'store']);
    Route::put('/quotes/{quotId}', [QuotCreateController::class, 'update']);
    Route::delete('/quotes/{quotId}', [QuotCreateController::class, 'destroy']);

    // ワークフロー（QuotWorkflowController）
    Route::post('/quotes/{quotId}/approve', [QuotWorkflowController::class, 'approve']);
    Route::post('/quotes/{quotId}/cancel-approve', [QuotWorkflowController::class, 'cancelApprove']);
    Route::post('/quotes/{quotId}/request-production', [QuotWorkflowController::class, 'requestProduction']);
    Route::post('/quotes/{quotId}/reject', [QuotWorkflowController::class, 'reject']);
    Route::post('/quotes/{quotId}/receive-prod-quot', [QuotWorkflowController::class, 'receiveProdQuot']);
    Route::post('/quotes/{quotId}/register-draft', [QuotWorkflowController::class, 'registerDraft']);
    Route::post('/quotes/{quotId}/register', [QuotWorkflowController::class, 'register']);
    Route::post('/quotes/{quotId}/cancel-register', [QuotWorkflowController::class, 'cancelRegister']);
    Route::post('/quotes/{quotId}/update-amounts', [QuotWorkflowController::class, 'updateAmounts']);

    // 発行（QuotIssueController）
    Route::post('/quotes/{quotId}/issue', [QuotIssueController::class, 'issue']);
    Route::post('/quotes/{quotId}/reissue', [QuotIssueController::class, 'reissue']);
    Route::post('/quotes/{quotId}/update-status60', [QuotIssueController::class, 'updateStatus60']);
});

// 受注週報（部署別）API（認証＋権限チェック）
Route::middleware(['authenticated', 'section-report.permission'])->group(function () {
    Route::post('/sales/orders/section-report/aggregate', [SectionReportController::class, 'aggregate']);
    Route::post('/sales/orders/section-report/export', [SectionReportController::class, 'export']);
});

// 受注週報（得意先別）API（認証＋権限チェック）
Route::middleware(['authenticated', 'customer-report.permission'])->group(function () {
    Route::post('/sales/orders/customer-report/export', [CustomerReportController::class, 'export']);
});

// デバッグ用ルート（開発環境のみ）
if (app()->environment('local', 'development')) {
    Route::get('/debug/tables', [DebugController::class, 'tables']);
    Route::get('/debug/records', [DebugController::class, 'records']);
}
