# 業種マスタ (industries)

## 概要

**テーブル物理名**: `industries`

**テーブル論理名**: 業種マスタ

**用途**:
- 得意先グループがどの業種に分類されているかを管理
- 得意先グループマスタから参照される

## テーブル定義

| No. | 論理名 | 物理名 | データ型 | 桁数 | Not Null | PK | UK | FK | Default | 備考 |
|-----|--------|--------|----------|------|----------|----|----|----|---------| ----- |
| 1 | 業種マスタid | industry_id | BIGINT | - | ● | ● | ● | - | - | - |
| 2 | 業種名 | industry_name | VARCHAR(40) | 40 | ● | - | ● | - | - | 40桁以内 |
| 3 | 削除日 | deleted_at | TIMESTAMP(0) | - | - | - | - | - | null | - |
| 4 | 更新日 | updated_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |

## インデックス

| インデックス名 | カラム | 種類 | 備考 |
|--------------|--------|------|------|
| PRIMARY | industry_id | PRIMARY KEY | 主キー |
| industries_industry_id_unique | industry_id | UNIQUE | 業種ID一意制約 |
| industries_industry_name_unique | industry_name | UNIQUE | 業種名一意制約 |

## マイグレーションファイル

**ファイルパス**: `backend/database/migrations/2025_12_10_150229_create_industries_table.php`

```php
public function up(): void
{
    Schema::create('industries', function (Blueprint $table) {
        // 業種マスタid (自動採番なし)
        $table->bigInteger('industry_id')->primary();
        $table->unique('industry_id');

        // 業種名 (40桁以内、一意制約)
        $table->string('industry_name', 40);
        $table->unique('industry_name');

        // ソフトデリート
        $table->softDeletes();

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

**ファイルパス**: `backend/database/seeders/IndustrySeeder.php`

13件のサンプルデータを定義しています:

| industry_id | industry_name |
|-------------|---------------|
| 1 | 製造業 |
| 2 | 情報通信業 |
| 3 | 卸売業 |
| 4 | 小売業 |
| 5 | 金融・保険業 |
| 6 | 不動産業 |
| 7 | 運輸・郵便業 |
| 8 | 建設業 |
| 9 | サービス業 |
| 10 | 医療・福祉 |
| 11 | 教育・学習支援業 |
| 12 | 官公庁・団体 |
| 13 | その他 |

## Eloquentモデル

**ファイルパス**: `backend/app/Models/Industry.php`

```php
class Industry extends Model
{
    use SoftDeletes;

    protected $table = 'industries';
    protected $primaryKey = 'industry_id';
    public $incrementing = false;
    const CREATED_AT = null; // created_at は使用しない

    protected $fillable = [
        'industry_id',
        'industry_name',
    ];
}
```

## 使用例（Eloquent）

```php
use App\Models\Industry;

// 全件取得
$industries = Industry::all();

// 業種名で検索
$industry = Industry::where('industry_name', '製造業')->first();

// 新規作成
$industry = Industry::create([
    'industry_id' => 14,
    'industry_name' => '農林水産業',
]);

// ソフトデリート
$industry->delete();

// 削除済みを含めて取得
$allIndustries = Industry::withTrashed()->get();
```

## 注意事項

1. **得意先グループとの関連**
   - このテーブルは得意先グループマスタから参照される
   - 得意先グループがどの業種に属するかを分類するために使用

2. **業種名の一意性**
   - industry_name に一意制約があるため、同じ名前の業種は登録不可

3. **ID の管理**
   - industry_id は自動採番なし
   - アプリケーション側で明示的にIDを管理する必要あり

4. **ソフトデリート**
   - 物理削除ではなくソフトデリート（論理削除）を使用
   - 過去データとの整合性を保つため

5. **created_at の不使用**
   - このテーブルは `created_at` を持たず、`updated_at` のみ使用
   - モデルで `const CREATED_AT = null;` を設定

## 更新履歴

- 2025-12-10: 初版作成
- 2026-01-12: テーブル定義フォーマット統一

---

[戻る: テーブル一覧](../tables.md)
