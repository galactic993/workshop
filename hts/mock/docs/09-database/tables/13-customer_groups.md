# 得意先グループマスタ (customer_groups)

## 概要

**テーブル物理名**: `customer_groups`

**テーブル論理名**: 得意先グループマスタ

**用途**:
- 会社団体をグループ化するためのマスタテーブル
- 会社団体マスタに「◯◯株式会社」のようなレコードがあり、それを「◯◯グループ」としてまとめる
- 会社団体マスタから参照される

## テーブル定義

| No. | 論理名 | 物理名 | データ型 | 桁数 | Not Null | PK | UK | FK | Default | 備考 |
|-----|--------|--------|----------|------|----------|----|----|----|---------| ----- |
| 1 | 得意先グループマスタid | customer_group_id | BIGINT | - | ● | ● | ● | - | - | - |
| 2 | 業種id | industry_id | BIGINT | - | ● | - | - | ● | - | 業種マスタ.industry_id FK制約restrict |
| 3 | 得意先グループ名 | customer_group_name | VARCHAR(40) | 40 | ● | - | ● | - | - | 40桁以内 |
| 4 | 削除日 | deleted_at | TIMESTAMP(0) | - | - | - | - | - | null | - |
| 5 | 更新日 | updated_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |

## インデックス

| インデックス名 | カラム | 種類 | 備考 |
|--------------|--------|------|------|
| PRIMARY | customer_group_id | PRIMARY KEY | 主キー |
| customer_groups_customer_group_id_unique | customer_group_id | UNIQUE | 得意先グループID一意制約 |
| customer_groups_customer_group_name_unique | customer_group_name | UNIQUE | 得意先グループ名一意制約 |

## 外部キー制約

| 制約名 | カラム | 参照先テーブル | 参照先カラム | ON DELETE | ON UPDATE |
|--------|--------|--------------|------------|-----------|-----------|
| customer_groups_industry_id_foreign | industry_id | industries | industry_id | RESTRICT | RESTRICT |

## マイグレーションファイル

**ファイルパス**: `backend/database/migrations/2025_12_10_151047_create_customer_groups_table.php`

```php
public function up(): void
{
    Schema::create('customer_groups', function (Blueprint $table) {
        // 得意先グループマスタid (自動採番なし)
        $table->bigInteger('customer_group_id')->primary();
        $table->unique('customer_group_id');

        // 業種id (FK制約 restrict)
        $table->bigInteger('industry_id');
        $table->foreign('industry_id')
            ->references('industry_id')
            ->on('industries')
            ->onDelete('restrict')
            ->onUpdate('restrict');

        // 得意先グループ名 (40桁以内、一意制約)
        $table->string('customer_group_name', 40);
        $table->unique('customer_group_name');

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

**ファイルパス**: `backend/database/seeders/CustomerGroupSeeder.php`

15件のサンプルデータを定義しています:

| customer_group_id | industry_id | customer_group_name |
|-------------------|-------------|---------------------|
| 1 | 1 (製造業) | あおぞら工業グループ |
| 2 | 1 (製造業) | さくら電子グループ |
| 3 | 1 (製造業) | ひまわり機械グループ |
| 4 | 2 (情報通信業) | つばさITグループ |
| 5 | 2 (情報通信業) | みらいネットグループ |
| 6 | 3 (卸売業) | はなまる商事グループ |
| 7 | 3 (卸売業) | こだま物産グループ |
| 8 | 4 (小売業) | なないろストアグループ |
| 9 | 4 (小売業) | ほしぞらマートグループ |
| 10 | 5 (金融・保険業) | あかつき信金グループ |
| 11 | 5 (金融・保険業) | やまびこ保険グループ |
| 12 | 9 (サービス業) | にじいろサービスグループ |
| 13 | 12 (官公庁・団体) | 官公庁A |
| 14 | 12 (官公庁・団体) | 自治体B |
| 15 | 13 (その他) | その他グループ |

## Eloquentモデル

**ファイルパス**: `backend/app/Models/CustomerGroup.php`

```php
class CustomerGroup extends Model
{
    use SoftDeletes;

    protected $table = 'customer_groups';
    protected $primaryKey = 'customer_group_id';
    public $incrementing = false;
    const CREATED_AT = null; // created_at は使用しない

    protected $fillable = [
        'customer_group_id',
        'industry_id',
        'customer_group_name',
    ];

    public function industry(): BelongsTo
    {
        return $this->belongsTo(Industry::class, 'industry_id', 'industry_id');
    }
}
```

## 使用例（Eloquent）

```php
use App\Models\CustomerGroup;
use App\Models\Industry;

// 全件取得（業種含む）
$groups = CustomerGroup::with('industry')->get();

// 得意先グループ名で検索
$group = CustomerGroup::where('customer_group_name', 'あおぞら工業グループ')->first();
$industry = $group->industry; // 業種を取得

// 業種から得意先グループを取得
$industry = Industry::find(1);
$groups = $industry->customerGroups;

// 新規作成
$group = CustomerGroup::create([
    'customer_group_id' => 16,
    'industry_id' => 1,
    'customer_group_name' => '新規グループ',
]);

// ソフトデリート
$group->delete();
```

## 注意事項

1. **会社団体との関連**
   - このテーブルは会社団体マスタから参照される
   - 複数の会社団体を1つのグループとしてまとめるために使用

2. **業種との関連**
   - 各得意先グループは必ず1つの業種に属する
   - FK制約がRESTRICTのため、参照されている業種は削除不可

3. **得意先グループ名の一意性**
   - customer_group_name に一意制約があるため、同じ名前のグループは登録不可

4. **ID の管理**
   - customer_group_id は自動採番なし
   - アプリケーション側で明示的にIDを管理する必要あり

5. **ソフトデリート**
   - 物理削除ではなくソフトデリート（論理削除）を使用
   - 過去データとの整合性を保つため

6. **created_at の不使用**
   - このテーブルは `created_at` を持たず、`updated_at` のみ使用
   - モデルで `const CREATED_AT = null;` を設定

## 更新履歴

- 2025-12-10: 初版作成
- 2026-01-12: テーブル定義フォーマット統一

---

[戻る: テーブル一覧](../tables.md)
