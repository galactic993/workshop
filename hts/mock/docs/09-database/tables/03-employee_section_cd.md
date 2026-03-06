# 社員別部署コード (employee_section_cd)

## 概要

**テーブル物理名**: `employee_section_cd`

**テーブル論理名**: 社員別部署コード

**用途**:
- 社員マスタと部署コードマスタの関連付け
- 認証機能における部署コードと社員コードの組み合わせ検証
- ログインユーザーのデータ登録時に紐付ける部署コードの特定
- 1社員につき1部署のみ所属可能（employee_idに一意制約）
- FK制約により参照整合性を保証

## テーブル定義

| No. | 論理名 | 物理名 | データ型 | 桁数 | Not Null | PK | UK | FK | Default | 備考 |
|-----|--------|--------|----------|------|----------|----|----|----|---------| ----- |
| 1 | 社員別部署コードid | employee_section_cd_id | BIGSERIAL | - | ● | ● | ● | - | - | 自動採番 |
| 2 | 部署id | section_cd_id | BIGINT | - | ● | - | ※1 | ● | - | 部署コードマスタ.section_cd_id FK制約restrict |
| 3 | 社員id | employee_id | BIGINT | - | ● | - | ※1 | ● | - | 社員マスタ.employee_id FK制約restrict |
| 4 | 更新日 | updated_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |
| 5 | 部署コード | section_cd | CHAR(6) | 6 | - | - | - | - | - | メンテナンス用カラム |
| 6 | 社員コード | employee_cd | CHAR(6) | 6 | - | - | - | - | - | メンテナンス用カラム |

※1: 複合ユニーク制約 (section_cd_id, employee_id)、社員idはさらに単独でユニーク制約

## インデックス

| インデックス名 | カラム | 種類 | 備考 |
|--------------|--------|------|------|
| PRIMARY | employee_section_cd_id | PRIMARY KEY | 主キー |
| employee_section_cd_employee_id_unique | employee_id | UNIQUE | 1社員1部署制約 |
| employee_section_cd_unique | (section_cd_id, employee_id) | UNIQUE | 複合一意制約 |

## 外部キー制約

| 制約名 | カラム | 参照先テーブル | 参照先カラム | ON DELETE | ON UPDATE |
|--------|--------|--------------|------------|-----------|-----------|
| FK_section_cd_id | section_cd_id | section_cds | section_cd_id | RESTRICT | RESTRICT |
| FK_employee_id | employee_id | employees | employee_id | RESTRICT | RESTRICT |

## Eloquentモデル

**ファイルパス**: `backend/app/Models/EmployeeSectionCd.php`

**主な設定**:
```php
class EmployeeSectionCd extends Model
{
    protected $table = 'employee_section_cd';
    protected $primaryKey = 'employee_section_cd_id';
    const CREATED_AT = null; // created_at は使用しない

    protected $fillable = [
        'section_cd_id',
        'employee_id',
        'section_cd',
        'employee_cd',
    ];

    // リレーション
    public function sectionCd()
    {
        return $this->belongsTo(SectionCd::class, 'section_cd_id', 'section_cd_id');
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'employee_id');
    }
}
```

## マイグレーションファイル

**ファイルパス**: `backend/database/migrations/2025_12_08_120346_create_employee_section_cd_table.php`

**実行コマンド**:
```bash
# マイグレーション実行
docker compose exec backend php artisan migrate

# ロールバック
docker compose exec backend php artisan migrate:rollback
```

## サンプルデータ

42件のサンプルデータを社員マスタに対応して定義しています:

**システム管理者** (1件): その他 (000000)
**本社系** (3件): 経営スタッフ (110000)
**営業事務** (2件): 東京営業センター (262000)
**東京営業センター** (5件): センター (262000) + 各担当者の部署コード
**第1営業センター** (5件): センター (281000) + 各担当者の部署コード
**第2営業センター** (6件): センター (282000) + 各担当者の部署コード + 大阪営業チーム
**第2ソフトウェア開発センター** (7件): センター + 社内/常駐外注/社外外注発注
**第1UX編集センター** (13件): センター + 第1チーム/第2チームの社内/常駐外注/社外外注発注

詳細は `backend/database/seeders/EmployeeSectionCdSeeder.php` を参照してください。

## 使用例（Eloquent）

```php
use App\Models\EmployeeSectionCd;

// 全件取得（リレーション含む）
$employeeSections = EmployeeSectionCd::with(['sectionCd', 'employee'])->get();

// 特定社員の所属部署を取得
$employeeSection = EmployeeSectionCd::where('employee_id', 1)->first();
$section = $employeeSection->sectionCd;
$employee = $employeeSection->employee;

// 特定部署に所属する社員を取得
$employeesInSection = EmployeeSectionCd::where('section_cd_id', 2)
    ->with('employee')
    ->get();

// 新規作成
$employeeSection = EmployeeSectionCd::create([
    'section_cd_id' => 3,
    'employee_id' => 9,
    'section_cd' => '281111',
    'employee_cd' => '000008',
]);

// 社員の所属部署を変更
$employeeSection = EmployeeSectionCd::where('employee_id', 1)->first();
$employeeSection->section_cd_id = 3;
$employeeSection->section_cd = '281111';
$employeeSection->save();
```

## 注意事項

1. **認証での利用**
   - 部署コードと社員コードの組み合わせで認証を行う
   - このテーブルで正しい組み合わせを検証可能
   - ログイン後のデータ登録時は、この紐付けを参照して部署コードを特定

2. **1社員1部署制約**
   - employee_idに一意制約があるため、1人の社員は1つの部署にのみ所属可能
   - 社員の部署変更は既存レコードのUPDATEで行う

3. **FK制約 (RESTRICT)**
   - 部署コードマスタまたは社員マスタが削除されている場合、関連レコードは削除不可
   - 削除する場合は先にこのテーブルのレコードを削除する必要あり

4. **複合ユニーク制約**
   - (section_cd_id, employee_id) の組み合わせは一意
   - employee_idが既に一意のため、実質的には冗長だが明示的に定義

5. **メンテナンス用カラム**
   - section_cd, employee_cd は参照用の補助カラム
   - データ確認時に便利だが、正規化の観点からは冗長
   - 必要に応じてトリガーやアプリケーションロジックで同期

6. **created_at の不使用**
   - このテーブルは `created_at` を持たず、`updated_at` のみ使用
   - モデルで `const CREATED_AT = null;` を設定

## 更新履歴

- 2025-12-08: 初版作成
- 2026-01-12: テーブル定義フォーマット統一

---

[戻る: テーブル一覧](../tables.md)
