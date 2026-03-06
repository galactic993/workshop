<?php

namespace App\Services;

use App\Enums\AccessType;
use App\Models\Customer;
use App\Models\DepartmentEmployee;
use App\Models\DepartmentSectionCd;
use App\Models\EmployeeSectionCd;
use App\Models\SectionCd;
use App\Models\VisibleDepartment;
use Illuminate\Support\Collection;

class QuotService
{
    /**
     * ユーザーがアクセス可能な部署コードIDの一覧を取得
     *
     * @param  int  $employeeId  社員ID
     * @param  string  $accessType  アクセス区分 (00:全て, 10:ディレクター, 20:所長, 30:リーダー, 40:一般)
     * @return array{section_cd_ids: array<int>|null, is_unlimited: bool, default_section_cd: string|null, is_section_cd_disabled: bool}
     */
    public function getAccessibleSectionCdIds(int $employeeId, string $accessType): array
    {
        $accessTypeEnum = AccessType::tryFrom($accessType);

        // アクセス区分00（全て）の場合は制限なし
        if ($accessTypeEnum?->hasUnlimitedAccess()) {
            return [
                'section_cd_ids' => null,  // null = 制限なし（全データ取得可能）
                'is_unlimited' => true,
                'default_section_cd' => null,
                'is_section_cd_disabled' => false,
            ];
        }

        // 参照可能組織を取得
        $visibleDepartments = VisibleDepartment::where('employee_id', $employeeId)
            ->with('department')
            ->get();

        // 所長（20）の場合
        if ($accessTypeEnum === AccessType::MANAGER) {
            return $this->getAccessibleSectionCdIdsForManager($employeeId, $visibleDepartments);
        }

        // 一般（40）、ディレクター（10）、リーダー（30）は同じ扱い
        return $this->getAccessibleSectionCdIdsForGeneral($employeeId, $visibleDepartments);
    }

    /**
     * 一般ユーザーがアクセス可能な部署コードIDを取得
     */
    private function getAccessibleSectionCdIdsForGeneral(int $employeeId, Collection $visibleDepartments): array
    {
        $sectionCdIds = [];
        $defaultSectionCd = null;

        // 参照可能組織がない場合は社員別部署コードから取得（入力欄は非活性）
        if ($visibleDepartments->isEmpty()) {
            // employee_section_cdテーブルから社員別部署コードを取得
            $employeeSectionCd = EmployeeSectionCd::where('employee_id', $employeeId)
                ->with('sectionCd')
                ->first();

            if ($employeeSectionCd && $employeeSectionCd->sectionCd) {
                $sectionCdIds[] = $employeeSectionCd->sectionCd->section_cd_id;
                $defaultSectionCd = $employeeSectionCd->sectionCd->section_cd;
            }

            return [
                'section_cd_ids' => $sectionCdIds,
                'is_unlimited' => false,
                'default_section_cd' => $defaultSectionCd,
                'is_section_cd_disabled' => true,  // 非活性
            ];
        }

        // 参照可能組織がある場合は、社員の所属組織から部署コードを取得
        $departmentEmployee = DepartmentEmployee::where('employee_id', $employeeId)
            ->with('department.departmentSectionCd.sectionCd')
            ->first();

        if ($departmentEmployee) {
            // 自身の部署コードを取得（組織別部署コードから）
            $ownSectionCd = $this->getOwnSectionCd($departmentEmployee);
            if ($ownSectionCd) {
                $sectionCdIds[] = $ownSectionCd->section_cd_id;
            }
        }

        // 参照可能組織（センター）配下の部署コードを追加
        foreach ($visibleDepartments as $visibleDepartment) {
            $centerSectionCdIds = $this->getCenterSubordinateSectionCdIds($visibleDepartment->department_id);
            $sectionCdIds = array_merge($sectionCdIds, $centerSectionCdIds);
        }

        return [
            'section_cd_ids' => array_unique($sectionCdIds),
            'is_unlimited' => false,
            'default_section_cd' => null,  // 活性で空欄
            'is_section_cd_disabled' => false,
        ];
    }

