<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DepartmentEmployee;
use App\Models\Employee;
use App\Models\EmployeeSectionCd;
use App\Models\VisibleDepartment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * 社員の参照可能組織を取得
     *
     * @return array<array{department_id: int, department_name: string}>
     */
    private function getVisibleDepartments(int $employeeId): array
    {
        $visibleDepartments = VisibleDepartment::with('department')
            ->where('employee_id', $employeeId)
            ->get();

        return $visibleDepartments->map(function ($vd) {
            return [
                'department_id' => $vd->department_id,
                'department_name' => $vd->department->department_name ?? '',
            ];
        })->toArray();
    }

    /**
     * 社員の役割と権限情報を取得
     *
     * @return array{roles: string[], permissions: string[]}
     */
    private function getEmployeeRolesAndPermissions(int $employeeId): array
    {
        $employee = Employee::with(['roles.permissions'])->find($employeeId);

        if (! $employee) {
            return ['roles' => [], 'permissions' => []];
        }

        // 役割名を収集
        $roles = $employee->roles->pluck('role_name')->toArray();

        // 全てのロールから権限を収集（重複を排除）
        $permissions = [];
        foreach ($employee->roles as $role) {
            foreach ($role->permissions as $permission) {
                $permissions[$permission->permission_key] = $permission->permission_name;
            }
        }

        return [
            'roles' => $roles,
            'permissions' => array_keys($permissions),
        ];
    }

    /**
     * ログイン処理
     * 部署コード + 社員コードで認証を行う
     */
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'section_cd' => 'required|string',
            'employee_cd' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // employee_section_cd テーブルで section_cd + employee_cd の組み合わせを検索
        $employeeSectionCd = EmployeeSectionCd::with(['employee', 'sectionCd'])
            ->where('section_cd', $request->section_cd)
            ->where('employee_cd', $request->employee_cd)
            ->first();

        // 認証条件を確認
        // 1. 部署コード + 社員コードの組み合わせが存在すること
        // 2. 社員が有効であること（deleted_flag が '1' でない）
        // 3. 部署コードが有効であること（deleted_flag が '1' でない）
        //    ※ SectionCd モデルのグローバルスコープにより、無効な部署コードは null になる
        if (! $employeeSectionCd
            || $employeeSectionCd->employee->deleted_flag === '1'
            || ! $employeeSectionCd->sectionCd) {
            return response()->json([
                'success' => false,
                'message' => '部署コードまたは社員コードが正しくありません',
            ], 401);
        }

        // 所属組織情報を取得
        $departmentEmployee = DepartmentEmployee::with(['department.center'])
            ->where('employee_id', $employeeSectionCd->employee->employee_id)
            ->first();

        $centerName = null;
        $teamName = null;

        if ($departmentEmployee && $departmentEmployee->department) {
            $department = $departmentEmployee->department;

            if ($department->is_center) {
                // センターに直接所属
                $centerName = $department->department_name;
            } else {
                // チームに所属（親センターも取得）
                $teamName = $department->department_name;
                $centerName = $department->center ? $department->center->department_name : null;
            }
        }

        // アクセス区分、役割、権限、参照可能組織を取得
        $employeeId = $employeeSectionCd->employee->employee_id;
        $accessType = $employeeSectionCd->employee->access_type;
        $rolesAndPermissions = $this->getEmployeeRolesAndPermissions($employeeId);
        $roles = $rolesAndPermissions['roles'];
        $permissions = $rolesAndPermissions['permissions'];
        $visibleDepartments = $this->getVisibleDepartments($employeeId);

        // セッションに情報を保存
        session([
            'employee_section_cd_id' => $employeeSectionCd->employee_section_cd_id,
            'employee_id' => $employeeId,
            'employee_cd' => $employeeSectionCd->employee_cd,
            'section_cd' => $employeeSectionCd->section_cd,
            'employee_name' => $employeeSectionCd->employee->employee_name,
            'section_name' => $employeeSectionCd->sectionCd->section_name,
            'center_name' => $centerName,
            'team_name' => $teamName,
            'access_type' => $accessType,
            'roles' => $roles,
            'permissions' => $permissions,
            'visible_departments' => $visibleDepartments,
        ]);

        // セッションを再生成（セキュリティ対策）
        $request->session()->regenerate();

        return response()->json([
            'success' => true,
            'user' => [
                'employee_id' => $employeeId,
                'employee_cd' => $employeeSectionCd->employee_cd,
                'employee_name' => $employeeSectionCd->employee->employee_name,
                'section_cd' => $employeeSectionCd->section_cd,
                'section_name' => $employeeSectionCd->sectionCd->section_name,
                'center_name' => $centerName,
                'team_name' => $teamName,
                'access_type' => $accessType,
                'roles' => $roles,
                'permissions' => $permissions,
                'visible_departments' => $visibleDepartments,
            ],
        ]);
    }

    /**
     * ログアウト処理
     */
    public function logout(Request $request): JsonResponse
    {
        // セッションをクリア
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'ログアウトしました',
        ]);
    }

    /**
     * 認証状態確認
     */
    public function check(Request $request): JsonResponse
    {
        $employeeId = session('employee_id');

        if (! $employeeId) {
            return response()->json([
                'authenticated' => false,
            ]);
        }

        return response()->json([
            'authenticated' => true,
            'user' => [
                'employee_id' => session('employee_id'),
                'employee_cd' => session('employee_cd'),
                'employee_name' => session('employee_name'),
                'section_cd' => session('section_cd'),
                'section_name' => session('section_name'),
                'center_name' => session('center_name'),
                'team_name' => session('team_name'),
                'access_type' => session('access_type'),
                'roles' => session('roles', []),
                'permissions' => session('permissions', []),
                'visible_departments' => session('visible_departments', []),
            ],
        ]);
    }
}
