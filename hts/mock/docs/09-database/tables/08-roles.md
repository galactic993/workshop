# 役割マスタ (roles)

## 概要

**テーブル物理名**: `roles`

**テーブル論理名**: 役割マスタ

**用途**:
- 権限の集合体として役割（ロール）を管理
- 社員に役割を割り当てることで、複数の権限を一括付与
- RBAC（ロールベースアクセス制御）を実現

**関連テーブル**:
- permission_role: 役割と権限の紐付け（多対多）
- employee_role: 社員と役割の紐付け（多対多）

## テーブル定義

| No. | 論理名 | 物理名 | データ型 | 桁数 | Not Null | PK | UK | FK | Default | 備考 |
|-----|--------|--------|----------|------|----------|----|----|----|---------| ----- |
| 1 | 役割マスタid | role_id | BIGINT | - | ● | ● | ● | - | - | - |
| 2 | 役割名 | role_name | VARCHAR(30) | 30 | ● | - | ● | - | - | 30桁以内 |
| 3 | 削除日 | deleted_at | TIMESTAMP(0) | - | - | - | - | - | - | - |
| 4 | 更新日 | updated_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |

## インデックス

| インデックス名 | カラム | 種類 | 備考 |
|--------------|--------|------|------|
| PRIMARY | role_id | PRIMARY KEY | 主キー |
| roles_role_id_unique | role_id | UNIQUE | 役割ID一意制約 |
| roles_role_name_unique | role_name | UNIQUE | 役割名一意制約 |

## Eloquentモデル

**ファイルパス**: `backend/app/Models/Role.php`

**主な設定**:
```php
class Role extends Model
{
    use SoftDeletes;

    protected $table = 'roles';
    protected $primaryKey = 'role_id';
    public $incrementing = false;
    const CREATED_AT = null; // created_at は使用しない

    protected $fillable = [
        'role_id',
        'role_name',
    ];

    // このロールに紐付いている権限を取得
    public function permissions()
    {
        return $this->belongsToMany(
            Permission::class,
            'permission_role',
            'role_id',
            'permission_id'
        );
    }

    // このロールを持っている社員を取得
    public function employees()
    {
        return $this->belongsToMany(
            Employee::class,
            'employee_role',
            'role_id',
            'employee_id'
        );
    }
}
```

## マイグレーションファイル

**ファイルパス**: `backend/database/migrations/2025_12_09_093533_create_roles_table.php`

**実行コマンド**:
```bash
# マイグレーション実行
docker compose exec backend php artisan migrate

# ロールバック
docker compose exec backend php artisan migrate:rollback
```

## サンプルデータ

システムで使用する30件の役割を定義しています:

**管理・本部系** (1-10):
- システム管理、財務、管理、品質保証、総務、人事、経営分析、IT管理、横浜管理、総務・経理(本社以外)

**営業系** (11-13):
- 営業所長、営業担当、営業事務

**編集系** (14-22):
- 編集所長、編集チームリーダー、編集マニュアルエディタ、編集翻訳コーディネーター、編集担当、編集以外所長、編集以外チームリーダー、編集以外システムエンジニア、編集以外ウェブディレクター

**印刷系** (23-29):
- 印刷千葉管理、印刷印刷管理、印刷調達、印刷IP、印刷刷版、印刷印刷、印刷製本

**物流系** (30):
- 配送

詳細は `backend/database/seeders/RoleSeeder.php` を参照してください。

## 使用例（Eloquent）

```php
use App\Models\Role;

// 全件取得
$roles = Role::all();

// 役割名で検索
$role = Role::where('role_name', 'システム管理')->first();

// 役割に紐付いている権限を取得
$permissions = $role->permissions;

// 役割を持っている社員を取得
$employees = $role->employees;

// 新規作成
$role = Role::create([
    'role_id' => 31,
    'role_name' => '新規役割',
]);
```

## 注意事項

1. **役割の粒度**
   - 部門別、職位別、業務別など、組織の実態に合わせた役割を定義
   - 役割名は30桁以内

2. **役割名の一意性**
   - role_name に一意制約があるため、同じ名前の役割は登録不可

3. **ID の管理**
   - role_id は自動採番なし
   - アプリケーション側で明示的にIDを管理する必要あり

4. **ソフトデリート**
   - 物理削除ではなくソフトデリート（論理削除）を使用
   - 過去データとの整合性を保つため

5. **created_at の不使用**
   - このテーブルは `created_at` を持たず、`updated_at` のみ使用
   - モデルで `const CREATED_AT = null;` を設定

6. **RBAC構造**
   - 権限マスタ → 権限割当(permission_role) → 役割マスタ → 役割割当(employee_role) → 社員マスタ
   - 社員に役割を付与することで、その役割に紐付いた権限を一括取得可能

## 更新履歴

- 2025-12-09: 初版作成
- 2026-01-12: テーブル定義フォーマット統一

---

[戻る: テーブル一覧](../tables.md)