    /**
     * 所長がアクセス可能な部署コードIDを取得
     */
    private function getAccessibleSectionCdIdsForManager(int $employeeId, Collection $visibleDepartments): array
    {
        $sectionCdIds = [];

        // 社員の所属組織を取得
        $departmentEmployee = DepartmentEmployee::where('employee_id', $employeeId)
            ->with('department')
            ->first();

        if ($departmentEmployee) {
            // 所属組織がセンターかチームかを判定
            $department = $departmentEmployee->department;

            if ($department) {
                // 所属センターを特定（チームの場合はcenter_idを使用）
                $centerId = $department->is_center ? $department->department_id : $department->center_id;

                if ($centerId) {
                    // 所属センター配下の部署コードを取得
                    $centerSectionCdIds = $this->getCenterSubordinateSectionCdIds($centerId);
                    $sectionCdIds = array_merge($sectionCdIds, $centerSectionCdIds);
                }
            }
        }

        // 参照可能組織（センター）配下の部署コードを追加
        foreach ($visibleDepartments as $visibleDepartment) {
            $centerSectionCdIds = $this->getCenterSubordinateSectionCdIds($visibleDepartment->department_id);
            $sectionCdIds = array_merge($sectionCdIds, $centerSectionCdIds);
        }

        return [
            'section_cd_ids' => array_unique($sectionCdIds),
            'is_unlimited' => false,
            'default_section_cd' => null,
            'is_section_cd_disabled' => false,
        ];
    }

    /**
     * 社員自身の部署コードを取得
     */
    private function getOwnSectionCd(DepartmentEmployee $departmentEmployee): ?SectionCd
    {
        $department = $departmentEmployee->department;
        if (! $department) {
            return null;
        }

        $departmentSectionCd = $department->departmentSectionCd;
        if (! $departmentSectionCd) {
            return null;
        }

        return $departmentSectionCd->sectionCd;
    }

    /**
     * センター配下の部署コードIDを取得
     *
     * ロジック:
     * 1. センターの組織別部署コードの頭3桁を取得
     * 2. 頭3桁が一致する部署コードを取得
     * 3. 組織別部署コードに存在するものは除外（センター・チームの部署コードには見積データが紐づかない）
     */
    private function getCenterSubordinateSectionCdIds(int $centerId): array
    {
        // センターの組織別部署コードを取得
        $centerDepartmentSectionCd = DepartmentSectionCd::where('department_id', $centerId)
            ->with('sectionCd')
            ->first();

        if (! $centerDepartmentSectionCd || ! $centerDepartmentSectionCd->sectionCd) {
            return [];
        }

        // 部署コードの頭3桁を取得
        $prefix = substr($centerDepartmentSectionCd->sectionCd->section_cd, 0, 3);

        // 組織別部署コードに存在する部署コードIDを取得（除外用）
        $excludeSectionCdIds = DepartmentSectionCd::pluck('section_cd_id')->toArray();

        // 頭3桁が一致する部署コードを取得（組織別部署コードに存在するものは除外）
        $sectionCdIds = SectionCd::where('section_cd', 'like', $prefix.'%')
            ->whereNotIn('section_cd_id', $excludeSectionCdIds)
            ->pluck('section_cd_id')
            ->toArray();

        return $sectionCdIds;
    }

    /**
     * 選択可能な得意先IDを取得
     *
     * ロジック:
     * 1. ユーザーの参照可能な部署コードIDを取得
     * 2. 各部署コードの頭3桁からセンターを特定
     * 3. センターに紐づく部署別得意先（customer_section_cd）を取得
     * 4. 重複を除外して返却
     */
    public function getSelectableCustomerIds(int $employeeId, string $accessType): array
    {
        // アクセス可能な部署コードIDを取得
        $accessInfo = $this->getAccessibleSectionCdIds($employeeId, $accessType);

        // 全てアクセス可能な場合は全得意先を対象
        if ($accessInfo['is_unlimited']) {
            // customer_section_cdに登録されている全得意先を取得
            return \Illuminate\Support\Facades\DB::table('customer_section_cd')
                ->distinct()
                ->pluck('customer_id')
                ->toArray();
        }

        // アクセス可能な部署コードがない場合は空配列
        if (empty($accessInfo['section_cd_ids'])) {
            return [];
        }

        // 部署コードIDからセンターの部署コードIDを特定
        $centerSectionCdIds = $this->getCenterSectionCdIdsFromUserAccess($accessInfo['section_cd_ids']);

        if (empty($centerSectionCdIds)) {
            return [];
        }

        // センターの部署コードに紐づく得意先IDを取得（重複除外）
        return \Illuminate\Support\Facades\DB::table('customer_section_cd')
            ->whereIn('section_cd_id', $centerSectionCdIds)
            ->distinct()
            ->pluck('customer_id')
            ->toArray();
    }

