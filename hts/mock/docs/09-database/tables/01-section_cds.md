# 部署コードマスタ (section_cds)

## 概要

**テーブル物理名**: `section_cds`

**テーブル論理名**: 部署コードマスタ

**用途**:
- 受注データや見積データなどの**集計単位**となる部署コードを管理
- あくまで集計単位であり、組織の部署そのものを表すテーブルではない
- 各種データがこのテーブルの部署コードに紐づく形で管理される

## テーブル定義

| No. | 論理名 | 物理名 | データ型 | 桁数 | Not Null | PK | UK | FK | Default | 備考 |
|-----|--------|--------|----------|------|----------|----|----|----|---------| ----- |
| 1 | 部署コードマスタid | section_cd_id | BIGINT | - | ● | ● | ● | - | - | - |
| 2 | 部署コード | section_cd | CHAR(6) | 6 | ● | - | ● | - | - | 半角数字6桁 |
| 3 | 部署名 | section_name | VARCHAR(30) | 30 | ● | - | - | - | - | 30桁以内 |
| 4 | 経費区分 | expense_category | CHAR(2) | 2 | ● | - | - | - | - | 半角数字2桁 23:製造費 25:製造管理費 29:販売費 30:販売管理費 60:一般管理費 |
| 5 | 削除フラグ | deleted_flag | CHAR(1) | 1 | ● | - | - | - | 0:有効 | 0:有効 1:無効 |
| 6 | 更新日 | updated_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |

## 削除フラグの値

| 値 | 説明 |
|----|------|
| 0 | 有効 |
| 1 | 無効 |

## 経費区分の値

| コード | 説明 |
|--------|------|
| 23 | 製造費 |
| 25 | 製造管理費 |
| 29 | 販売費 |
| 30 | 販売管理費 |
| 60 | 一般管理費 |

## インデックス

| インデックス名 | カラム | 種類 | 備考 |
|--------------|--------|------|------|
| PRIMARY | section_cd_id | PRIMARY KEY | 主キー |
| section_cds_section_cd_unique | section_cd | UNIQUE | 部署コード一意制約 |

## リレーション

**参照元テーブル** (このテーブルを参照するテーブル):
- 受注データテーブル (今後実装)
- 見積データテーブル (今後実装)
- その他集計対象データ (今後実装)

## Eloquentモデル

**ファイルパス**: `backend/app/Models/SectionCd.php`

**主な設定**:
```php
class SectionCd extends Model
{
    protected $table = 'section_cds';
    protected $primaryKey = 'section_cd_id';
    const CREATED_AT = null; // created_at は使用しない

    protected $fillable = [
        'section_cd',
        'section_name',
        'expense_category',
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

**ファイルパス**: `backend/database/migrations/2025_12_08_112728_create_section_cds_table.php`

**実行コマンド**:
```bash
# マイグレーション実行
docker compose exec backend php artisan migrate

# ロールバック
docker compose exec backend php artisan migrate:rollback
```

## サンプルデータ

40件のサンプルデータを以下のカテゴリで定義しています:

**その他・経営管理グループ** (5件):
- その他、経営管理グループ、経営スタッフ、新入社員、品質保証センター

**営業グループ** (21件):
- 営業グループ
- 東京営業センター系: 東京営業センター、営業、東京太郎/花子/三郎/四郎
- 第1営業センター系: 第1営業センター、営業、第一太郎/花子/三郎/四郎
- 第2営業センター系: 第2営業センター、営業、第二太郎/花子/三郎/四郎、大阪営業チーム、第二大阪太郎

**編集・ソフトウエア事業グループ** (14件):
- 第2ソフトウェア開発センター系: センター、集計、社内、常駐外注、社外外注発注
- 第1UX編集センター系: センター、第1チーム(社内/常駐外注/社外外注発注)、第2チーム(社内/常駐外注/社外外注発注)

詳細は `backend/database/seeders/SectionCdSeeder.php` を参照してください。

## 使用例(Eloquent)

```php
use App\Models\SectionCd;

// 有効なレコードのみ取得（デフォルト）
$sections = SectionCd::all();

// 部署コードで検索（有効なレコードのみ）
$section = SectionCd::where('section_cd', '100001')->first();

// 無効なレコードを含めて取得
$allSections = SectionCd::withoutGlobalScope('active')->get();

// 無効なレコードのみ取得
$inactiveSections = SectionCd::withoutGlobalScope('active')
    ->where('deleted_flag', '1')
    ->get();

// 新規作成
$section = SectionCd::create([
    'section_cd' => '100004',
    'section_name' => '開発部',
    'expense_category' => '25',
]);

// 無効化（論理削除）
$section->deactivate();

// 有効化
$section->activate();
```

## 注意事項

1. **集計単位としての部署コード**
   - このテーブルは組織の部署そのものではなく、集計のための単位
   - 実際の組織構造は別途管理される場合がある

2. **部署コードの形式**
   - 半角数字6桁固定
   - バリデーションで形式チェックを実施すること

3. **経費区分の検証**
   - 23, 25, 29, 30, 60 のいずれかであることを検証
   - アプリケーション層でバリデーションを実装

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

---

[戻る: テーブル一覧](../tables.md)
