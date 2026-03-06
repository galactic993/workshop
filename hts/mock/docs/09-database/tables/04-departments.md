# 組織マスタ (departments)

## 概要

**テーブル物理名**: `departments`

**テーブル論理名**: 組織マスタ

**用途**:
- 実態としての組織（センター・チーム）を管理
- 部署コードマスタ（section_cds）とは異なり、集計単位ではなく実際の組織構造を表現
- 社員は所属組織テーブル（department_employee）を通じていずれかのセンターまたはチームに紐付く
- チームは親となるセンターIDを持ち、階層構造を表現

## テーブル定義

| No. | 論理名 | 物理名 | データ型 | 桁数 | Not Null | PK | UK | FK | Default | 備考 |
|-----|--------|--------|----------|------|----------|----|----|----|---------| ----- |
| 1 | 組織id | department_id | BIGINT | - | ● | ● | ● | - | - | - |
| 2 | 組織名 | department_name | VARCHAR(30) | 30 | ● | - | - | - | - | 30桁以内 |
| 3 | センターフラグ | is_center | BOOLEAN | - | ● | - | - | - | False:チーム | False:チーム、True:センター |
| 4 | 省略名 | display_name | VARCHAR(6) | 6 | - | - | - | - | - | 6桁以内 センターの場合のみ |
| 5 | 出力順 | display_order | SMALLINT | - | - | - | ● | - | - | センターの場合のみ |
| 6 | センターid | center_id | BIGINT | - | - | - | - | ● | - | 組織.department_id FK制約restrict |
| 7 | 組織区分 | department_category | CHAR(2) | 2 | ● | - | - | - | - | 00:スタッフ 10:営業 20:制作 30:印刷 |
| 8 | 削除日 | deleted_at | TIMESTAMP(0) | - | - | - | - | - | null | - |
| 9 | 更新日 | updated_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |

## インデックス

| インデックス名 | カラム | 種類 | 備考 |
|--------------|--------|------|------|
| PRIMARY | department_id | PRIMARY KEY | 主キー |
| departments_department_id_unique | department_id | UNIQUE | 組織ID一意制約 |
| departments_display_order_unique | display_order | UNIQUE | 出力順一意制約（センターのみ） |

## 外部キー制約

| 制約名 | カラム | 参照先テーブル | 参照先カラム | ON DELETE | ON UPDATE |
|--------|--------|--------------|------------|-----------|-----------|
| departments_center_id_foreign | center_id | departments | department_id | RESTRICT | RESTRICT |

## マイグレーションファイル

**ファイルパス**: `backend/database/migrations/2025_12_08_165306_create_departments_table.php`

**実行コマンド**:
```bash
# マイグレーション実行
docker compose exec backend php artisan migrate

# ロールバック
docker compose exec backend php artisan migrate:rollback
```

## サンプルデータ

16件のサンプルデータを以下のカテゴリで定義しています:

**スタッフ (department_category: 00)** (8件):
- システム管理センター (department_id: 1)
- 財務センター (department_id: 2)
- 人事センター (department_id: 3)
- 総務センター (department_id: 4)
- 管理センター (department_id: 5)
- 営業経理センター (department_id: 6) ※財務センター配下
- 経営分析センター (department_id: 7)
- 品質保証センター (department_id: 8)

**営業 (department_category: 10)** (4件):
- 東京営業センター (department_id: 9)
- 第1営業センター (department_id: 10)
- 第2営業センター (department_id: 11)
- 大阪営業チーム (department_id: 12) ※第2営業センター配下

**制作 (department_category: 20)** (4件):
- 第2ソフトウェア開発センター (department_id: 13)
- 第1UX編集センター (department_id: 14)
- 第1チーム (department_id: 15) ※第1UX編集センター配下
- 第2チーム (department_id: 16) ※第1UX編集センター配下

詳細は `backend/database/seeders/DepartmentSeeder.php` を参照してください。

## 組織構造の例

```
システム管理センター（department_id: 1, is_center = 1）
財務センター（department_id: 2, is_center = 1）
  └─ 営業経理センター（department_id: 6, is_center = 1, center_id = 2）
人事センター（department_id: 3, is_center = 1）
総務センター（department_id: 4, is_center = 1）
管理センター（department_id: 5, is_center = 1）
経営分析センター（department_id: 7, is_center = 1）
品質保証センター（department_id: 8, is_center = 1）
東京営業センター（department_id: 9, is_center = 1）
第1営業センター（department_id: 10, is_center = 1）
第2営業センター（department_id: 11, is_center = 1）
  └─ 大阪営業チーム（department_id: 12, is_center = 0, center_id = 11）
第2ソフトウェア開発センター（department_id: 13, is_center = 1）
第1UX編集センター（department_id: 14, is_center = 1）
  ├─ 第1チーム（department_id: 15, is_center = 0, center_id = 14）
  └─ 第2チーム（department_id: 16, is_center = 0, center_id = 14）
```

## 注意事項

1. **センターとチームの区別**
   - `is_center = 1` がセンター、`is_center = 0` がチーム
   - センターは `center_id = NULL`
   - チームは親センターの `center_id` を持つ

2. **センター専用カラム**
   - `display_name`（省略名）と `display_order`（出力順）はセンターのみ使用
   - チームの場合はNULL

3. **組織区分（department_category）**
   - `00`: スタッフ - 管理系の組織
   - `10`: 営業 - 営業部門
   - `20`: 制作 - 編集・ソフトウェア開発部門
   - `30`: 印刷 - 印刷部門
   - 見積の主管センター選択では制作（20）・印刷（30）のみが対象

4. **自己参照FK制約**
   - `center_id` は同じテーブルの `department_id` を参照
   - RESTRICT制約により、チームが存在するセンターは削除不可

5. **ID の管理**
   - `department_id` は自動採番なし
   - アプリケーション側で明示的にIDを管理する必要あり

6. **ソフトデリート**
   - 物理削除ではなくソフトデリート（論理削除）を使用
   - 過去データとの整合性を保つため

## 更新履歴

- 2025-12-08: 初版作成
- 2026-01-12: テーブル定義フォーマット統一

---

[戻る: テーブル一覧](../tables.md)
