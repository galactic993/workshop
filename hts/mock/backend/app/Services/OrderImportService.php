<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\DepartmentEmployee;
use App\Models\DepartmentSectionCd;
use App\Models\EmployeeSectionCd;
use App\Models\Order;
use App\Models\OrderOperationAmount;
use App\Models\WorkNumberRelation;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;

class OrderImportService
{
    /**
     * デフォルト作業部門ID（編集）
     */
    private const DEFAULT_OPERATION_ID = 1;

    /**
     * Excelファイルからデータを読み取り、バリデーションを行う
     *
     * @param  string  $filePath  アップロードされたファイルのパス
     * @param  int  $employeeId  ログインユーザーの社員ID
     * @return array{success: bool, errors?: array<string>, data?: array}
     */
    public function validateExcelFile(string $filePath, int $employeeId): array
    {
        // Excelファイルを読み込み
        $spreadsheet = IOFactory::load($filePath);
        $worksheet = $spreadsheet->getActiveSheet();
        $rows = [];

        // 2行目以降のデータを読み込み
        $highestRow = $worksheet->getHighestRow();
        for ($rowNum = 2; $rowNum <= $highestRow; $rowNum++) {
            $purchaseOrderNumber = trim((string) $worksheet->getCell("A{$rowNum}")->getValue());
            $customerCode = trim((string) $worksheet->getCell("B{$rowNum}")->getValue());
            $shortProdName = trim((string) $worksheet->getCell("C{$rowNum}")->getValue());
            $orderOnRaw = $worksheet->getCell("D{$rowNum}")->getValue();

            // 空行はスキップ（全カラムが空の場合）
            if ($purchaseOrderNumber === '' && $customerCode === '' && $shortProdName === '' && ($orderOnRaw === null || $orderOnRaw === '')) {
                continue;
            }

            $rows[] = [
                'row_number' => $rowNum,
                'purchase_order_number' => $purchaseOrderNumber,
                'customer_code' => $customerCode,
                'short_prod_name' => $shortProdName,
                'order_on_raw' => $orderOnRaw,
            ];
        }

        return $this->validateRows($rows, $employeeId);
    }

    /**
     * 行データのバリデーション
     *
     * @param  array  $rows  読み取った行データ
     * @param  int  $employeeId  ログインユーザーの社員ID
     * @return array{success: bool, errors?: array<string>, data?: array}
     */
    private function validateRows(array $rows, int $employeeId): array
    {
        $errors = [];
        $rowCount = count($rows);

        // チェック1: 件数が30件より多い
        if ($rowCount > 30) {
            $errors[] = "受注情報リストの件数が多すぎます。\n※30件まで工番の採番・発行をすることができます。";
        }

        // チェック2: 件数が1件のみ
        if ($rowCount === 1) {
            $errors[] = "1件だけの工番の採番・発行をすることはできません。\n受注登録を行い、工番の発行をしてください。";
        }

        // チェック3: 得意先コードが複数存在（全行同一でない）
        $customerCodes = array_unique(array_column($rows, 'customer_code'));
        if (count($customerCodes) > 1) {
            $errors[] = '複数の得意先を指定することはできません。';
        }

        // 得意先関連のチェック（得意先コードが1種類の場合のみ）
        if (count($customerCodes) === 1) {
            $customerCode = $customerCodes[0];

            // チェック4: 得意先コードが得意先マスタに存在しない
            $customer = Customer::where('customer_cd', $customerCode)->first();
            if (! $customer) {
                $errors[] = 'リストの得意先コードは得意先マスタに登録されていません。';
            } else {
                // チェック5: 得意先コードがログインユーザーのセンターの部署別得意先に登録されていない
                if (! $this->isCustomerInUserCenter($customer->customer_id, $employeeId)) {
                    $errors[] = 'リストの得意先コードは部署別得意先に登録されていません。';
                }
            }
        }

        // 行ごとのバリデーション
        $parsedRows = [];
        foreach ($rows as $row) {
            $rowNumber = $row['row_number'];

            // チェック6: 発注書番号が20桁超
            if (mb_strlen($row['purchase_order_number']) > 20) {
                $errors[] = "発注書番号は20桁以内で入力してください({$rowNumber}行目)";
            }

            // チェック7: 品名が空
            if ($row['short_prod_name'] === '') {
                $errors[] = "品名は必須です({$rowNumber}行目)";
            }
            // チェック8: 品名が50桁超
            elseif (mb_strlen($row['short_prod_name']) > 50) {
                $errors[] = "品名は50桁以内で入力してください({$rowNumber}行目)";
            }

            // チェック9: 受注日が空
            if ($row['order_on_raw'] === null || $row['order_on_raw'] === '') {
                $errors[] = "受注日は必須です({$rowNumber}行目)";
            } else {
                // チェック10: 受注日が不正な日付
                $orderOn = $this->parseDate($row['order_on_raw']);
                if ($orderOn === null) {
                    $errors[] = "有効な日付を入力してください({$rowNumber}行目)";
                } else {
                    $row['order_on'] = $orderOn;
                }
            }

            $parsedRows[] = $row;
        }

        // エラーがある場合
        if (! empty($errors)) {
            return [
                'success' => false,
                'errors' => $errors,
            ];
        }

        // エラーがない場合は成功レスポンス
        $customerCode = $customerCodes[0] ?? '';

        return [
            'success' => true,
            'data' => [
                'row_count' => $rowCount,
                'customer_code' => $customerCode,
                'rows' => array_map(function ($row) {
                    return [
                        'purchase_order_number' => $row['purchase_order_number'],
                        'customer_code' => $row['customer_code'],
                        'short_prod_name' => $row['short_prod_name'],
                        'order_on' => $row['order_on'] ?? null,
                    ];
                }, $parsedRows),
            ],
        ];
    }

