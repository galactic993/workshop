# 得意先マスタ (customers)

## 概要

**テーブル物理名**: `customers`

**テーブル論理名**: 得意先マスタ

**用途**:
- 会社団体に存在する事業部などを管理
- 「◯◯事業部」「◯◯本部」のような単位で登録
- 見積・受注の取引先として使用

## テーブル定義

| No. | 論理名 | 物理名 | データ型 | 桁数 | Not Null | PK | UK | FK | Default | 備考 |
|-----|--------|--------|----------|------|----------|----|----|----|---------| ----- |
| 1 | 得意先マスタid | customer_id | BIGSERIAL | - | ● | ● | ● | - | - | 自動採番 |
| 2 | 得意先コード | customer_cd | CHAR(5) | 5 | ● | - | ● | - | - | 半角数字5桁 |
| 3 | 得意先名 | customer_name | VARCHAR(120) | 120 | ● | - | - | - | - | 120桁以内 |
| 4 | フリガナ | customer_name_kana | VARCHAR(120) | 120 | ● | - | - | - | - | 120桁以内 |
| 5 | 会社団体id | company_id | BIGINT | - | ● | - | - | ● | - | 会社団体マスタ.company_id FK制約restrict |
| 6 | 郵便番号 | postal_cd | CHAR(7) | 7 | - | - | - | - | - | 7桁 |
| 7 | 住所1 | address1 | VARCHAR(100) | 100 | - | - | - | - | - | 100桁以内　都道府県市区町村番地 |
| 8 | 住所2 | address2 | VARCHAR(50) | 50 | - | - | - | - | - | 50桁以内　建物名称等 |
| 9 | 代表者氏名 | representative_name | VARCHAR(30) | 30 | ● | - | - | - | - | 30桁以内　役職は含まず |
| 10 | 電話番号 | phone_number | VARCHAR(15) | 15 | - | - | - | - | - | 「-」含む |
| 11 | FAX番号 | fax_number | VARCHAR(15) | 15 | - | - | - | - | - | 「-」含む |
| 12 | メールアドレス | email | VARCHAR(256) | 256 | - | - | - | - | - | 256桁以内 |
| 13 | 検収有無 | is_inspection | BOOLEAN | - | ● | - | - | - | False:無 | False:無, True:有 |
| 14 | 検収期間月数 | inspection_term_months | VARCHAR(2) | 2 | - | - | - | - | - | 半角数字2桁以内 |
| 15 | 検収日 | inspection_date | VARCHAR(2) | 2 | - | - | - | - | - | 半角数字2桁以内 |
| 16 | 支払期間月数 | payment_term_months | VARCHAR(2) | 2 | ● | - | - | - | - | 半角数字2桁以内 |
| 17 | 支払日 | payment_date | VARCHAR(2) | 2 | ● | - | - | - | - | 半角数字2桁以内 |
| 18 | 支払方法 | payment_type | CHAR(2) | 2 | ● | - | - | - | 00:口座 | 00:口座, 10:現金, 20:小切手, 30:手形 |
| 19 | 消費税集計区分 | tax_rounded_type | CHAR(1) | 1 | ● | - | - | - | 1:四捨五入 | 0:切り捨て, 1:四捨五入 |
| 20 | 振込手数料負担区分 | fee_beare_type | CHAR(1) | 1 | ● | - | - | - | 0:先方負担 | 0:先方負担, 1:当方負担 |
| 21 | 与信限度額 | credit_limit | DECIMAL(9,0) | 9 | ● | - | - | - | - | 9桁以内 |
| 22 | 一品毎受注限度額 | order_limit | DECIMAL(12,0) | 12 | ● | - | - | - | - | 12桁以内、少数なし |
| 23 | 値引有無フラグ | discount_flag | CHAR(1) | 1 | - | - | - | - | null:無 | null:無 1:有 |
| 24 | 削除フラグ | deleted_flag | CHAR(1) | 1 | ● | - | - | - | 0:有効 | 0:有効 1:無効 |
| 25 | 更新日 | updated_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |

## 削除フラグの値

| 値 | 説明 |
|----|------|
| 0 | 有効 |
| 1 | 無効 |

## 値引有無フラグの値

| 値 | 説明 |
|----|------|
| null | 無 |
| 1 | 有 |

## 支払方法の値

| コード | 説明 |
|--------|------|
| 00 | 口座 |
| 10 | 現金 |
| 20 | 小切手 |
| 30 | 手形 |

## インデックス

| インデックス名 | カラム | 種類 | 備考 |
|--------------|--------|------|------|
| PRIMARY | customer_id | PRIMARY KEY | 主キー |
| customers_customer_id_unique | customer_id | UNIQUE | 得意先ID一意制約 |
| customers_customer_cd_unique | customer_cd | UNIQUE | 得意先コード一意制約 |

## 外部キー制約

| 制約名 | カラム | 参照先テーブル | 参照先カラム | ON DELETE | ON UPDATE |
|--------|--------|--------------|------------|-----------|-----------|
| customers_company_id_foreign | company_id | companies | company_id | RESTRICT | RESTRICT |

## マイグレーションファイル

**ファイルパス**: `backend/database/migrations/2025_12_10_152646_create_customers_table.php`

## サンプルデータ

**ファイルパス**: `backend/database/seeders/CustomerSeeder.php`

