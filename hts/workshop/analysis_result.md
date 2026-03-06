# Excel 分析結果

## 1. 参照仕様シートの分析

### 英数字パターン (word.word形式)
**合計: 0件**

英数字のみのドット区切りパターンはありません。

---

### 日本語パターン (テーブル名.カラム名形式)
**合計: 62件**

```
  1.《ログインユーザーの所属組織がセンターかチェック》
  1.《依頼者に紐づく組織マスタレコードのセンターフラグチェック》
  2.《センター部署コードを取得》
  2.《省略名を取得》
  3.《親組織
  and　制作見積.id
  and　制作見積.ステータス
  and　制作見積.見積id
  and　制作見積依頼.ステータス
  and　制作見積依頼.作業部署id
  and　制作見積依頼.制作見積id
  and　組織マスタ.id
  and　組織マスタ.センターフラグ
  and　組織別部署コード.組織id
  and　見積.id
  and　見積.主管センターid
  and　見積.得意先id
  and　部署コードマスタ.id
  and　部署コードマスタ.部署コード
  ド.部署id
  制作見積.id
  制作見積.ステータス
  制作見積.基準価格
  制作見積.見積id
  制作見積依頼.id
  制作見積依頼.ステータス
  制作見積依頼.作業部署id
  制作見積依頼.依頼概要
  制作見積依頼.依頼者id
  制作見積依頼.制作見積id
  制作見積依頼.参考資料
  制作見積依頼.根拠資料
  制作見積依頼.設計者id
  制作見積詳細.制作見積依頼id
  制作見積詳細.加工品内容id
  制作見積詳細.単価
  制作見積詳細.数量
  制作見積詳細.金額
  所属組織.社員id
  所属組織.組織id
  組織マスタ.id
  組織マスタ.センターフラグ
  組織マスタ.出力順
  組織マスタ.省略名
  組織別部署コード.組織id
  組織別部署コード.部署id
  見積.id
  見積.主管センターid
  見積.参考資料
  見積.品名
  見積.得意先id
  見積.得意先idに紐づく得意先名
  見積.得意先名
  見積.得意先名がNot
  見積.得意先名がNullの場合
  見積.担当者id
  見積.担当部署id
  見積.見積件名
  見積.見積書No
  見積.見積概要
  部署コードマスタ.id
  部署コードマスタ.部署コード
```

---

## 2. ドット含むセル一覧（全件）

以下の全セルがドット「.」または「．」を含みます：