    /**
     * 得意先がユーザーのセンターの部署別得意先に登録されているかチェック
     *
     * @param  int  $customerId  得意先ID
     * @param  int  $employeeId  社員ID
     */
    private function isCustomerInUserCenter(int $customerId, int $employeeId): bool
    {
        // ユーザーの所属部署を取得
        $departmentEmployee = DepartmentEmployee::where('employee_id', $employeeId)
            ->with('department')
            ->first();

        if (! $departmentEmployee || ! $departmentEmployee->department) {
            return false;
        }

        $department = $departmentEmployee->department;

        // 所属センターを特定（チームの場合はcenter_idを使用）
        $centerId = $department->is_center ? $department->department_id : $department->center_id;

        if (! $centerId) {
            return false;
        }

        // センターの組織別部署コードを取得
        $centerDepartmentSectionCd = DepartmentSectionCd::where('department_id', $centerId)->first();

        if (! $centerDepartmentSectionCd) {
            return false;
        }

        $centerSectionCdId = $centerDepartmentSectionCd->section_cd_id;

        // センターの部署コードに紐づく得意先かチェック
        return DB::table('customer_section_cd')
            ->where('section_cd_id', $centerSectionCdId)
            ->where('customer_id', $customerId)
            ->exists();
    }

    /**
     * 日付をパースする
     *
     * @param  mixed  $value  日付の値（Excelシリアル値または文字列）
     * @return string|null Y-m-d形式の日付文字列、パース失敗時はnull
     */
    private function parseDate(mixed $value): ?string
    {
        // 数値（Excelシリアル値）の場合
        if (is_numeric($value)) {
            try {
                $dateTime = ExcelDate::excelToDateTimeObject($value);

                return $dateTime->format('Y-m-d');
            } catch (\Exception $e) {
                return null;
            }
        }

        // 文字列の場合
        $value = trim((string) $value);
        if ($value === '') {
            return null;
        }

        // "2019/9/29" のような形式をパース
        if (preg_match('/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/', $value, $matches)) {
            $year = (int) $matches[1];
            $month = (int) $matches[2];
            $day = (int) $matches[3];

            // 日付の妥当性チェック
            if (! checkdate($month, $day, $year)) {
                return null;
            }

            return sprintf('%04d-%02d-%02d', $year, $month, $day);
        }

        // "2019-9-29" のような形式もサポート
        if (preg_match('/^(\d{4})-(\d{1,2})-(\d{1,2})$/', $value, $matches)) {
            $year = (int) $matches[1];
            $month = (int) $matches[2];
            $day = (int) $matches[3];

            // 日付の妥当性チェック
            if (! checkdate($month, $day, $year)) {
                return null;
            }

            return sprintf('%04d-%02d-%02d', $year, $month, $day);
        }

        return null;
    }

