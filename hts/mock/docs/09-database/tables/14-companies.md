# 会社団体マスタ (companies)

## 概要

**テーブル物理名**: `companies`

**テーブル論理名**: 会社団体マスタ

**用途**:
- 得意先グループに属する会社団体を管理
- 「◯◯株式会社」のような個別の会社・団体を登録
- 得意先マスタから参照される

## テーブル定義

| No. | 論理名 | 物理名 | データ型 | 桁数 | Not Null | PK | UK | FK | Default | 備考 |
|-----|--------|--------|----------|------|----------|----|----|----|---------| ----- |
| 1 | 会社団体マスタid | company_id | BIGINT | - | ● | ● | ● | - | - | - |
| 2 | 得意先グループid | customer_group_id | BIGINT | - | ● | - | - | ● | - | 得意先グループマスタ.customer_group_id FK制約restrict |
| 3 | 会社団体名 | company_name | VARCHAR(50) | 50 | ● | - | - | - | - | 50桁以内 |
| 4 | 削除日 | deleted_at | TIMESTAMP(0) | - | - | - | - | - | null | - |
| 5 | 更新日 | updated_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |

## インデックス

| インデックス名 | カラム | 種類 | 備考 |
|--------------|--------|------|------|
| PRIMARY | company_id | PRIMARY KEY | 主キー |
| companies_company_id_unique | company_id | UNIQUE | 会社団体ID一意制約 |

## 外部キー制約

| 制約名 | カラム | 参照先テーブル | 参照先カラム | ON DELETE | ON UPDATE |
|--------|--------|--------------|------------|-----------|-----------|
| companies_customer_group_id_foreign | customer_group_id | customer_groups | customer_group_id | RESTRICT | RESTRICT |

## マイグレーションファイル

**ファイルパス**: `backend/database/migrations/2025_12_10_151844_create_companies_table.php`

```php
public function up(): void
{
    Schema::create('companies', function (Blueprint $table) {
        // 会社団体マスタid (自動採番なし)
        $table->bigInteger('company_id')->primary();
        $table->unique('company_id');

        // 得意先グループid (FK制約 restrict)
        $table->bigInteger('customer_group_id');
        $table->foreign('customer_group_id')
            ->references('customer_group_id')
            ->on('customer_groups')
            ->onDelete('restrict')
            ->onUpdate('restrict');

        // 会社団体名 (50桁以内)
        $table->string('company_name', 50);

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

**ファイルパス**: `backend/database/seeders/CompanySeeder.php`

30件のサンプルデータを定義しています:

| company_id | customer_group_id | company_name |
|------------|-------------------|--------------|
| 1 | 1 (あおぞら工業グループ) | あおぞら工業株式会社 |
| 2 | 1 | あおぞら部品株式会社 |
| 3 | 1 | あおぞらテクノ株式会社 |
| 4 | 2 (さくら電子グループ) | さくら電子株式会社 |
| 5 | 2 | さくらデバイス株式会社 |
| 6 | 3 (ひまわり機械グループ) | ひまわり機械株式会社 |
| 7 | 3 | ひまわり精機株式会社 |
| 8-10 | 4 (つばさITグループ) | つばさIT/ソリューション/クラウド |
| 11-12 | 5 (みらいネットグループ) | みらいネット/コミュニケーションズ |
| 13-14 | 6 (はなまる商事グループ) | はなまる商事/貿易 |
| 15 | 7 (こだま物産グループ) | こだま物産株式会社 |
| 16-17 | 8 (なないろストアグループ) | なないろストア/マーケット |
| 18 | 9 (ほしぞらマートグループ) | ほしぞらマート株式会社 |
| 19-20 | 10 (あかつき信金グループ) | あかつき信用金庫/リース |
| 21-22 | 11 (やまびこ保険グループ) | やまびこ損害保険/生命保険 |
| 23-24 | 12 (にじいろサービスグループ) | にじいろサービス/コンサルティング |
| 25-26 | 13 (官公庁A) | 経済産業省/国土交通省 |
| 27-29 | 14 (自治体B) | 東京都/神奈川県/横浜市 |
| 30 | 15 (その他グループ) | その他団体A |

## Eloquentモデル

**ファイルパス**: `backend/app/Models/Company.php`

```php
class Company extends Model
{
    use SoftDeletes;

    protected $table = 'companies';
    protected $primaryKey = 'company_id';
    public $incrementing = false;
    const CREATED_AT = null; // created_at は使用しない

    protected $fillable = [
        'company_id',
        'customer_group_id',
        'company_name',
    ];

    public function customerGroup(): BelongsTo
    {
        return $this->belongsTo(CustomerGroup::class, 'customer_group_id', 'customer_group_id');
    }
}
```

## 使用例（Eloquent）

```php
use App\Models\Company;
use App\Models\CustomerGroup;

// 全件取得（得意先グループ含む）
$companies = Company::with('customerGroup')->get();

// 会社団体名で検索
$company = Company::where('company_name', 'like', '%工業%')->get();

// 得意先グループから会社団体を取得
$group = CustomerGroup::find(1);
$companies = $group->companies;

// 業種→得意先グループ→会社団体と辿る
$company = Company::with('customerGroup.industry')->find(1);
$industryName = $company->customerGroup->industry->industry_name;

// 新規作成
$company = Company::create([
    'company_id' => 31,
    'customer_group_id' => 1,
    'company_name' => '新規会社株式会社',
]);

// ソフトデリート
$company->delete();
```

## 注意事項

1. **得意先グループとの関連**
   - 各会社団体は必ず1つの得意先グループに属する
   - FK制約がRESTRICTのため、会社団体が存在する得意先グループは削除不可

2. **会社団体名の重複**
   - company_name に一意制約はない
   - 同じ名前の会社団体を複数登録可能（異なるグループに同名会社がある場合など）

3. **ID の管理**
   - company_id は自動採番なし
   - アプリケーション側で明示的にIDを管理する必要あり

4. **ソフトデリート**
   - 物理削除ではなくソフトデリート（論理削除）を使用
   - 過去データとの整合性を保つため

5. **created_at の不使用**
   - このテーブルは `created_at` を持たず、`updated_at` のみ使用
   - モデルで `const CREATED_AT = null;` を設定

6. **データ階層**
   - 業種マスタ → 得意先グループマスタ → 会社団体マスタ
   - 会社団体から業種を取得するには、得意先グループを経由する

## 更新履歴

- 2025-12-10: 初版作成
- 2026-01-12: テーブル定義フォーマット統一

---

[戻る: テーブル一覧](../tables.md)
