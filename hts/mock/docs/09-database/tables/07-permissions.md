# 権限マスタ (permissions)

## 概要

**テーブル物理名**: `permissions`

**テーブル論理名**: 権限マスタ

**用途**:
- 社員がアクセス可能な画面・機能を管理
- 権限識別子（permission_key）をコードで使用
- 権限名（permission_name）を画面表示で使用

## テーブル定義

| No. | 論理名 | 物理名 | データ型 | 桁数 | Not Null | PK | UK | FK | Default | 備考 |
|-----|--------|--------|----------|------|----------|----|----|----|---------| ----- |
| 1 | 権限マスタid | permission_id | BIGSERIAL | - | ● | ● | ● | - | - | 自動採番 |
| 2 | 権限識別子 | permission_key | VARCHAR(50) | 50 | ● | - | ● | - | - | 50桁以内 |
| 3 | 権限名 | permission_name | VARCHAR(30) | 30 | ● | - | ● | - | - | 30桁以内 |
| 4 | 更新日 | updated_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |

## インデックス

| インデックス名 | カラム | 種類 | 備考 |
|--------------|--------|------|------|
| PRIMARY | permission_id | PRIMARY KEY | 主キー |
| permissions_permission_id_unique | permission_id | UNIQUE | 権限ID一意制約 |
| permissions_permission_key_unique | permission_key | UNIQUE | 権限識別子一意制約 |
| permissions_permission_name_unique | permission_name | UNIQUE | 権限名一意制約 |

## Eloquentモデル

**ファイルパス**: `backend/app/Models/Permission.php`

**主な設定**:
```php
class Permission extends Model
{
    protected $table = 'permissions';
    protected $primaryKey = 'permission_id';
    const CREATED_AT = null; // created_at は使用しない

    protected $fillable = [
        'permission_key',
        'permission_name',
    ];
}
```

## マイグレーションファイル

**ファイルパス**: `backend/database/migrations/2025_12_09_072209_create_permissions_table.php`

**実行コマンド**:
```bash
# マイグレーション実行
docker compose exec backend php artisan migrate

# ロールバック
docker compose exec backend php artisan migrate:rollback
```

## サンプルデータ

システムで使用する65件の権限を以下のモジュール別に定義しています:

**売上管理 (sales.*)** - 18件
- 見積、受注、売上、月次処理

**編集管理 (editorial.*)** - 15件
- 制作見積書、作業受付、作業計画、作業実績、作業完了、月次、マスタ管理

**印刷管理 (printing.*)** - 9件
- 印刷見積、作業計画、作業実績、作業完了、月次

**物流・倉庫管理 (logistics.*)** - 21件
- 入荷、在庫、棚卸、出荷、マスタ管理、月次

**IT資産管理 (it-assets.*)** - 3件
- ハードウェア、ソフトウェア、周辺機器

**命名規則**: `モジュール.カテゴリ.アクション` (例: `sales.orders.create`, `editorial.work-plan.assign`)

詳細は `backend/database/seeders/PermissionSeeder.php` を参照してください。

## 使用例（Eloquent）

```php
use App\Models\Permission;

// 全件取得
$permissions = Permission::all();

// 権限識別子で検索
$permission = Permission::where('permission_key', 'view_dashboard')->first();

// 新規作成
$permission = Permission::create([
    'permission_key' => 'view_analytics',
    'permission_name' => '分析画面閲覧',
]);
```

## 注意事項

1. **権限識別子の形式**
   - ドット記法を使用: `モジュール.カテゴリ.アクション`
   - 例:
     - `sales.orders.create` - 売上管理-受注-登録
     - `editorial.work-plan.assign` - 編集管理-作業計画-作業割振
     - `logistics.shipping.order` - 物流・倉庫管理-出荷-出荷指示
   - 英数字、ドット、ハイフンのみ使用
   - 50桁以内

2. **モジュール構成**
   - `sales`: 売上管理
   - `editorial`: 編集管理
   - `printing`: 印刷管理
   - `logistics`: 物流・倉庫管理
   - `it-assets`: IT資産管理

3. **権限名の一意性**
   - permission_key と permission_name の両方に一意制約
   - 同じ名前の権限は登録不可

4. **created_at の不使用**
   - このテーブルは `created_at` を持たず、`updated_at` のみ使用
   - モデルで `const CREATED_AT = null;` を設定

## 更新履歴

- 2025-12-09: 初版作成
- 2026-01-12: テーブル定義フォーマット統一

---

[戻る: テーブル一覧](../tables.md)
