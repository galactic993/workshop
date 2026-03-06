# Excelファイル分析レポート

## ファイル情報
- **画面設計書**: `/Users/izutanikazuki/kzp/fileMaker/training/sample/02-02_2_編-制作見積-制作見積書作成トップ_画面設計書_1007.xlsx`
- **テーブル定義書**: `/Users/izutanikazuki/kzp/fileMaker/training/sample/編-テーブル定義書_1012.xlsx`

---

## 1. 画面設計書 - シート一覧

| No | シート名 |
|---|---|
| 1 | 表紙 |
| 2 | 変更履歴 |
| 3 | 画面概要 |
| 4 | イベント記述書 |
| 5 | 項目記述書 |
| 6 | **参照仕様** ← メイン対象 |
| 7 | DB登録値 |
| 8 | 表示切替項目 |
| 9 | メッセージ一覧 |
| 10 | Sheet1 |

---

## 2. テーブル定義書 - シート一覧（テーブル名）

### メタシート
1. 表紙
2. 変更履歴
3. テーブル一覧

### データテーブル
4. 制作見積
5. 制作見積依頼
6. 制作見積詳細
7. 作業部門別制作見積
8. 制作見積差戻管理
9. 制作基準価格
10. ランク単価マスタ
11. ランク単価マスタ履歴
12. 個人別ランク単価マスタ
13. 個人別ランク単価マスタ履歴
14. 原価単価マスタ
15. 原価単価マスタ履歴
16. 作業振分
17. 作業項目別作業設計
18. 担当者別作業設計
19. 作業実績
20. 社内仕掛在庫金額計上

---

## 3. 参照仕様シート - 基本情報

| 項目 | 値 |
|---|---|
| **システム名** | 管理会計システム |
| **サブシステム名** | 編集管理 |
| **画面名** | 制作見積書作成<トップ画面> |
| **種別** | 参照仕様 |
| **作成日** | 2025年10月6日 |
| **変更日** | 2026年1月9日 |
| **作成者** | 高嶋　幸太 |
| **変更者** | 高嶋　幸太 |
| **シートサイズ** | 322行 × 49列 |

---

## 4. テーブル定義書 - N列（カラム定義）

### 制作見積
| 物理名 |
|---|
| prod_quot_id |
| quot_id |
| cost |
| quot_doc_path |
| reference_doc_path |
| submission_on |
| prod_quot_status |
| version |
| created_at |
| updated_at |

### 制作見積依頼
| 物理名 |
|---|
| prod_quot_request_id |
| prod_quot_id |
| section_cd_id |
| requested_by |
| request_summary |
| reference_doc_path |
| supporting_doc_path |
| designed_by |
| approved_by |
| approved_at |
| prod_quot_request_status |
| created_at |
| updated_at |

### 制作見積詳細
| 物理名 |
|---|
| prod_quot_detail_id |
| prod_quot_request_id |
| proces_cd_id |
| employee_id |
| quantity |
| unit_cost |
| cost |
| created_at |
| updated_at |

### 作業部門別制作見積
| 物理名 |
|---|
| prod_quot_operation_id |
| prod_quot_id |
| operation_id |
| prod_quot_cost |
| created_at |
| updated_at |

### 制作見積差戻管理
| 物理名 |
|---|
| prod_quot_return_log_id |
| prod_quot_id |
| previous_version |
| next_version |
| remand_reason |
| created_at |
| updated_at |

### 制作基準価格
| 物理名 |
|---|
| prod_cost_id |
| internal_order_id |
| proces_cd_id |
| section_cd_id |
| quantity |
| cost |
| created_at |
| updated_at |

### ランク単価マスタ
| 物理名 |
|---|
| rank_unit_cost_id |
| unit_cost |
| deleted_at |

### ランク単価マスタ履歴
| 物理名 |
|---|
| rank_unit_cost_log_id |
| rank_unit_cost_id |
| action_type |
| unit_cost |
| processed_by |
| processed_at |

### 個人別ランク単価マスタ
| 物理名 |
|---|
| person_rank_id |
| rank_unit_cost_id |
| employee_id |

### 個人別ランク単価マスタ履歴
| 物理名 |
|---|
| person_rank_log_id |
| person_rank_id |
| rank_unit_cost_id |
| action_type |
| processed_by |
| processed_at |

### 原価単価マスタ
| 物理名 |
|---|
| cost_unit_cost_id |
| proces_cd_id |
| unit_cost |
| deleted_at |

### 原価単価マスタ履歴
| 物理名 |
|---|
| cost_unit_cost_log_id |
| cost_unit_cost_id |
| unit_cost |
| action_type |
| processed_by |
| processed_at |

### 作業振分
| 物理名 |
|---|
| work_assignment_id |
| order_operation_cost_id |
| section_cd_id |
| cost |
| created_at |
| updated_at |