```
[4,3] 1.《ログインユーザーの所属組織がセンターかチェック》
[8,5] 組織マスタ.センターフラグ
[10,5] 所属組織.社員id=ログインユーザーの社員マスタid
[11,4] and　組織マスタ.id=所属組織.組織id
[18,3] 2.《センター部署コードを取得》
[18,25] 3.《親組織(センター)のセンター部署コードを取得》
[22,5] 部署コードマスタ.部署コード
[22,27] 部署コードマスタ.部署コード
[24,5] 組織別部署コード.組織id=抽出した組織マスタレコードのid
[24,27] 組織マスタ.id=抽出した組織マスタレコードのセンターid
[25,4] and　部署コードマスタ.id=組織別部署コード.部署id
[25,26] and　組織別部署コード.組織id=抽出した組織マスタレコードのid
[26,26] and　部署コードマスタ.id=組織別部署コード.部署id
[31,1] No.
[40,3] 見積.主管センターid.部署コード=ログインユーザーの所属センター部署コード
[41,2] and　制作見積.見積id=見積.id
[42,2] and　制作見積.ステータス=00(未着手)
[43,1] No.
[45,30] 見積.見積書No
[48,17] 見積.得意先名がNullの場合
[49,18] →見積.得意先idに紐づく得意先名
[49,30] 見積.得意先id.得意先名
[51,30] 見積.得意先名=null
[52,17] 見積.得意先名がNot Nullの場合
[53,18] →見積.得意先名
[53,30] 見積.得意先名
[55,30] 見積.得意先名=not null
[57,30] 見積.見積件名
[61,30] 見積.品名
[65,30] 組織マスタ.省略名
[67,30] 部署コードマスタ.id=見積.担当部署id
[68,29] and　部署コードマスタ.部署コード(先頭3桁)=抽出した部署コー
[71,29] ド.部署id
[72,29] and　組織マスタ.id=組織別部署コード.組織id
[73,29] and　組織マスタ.センターフラグ=True(センター)
[75,30] 制作見積.基準価格
[82,1] No.
[91,3] 制作見積依頼.作業部署id.部署コード=ログインユーザーの所属センター部署コード
[92,2] and　制作見積依頼.ステータス=選択値（未着手以外）
[93,2] and　制作見積.id=制作見積依頼.制作見積id
[94,2] and　見積.id=制作見積.見積id
[95,1] No.
[97,30] 見積.見積書No
[99,30] 見積.見積書No=入力値
[100,17] 見積.得意先名がNullの場合
[101,18] →見積.得意先idに紐づく得意先名
[101,30] 見積.得意先id.得意先名
[103,30] 見積.得意先名=null
[104,29] and　見積.得意先id=入力値or選択値
[105,17] 見積.得意先名がNot Nullの場合
[106,18] →見積.得意先名
[106,30] 見積.得意先名
[108,30] 見積.得意先名=not null
[109,29] and　見積.得意先id=入力値or選択値
[111,30] 見積.見積件名
[113,30] 見積.見積件名=入力値
[115,30] 見積.品名
[117,30] 見積.品名=入力値
[121,30] 制作見積.基準価格
[126,3] 1.《依頼者に紐づく組織マスタレコードのセンターフラグチェック》
[130,5] 組織マスタ.センターフラグ
[132,5] 所属組織.社員id=制作見積依頼.依頼者id
[133,4] and　組織マスタ.id=所属組織.組織id
[140,3] 2.《省略名を取得》
[140,25] 3.《親組織(センター)の省略名を取得》
[144,5] 組織マスタ.省略名
[144,27] 組織マスタ.省略名
[146,27] 組織マスタ.id=抽出した組織マスタレコードのセンターid
[151,3] 見積.見積書No=一覧から選択した見積書No
[152,1] No.
[154,30] 見積.見積書No
[158,30] 見積.担当者id.社員名
[162,30] 見積.得意先id.得意先コード
[165,17] 見積.得意先名がNullの場合
[166,18] →見積.得意先idに紐づく得意先名
[166,30] 見積.得意先id.得意先名
[168,30] 見積.得意先名=null
[169,17] 見積.得意先名がNot Nullの場合
[170,18] →見積.得意先名
[170,30] 見積.得意先名
[172,30] 見積.得意先名=not null
[174,30] 見積.主管センターid.部署名
[178,30] 見積.見積件名
[182,30] 見積.品名
[186,30] 見積.見積概要
[190,30] 見積.参考資料
[196,1] No.
[201,3] 見積.見積書No=一覧から選択した見積書No
[202,2] and　見積.主管センターid.部署コード≠ログインユーザーの所属センター部署コード
[203,2] and　制作見積.見積id=見積.id
[204,2] and　制作見積依頼.制作見積id=制作見積.id
[205,2] and　制作見積依頼.作業部署id.部署コード=ログインユーザーの所属センター部署コード
[206,1] No.
[208,30] 制作見積依頼.依頼者id.社員名
[212,30] 制作見積依頼.依頼概要
[216,30] 制作見積依頼.参考資料
[222,3] 見積.見積書No=一覧から選択した見積書No
[223,2] and　制作見積.見積id=見積.id
[224,2] and　制作見積依頼.制作見積id=制作見積.id
[225,2] and　制作見積依頼.作業部署id.部署コード=ログインユーザーの所属センター部署コード
[226,1] No.
[228,30] 制作見積依頼.ステータス
[232,30] 制作見積依頼.設計者id.社員名
[236,30] 制作見積詳細.加工品内容id.加工品内容コード
[238,30] 制作見積詳細.制作見積依頼id=制作見積依頼.id
[240,30] 制作見積詳細.加工品内容id.内容
[242,30] 制作見積詳細.制作見積依頼id=制作見積依頼.id
[244,30] 制作見積詳細.単価
[246,30] 制作見積詳細.制作見積依頼id=制作見積依頼.id
[248,30] 制作見積詳細.数量
[250,30] 制作見積詳細.制作見積依頼id=制作見積依頼.id
[252,30] 制作見積詳細.金額
[254,30] 制作見積詳細.制作見積依頼id=制作見積依頼.id
[257,30] 制作見積依頼.根拠資料
[263,3] 見積.見積書No=一覧から選択した見積書No
[264,2] and　見積.主管センターid.部署コード=ログインユーザーの所属センター部署コード
[265,2] and　制作見積.見積id=見積.id
[266,2] and　制作見積依頼.制作見積id=制作見積.id
[267,2] and　制作見積依頼.作業部署id.部署コード≠ログインユーザーの所属センター部署コード
[268,1] No.
[270,30] 組織マスタ.省略名
[271,30] 組織マスタ.出力順
[273,30] 組織別部署コード.部署id=制作見積依頼.作業部署id
[274,29] and　組織マスタ.id=組織別部署コード.組織id
[276,30] 制作見積依頼.ステータス
[280,30] 制作見積依頼.ステータス
[281,30] 制作見積詳細.金額
[283,30] 制作見積詳細.制作見積依頼id=制作見積依頼.id
[289,3] 見積.見積書No=一覧から選択した見積書No
[290,2] and　見積.主管センターid.部署コード=ログインユーザーの所属センター部署コード
[291,2] and　制作見積.見積id=見積.id
[292,1] No.
[294,30] 制作見積.ステータス
[298,30] 制作見積.基準価格
[305,3] 見積.見積書No=一覧から選択した見積書No
[306,2] and　制作見積.見積id=見積.id
[307,2] and　制作見積依頼.制作見積id=制作見積.id
[308,2] and　制作見積依頼.作業部署id.部署コード=選択したセンターの部署コード
[309,1] No.
[311,30] 制作見積依頼.依頼者id.社員名
[315,30] 制作見積依頼.依頼概要
[319,30] 制作見積依頼.参考資料
```

