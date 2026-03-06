# 部署別得意先 (customer_section_cd)

## 概要

**テーブル物理名**: `customer_section_cd`

**テーブル論理名**: 部署別得意先

**用途**:
- センターの部署コードと得意先の紐付けを管理
- 受注データ登録時など、得意先選択の絞り込みに使用
- 部署コードごとに担当する得意先を定義

## テーブル定義

| No. | 論理名 | 物理名 | データ型 | 桁数 | Not Null | PK | UK | FK | Default | 備考 |
|-----|--------|--------|----------|------|----------|----|----|----|---------| ----- |
| 1 | 部署別得意先id | customer_section_cd_id | BIGSERIAL | - | ● | ● | ● | - | - | 自動採番 |
| 2 | センター部署id | section_cd_id | BIGINT | - | ● | - | ※1 | ● | - | 部署コードマスタ.section_cd_id FK制約cascade |
| 3 | 得意先id | customer_id | BIGINT | - | ● | - | ※1 | ● | - | 得意先マスタ.customer_id FK制約cascade |
| 4 | 更新日 | updated_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |

※1: section_cd_id と customer_id の複合ユニーク制約

## インデックス

| インデックス名 | カラム | 種類 | 備考 |
|--------------|--------|------|------|
| PRIMARY | customer_section_cd_id | PRIMARY KEY | 主キー |
| customer_section_cd_customer_section_cd_id_unique | customer_section_cd_id | UNIQUE | 部署別得意先ID一意制約 |
| customer_section_cd_unique | (section_cd_id, customer_id) | UNIQUE | 複合一意制約 |

## 外部キー制約

| 制約名 | カラム | 参照先テーブル | 参照先カラム | ON DELETE | ON UPDATE |
|--------|--------|--------------|------------|-----------|-----------|
| customer_section_cd_section_cd_id_foreign | section_cd_id | section_cds | section_cd_id | CASCADE | CASCADE |
| customer_section_cd_customer_id_foreign | customer_id | customers | customer_id | CASCADE | CASCADE |

## サンプルデータ

```
customer_section_cd_id | section_cd_id | customer_id
----------------------|---------------|-------------
1                     | 13            | 1            -- 第1営業センター - あおぞら工業 営業本部
2                     | 13            | 2            -- 第1営業センター - あおぞら工業 技術開発部
3                     | 19            | 3            -- 第2営業センター - さくら電子 購買部
4                     | 19            | 6            -- 第2営業センター - はなまる商事 本社
5                     | 7             | 4            -- 東京営業センター - つばさIT システム開発事業部
6                     | 7             | 5            -- 東京営業センター - つばさIT クラウド事業部
7                     | 7             | 7            -- 東京営業センター - 東京都 総務局
8                     | 7             | 8            -- 東京営業センター - 東京都 産業労働局
```

## 注意事項

1. **CASCADE削除**
   - 部署コードまたは得意先が削除された場合、関連する部署別得意先レコードも自動削除される

2. **複合ユニーク制約**
   - 同一の部署コードと得意先の組み合わせは1つしか登録できない

3. **多対多リレーション**
   - 1つの部署コードに複数の得意先を紐付け可能
   - 1つの得意先を複数の部署コードに紐付け可能

4. **created_at の不使用**
   - このテーブルは `created_at` を持たず、`updated_at` のみ使用

## 更新履歴

- 2025-12-10: 初版作成
- 2026-01-12: テーブル定義フォーマット統一

---

[戻る: テーブル一覧](../tables.md)
