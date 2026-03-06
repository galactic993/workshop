# 所属組織 (department_employee)

## 概要

**テーブル物理名**: `department_employee`

**テーブル論理名**: 所属組織

**用途**:
- 社員マスタと組織マスタの関連付け（中間テーブル）
- 社員の所属組織（センターまたはチーム）を管理
- 1社員につき1組織のみ所属可能（employee_idに一意制約）
- FK制約（CASCADE）により参照整合性を保証

## テーブル定義

| No. | 論理名 | 物理名 | データ型 | 桁数 | Not Null | PK | UK | FK | Default | 備考 |
|-----|--------|--------|----------|------|----------|----|----|----|---------| ----- |
| 1 | 所属組織id | department_employee_id | BIGINT | - | ● | ● | ● | - | - | - |
| 2 | 組織id | department_id | BIGINT | - | ● | - | ※1 | ● | - | 組織マスタ.department_id FK制約cascade |
| 3 | 社員id | employee_id | BIGINT | - | ● | - | ※1 | ● | - | 社員マスタ.employee_id FK制約cascade |
| 4 | 更新日 | updated_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |

※1: 複合ユニーク制約 (department_id, employee_id)、社員idはさらに単独でユニーク制約

## インデックス

| インデックス名 | カラム | 種類 | 備考 |
|--------------|--------|------|------|
| PRIMARY | department_employee_id | PRIMARY KEY | 主キー |
| department_employee_department_employee_id_unique | department_employee_id | UNIQUE | 所属組織ID一意制約 |
| department_employee_employee_id_unique | employee_id | UNIQUE | 1社員1組織制約 |
| department_employee_unique | (department_id, employee_id) | UNIQUE | 複合一意制約 |

## 外部キー制約

| 制約名 | カラム | 参照先テーブル | 参照先カラム | ON DELETE | ON UPDATE |
|--------|--------|--------------|------------|-----------|-----------|
| department_employee_department_id_foreign | department_id | departments | department_id | CASCADE | CASCADE |
| department_employee_employee_id_foreign | employee_id | employees | employee_id | CASCADE | CASCADE |

## マイグレーションファイル

**ファイルパス**: `backend/database/migrations/2025_12_08_165624_create_department_employee_table.php`

**実行コマンド**:
```bash
# マイグレーション実行
docker compose exec backend php artisan migrate

# ロールバック
docker compose exec backend php artisan migrate:rollback
```

## サンプルデータ

42件のサンプルデータを社員マスタに対応して定義しています:

**システム管理者** (1件): システム管理センター (department_id: 1)
**本社系** (3件): 経営分析センター (7)、総務センター (4)、人事センター (3)
**営業事務** (2件): 東京営業センター (9)
**東京営業センター** (5件): 東京営業センター (9)
**第1営業センター** (5件): 第1営業センター (10)
**第2営業センター** (5件): 第2営業センター (11)
**大阪営業チーム** (1件): 大阪営業チーム (12)
**第2ソフトウェア開発センター** (7件): 第2ソフトウェア開発センター (13)
**第1UX編集センター** (13件): 所長→センター直属 (14)、第1チーム (15)、第2チーム (16)

詳細は `backend/database/seeders/DepartmentEmployeeSeeder.php` を参照してください。

## 使用例（想定）

```php
use App\Models\DepartmentEmployee;

// 社員の所属組織を取得
$departmentEmployee = DepartmentEmployee::where('employee_id', 1)->first();

// 組織に所属する社員一覧
$employees = DepartmentEmployee::where('department_id', 9)->get();

// 新規所属登録
$departmentEmployee = DepartmentEmployee::create([
    'department_employee_id' => 43,
    'department_id' => 10,
    'employee_id' => 43,
]);
```

## 注意事項

1. **1社員1組織制約**
   - `employee_id` に一意制約があるため、1人の社員は1つの組織にのみ所属可能
   - 社員の組織変更は既存レコードのUPDATEで行う

2. **FK制約 (CASCADE)**
   - 組織マスタまたは社員マスタが削除された場合、関連する所属レコードも自動削除
   - データの整合性が自動的に保たれる

3. **複合ユニーク制約**
   - `(department_id, employee_id)` の組み合わせは一意
   - `employee_id` が既に一意のため、実質的には冗長だが明示的に定義

4. **ID の管理**
   - `department_employee_id` は自動採番なし
   - アプリケーション側で明示的にIDを管理する必要あり

5. **所属組織の取得**
   - サンプルデータでは8名の社員がセンターに直接所属、1名の社員（employee_id: 9）がチームに所属
   - チーム所属の社員の場合：
     - 社員がチームに所属している場合、親センターは `departments.center_id` から取得可能
     - これによりヘッダーのユーザーメニューに「所属センター」と「所属チーム」を両方表示可能
     - 例: 社員ID 9は東京チーム（department_id: 6）に所属し、親センターは第1営業センター（department_id: 2）

## 更新履歴

- 2025-12-08: 初版作成
- 2026-01-12: テーブル定義フォーマット統一

---

[戻る: テーブル一覧](../tables.md)