    /**
     * 部署コードIDからセンターの部署コードIDを取得
     *
     * 部署コードの頭3桁が一致する部署コードのうち、
     * 組織マスタでセンターとして登録されている部署コードを特定
     */
    private function getCenterSectionCdIdsFromUserAccess(array $sectionCdIds): array
    {
        // 部署コードの頭3桁を取得
        $prefixes = SectionCd::whereIn('section_cd_id', $sectionCdIds)
            ->get(['section_cd'])
            ->map(fn ($s) => substr($s->section_cd, 0, 3))
            ->unique()
            ->values()
            ->toArray();

        if (empty($prefixes)) {
            return [];
        }

        // センターとして登録されている組織に紐づく部署コードIDを取得
        // departments.is_center = true の組織の department_section_cd.section_cd_id
        $centerSectionCdIds = \Illuminate\Support\Facades\DB::table('department_section_cd')
            ->join('departments', 'department_section_cd.department_id', '=', 'departments.department_id')
            ->join('section_cds', 'department_section_cd.section_cd_id', '=', 'section_cds.section_cd_id')
            ->where('departments.is_center', true)
            ->whereNull('departments.deleted_at')
            ->where('section_cds.deleted_flag', '0')
            ->where(function ($query) use ($prefixes) {
                foreach ($prefixes as $prefix) {
                    $query->orWhere('section_cds.section_cd', 'like', $prefix.'%');
                }
            })
            ->distinct()
            ->pluck('department_section_cd.section_cd_id')
            ->toArray();

        return $centerSectionCdIds;
    }

    /**
     * ユーザー所属センターに紐づく得意先IDを取得（新規登録モーダル用）
     *
     * ロジック:
     * 1. ログインユーザーの所属部署を取得
     * 2. 所属部署からセンターを特定（センター直属ならそのセンター、チームなら親センター）
     * 3. センターの組織別部署コード（department_section_cd）から部署コードを取得
     * 4. その部署コードに紐づく部署別得意先（customer_section_cd）を取得
     * ※アクセス権限に関わらず一律のロジック
     */
    public function getCustomerIdsByUserCenter(int $employeeId): array
    {
        // ユーザーの所属部署を取得
        $departmentEmployee = DepartmentEmployee::where('employee_id', $employeeId)
            ->with('department')
            ->first();

        if (! $departmentEmployee || ! $departmentEmployee->department) {
            return [];
        }

        $department = $departmentEmployee->department;

        // 所属センターを特定（チームの場合はcenter_idを使用）
        $centerId = $department->is_center ? $department->department_id : $department->center_id;

        if (! $centerId) {
            return [];
        }

        // センターの組織別部署コードを取得
        $centerDepartmentSectionCd = DepartmentSectionCd::where('department_id', $centerId)
            ->first();

        if (! $centerDepartmentSectionCd) {
            return [];
        }

        $centerSectionCdId = $centerDepartmentSectionCd->section_cd_id;

        // センターの部署コードに紐づく得意先IDを取得
        return \Illuminate\Support\Facades\DB::table('customer_section_cd')
            ->where('section_cd_id', $centerSectionCdId)
            ->distinct()
            ->pluck('customer_id')
            ->toArray();
    }