---

## 3. テーブル定義書の分析

### テーブル一覧と物理名（N列 Index 13）

#### 1. 制作見積 (prod_quots)
**物理カラム：** prod_quot_id, quot_id, cost, quot_doc_path, reference_doc_path, submission_on, prod_quot_status, version, created_at, updated_at

#### 2. 制作見積依頼 (prod_quot_requests)
**物理カラム：** prod_quot_request_id, prod_quot_id, section_cd_id, requested_by, request_summary, reference_doc_path, supporting_doc_path, designed_by, approved_by, approved_at, prod_quot_request_status, created_at, updated_at

#### 3. 制作見積詳細 (prod_quot_details)
**物理カラム：** prod_quot_detail_id, prod_quot_request_id, proces_cd_id, employee_id, quantity, unit_cost, cost, created_at, updated_at

#### 4. 作業部門別制作見積 (prod_quot_operations)
**物理カラム：** prod_quot_operation_id, prod_quot_id, operation_id, prod_quot_cost, created_at, updated_at

#### 5. 制作見積差戻管理 (prod_quot_return_log)
**物理カラム：** prod_quot_return_log_id, prod_quot_id, previous_version, next_version, remand_reason, created_at, updated_at

#### 6. 制作基準価格 (prod_costs)
**物理カラム：** prod_cost_id, internal_order_id, proces_cd_id, section_cd_id, quantity, cost, created_at, updated_at

#### 7. ランク単価マスタ (rank_unit_costs)
**物理カラム：** rank_unit_cost_id, unit_cost, deleted_at

#### 8. ランク単価マスタ履歴 (rank_unit_cost_log)
**物理カラム：** rank_unit_cost_log_id, rank_unit_cost_id, action_type, unit_cost, processed_by, processed_at

#### 9. 個人別ランク単価マスタ (person_ranks)
**物理カラム：** person_rank_id, rank_unit_cost_id, employee_id

#### 10. 個人別ランク単価マスタ履歴 (person_rank_log)
**物理カラム：** person_rank_log_id, person_rank_id, rank_unit_cost_id, action_type, processed_by, processed_at

#### 11. 原価単価マスタ (cost_unit_costs)
**物理カラム：** cost_unit_cost_id, proces_cd_id, unit_cost, deleted_at

#### 12. 原価単価マスタ履歴 (cost_unit_cost_log)
**物理カラム：** cost_unit_cost_log_id, cost_unit_cost_id, unit_cost, action_type, processed_by, processed_at

#### 13. 作業振分 (work_assignments)
**物理カラム：** work_assignment_id, order_operation_cost_id, section_cd_id, cost, created_at, updated_at

#### 14. 作業項目別作業設計 (work_item_plans)
**物理カラム：** work_item_plan_id, work_assignment_id, proces_cd_id, section_cd_id, cost, created_at, updated_at

#### 15. 担当者別作業設計 (work_executor_plans)
**物理カラム：** work_executor_plan_id, work_item_plan_id, executor_type, employee_id, outsource_id, man_hours, unit_cost, cost, created_at, updated_at

#### 16. 作業実績 (work_time_entries)
**物理カラム：** work_time_entry_id, work_executor_plan_id, work_on, start_time, end_time, created_at, updated_at

#### 17. 社内仕掛在庫金額計上 (in_progress_inv_postings)
**物理カラム：** in_progress_inv_posting_id, order_id, operation_id, accrual_cost, year_month, created_at, updated_at

---

## 重要な発見

### 抽出されたテーブル・カラム参照パターン（62件）

主要なテーブル：
- **制作見積** (prod_quots)
- **制作見積依頼** (prod_quot_requests)
- **制作見積詳細** (prod_quot_details)
- **見積** (quotes, 仕様書では「見積」と表記)
- **組織マスタ**
- **部署コードマスタ**
- **組織別部署コード**
- **所属組織**

### 主要な関連キー（foreign keys）：
- 制作見積.見積id = 見積.id
- 制作見積依頼.制作見積id = 制作見積.id
- 制作見積詳細.制作見積依頼id = 制作見積依頼.id
- 見積.得意先id → 得意先テーブル
- 見積.担当者id → 社員テーブル
- 見積.主管センターid → 部署マスタ
- 見積.担当部署id → 部署コードマスタ
- 制作見積依頼.依頼者id → 社員マスタ
- 制作見積依頼.設計者id → 社員マスタ
- 制作見積依頼.作業部署id → 部署コードマスタ

---

## ファイルパス

- スクリプト: `/Users/izutanikazuki/kzp/fileMaker/training/analyze_refs.py`
- 結果出力: `/Users/izutanikazuki/kzp/fileMaker/training/analysis_result.md`