    /**
     * 受注情報を登録する
     *
     * @param  array  $validatedData  バリデーション済みデータ
     * @param  int  $employeeId  ログインユーザーの社員ID
     * @return array{success: bool, errors?: array<string>, data?: array}
     */
    public function registerOrders(array $validatedData, int $employeeId): array
    {
        // ユーザーの部署コードIDを取得
        $employeeSectionCd = EmployeeSectionCd::where('employee_id', $employeeId)->first();

        if (! $employeeSectionCd) {
            return [
                'success' => false,
                'errors' => ['社員の部署情報が見つかりません。'],
            ];
        }

        $sectionCdId = $employeeSectionCd->section_cd_id;

        // 得意先IDを取得
        $customerCode = $validatedData['customer_code'];
        $customer = Customer::where('customer_cd', $customerCode)->first();

        if (! $customer) {
            return [
                'success' => false,
                'errors' => ['得意先が見つかりません。'],
            ];
        }

        $customerId = $customer->customer_id;

        // 取込日の西暦下2桁を取得
        $orderCdYear = date('y');

        $rows = $validatedData['rows'];
        $rowCount = count($rows);

        DB::beginTransaction();
        try {
            // 工番採番のためにテーブルロックを取得（他トランザクションとの競合を防止）
            DB::statement('LOCK TABLE orders IN SHARE ROW EXCLUSIVE MODE');

            // 同一年号の最大工番を取得
            $maxOrderCd = $this->getNextOrderCd($orderCdYear);

            $createdOrders = [];
            $startOrderCd = $maxOrderCd;

            foreach ($rows as $index => $row) {
                // 工番（通番）を計算
                $orderCd = str_pad((string) ($maxOrderCd + $index), 5, '0', STR_PAD_LEFT);

                // 受注レコードを作成
                $order = Order::create([
                    'order_cd_year' => $orderCdYear,
                    'order_cd' => $orderCd,
                    'quot_id' => null,
                    'section_cd_id' => $sectionCdId,
                    'customer_id' => $customerId,
                    'customer_name' => null,
                    'employee_id' => $employeeId,
                    'prod_name' => $row['short_prod_name'],
                    'official_prod_name' => $row['short_prod_name'],
                    'prod_cd' => null,
                    'size' => null,
                    'quantity' => 1,
                    'order_on' => $row['order_on'],
                    'bc_delivery_on' => null,
                    'delivery_on' => null,
                    'completion_on' => null,
                    'orders_category' => Order::ORDERS_CATEGORY_NORMAL,
                    'sales_category' => Order::SALES_CATEGORY_NORMAL,
                    'sales_status' => Order::SALES_STATUS_NONE,
                    'purchase_order_number' => $row['purchase_order_number'] ?: null,
                    'is_approved' => false,
                    'approved_by' => null,
                    'approved_at' => null,
                    'short_prod_name' => $row['short_prod_name'],
                    'first_proof_on' => null,
                    'second_proof_on' => null,
                    'third_proof_on' => null,
                    'manuscript_pages' => null,
                    'drawing_count' => null,
                    'provided_photos_count' => null,
                    'is_work_category1' => false,
                    'is_work_category2' => false,
                    'is_work_category3' => false,
                    'is_work_category4' => false,
                    'is_work_category5' => false,
                    'is_work_category6' => false,
                    'is_personal_data' => false,
                    'is_confidential_data' => false,
                    'is_retention_required' => false,
                    'center_section_cd_id' => null,
                    'person_in_charge_id' => null,
                    'communication_note' => null,
                    'sales_completion_on' => null,
                    'order_status' => Order::ORDER_STATUS_ISSUED,
                ]);

                $createdOrders[] = $order;

                // 作業部門別受注金額レコードを作成
                OrderOperationAmount::create([
                    'order_id' => $order->order_id,
                    'operation_id' => self::DEFAULT_OPERATION_ID,
                    'cost' => 0,
                    'order_amount' => 0,
                    'first_cost' => 0,
                    'first_order_amount' => 0,
                ]);
            }

            // 工番関連テーブルに登録（1件目を代表工番、2件目以降を関連工番）
            if (count($createdOrders) >= 2) {
                $parentOrderId = $createdOrders[0]->order_id;

                for ($i = 1; $i < count($createdOrders); $i++) {
                    WorkNumberRelation::create([
                        'parent_order_id' => $parentOrderId,
                        'related_order_id' => $createdOrders[$i]->order_id,
                    ]);
                }
            }

            DB::commit();

            // 採番開始工番をフォーマット
            $firstOrderCd = $orderCdYear.'-'.str_pad((string) $startOrderCd, 5, '0', STR_PAD_LEFT);

            return [
                'success' => true,
                'data' => [
                    'first_order_cd' => $firstOrderCd,
                    'row_count' => $rowCount,
                ],
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * 次の工番を取得する
     *
     * 注意: このメソッドを呼び出す前に、トランザクション内で
     * LOCK TABLE orders IN SHARE ROW EXCLUSIVE MODE を実行すること
     *
     * @param  string  $orderCdYear  年号（2桁）
     * @return int 採番開始番号
     */
    private function getNextOrderCd(string $orderCdYear): int
    {
        // 同一年号の最大工番を取得
        $result = DB::table('orders')
            ->where('order_cd_year', $orderCdYear)
            ->selectRaw('MAX(CAST(order_cd AS INTEGER)) as max_cd')
            ->first();

        $maxCd = $result->max_cd ?? 0;

        return $maxCd + 1;
    }
}
