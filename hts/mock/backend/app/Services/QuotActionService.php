<?php

namespace App\Services;

use App\Enums\AccessType;
use App\Mail\ProdQuotRequestMail;
use App\Models\DepartmentSectionCd;
use App\Models\Employee;
use App\Models\ProdQuot;
use App\Models\ProdQuotReturnLog;
use App\Models\Quot;
use App\Models\QuotIssueLog;
use App\Models\QuotOperation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class QuotActionService
{
    /**
     * 見積を承認する
     *
     * @throws \InvalidArgumentException ステータスが承認待ちでない場合
     */
    public function approve(Quot $quot, int $employeeId): void
    {
        if ($quot->quot_status !== Quot::STATUS_PENDING_APPROVAL) {
            throw new \InvalidArgumentException('承認待ちの見積のみ承認できます');
        }

        $quot->quot_status = Quot::STATUS_APPROVED;
        $quot->approved_by = $employeeId;
        $quot->approved_at = now();
        $quot->save();
    }

    /**
     * 見積の承認を取り消す
     *
     * @throws \InvalidArgumentException ステータスが承認済でない場合
     */
    public function cancelApproval(Quot $quot): void
    {
        if ($quot->quot_status !== Quot::STATUS_APPROVED) {
            throw new \InvalidArgumentException('承認済の見積のみ取消できます');
        }

        $quot->quot_status = Quot::STATUS_PENDING_APPROVAL;
        $quot->approved_by = null;
        $quot->approved_at = null;
        $quot->save();
    }

    /**
     * 制作見積依頼を行う
     *
     * @throws \InvalidArgumentException ステータスが作成中・制作見積依頼前でない場合
     */
    public function requestProduction(Quot $quot): ProdQuot
    {
        if ($quot->quot_status !== Quot::STATUS_DRAFT || $quot->prod_quot_status !== Quot::PROD_STATUS_BEFORE_REQUEST) {
            throw new \InvalidArgumentException('作成中・制作見積依頼前の見積のみ制作見積依頼できます');
        }

        $prodQuot = DB::transaction(function () use ($quot) {
            $quot->prod_quot_status = Quot::PROD_STATUS_REQUESTED;
            $quot->save();

            return ProdQuot::create([
                'quot_id' => $quot->quot_id,
                'cost' => 0,
                'prod_quot_status' => ProdQuot::STATUS_NOT_STARTED,
                'version' => 1,
            ]);
        });

        // メール送信処理
        $this->sendProdQuotRequestMail($quot);

        return $prodQuot;
    }

    /**
     * 制作見積依頼メールを送信する
     */
    private function sendProdQuotRequestMail(Quot $quot): void
    {
        // メール用に関連データをロード
        $quot->load(['sectionCd', 'customer']);

        // 主管センターから組織IDを取得
        if (! $quot->center_section_cd_id) {
            return;
        }

        $departmentSectionCd = DepartmentSectionCd::where('section_cd_id', $quot->center_section_cd_id)->first();
        if (! $departmentSectionCd) {
            return;
        }

        // 組織に所属する所長（アクセス区分20）を取得
        $managers = Employee::whereHas('departmentEmployee', function ($query) use ($departmentSectionCd) {
            $query->where('department_id', $departmentSectionCd->department_id);
        })
            ->where('access_type', AccessType::MANAGER->value)
            ->whereNotNull('email')
            ->get();

        // 所長にメールを送信
        foreach ($managers as $manager) {
            Mail::to($manager->email)->send(new ProdQuotRequestMail($quot));
        }
    }

    /**
     * 見積を差し戻す
     *
     * @throws \InvalidArgumentException ステータスが承認待ちまたは承認済でない場合
     * @throws \RuntimeException 制作見積が見つからない場合
     */
    public function reject(Quot $quot, string $reason): void
    {
        // 承認待ち(10)または承認済(20)のみ差し戻し可能
        if ($quot->quot_status !== Quot::STATUS_PENDING_APPROVAL && $quot->quot_status !== Quot::STATUS_APPROVED) {
            throw new \InvalidArgumentException('承認待ちまたは承認済の見積のみ差戻しできます');
        }

        $prodQuot = ProdQuot::where('quot_id', $quot->quot_id)->first();

        if (! $prodQuot) {
            throw new \RuntimeException('制作見積が見つかりません');
        }

        DB::transaction(function () use ($quot, $prodQuot, $reason) {
            $previousVersion = $prodQuot->version;
            $nextVersion = $previousVersion + 1;

            // 見積ステータスは変更しない（承認待ちまたは承認済のまま）
            // 制作見積ステータスを制作見積依頼済に変更
            $quot->prod_quot_status = Quot::PROD_STATUS_REQUESTED;
            $quot->save();

            $prodQuot->prod_quot_status = ProdQuot::STATUS_REJECTED;
            $prodQuot->version = $nextVersion;
            $prodQuot->save();

            ProdQuotReturnLog::create([
                'prod_quot_id' => $prodQuot->prod_quot_id,
                'previous_version' => $previousVersion,
                'next_version' => $nextVersion,
                'remand_reason' => $reason,
            ]);
        });
    }

    /**
     * 制作見積を受け取る
     *
     * @throws \InvalidArgumentException ステータスが制作見積済でない場合
     */
    public function receiveProdQuot(Quot $quot): void
    {
        if ($quot->prod_quot_status !== Quot::PROD_STATUS_COMPLETED) {
            throw new \InvalidArgumentException('制作見積済の見積のみ受け取れます');
        }

        $quot->prod_quot_status = Quot::PROD_STATUS_RECEIVED;
        $quot->save();
    }

    /**
     * 見積を登録する（作成中から承認待ちへ）
     *
     * 作業部門別見積レコードが存在する場合のみ登録可能
     * ステータスを承認待ち（10）に変更し、見積金額を合計金額で更新
     *
     * @throws \InvalidArgumentException ステータスが作成中でない場合、または作業部門別見積が存在しない場合
     */
    public function registerDraft(Quot $quot): void
    {
        if ($quot->quot_status !== Quot::STATUS_DRAFT) {
            throw new \InvalidArgumentException('作成中の見積のみ登録できます');
        }

        // 作業部門別見積レコードが存在するか確認
        $operations = QuotOperation::where('quot_id', $quot->quot_id)->get();

        if ($operations->isEmpty()) {
            throw new \InvalidArgumentException('作業部門別見積レコードが存在しません');
        }

        DB::transaction(function () use ($quot, $operations) {
            // 見積金額の合計を計算
            $totalAmount = $operations->sum('quot_amount');

            // ステータスを承認待ちに変更
            $quot->quot_status = Quot::STATUS_PENDING_APPROVAL;
            $quot->quot_amount = $totalAmount;
            $quot->save();
        });
    }

    /**
     * 見積を登録する（制作見積受取後、承認待ちへ）
     *
     * @param  array  $amounts  [['prod_quot_operation_id' => int, 'quot_amount' => int], ...]
     *
     * @throws \InvalidArgumentException ステータスが制作見積済でない場合
     * @throws \RuntimeException 制作見積が見つかりません場合、または作業部門別制作見積が見つからない場合
     */
    public function register(Quot $quot, array $amounts): void
    {
        if ($quot->prod_quot_status !== Quot::PROD_STATUS_COMPLETED) {
            throw new \InvalidArgumentException('制作見積済の見積のみ登録できます');
        }

        $prodQuot = ProdQuot::where('quot_id', $quot->quot_id)->first();

        if (! $prodQuot) {
            throw new \RuntimeException('制作見積が見つかりません');
        }

        DB::transaction(function () use ($quot, $amounts) {
            $totalAmount = 0;

            foreach ($amounts as $amountData) {
                $operationId = $amountData['operation_id'];
                $quotAmount = $amountData['quot_amount'];
                $cost = $amountData['cost'] ?? 0;

                QuotOperation::create([
                    'quot_id' => $quot->quot_id,
                    'operation_id' => $operationId,
                    'cost' => $cost,
                    'quot_amount' => $quotAmount,
                ]);

                $totalAmount += $quotAmount;
            }

            $quot->quot_status = Quot::STATUS_PENDING_APPROVAL;
            $quot->prod_quot_status = Quot::PROD_STATUS_RECEIVED;
            $quot->quot_amount = $totalAmount;
            $quot->save();
        });
    }

    /**
     * 見積登録を取り消す（承認待ちから制作見積済へ）
     *
     * @throws \InvalidArgumentException ステータスが承認待ちでない場合
     */
    public function cancelRegister(Quot $quot): void
    {
        if ($quot->quot_status !== Quot::STATUS_PENDING_APPROVAL) {
            throw new \InvalidArgumentException('承認待ちの見積のみ登録取消できます');
        }

        DB::transaction(function () use ($quot) {
            QuotOperation::where('quot_id', $quot->quot_id)->delete();

            $quot->quot_status = Quot::STATUS_DRAFT;
            $quot->prod_quot_status = Quot::PROD_STATUS_COMPLETED;
            $quot->quot_amount = null;
            $quot->save();
        });
    }

    /**
     * 見積金額を更新する（ステータス40）
     *
     * @param  array  $amounts  [['prod_quot_operation_id' => int, 'quot_amount' => int], ...]
     *
     * @throws \InvalidArgumentException ステータスが承認待ちでない場合
     */
    public function updateAmounts(Quot $quot, array $amounts): void
    {
        if ($quot->quot_status !== Quot::STATUS_PENDING_APPROVAL) {
            throw new \InvalidArgumentException('承認待ちの見積のみ更新できます');
        }

        DB::transaction(function () use ($quot, $amounts) {
            $totalAmount = 0;

            foreach ($amounts as $amountData) {
                $operationId = $amountData['operation_id'];
                $quotAmount = $amountData['quot_amount'];

                QuotOperation::where('quot_id', $quot->quot_id)
                    ->where('operation_id', $operationId)
                    ->update(['quot_amount' => $quotAmount]);

                $totalAmount += $quotAmount;
            }

            $quot->quot_amount = $totalAmount;
            $quot->save();
        });
    }

    /**
     * 見積書を発行する（Excel形式）
     *
     * @return string 生成されたファイルパス
     *
     * @throws \InvalidArgumentException ステータスが承認済でない場合
     */
    public function issue(Quot $quot, int $employeeId): string
    {
        if ($quot->quot_status !== Quot::STATUS_APPROVED) {
            throw new \InvalidArgumentException('承認済の見積のみ発行できます');
        }

        $now = now();
        $currentDate = $now->format('Y-m-d');
        $currentDateTime = $now->format('YmdHis');

        $fileName = $quot->quot_number.'_'.$currentDateTime.'.xlsx';
        $tempFilePath = sys_get_temp_dir().'/'.$fileName;

        $this->createEmptyExcel($tempFilePath);

        DB::transaction(function () use ($quot, $employeeId, $now, $currentDate, $fileName) {
            $quot->quot_status = Quot::STATUS_ISSUED;
            $quot->quot_on = $currentDate;
            $quot->save();

            QuotIssueLog::create([
                'quot_id' => $quot->quot_id,
                'issued_at' => $now,
                'issued_by' => $employeeId,
                'file_name' => $fileName,
            ]);
        });

        return $tempFilePath;
    }

    /**
     * 見積書を再発行する
     *
     * @return string 生成されたファイルパス
     *
     * @throws \InvalidArgumentException ステータスが発行済でない場合
     */
    public function reissue(Quot $quot, int $employeeId): string
    {
        if ($quot->quot_status !== Quot::STATUS_ISSUED) {
            throw new \InvalidArgumentException('発行済の見積のみ再発行できます');
        }

        $now = now();
        $currentDateTime = $now->format('YmdHis');

        $fileName = $quot->quot_number.'_'.$currentDateTime.'.xlsx';
        $tempFilePath = sys_get_temp_dir().'/'.$fileName;

        $this->createEmptyExcel($tempFilePath);

        DB::transaction(function () use ($quot, $employeeId, $now, $fileName) {
            QuotIssueLog::create([
                'quot_id' => $quot->quot_id,
                'issued_at' => $now,
                'issued_by' => $employeeId,
                'file_name' => $fileName,
            ]);
        });

        return $tempFilePath;
    }

    /**
     * 空のExcelファイルを作成
     */
    private function createEmptyExcel(string $filePath): void
    {
        $zip = new \ZipArchive;
        if ($zip->open($filePath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) === true) {
            $contentTypes = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
    <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
    <Default Extension="xml" ContentType="application/xml"/>
    <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
    <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>';
            $zip->addFromString('[Content_Types].xml', $contentTypes);

            $rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>';
            $zip->addFromString('_rels/.rels', $rels);

            $workbookRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>';
            $zip->addFromString('xl/_rels/workbook.xml.rels', $workbookRels);

            $workbook = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
    <sheets>
        <sheet name="Sheet1" sheetId="1" r:id="rId1"/>
    </sheets>
</workbook>';
            $zip->addFromString('xl/workbook.xml', $workbook);

            $sheet = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
    <sheetData/>
</worksheet>';
            $zip->addFromString('xl/worksheets/sheet1.xml', $sheet);

            $zip->close();
        }
    }
}
