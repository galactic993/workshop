# 組織別部署コード (department_section_cd)

## 概要

**テーブル物理名**: `department_section_cd`

**テーブル論理名**: 組織別部署コード

**用途**:
- 組織マスタと部署コードマスタの関連付け
- 組織（センターまたはチーム）がどの部署コードと紐付いているかを特定
- 1組織につき1部署コードのみ紐付け可能（department_idに一意制約）
- FK制約（CASCADE）により参照整合性を保証

## テーブル定義

| No. | 論理名 | 物理名 | データ型 | 桁数 | Not Null | PK | UK | FK | Default | 備考 |
|-----|--------|--------|----------|------|----------|----|----|----|---------| ----- |
| 1 | 組織別部署コードid | department_section_cd_id | BIGSERIAL | - | ● | ● | ● | - | - | 自動採番 |
| 2 | 部署id | section_cd_id | BIGINT | - | ● | - | ※1 | ● | - | 部署コードマスタ.section_cd_id FK制約cascade |
| 3 | 組織id | department_id | BIGINT | - | ● | - | ※1 | ● | - | 組織マスタ.department_id FK制約cascade |
| 4 | 更新日 | updated_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |

※1: 部署コードマスタidと組織マスタidの複合ユニーク制約、組織マスタid単体でのユニーク制約

## インデックス

| インデックス名 | カラム | 種類 | 備考 |
|--------------|--------|------|------|
| PRIMARY | department_section_cd_id | PRIMARY KEY | 主キー |
| department_section_cd_department_section_cd_id_unique | department_section_cd_id | UNIQUE | 組織別部署コードID一意制約 |
| department_section_cd_department_id_unique | department_id | UNIQUE | 1組織1部署制約 |
| department_section_cd_unique | (section_cd_id, department_id) | UNIQUE | 複合一意制約 |

## 外部キー制約

| 制約名 | カラム | 参照先テーブル | 参照先カラム | ON DELETE | ON UPDATE |
|--------|--------|--------------|------------|-----------|-----------|
| department_section_cd_section_cd_id_foreign | section_cd_id | section_cds | section_cd_id | CASCADE | CASCADE |
| department_section_cd_department_id_foreign | department_id | departments | department_id | CASCADE | CASCADE |

## Eloquentモデル

**ファイルパス**: `backend/app/Models/DepartmentSectionCd.php`

**主な設定**:
```php
class DepartmentSectionCd extends Model
{
    protected $table = 'department_section_cd';
    protected $primaryKey = 'department_section_cd_id';
    const CREATED_AT = null; // created_at は使用しない

    protected $fillable = [
        'section_cd_id',
        'department_id',
    ];

    // リレーション
    public function sectionCd()
    {
        return $this->belongsTo(SectionCd::class, 'section_cd_id', 'section_cd_id');
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id', 'department_id');
    }
}
```

## マイグレーションファイル

**ファイルパス**: `backend/database/migrations/2025_12_10_134615_create_department_section_cd_table.php`

**実行コマンド**:
```bash
# マイグレーション実行
docker compose exec backend php artisan migrate

# ロールバック
docker compose exec backend php artisan migrate:rollback
```

## サンプルデータ

16件のサンプルデータを組織マスタに対応して定義しています:

**システム管理** (1件): その他 (section_cd_id: 1)
**本社系** (7件): すべて経営スタッフ (section_cd_id: 3) ※品質保証センターのみ品質保証センター (5)
**営業グループ** (4件): 東京営業 (7)/第1営業 (13)/第2営業 (19)/大阪営業チーム (25)
**編集・ソフトウエア事業グループ** (4件): 第2ソフトウェア開発 (27)/第1UX編集 (32)/第1チーム (33)/第2チーム (37)

詳細は `backend/database/seeders/DepartmentSectionCdSeeder.php` を参照してください。

## 使用例（Eloquent）

```php
use App\Models\DepartmentSectionCd;
use App\Models\Department;

// 組織の紐付いている部署コードを取得
$departmentSectionCd = DepartmentSectionCd::where('department_id', 9)->first();
$sectionCd = $departmentSectionCd->sectionCd;

// Departmentモデル経由で部署コードを取得
$department = Department::find(9);
$sectionCd = $department->sectionCd; // hasOneThrough

// 新規紐付け登録
$departmentSectionCd = DepartmentSectionCd::create([
    'department_id' => 17,
    'section_cd_id' => 41,
]);
```

## 注意事項

1. **1組織1部署制約**
   - `department_id` に一意制約があるため、1つの組織は1つの部署コードにのみ紐付け可能
   - 紐付けの変更は既存レコードのUPDATEで行う

2. **FK制約 (CASCADE)**
   - 部署コードマスタまたは組織マスタが削除された場合、関連する紐付けレコードも自動削除
   - データの整合性が自動的に保たれる

3. **複合ユニーク制約**
   - `(section_cd_id, department_id)` の組み合わせは一意
   - `department_id` が既に一意のため、実質的には冗長だが明示的に定義

4. **created_at の不使用**
   - このテーブルは `created_at` を持たず、`updated_at` のみ使用
   - モデルで `const CREATED_AT = null;` を設定

5. **組織と部署コードの関係**
   - 組織マスタは実態としての組織（センター・チーム）を表す
   - 部署コードマスタは集計単位を表す
   - このテーブルで両者を紐付けることで、組織からの集計が可能になる

## 更新履歴

- 2025-12-10: 初版作成
- 2026-01-12: テーブル定義フォーマット統一

---

[戻る: テーブル一覧](../tables.md)