9件のサンプルデータを定義しています:

| customer_cd | customer_name | company_id | 備考 |
|-------------|---------------|------------|------|
| 00001 | あおぞら工業 営業本部 | 1 | 検収あり |
| 00002 | あおぞら工業 技術開発部 | 1 | 検収なし |
| 00003 | さくら電子 購買部 | 4 | 検収あり、当方負担 |
| 00004 | つばさIT システム開発事業部 | 8 | 検収なし |
| 00005 | つばさIT クラウド事業部 | 8 | 検収あり |
| 00006 | はなまる商事 本社 | 13 | 小切手払い |
| 00007 | 東京都 総務局 | 27 | 官公庁、当方負担 |
| 00008 | 東京都 産業労働局 | 27 | 官公庁、当方負担 |
| 33900 | 諸口 | 31 | **特殊得意先**（下記参照） |

## Eloquentモデル

**ファイルパス**: `backend/app/Models/Customer.php`

```php
class Customer extends Model
{
    protected $table = 'customers';
    protected $primaryKey = 'customer_id';
    const CREATED_AT = null;

    protected $fillable = [
        'customer_cd',
        'customer_name',
        'customer_name_kana',
        'company_id',
        'postal_cd',
        'address1',
        'address2',
        'representative_name',
        'phone_number',
        'fax_number',
        'email',
        'is_inspection',
        'inspection_term_months',
        'inspection_date',
        'payment_term_months',
        'payment_date',
        'payment_type',
        'tax_rounded_type',
        'fee_beare_type',
        'credit_limit',
        'order_limit',
        'discount_flag',
    ];

    protected $casts = [
        'is_inspection' => 'boolean',
        'credit_limit' => 'decimal:0',
        'order_limit' => 'decimal:0',
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

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'company_id', 'company_id');
    }
}
```

## 使用例（Eloquent）

```php
use App\Models\Customer;
use App\Models\Company;

// 有効なレコードのみ取得（デフォルト）
$customers = Customer::with('company')->get();

// 得意先コードで検索（有効なレコードのみ）
$customer = Customer::where('customer_cd', '00001')->first();

// 会社団体から得意先を取得
$company = Company::find(1);
$customers = $company->customers;

// 階層をまとめて取得（業種→グループ→会社→得意先）
$customer = Customer::with('company.customerGroup.industry')->find(1);

// 検収ありの得意先のみ取得
$inspectionCustomers = Customer::where('is_inspection', true)->get();

// 無効なレコードを含めて取得
$allCustomers = Customer::withoutGlobalScope('active')->get();

// 無効なレコードのみ取得
$inactiveCustomers = Customer::withoutGlobalScope('active')
    ->where('deleted_flag', '1')
    ->get();

// 新規作成
$customer = Customer::create([
    'customer_cd' => '00009',
    'customer_name' => '新規得意先',
    'customer_name_kana' => 'シンキトクイサキ',
    'company_id' => 1,
    'representative_name' => '新規太郎',
    'payment_term_months' => '1',
    'payment_date' => '25',
    'credit_limit' => '10000000',
    'order_limit' => 1000000,
]);

// 無効化（論理削除）
$customer->deactivate();

// 有効化
$customer->activate();
```

## 注意事項

1. **会社団体との関連**
   - 各得意先は必ず1つの会社団体に属する
   - FK制約がRESTRICTのため、得意先が存在する会社団体は削除不可

2. **得意先コードの形式**
   - 半角数字5桁固定
   - 一意制約あり

3. **検収関連項目**
   - is_inspection=1の場合のみ、inspection_term_months と inspection_date が有効
   - is_inspection=0の場合はNULLを設定

4. **支払関連項目**
   - payment_term_months: 締め日から支払日までの月数
   - payment_date: 支払日（末日の場合は31）

5. **データ階層**
   - 業種マスタ → 得意先グループマスタ → 会社団体マスタ → 得意先マスタ

6. **削除フラグによる論理削除**
   - 物理削除ではなく削除フラグによる論理削除を使用
   - `deleted_flag = '0'` が有効、`'1'` が無効
   - グローバルスコープにより、デフォルトで有効なレコードのみ取得

7. **created_at の不使用**
   - このテーブルは `created_at` を持たず、`updated_at` のみ使用

8. **値引有無フラグ**
   - `discount_flag` が `null` の場合は値引無、`'1'` の場合は値引有

## 特殊得意先：諸口

**得意先コード**: `33900`

マスタに登録されていない得意先に対して見積や受注を作成する際に使用する特殊な得意先レコード。

### 用途
- 取引頻度が低くマスタ登録不要な得意先
- 一時的な取引先
- 新規取引でマスタ登録が間に合わない場合

### 運用
- 諸口を選択した場合、見積テーブル(`quots`)や受注テーブルの`customer_name`カラムに実際の得意先名を入力する
- 全営業センターから選択可能（`customer_section_cd`テーブルで全センターに紐付け）

### 関連テーブル
- [見積テーブル (quots)](17-quots.md) - `customer_name`カラムで実際の得意先名を管理
- [部署別得意先 (customer_section_cd)](16-customer_section_cd.md) - 全営業センターに紐付け

## 更新履歴

- 2025-12-10: 初版作成
- 2026-01-12: テーブル定義フォーマット統一

---

[戻る: テーブル一覧](../tables.md)
