# 権限割当テーブル (permission_role)

## 概要

**テーブル物理名**: `permission_role`

**テーブル論理名**: 権限割当

**用途**:
- 役割マスタ(roles)と権限マスタ(permissions)を紐付ける中間テーブル
- 各役割がどの権限を持つかを定義
- RBAC（Role-Based Access Control）の中核を担う

## テーブル定義

| No. | 論理名 | 物理名 | データ型 | 桁数 | Not Null | PK | UK | FK | Default | 備考 |
|-----|--------|--------|----------|------|----------|----|----|----|---------| ----- |
| 1 | 権限割当id | permission_role_id | BIGINT | - | ● | ● | ● | - | - | - |
| 2 | 役割id | role_id | BIGINT | - | ● | - | ※1 | ● | - | 役割マスタ.role_id FK制約cascade |
| 3 | 権限id | permission_id | BIGINT | - | ● | - | ※1 | ● | - | 権限マスタ.permission_id FK制約cascade |
| 4 | 更新日 | updated_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |

※1: (role_id, permission_id) の複合ユニーク制約

## インデックス

| インデックス名 | カラム | 種類 | 備考 |
|--------------|--------|------|------|
| PRIMARY | permission_role_id | PRIMARY KEY | 主キー |
| permission_role_permission_role_id_unique | permission_role_id | UNIQUE | 権限割当ID一意制約 |
| permission_role_unique | (role_id, permission_id) | UNIQUE | 複合一意制約 |

## 外部キー制約

| 制約名 | カラム | 参照先テーブル | 参照先カラム | ON DELETE | ON UPDATE |
|--------|--------|--------------|------------|-----------|-----------|
| permission_role_role_id_foreign | role_id | roles | role_id | CASCADE | CASCADE |
| permission_role_permission_id_foreign | permission_id | permissions | permission_id | CASCADE | CASCADE |

## マイグレーションファイル

**ファイルパス**: `backend/database/migrations/2025_12_09_095716_create_permission_role_table.php`

```php
public function up(): void
{
    Schema::create('permission_role', function (Blueprint $table) {
        // 権限割当id (自動採番なし)
        $table->bigInteger('permission_role_id')->primary();
        $table->unique('permission_role_id');

        // 役割id (FK制約 cascade)
        $table->bigInteger('role_id');
        $table->foreign('role_id')
            ->references('role_id')
            ->on('roles')
            ->onDelete('cascade')
            ->onUpdate('cascade');

        // 権限id (FK制約 cascade)
        $table->bigInteger('permission_id');
        $table->foreign('permission_id')
            ->references('permission_id')
            ->on('permissions')
            ->onDelete('cascade')
            ->onUpdate('cascade');

        // 複合ユニーク制約
        $table->unique(['role_id', 'permission_id']);

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

**ファイルパス**: `backend/database/seeders/PermissionRoleSeeder.php`

30件の役割に対して201件の権限割当を定義しています。

**権限割当概要**:

| role_id | 役割名 | 権限数 | 備考 |
|---------|--------|--------|------|
| 1 | システム管理 | 0 | システムレベルのアクセス権限を持つため不要 |
| 2 | 財務 | 3 | IT資産管理全般 |
| 3 | 管理 | 0 | - |
| 4 | 品質保証 | 0 | - |
| 5 | 総務 | 8 | 受注登録、売上計上等 |
| 6 | 人事 | 9 | 総務 + 編集管理月次分析 |
| 7 | 経営分析 | 17 | 売上管理、在庫管理等 |
| 8 | IT管理 | 3 | IT資産管理全般 |
| 9 | 横浜管理 | 2 | 受注登録、編集管理月次帳票 |
| 10 | 総務・経理（本社以外） | 2 | 出荷実績、発送費情報 |
| 11 | 営業所長 | 20 | 売上管理、印刷見積、物流倉庫管理 |
| 12 | 営業担当 | 19 | 営業所長から長期在庫を除外 |
| 13 | 営業事務 | 12 | 売上管理参照系、月次 |
| 14 | 編集所長 | 16 | 編集管理すべて |
| 15 | 編集チームリーダー | 13 | 編集所長から承認・完了・帳票を除外 |
| 16 | 編集マニュアルエディタ | 9 | チームリーダーから分析・マスタを除外 |
| 17 | 編集翻訳コーディネーター | 9 | マニュアルエディタと同じ |
| 18 | 編集担当 | 1 | 作業実績のみ |
| 19 | 編集以外所長 | 10 | 編集所長から担当者・実績・分析・マスタを除外 |
| 20 | 編集以外チームリーダー | 7 | 編集以外所長から承認・完了・帳票を除外 |
| 21 | 編集以外システムエンジニア | 7 | 編集以外チームリーダーと同じ |
| 22 | 編集以外ウェブディレクター | 7 | 編集以外チームリーダーと同じ |
| 23 | 印刷千葉管理 | 0 | - |
| 24 | 印刷印刷管理 | 8 | 印刷見積、作業計画、作業完了、月次 |
| 25 | 印刷調達 | 0 | - |
| 26 | 印刷IP | 1 | 印刷作業実績のみ |
| 27 | 印刷刷版 | 1 | 印刷作業実績のみ |
| 28 | 印刷印刷 | 1 | 印刷作業実績のみ |
| 29 | 印刷製本 | 1 | 印刷作業実績のみ |
| 30 | 配送 | 15 | 入荷、在庫、出荷、マスタ管理、月次 |

詳細は `backend/database/seeders/PermissionRoleSeeder.php` を参照してください。

## Eloquentリレーション

権限割当テーブルは中間テーブルのため、専用のモデルは不要です。RoleモデルとPermissionモデルで `belongsToMany` を使用してアクセスします。

**Roleモデル** (`backend/app/Models/Role.php`):
```php
public function permissions()
{
    return $this->belongsToMany(
        Permission::class,
        'permission_role',
        'role_id',
        'permission_id',
        'role_id',
        'permission_id'
    );
}
```

**Permissionモデル** (`backend/app/Models/Permission.php`):
```php
public function roles()
{
    return $this->belongsToMany(
        Role::class,
        'permission_role',
        'permission_id',
        'role_id',
        'permission_id',
        'role_id'
    );
}
```

## 使用例（Eloquent）

```php
use App\Models\Role;
use App\Models\Permission;

