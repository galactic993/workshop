# 作業部門マスタ (operations)

## 概要

**テーブル物理名**: `operations`

**テーブル論理名**: 作業部門マスタ

**用途**:
- 作業項目をグループ化するための作業部門を管理
- 加工品内容コードの先頭3桁でグループ化に使用
- 印刷、編集、開発などの作業部門を定義

## テーブル定義

| No. | 論理名 | 物理名 | データ型 | 桁数 | Not Null | PK | UK | FK | Default | 備考 |
|-----|--------|--------|----------|------|----------|----|----|----|---------| ----- |
| 1 | 作業部門マスタid | operation_id | BIGSERIAL | - | ● | ● | ● | - | - | 自動採番 |
| 2 | 作業部門コード | operation_cd | CHAR(3) | 3 | ● | - | ● | - | - | 半角数字3桁 |
| 3 | 作業部門名 | operation_name | VARCHAR(30) | 30 | ● | - | ● | - | - | 30桁以内 |
| 4 | 削除日 | deleted_at | TIMESTAMP(0) | - | - | - | - | - | null | - |
| 5 | 更新日 | updated_at | TIMESTAMP(0) | - | ● | - | - | - | CURRENT_TIMESTAMP | - |

## インデックス

| インデックス名 | カラム | 種類 | 備考 |
|--------------|--------|------|------|
| operations_pkey | operation_id | PRIMARY KEY | 主キー |
| operations_operation_id_unique | operation_id | UNIQUE | 作業部門ID一意制約 |
| operations_operation_cd_unique | operation_cd | UNIQUE | 作業部門コード一意制約 |
| operations_operation_name_unique | operation_name | UNIQUE | 作業部門名一意制約 |

## 作業部門コード

| コード | 名称 |
|--------|------|
| 100 | 印刷 |
| 200 | 編集 |
| 300 | 開発 |

## Eloquentモデル

- ファイル: `backend/app/Models/Operation.php`
- トレイト:
  - `SoftDeletes`: ソフトデリート

## 関連テーブル

- [作業項目マスタ (operation_items)](21-operation_items.md) ※後述

## 更新履歴

- 2025-12-24: 初版作成
- 2026-01-12: テーブル定義フォーマット統一