    /**
     * 選択可能な部署コード一覧を取得（プルダウン用）
     *
     * @param  int  $employeeId  社員ID
     * @param  string  $accessType  アクセス区分
     * @return array{section_cds: array<array{section_cd_id: int, section_cd: string, section_name: string}>, is_disabled: bool}
     */
    public function getSelectableSectionCds(int $employeeId, string $accessType): array
    {
        $accessTypeEnum = AccessType::tryFrom($accessType);

        // アクセス区分00（全て）の場合は全部署コード（センター/チームを除く）
        if ($accessTypeEnum?->hasUnlimitedAccess()) {
            // 組織別部署コードに存在する部署コードIDを取得（除外用）
            $excludeSectionCdIds = DepartmentSectionCd::pluck('section_cd_id')->toArray();

            $sectionCds = SectionCd::whereNotIn('section_cd_id', $excludeSectionCdIds)
                ->orderBy('section_cd')
                ->get(['section_cd_id', 'section_cd', 'section_name'])
                ->map(fn ($s) => [
                    'section_cd_id' => $s->section_cd_id,
                    'section_cd' => $s->section_cd,
                    'section_name' => $s->section_name,
                ])
                ->toArray();

            return [
                'section_cds' => $sectionCds,
                'is_disabled' => count($sectionCds) === 1,
            ];
        }

        // それ以外はアクセス可能な部署コードIDを取得
        $accessInfo = $this->getAccessibleSectionCdIds($employeeId, $accessType);

        if (empty($accessInfo['section_cd_ids'])) {
            return [
                'section_cds' => [],
                'is_disabled' => true,
            ];
        }

        $sectionCds = SectionCd::whereIn('section_cd_id', $accessInfo['section_cd_ids'])
            ->orderBy('section_cd')
            ->get(['section_cd_id', 'section_cd', 'section_name'])
            ->map(fn ($s) => [
                'section_cd_id' => $s->section_cd_id,
                'section_cd' => $s->section_cd,
                'section_name' => $s->section_name,
            ])
            ->toArray();

        return [
            'section_cds' => $sectionCds,
            'is_disabled' => count($sectionCds) === 1,
        ];
    }

    /**
     * 得意先サジェスト検索
     *
     * @param  array  $customerIds  検索対象の得意先ID配列
     * @param  string  $query  検索文字列（スペース区切りでAND検索）
     * @param  int  $limit  取得上限
     * @return Collection 得意先情報のコレクション
     */
    public function suggestCustomers(array $customerIds, string $query = '', int $limit = 20): Collection
    {
        if (empty($customerIds)) {
            return collect([]);
        }

        $customersQuery = Customer::query()
            ->whereIn('customer_id', $customerIds);

        // 検索クエリがある場合はフィルタリング
        if (! empty($query)) {
            // スペース（半角・全角）で分割して各単語でAND検索
            $keywords = preg_split('/[\s\x{3000}]+/u', trim($query));
            foreach ($keywords as $keyword) {
                if (! empty($keyword)) {
                    $customersQuery->where(function ($q) use ($keyword) {
                        $q->where('customer_cd', 'like', "%{$keyword}%")
                            ->orWhere('customer_name', 'like', "%{$keyword}%");
                    });
                }
            }
        }

        return $customersQuery
            ->orderBy('customer_cd')
            ->limit($limit)
            ->get(['customer_id', 'customer_cd', 'customer_name']);
    }

    /**
     * 得意先検索（ダイアログ用）
     *
     * @param  array  $customerIds  検索対象の得意先ID配列
     * @param  string|null  $customerCd  得意先コード（部分一致）
     * @param  string|null  $customerName  得意先名（部分一致）
     * @param  int  $limit  取得上限
     * @return Collection 得意先情報のコレクション
     */
    public function searchCustomers(array $customerIds, ?string $customerCd = null, ?string $customerName = null, int $limit = 100): Collection
    {
        if (empty($customerIds)) {
            return collect([]);
        }

        $customersQuery = Customer::query()
            ->whereIn('customer_id', $customerIds);

        // 得意先コード検索
        if (! empty($customerCd)) {
            $customersQuery->where('customer_cd', 'like', "%{$customerCd}%");
        }

        // 得意先名検索
        if (! empty($customerName)) {
            $customersQuery->where('customer_name', 'like', "%{$customerName}%");
        }

        return $customersQuery
            ->orderBy('customer_cd')
            ->limit($limit)
            ->get(['customer_id', 'customer_cd', 'customer_name']);
    }
}