### 作業項目別作業設計
| 物理名 |
|---|
| work_item_plan_id |
| work_assignment_id |
| proces_cd_id |
| section_cd_id |
| cost |
| created_at |
| updated_at |

### 担当者別作業設計
| 物理名 |
|---|
| work_executor_plan_id |
| work_item_plan_id |
| executor_type |
| employee_id |
| outsource_id |
| man_hours |
| unit_cost |
| cost |
| created_at |
| updated_at |

### 作業実績
| 物理名 |
|---|
| work_time_entry_id |
| work_executor_plan_id |
| work_on |
| start_time |
| end_time |
| created_at |
| updated_at |

### 社内仕掛在庫金額計上
| 物理名 |
|---|
| in_progress_inv_posting_id |
| order_id |
| operation_id |
| accrual_cost |
| year_month |
| created_at |
| updated_at |

---

## 5. 参照仕様シート - 主要内容

### ◆ログインユーザーの所属センターの取得
画面初期表示時に、ログインユーザーの所属組織がセンター/チームかを判定し、該当するセンター部署コードを取得するロジック

#### 処理フロー:
1. **所属組織がセンターかチェック** → 組織マスタ.センターフラグを確認
   - True(センター): 該当組織のセンター部署コードを取得
   - False(チーム): 親組織(センター)の部署コードを取得

2. **センター部署コード取得**
   - テーブル: 部署コードマスタ
   - 抽出項目: 部署コードマスタ.部署コード
   - 条件: 組織id と部署id の紐付けで検索

3. **親組織(センター)の部署コード取得**
   - テーブル: 部署コードマスタ
   - 抽出項目: 部署コードマスタ.部署コード
   - 条件: 組織マスタのセンターidを参照

### ◆制作見積作成トップ画面 - 初期表示

#### 検索フォーム
- ステータス: 「未着手」を選択
- 見積書No: 空白
- 得意先: 空白
- 見積件名: 空白
- 品名: 空白

#### 一覧表示 - 共通抽出条件
```
見積.主管センターid.部署コード = ログインユーザーの所属センター部署コード
AND 制作見積.見積id = 見積.id
AND 制作見積.ステータス = 00(未着手)
```

#### 一覧表示カラム
| No | 項目名 | 設定内容 | 抽出項目 | 備考 |
|---|---|---|---|---|
| 1 | 見積書No | 該当データ表示 | 見積.見積書No | リンク形式 |
| 2 | 得意先 | 条件付き表示 | 見積.得意先名/得意先id | Null判定あり |
| 3 | 見積件名 | 該当データ表示 | 見積.見積件名 | - |
| 4 | 品名 | 該当データ表示 | 見積.品名 | - |
| 5 | 依頼元 | センター省略名 | 組織マスタ.省略名 | 複雑な抽出条件 |
| 6 | 基準価格 | 該当データ表示 | 制作見積.基準価格 | - |

### ◆制作見積作成トップ画面 - 検索時

#### 検索フォーム
- ステータス: 選択値
- 見積書No: 入力値
- 得意先: 選択値or入力値
- 見積件名: 入力値
- 品名: 入力値

#### 一覧表示 - 共通抽出条件
```
制作見積依頼.作業部署id.部署コード = ログインユーザーの所属センター部署コード
AND 制作見積依頼.ステータス = 選択値（未着手以外）
AND 制作見積.id = 制作見積依頼.制作見積id
AND 見積.id = 制作見積.見積id
```

---

## 6. 分析総括

### データテーブル構成（20個）
- **見積関連**: 制作見積、制作見積依頼、制作見積詳細、作業部門別制作見積、制作見積差戻管理
- **価格マスタ**: 制作基準価格、ランク単価マスタ、個人別ランク単価マスタ、原価単価マスタ
- **作業関連**: 作業振分、作業項目別作業設計、担当者別作業設計、作業実績
- **その他**: 社内仕掛在庫金額計上

### フィールド分析
- **最大フィールド数**: 制作見積依頼テーブル (14フィールド)
- **最小フィールド数**: ランク単価マスタ (3フィールド)
- **共通フィールド**:
  - `created_at`, `updated_at` (ほとんどのテーブル)
  - `deleted_at` (論理削除対応テーブル)
  - `action_type` (履歴テーブル)

### 参照仕様の特徴
- **複合キー取得**: ログインユーザーから多段階で組織/部署情報を取得
- **条件分岐**: Null判定や複雑な抽出条件が多い
- **リレーション**: 見積 → 制作見積 → 制作見積依頼の階層構造
- **ステータス管理**: ステータス別フィルタリング（初期表示は未着手のみ）
- **部署コード取力駄**: 先頭3桁による部署コード抽出ロジック

