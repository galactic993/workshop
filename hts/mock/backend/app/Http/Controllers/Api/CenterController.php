<?php

namespace App\Http\Controllers\Api;

use App\Enums\AccessType;
use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\DepartmentEmployee;
use App\Models\VisibleDepartment;
use Illuminate\Http\JsonResponse;

class CenterController extends Controller
{
    /**
     * ユーザーがアクセス可能なセンター一覧を取得
     *
     * アクセス区分00: 全センター
     * それ以外: 所属組織のセンター + 参照可能組織のうちセンターのもの
     */
    public function index(): JsonResponse
    {
        $employeeId = session('employee_id');
        $accessType = AccessType::tryFrom(session('access_type', ''));

        $centers = collect();

        // アクセス区分00（全て）の場合は全センターを取得
        if ($accessType?->hasUnlimitedAccess()) {
            $centers = Department::where('is_center', true)
                ->orderBy('department_id')
                ->get(['department_id', 'department_name']);
        } else {
            // 所属組織からセンターを取得
            $departmentEmployee = DepartmentEmployee::with(['department.center'])
                ->where('employee_id', $employeeId)
                ->first();

            if ($departmentEmployee && $departmentEmployee->department) {
                $department = $departmentEmployee->department;

                if ($department->is_center) {
                    // センターに直接所属
                    $centers->push($department);
                } elseif ($department->center) {
                    // チームに所属 → 親センターを取得
                    $centers->push($department->center);
                }
            }

            // 参照可能組織からセンターを取得（センターのみ）
            $visibleDepartments = VisibleDepartment::with(['department'])
                ->where('employee_id', $employeeId)
                ->get();

            foreach ($visibleDepartments as $vd) {
                if ($vd->department && $vd->department->is_center) {
                    // 参照可能組織がセンターの場合のみ追加
                    $centers->push($vd->department);
                }
            }

            // 重複を排除してdepartment_idでソート
            $centers = $centers->unique('department_id')
                ->sortBy('department_id')
                ->values();
        }

        return response()->json([
            'success' => true,
            'centers' => $centers->map(function ($center) {
                return [
                    'department_id' => $center->department_id,
                    'department_name' => $center->department_name,
                ];
            })->values(),
        ]);
    }

    /**
     * 全センター一覧を取得
     */
    public function all(): JsonResponse
    {
        $centers = Department::where('is_center', true)
            ->orderBy('department_id')
            ->get(['department_id', 'department_name']);

        return response()->json([
            'success' => true,
            'centers' => $centers->map(function ($center) {
                return [
                    'department_id' => $center->department_id,
                    'department_name' => $center->department_name,
                ];
            })->values(),
        ]);
    }

    /**
     * 見積用センター一覧を取得（編集・印刷のみ）
     */
    public function quot(): JsonResponse
    {
        $centers = Department::where('is_center', true)
            ->whereIn('department_category', ['20', '30']) // 制作・印刷のみ
            ->orderBy('department_id')
            ->get(['department_id', 'department_name']);

        return response()->json([
            'success' => true,
            'centers' => $centers->map(function ($center) {
                return [
                    'department_id' => $center->department_id,
                    'department_name' => $center->department_name,
                ];
            })->values(),
        ]);
    }
}