// 役割に権限を追加
$role = Role::find(1); // システム管理
$permission = Permission::where('permission_key', 'sales.orders.create')->first();
$role->permissions()->attach($permission->permission_id);

// 役割に複数の権限を一括追加
$permissionIds = [1, 2, 3, 4, 5];
$role->permissions()->attach($permissionIds);

// 役割の権限を取得
$role = Role::find(1);
$permissions = $role->permissions; // 役割に紐付くすべての権限

// 権限が割り当てられている役割を取得
$permission = Permission::find(1);
$roles = $permission->roles; // この権限を持つすべての役割

// 役割の権限を削除
$role->permissions()->detach($permissionId); // 特定の権限を削除
$role->permissions()->detach(); // すべての権限を削除

// 役割の権限を同期（既存の紐付けを削除して新しいものを設定）
$role->permissions()->sync([1, 2, 3]);

// 権限の存在確認
if ($role->permissions->contains($permissionId)) {
    // 権限を持っている
}
```

## 注意事項

1. **ID の管理**
   - permission_role_id は自動採番なし
   - アプリケーション側で明示的にIDを管理する必要あり
   - ただし、Eloquentの `attach()` メソッドを使用する場合は、IDを意識せずに紐付け可能

2. **複合ユニーク制約**
   - 同じ役割に同じ権限を二重に割り当てることはできません
   - `(role_id, permission_id)` の組み合わせは一意である必要があります

3. **カスケード削除**
   - 役割が削除されると、その役割に紐付くすべての権限割当も自動削除されます
   - 権限が削除されると、その権限に紐付くすべての割当も自動削除されます

4. **created_at の不使用**
   - このテーブルは `created_at` を持たず、`updated_at` のみ使用
   - 中間テーブルのため、作成日時の追跡は不要と判断

5. **RBAC構造における位置づけ**
   - 権限マスタ → **権限割当(permission_role)** → 役割マスタ → 役割割当(employee_role) → 社員マスタ
   - このテーブルで役割の権限セットを定義することで、社員への権限付与を効率化

6. **専用モデル不要**
   - Laravelの多対多リレーションを使用するため、専用のEloquentモデルは不要
   - `belongsToMany` で自動的にテーブルにアクセス可能

## 更新履歴

- 2025-12-09: 初版作成
- 2026-01-12: テーブル定義フォーマット統一

---

[戻る: テーブル一覧](../tables.md)
