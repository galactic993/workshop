# 参照可能組織テーブル (visible_departments)

## 概要

**テーブル物理名**: `visible_departments`

**テーブル論理名**: 参照可能組織

**用途**:
- 社員が自身の所属組織以外に参照可能な組織を管理
- デフォルトでは社員は自身の所属センター（チームの場合は親センター）のみ参照可能
- このテーブルで追加の参照権限を付与

## テーブル定義

| No. | 論理名 | 物理名 | データ型 | 桁数 | Not Null | PK | UK | FK | Default | 備考 |
|-----|--------|--------|----------|------|----------|----|----|----|---------| ----- |
| 1 | 参照可能組織id | visible_department_id | BIGINT | - | ● | ● | ● | - | - | - |
| 2 | 社員id | employee_id | BIGINT | - | ● | - | ※1 | ● | - | 社員マスタ.employee_id FK制約cascade |
| 3 | 組織id | department_id | BIGINT | - | ● | - | ※1 | ● | - | 組織マスタ.department_id FK制約cascade |
| 4 | 更新日 | updated_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |
| 5 | 社員コード | employee_cd | CHAR(6) | 6 | - | - | - | - | - | メンテナンス用カラム |
| 6 | 備考 | remarks | VARCHAR(20) | 20 | - | - | - | - | - | メンテナンス用カラム |

※1: (employee_id, department_id) の複合ユニーク制約

## インデックス

| インデックス名 | カラム | 種類 | 備考 |
|--------------|--------|------|------|
| PRIMARY | visible_department_id | PRIMARY KEY | 主キー |
| visible_departments_visible_department_id_unique | visible_department_id | UNIQUE | 参照可能組織ID一意制約 |
| visible_departments_unique | (employee_id, department_id) | UNIQUE | 複合一意制約 |

## 外部キー制約

| 制約名 | カラム | 参照先テーブル | 参照先カラム | ON DELETE | ON UPDATE |
|--------|--------|--------------|------------|-----------|-----------|
| visible_departments_employee_id_foreign | employee_id | employees | employee_id | CASCADE | CASCADE |
| visible_departments_department_id_foreign | department_id | departments | department_id | CASCADE | CASCADE |

## マイグレーションファイル

**ファイルパス**: `backend/database/migrations/2025_12_10_144148_create_visible_departments_table.php`

```php
public function up(): void
{
    Schema::create('visible_departments', function (Blueprint $table) {
        // 参照可能組織id (自動採番なし)
        $table->bigInteger('visible_department_id')->primary();
        $table->unique('visible_department_id');

        // 社員id (FK制約 cascade)
        $table->bigInteger('employee_id');
        $table->foreign('employee_id')
            ->references('employee_id')
            ->on('employees')
            ->onDelete('cascade')
            ->onUpdate('cascade');

        // 組織id (FK制約 cascade)
        $table->bigInteger('department_id');
        $table->foreign('department_id')
            ->references('department_id')
            ->on('departments')
            ->onDelete('cascade')
            ->onUpdate('cascade');

        // 複合ユニーク制約
        $table->unique(['employee_id', 'department_id']);

        // 更新日のみ (created_at は使用しない)
        $table->timestamp('updated_at', 0)->useCurrent()->useCurrentOnUpdate();

        // メンテナンス用カラム
        $table->char('employee_cd', 6)->nullable();
        $table->string('remarks', 20)->nullable();
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

**ファイルパス**: `backend/database/seeders/VisibleDepartmentSeeder.php`

2件のサンプルデータを定義しています:

**営業事務**:
- 事務太郎（employee_id: 5）→ 第1営業センター、第2営業センターを参照可能
- 事務花子（employee_id: 6）→ 追加の参照権限なし（所属センターのみ）

※営業事務は東京営業センター所属のため、東京営業センターはデフォルトで参照可能（登録不要）

| visible_department_id | employee_id | department_id | employee_cd | remarks |
|-----------------------|-------------|---------------|-------------|---------|
| 1 | 5 | 10 | 000005 | 第1営業 |
| 2 | 5 | 11 | 000005 | 第2営業 |

詳細は `backend/database/seeders/VisibleDepartmentSeeder.php` を参照してください。

## Eloquentモデル

**ファイルパス**: `backend/app/Models/VisibleDepartment.php`

```php
class VisibleDepartment extends Model
{
    protected $table = 'visible_departments';
    protected $primaryKey = 'visible_department_id';
    public $incrementing = false;
    const CREATED_AT = null; // created_at は使用しない

    protected $fillable = [
        'visible_department_id',
        'employee_id',
        'department_id',
        'employee_cd',
        'remarks',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'employee_id');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'department_id', 'department_id');
    }
}
```

**Employeeモデルのリレーション** (`backend/app/Models/Employee.php`):
```php
// 参照可能組織（中間テーブル経由）
public function visibleDepartments()
{
    return $this->hasMany(VisibleDepartment::class, 'employee_id', 'employee_id');
}

// 参照可能な組織を直接取得
public function visibleDepartmentsList()
{
    return $this->belongsToMany(
        Department::class,
        'visible_departments',
        'employee_id',
        'department_id',
        'employee_id',
        'department_id'
    );
}
```

## 使用例（Eloquent）

```php
use App\Models\Employee;
use App\Models\VisibleDepartment;

// 社員の参照可能組織を取得
$employee = Employee::find(5);
$visibleDepartments = $employee->visibleDepartmentsList; // 直接組織を取得

// または中間テーブル経由で取得
$visibleDeptRecords = $employee->visibleDepartments;
foreach ($visibleDeptRecords as $record) {
    $department = $record->department;
}

// 新規参照権限を追加
$visibleDept = VisibleDepartment::create([
    'visible_department_id' => 5,
    'employee_id' => 7,
    'department_id' => 10,
    'employee_cd' => '000007',
    'remarks' => '第1営業',
]);

// 社員の全参照可能組織（所属 + 追加権限）を取得
$employee = Employee::with(['department', 'visibleDepartmentsList'])->find(5);
$ownDepartment = $employee->department; // 所属組織
$additionalDepts = $employee->visibleDepartmentsList; // 追加参照可能組織
```

## 注意事項

1. **デフォルト参照権限**
   - 社員は自身の所属センターをデフォルトで参照可能
   - チームに所属している場合は、親センターをデフォルトで参照可能
   - このテーブルには「追加の」参照権限のみ登録

2. **ID の管理**
   - visible_department_id は自動採番なし
   - アプリケーション側で明示的にIDを管理する必要あり

3. **複合ユニーク制約**
   - 同じ社員に同じ組織を二重に登録できない
   - `(employee_id, department_id)` の組み合わせは一意

4. **カスケード削除**
   - 社員が削除されると、その社員の参照可能組織レコードも自動削除
   - 組織が削除されると、その組織への参照権限レコードも自動削除

5. **メンテナンス用カラム**
   - employee_cd, remarks は参照用の補助カラム
   - データ確認時に便利だが、正規化の観点からは冗長
   - 必要に応じてアプリケーションロジックで同期

6. **created_at の不使用**
   - このテーブルは `created_at` を持たず、`updated_at` のみ使用
   - モデルで `const CREATED_AT = null;` を設定

7. **センター/チームの参照権限**
   - チームを参照可能にすると、そのチームのみ参照可能（親センターは含まない）
   - センターを参照可能にすると、そのセンター配下のチームも参照可能とするかはアプリケーション実装による

## 更新履歴

- 2025-12-10: 初版作成
- 2026-01-12: テーブル定義フォーマット統一

---

[戻る: テーブル一覧](../tables.md)
