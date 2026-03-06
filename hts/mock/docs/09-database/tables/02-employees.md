# 社員マスタ (employees)

## 概要

**テーブル物理名**: `employees`

**テーブル論理名**: 社員マスタ

**用途**:
- 社員情報を管理
- 認証・認可の基礎データ
- アクセス区分による権限制御

## テーブル定義

| No. | 論理名 | 物理名 | データ型 | 桁数 | Not Null | PK | UK | FK | Default | 備考 |
|-----|--------|--------|----------|------|----------|----|----|----|---------| ----- |
| 1 | 社員マスタid | employee_id | BIGINT | - | ● | ● | ● | - | - | - |
| 2 | 社員コード | employee_cd | CHAR(6) | 6 | ● | - | ● | - | - | 半角数字6桁 |
| 3 | 社員名 | employee_name | VARCHAR(30) | 30 | ● | - | - | - | - | 30桁以内 |
| 4 | メールアドレス | email | VARCHAR(256) | 256 | ● | - | - | - | - | 256桁以内 |
| 5 | アクセス区分 | access_type | CHAR(2) | 2 | ● | - | - | - | 40:一般 | 00:全て 10:ディレクター 20:所長 30:リーダー 40:一般 |
| 6 | 削除フラグ | deleted_flag | CHAR(1) | 1 | ● | - | - | - | 0:有効 | 0:有効 1:無効 |
| 7 | 更新日 | updated_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |

## 削除フラグの値

| 値 | 説明 |
|----|------|
| 0 | 有効 |
| 1 | 無効 |

## アクセス区分の値

| コード | 説明 |
|--------|------|
| 00 | 全て |
| 10 | ディレクター |
| 20 | 所長 |
| 30 | リーダー |
| 40 | 一般 |

## インデックス

| インデックス名 | カラム | 種類 | 備考 |
|--------------|--------|------|------|
| PRIMARY | employee_id | PRIMARY KEY | 主キー |
| employees_employee_cd_unique | employee_cd | UNIQUE | 社員コード一意制約 |

## Eloquentモデル

**ファイルパス**: `backend/app/Models/Employee.php`

**主な設定**:
```php
class Employee extends Model
{
    protected $table = 'employees';
    protected $primaryKey = 'employee_id';
    const CREATED_AT = null; // created_at は使用しない

    protected $fillable = [
        'employee_id',
        'employee_cd',
        'employee_name',
        'email',
        'access_type',
    ];

    // 有効なレコードのみ取得するグローバルスコープ
    protected static function booted(): void
    {
        static::addGlobalScope('active', function ($query) {
            $query->where('deleted_flag', '0');
        });
    }

    // 無効化（論理削除）
    public function deactivate(): bool
    {
        return $this->update(['deleted_flag' => '1']);
    }

    // 有効化
    public function activate(): bool
    {
        return $this->update(['deleted_flag' => '0']);
    }
}
```

## マイグレーションファイル

**ファイルパス**: `backend/database/migrations/2025_12_08_114903_create_employees_table.php`

**実行コマンド**:
```bash
# マイグレーション実行
docker compose exec backend php artisan migrate

# ロールバック
docker compose exec backend php artisan migrate:rollback
```

## サンプルデータ

42件のサンプルデータを以下のカテゴリで定義しています:

**システム管理者** (1件):
- 管理太郎 (access_type: 00)

**本社系** (3件):
- 経営分析太郎 (access_type: 10)、総務太郎 (access_type: 40)、人事太郎 (access_type: 40)

**営業事務** (2件):
- 事務太郎、事務花子 (access_type: 40)

**東京営業センター** (5件):
- 所長: 東京所長太郎 (access_type: 20)
- 担当: 東京太郎/花子/三郎/四郎 (access_type: 40)

**第1営業センター** (5件):
- 所長: 第一所長太郎 (access_type: 20)
- 担当: 第一太郎/花子/三郎/四郎 (access_type: 40)

**第2営業センター** (6件):
- 所長: 第二所長太郎 (access_type: 20)
- 担当: 第二太郎/花子/三郎/四郎 (access_type: 40)
- 大阪営業チーム: 第二大阪太郎 (access_type: 40)

**第2ソフトウェア開発センター** (7件):
- 所長: 第二開発所長太郎 (access_type: 20)
- 社内/常駐外注/社外外注発注の各担当 (access_type: 40)

**第1UX編集センター** (13件):
- 所長: 第一UX所長太郎 (access_type: 20)
- 第1チーム: リーダー (access_type: 30)、社内/常駐外注/社外外注発注の各担当 (access_type: 40)
- 第2チーム: リーダー (access_type: 30)、社内/常駐外注/社外外注発注の各担当 (access_type: 40)

詳細は `backend/database/seeders/EmployeeSeeder.php` を参照してください。

## 使用例（Eloquent）

```php
use App\Models\Employee;

// 有効なレコードのみ取得（デフォルト）
$employees = Employee::all();

// 社員コードで検索（有効なレコードのみ）
$employee = Employee::where('employee_cd', '000001')->first();

// アクセス区分で絞り込み
$directors = Employee::where('access_type', '10')->get();

// 無効なレコードを含めて取得
$allEmployees = Employee::withoutGlobalScope('active')->get();

// 無効なレコードのみ取得
$inactiveEmployees = Employee::withoutGlobalScope('active')
    ->where('deleted_flag', '1')
    ->get();

// 新規作成
$employee = Employee::create([
    'employee_id' => 9,
    'employee_cd' => '000008',
    'employee_name' => '伊藤健太',
    'email' => 'ito@example.com',
    'access_type' => '40',
]);

// 無効化（論理削除）
$employee->deactivate();

// 有効化
$employee->activate();
```

## 注意事項

1. **社員コードの形式**
   - 半角数字6桁固定
   - バリデーションで形式チェックを実施すること

2. **アクセス区分の検証**
   - 00, 10, 20, 30, 40 のいずれかであることを検証
   - アプリケーション層でバリデーションを実装

3. **メールアドレスの一意性**
   - 現在は一意制約なし
   - 必要に応じて追加を検討

4. **削除フラグによる論理削除**
   - 物理削除ではなく削除フラグによる論理削除を使用
   - `deleted_flag = '0'` が有効、`'1'` が無効
   - グローバルスコープにより、デフォルトで有効なレコードのみ取得
   - 過去データとの整合性を保つため

5. **created_at の不使用**
   - このテーブルは `created_at` を持たず、`updated_at` のみ使用
   - モデルで `const CREATED_AT = null;` を設定

## 更新履歴

- 2025-12-08: 初版作成
- 2026-01-12: テーブル定義フォーマット統一
- 2026-01-30: 営業事務のアクセス区分を40（一般）に修正

---

[戻る: テーブル一覧](../tables.md)
