# 役割割当テーブル (employee_role)

## 概要

**テーブル物理名**: `employee_role`

**テーブル論理名**: 役割割当

**用途**:
- 社員マスタ(employees)と役割マスタ(roles)を紐付ける中間テーブル
- 各社員がどの役割を持つかを定義
- RBAC（Role-Based Access Control）の最終段階を担う

## テーブル定義

| No. | 論理名 | 物理名 | データ型 | 桁数 | Not Null | PK | UK | FK | Default | 備考 |
|-----|--------|--------|----------|------|----------|----|----|----|---------| ----- |
| 1 | 役割割当id | employee_role_id | BIGINT | - | ● | ● | ● | - | - | - |
| 2 | 社員id | employee_id | BIGINT | - | ● | - | ※1 | ● | - | 社員マスタ.employee_id FK制約cascade |
| 3 | 役割id | role_id | BIGINT | - | ● | - | ※1 | ● | - | 役割マスタ.role_id FK制約cascade |
| 4 | 更新日 | updated_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |

※1: (employee_id, role_id) の複合ユニーク制約

## インデックス

| インデックス名 | カラム | 種類 | 備考 |
|--------------|--------|------|------|
| PRIMARY | employee_role_id | PRIMARY KEY | 主キー |
| employee_role_employee_role_id_unique | employee_role_id | UNIQUE | 役割割当ID一意制約 |
| employee_role_unique | (employee_id, role_id) | UNIQUE | 複合一意制約 |

## 外部キー制約

| 制約名 | カラム | 参照先テーブル | 参照先カラム | ON DELETE | ON UPDATE |
|--------|--------|--------------|------------|-----------|-----------|
| employee_role_employee_id_foreign | employee_id | employees | employee_id | CASCADE | CASCADE |
| employee_role_role_id_foreign | role_id | roles | role_id | CASCADE | CASCADE |

## マイグレーションファイル

**ファイルパス**: `backend/database/migrations/2025_12_09_121732_create_employee_role_table.php`

```php
public function up(): void
{
    Schema::create('employee_role', function (Blueprint $table) {
        // 役割割当id (自動採番なし)
        $table->bigInteger('employee_role_id')->primary();
        $table->unique('employee_role_id');

        // 社員id (FK制約 cascade)
        $table->bigInteger('employee_id');
        $table->foreign('employee_id')
            ->references('employee_id')
            ->on('employees')
            ->onDelete('cascade')
            ->onUpdate('cascade');

        // 役割id (FK制約 cascade)
        $table->bigInteger('role_id');
        $table->foreign('role_id')
            ->references('role_id')
            ->on('roles')
            ->onDelete('cascade')
            ->onUpdate('cascade');

        // 複合ユニーク制約
        $table->unique(['employee_id', 'role_id']);

        // 更新日のみ (created_at は使用しない)
        $table->timestamp('updated_at', 0)->useCurrent()->useCurrentOnUpdate();
    });
}
```

**実行コマンド**:
```bash
# マイグレーション実行
docker compose exec backend php artisan migrate

# ロールバック
docker compose exec backend php artisan migrate:rollback
```

## サンプルデータ

**ファイルパス**: `backend/database/seeders/EmployeeRoleSeeder.php`

42件のサンプルデータを社員マスタに対応して定義しています:

**システム管理者** (1件): role_id=1 (システム管理)
**本社系** (3件): role_id=7 (経営分析), 5 (総務), 6 (人事)
**営業事務** (2件): role_id=13 (営業事務)
**東京営業センター** (5件): role_id=11 (営業所長) + 12 (営業担当)
**第1営業センター** (5件): role_id=11 (営業所長) + 12 (営業担当)
**第2営業センター** (6件): role_id=11 (営業所長) + 12 (営業担当)
**第2ソフトウェア開発センター** (7件): role_id=19 (編集以外所長) + 21 (編集以外システムエンジニア)
**第1UX編集センター** (13件): role_id=14 (編集所長) + 15 (編集チームリーダー) + 18 (編集担当)

詳細は `backend/database/seeders/EmployeeRoleSeeder.php` を参照してください。

## Eloquentリレーション

役割割当テーブルは中間テーブルのため、専用のモデルは不要です。EmployeeモデルとRoleモデルで `belongsToMany` を使用してアクセスします。

**Employeeモデル** (`backend/app/Models/Employee.php`):
```php
public function roles()
{
    return $this->belongsToMany(
        Role::class,
        'employee_role',
        'employee_id',
        'role_id',
        'employee_id',
        'role_id'
    );
}
```

**Roleモデル** (`backend/app/Models/Role.php`):
```php
public function employees()
{
    return $this->belongsToMany(
        Employee::class,
        'employee_role',
        'role_id',
        'employee_id',
        'role_id',
        'employee_id'
    );
}
```

## 使用例（Eloquent）

```php
use App\Models\Employee;
use App\Models\Role;

// 社員に役割を追加
$employee = Employee::find(1);
$role = Role::where('role_name', '営業担当')->first();
$employee->roles()->attach($role->role_id);

// 社員に複数の役割を一括追加
$roleIds = [11, 12];
$employee->roles()->attach($roleIds);

// 社員の役割を取得
$employee = Employee::find(1);
$roles = $employee->roles; // 社員が持つすべての役割

// 社員が持つ権限を取得（役割経由）
$permissions = $employee->roles->flatMap(function ($role) {
    return $role->permissions;
})->unique('permission_id');

// 役割を持っている社員を取得
$role = Role::find(11); // 営業所長
$employees = $role->employees; // この役割を持つすべての社員

// 社員の役割を削除
$employee->roles()->detach($roleId); // 特定の役割を削除
$employee->roles()->detach(); // すべての役割を削除

// 社員の役割を同期（既存の紐付けを削除して新しいものを設定）
$employee->roles()->sync([11, 12]);

// 権限の存在確認
$hasPermission = $employee->roles->flatMap(function ($role) {
    return $role->permissions;
})->contains('permission_key', 'sales.orders.create');
```

## 注意事項

1. **ID の管理**
   - employee_role_id は自動採番なし
   - アプリケーション側で明示的にIDを管理する必要あり
   - ただし、Eloquentの `attach()` メソッドを使用する場合は、IDを意識せずに紐付け可能

2. **複合ユニーク制約**
   - 同じ社員に同じ役割を二重に割り当てることはできません
   - `(employee_id, role_id)` の組み合わせは一意である必要があります

3. **カスケード削除**
   - 社員が削除されると、その社員に紐付くすべての役割割当も自動削除されます
   - 役割が削除されると、その役割に紐付くすべての割当も自動削除されます

4. **created_at の不使用**
   - このテーブルは `created_at` を持たず、`updated_at` のみ使用
   - 中間テーブルのため、作成日時の追跡は不要と判断

5. **RBAC構造における位置づけ**
   - 権限マスタ → 権限割当(permission_role) → 役割マスタ → **役割割当(employee_role)** → 社員マスタ
   - このテーブルで社員と役割を紐付けることで、社員の権限が決定される

6. **専用モデル不要**
   - Laravelの多対多リレーションを使用するため、専用のEloquentモデルは不要
   - `belongsToMany` で自動的にテーブルにアクセス可能

7. **複数役割の付与**
   - 1人の社員に複数の役割を付与可能
   - 社員の権限は、付与されたすべての役割の権限の合計となる

## 更新履歴

- 2025-12-09: 初版作成
- 2026-01-12: テーブル定義フォーマット統一

---

[戻る: テーブル一覧](../tables.md)
