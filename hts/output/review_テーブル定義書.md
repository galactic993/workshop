# テーブル定義書レビュー結果

## サマリー

- エラー: 2件
- 警告: 0件
- 情報: 177件

## エラー

### 1. [C1] FK参照先テーブルが見つかりません: 組織マスタ.センターid → 組織

  - 参照元テーブル: departments
  - 参照元カラム: center_id
  - 参照先テーブル: 組織
  - 備考: 組織.department_id FK制約restrict

### 2. [C1] FK参照先テーブルが見つかりません: 担当者別作業設計.担当外注先id → 外注先マスタ

  - 参照元テーブル: work_executor_plans
  - 参照元カラム: outsource_id
  - 参照先テーブル: 外注先マスタ
  - 備考: 外注先マスタ.outsource_id
FK制約restrict

## 情報

### 1. [C3] NOT NULL設定があるがデフォルト値なし: 部署コードマスタ.部署コード

  - テーブル: section_cds
  - カラム: section_cd
  - 型: CHAR(6)

### 2. [C3] NOT NULL設定があるがデフォルト値なし: 部署コードマスタ.部署名

  - テーブル: section_cds
  - カラム: section_name
  - 型: VARCHAR(30)

### 3. [C3] NOT NULL設定があるがデフォルト値なし: 部署コードマスタ.経費区分

  - テーブル: section_cds
  - カラム: expense_category
  - 型: CHAR(2)

### 4. [C3] NOT NULL設定があるがデフォルト値なし: 社員マスタ.社員コード

  - テーブル: employees
  - カラム: employee_cd
  - 型: CHAR(6)

### 5. [C3] NOT NULL設定があるがデフォルト値なし: 社員マスタ.社員名

  - テーブル: employees
  - カラム: employee_name
  - 型: VARCHAR(30)

### 6. [C3] NOT NULL設定があるがデフォルト値なし: 社員マスタ.メールアドレス

  - テーブル: employees
  - カラム: email
  - 型: VARCHAR(256)

### 7. [C3] NOT NULL設定があるがデフォルト値なし: 役割マスタ.役割名

  - テーブル: roles
  - カラム: role_name
  - 型: VARCHAR(30)

### 8. [C3] NOT NULL設定があるがデフォルト値なし: 権限マスタ.権限識別子

  - テーブル: permissions
  - カラム: permission_key
  - 型: VARCHAR(50)

### 9. [C3] NOT NULL設定があるがデフォルト値なし: 権限マスタ.権限名

  - テーブル: permissions
  - カラム: permission_name
  - 型: VARCHAR(30)

### 10. [C3] NOT NULL設定があるがデフォルト値なし: 組織マスタ.組織名

  - テーブル: departments
  - カラム: department_name
  - 型: VARCHAR(30)

### 11. [C3] NOT NULL設定があるがデフォルト値なし: 組織マスタ.組織区分

  - テーブル: departments
  - カラム: department_category
  - 型: CHAR(2)

### 12. [C3] NOT NULL設定があるがデフォルト値なし: メンテナンスログ.メンテナンス対象テーブル

  - テーブル: maintenance_logs
  - カラム: target_table
  - 型: VARCHAR(100)

### 13. [C3] NOT NULL設定があるがデフォルト値なし: メンテナンスログ.メンテナンス種別

  - テーブル: maintenance_logs
  - カラム: maintenance_type
  - 型: VARCHAR(20)

### 14. [C3] NOT NULL設定があるがデフォルト値なし: メンテナンスログ.メンテナンス詳細

  - テーブル: maintenance_logs
  - カラム: maintenance_detail
  - 型: TEXT

### 15. [C3] NOT NULL設定があるがデフォルト値なし: メンテナンスログ.処理者

  - テーブル: maintenance_logs
  - カラム: recorded_by
  - 型: VARCHAR(30)

### 16. [C3] NOT NULL設定があるがデフォルト値なし: お知らせ.お知らせ区分

  - テーブル: notices
  - カラム: notice_category
  - 型: CHAR(1)

### 17. [C3] NOT NULL設定があるがデフォルト値なし: お知らせ.タイトル

  - テーブル: notices
  - カラム: notice_title
  - 型: VARCHAR(50)

### 18. [C3] NOT NULL設定があるがデフォルト値なし: お知らせ.メッセージ

  - テーブル: notices
  - カラム: notice_message
  - 型: TEXT

### 19. [C3] NOT NULL設定があるがデフォルト値なし: お知らせ.公開開始日

  - テーブル: notices
  - カラム: start _on
  - 型: DATE

### 20. [C3] NOT NULL設定があるがデフォルト値なし: お知らせ.公開終了日

  - テーブル: notices
  - カラム: end_on
  - 型: DATE

### 21. [C3] NOT NULL設定があるがデフォルト値なし: 押印欄マスタ.帳票区分

  - テーブル: stamp_areas
  - カラム: doc_type
  - 型: CHAR(2)

### 22. [C3] NOT NULL設定があるがデフォルト値なし: 押印欄マスタ.名称

  - テーブル: stamp_areas
  - カラム: section_name
  - 型: VARCHAR(5)

### 23. [C3] NOT NULL設定があるがデフォルト値なし: 押印欄マスタ.出力順

  - テーブル: stamp_areas
  - カラム: display_order
  - 型: SMALLINT

### 24. [C3] NOT NULL設定があるがデフォルト値なし: 得意先マスタ.得意先コード

  - テーブル: customers
  - カラム: customer_cd
  - 型: CHAR(5)

### 25. [C3] NOT NULL設定があるがデフォルト値なし: 得意先マスタ.得意先名

  - テーブル: customers
  - カラム: customer_name
  - 型: VARCHAR(120)

### 26. [C3] NOT NULL設定があるがデフォルト値なし: 得意先マスタ.フリガナ

  - テーブル: customers
  - カラム: customer_name_kana
  - 型: VARCHAR(120)

### 27. [C3] NOT NULL設定があるがデフォルト値なし: 得意先マスタ.代表者氏名

  - テーブル: customers
  - カラム: representative_name
  - 型: VARCHAR(30)

### 28. [C3] NOT NULL設定があるがデフォルト値なし: 得意先マスタ.支払期間月数

  - テーブル: customers
  - カラム: payment_term_months
  - 型: VARCHAR(2)

### 29. [C3] NOT NULL設定があるがデフォルト値なし: 得意先マスタ.支払日

  - テーブル: customers
  - カラム: payment_date
  - 型: VARCHAR(2)

### 30. [C3] NOT NULL設定があるがデフォルト値なし: 得意先マスタ.与信限度額

  - テーブル: customers
  - カラム: credit_limit
  - 型: DECIMAL(9,0)

### 31. [C3] NOT NULL設定があるがデフォルト値なし: 得意先マスタ.一品毎受注限度額

  - テーブル: customers
  - カラム: order_limit
  - 型: DECIMAL(12,0)

### 32. [C3] NOT NULL設定があるがデフォルト値なし: 業種マスタ.業種名

  - テーブル: industries
  - カラム: industry_name
  - 型: VARCHAR(40)

### 33. [C3] NOT NULL設定があるがデフォルト値なし: 得意先グループマスタ.得意先グループ名

  - テーブル: customer_groups
  - カラム: customer_group_name
  - 型: VARCHAR(40)

### 34. [C3] NOT NULL設定があるがデフォルト値なし: 会社団体マスタ.会社団体名

  - テーブル: companies
  - カラム: company_name
  - 型: VARCHAR(50)

### 35. [C3] NOT NULL設定があるがデフォルト値なし: 作業部門マスタ.作業部門コード

  - テーブル: operations
  - カラム: operation_cd
  - 型: CHAR(3)

### 36. [C3] NOT NULL設定があるがデフォルト値なし: 作業部門マスタ.作業部門名

  - テーブル: operations
  - カラム: operation_name
  - 型: VARCHAR(30)

### 37. [C3] NOT NULL設定があるがデフォルト値なし: 消費税率マスタ.税率区分

  - テーブル: tax_rates
  - カラム: rate_type
  - 型: CHAR(2)

### 38. [C3] NOT NULL設定があるがデフォルト値なし: 消費税率マスタ.消費税率

  - テーブル: tax_rates
  - カラム: tax_rate
  - 型: DECIMAL(4, 2)

### 39. [C3] NOT NULL設定があるがデフォルト値なし: 消費税率マスタ.適用開始年月日

  - テーブル: tax_rates
  - カラム: start _on
  - 型: DATE

### 40. [C3] NOT NULL設定があるがデフォルト値なし: 消費税率マスタ.適用終了年月日

  - テーブル: tax_rates
  - カラム: end_on
  - 型: DATE

### 41. [C3] NOT NULL設定があるがデフォルト値なし: 加工品内容コードマスタ.加工品内容コード

  - テーブル: proces_cds
  - カラム: proces_cd
  - 型: CHAR(8)

### 42. [C3] NOT NULL設定があるがデフォルト値なし: 加工品内容コードマスタ.内容

  - テーブル: proces_cds
  - カラム: proces_content
  - 型: VARCHAR(255)

### 43. [C3] NOT NULL設定があるがデフォルト値なし: 加工品内容コードマスタ.基準単価

  - テーブル: proces_cds
  - カラム: proces_cost
  - 型: DECIMAL(10,2)

### 44. [C3] NOT NULL設定があるがデフォルト値なし: 制作見積.基準価格

  - テーブル: prod_quots
  - カラム: cost
  - 型: DECIMAL(12,0)

### 45. [C3] NOT NULL設定があるがデフォルト値なし: 制作見積詳細.数量

  - テーブル: prod_quot_details
  - カラム: quantity
  - 型: INTEGER

### 46. [C3] NOT NULL設定があるがデフォルト値なし: 制作見積詳細.単価

  - テーブル: prod_quot_details
  - カラム: unit_cost
  - 型: DECIMAL(12,0)

### 47. [C3] NOT NULL設定があるがデフォルト値なし: 制作見積詳細.金額

  - テーブル: prod_quot_details
  - カラム: cost
  - 型: DECIMAL(12,0)

### 48. [C3] NOT NULL設定があるがデフォルト値なし: 作業部門別制作見積.見積基準価格

  - テーブル: prod_quot_operations
  - カラム: prod_quot_cost
  - 型: DECIMAL(12,0)

### 49. [C3] NOT NULL設定があるがデフォルト値なし: 制作見積差戻管理.差戻前バージョン

  - テーブル: prod_quot_return_log
  - カラム: previous_version
  - 型: SMALLINT

### 50. [C3] NOT NULL設定があるがデフォルト値なし: 制作見積差戻管理.差戻後バージョン

  - テーブル: prod_quot_return_log
  - カラム: next_version
  - 型: SMALLINT

### 51. [C3] NOT NULL設定があるがデフォルト値なし: 制作基準価格.数量

  - テーブル: prod_costs
  - カラム: quantity
  - 型: INTEGER

### 52. [C3] NOT NULL設定があるがデフォルト値なし: 制作基準価格.基準価格

  - テーブル: prod_costs
  - カラム: cost
  - 型: DECIMAL(12,0)

### 53. [C3] NOT NULL設定があるがデフォルト値なし: ランク単価マスタ.単価

  - テーブル: rank_unit_costs
  - カラム: unit_cost
  - 型: DECIMAL(12,0)

### 54. [C3] NOT NULL設定があるがデフォルト値なし: 個人別ランク単価マスタ履歴.処理区分

  - テーブル: person_rank_log
  - カラム: action_type
  - 型: CHAR(1)

### 55. [C3] NOT NULL設定があるがデフォルト値なし: 原価単価マスタ.原価単価

  - テーブル: cost_unit_costs
  - カラム: unit_cost
  - 型: DECIMAL(12,0)

### 56. [C3] NOT NULL設定があるがデフォルト値なし: 原価単価マスタ履歴.原価単価

  - テーブル: cost_unit_cost_log
  - カラム: unit_cost
  - 型: DECIMAL(12,0)

### 57. [C3] NOT NULL設定があるがデフォルト値なし: 作業振分.基準価格

  - テーブル: work_assignments
  - カラム: cost
  - 型: DECIMAL(12,0)

### 58. [C3] NOT NULL設定があるがデフォルト値なし: 作業項目別作業設計.基準価格

  - テーブル: work_item_plans
  - カラム: cost
  - 型: DECIMAL(12,0)

### 59. [C3] NOT NULL設定があるがデフォルト値なし: 担当者別作業設計.担当種別

  - テーブル: work_executor_plans
  - カラム: executor_type
  - 型: CHAR(1)

### 60. [C3] NOT NULL設定があるがデフォルト値なし: 担当者別作業設計.工数

  - テーブル: work_executor_plans
  - カラム: man_hours
  - 型: DECIMAL(4,1)

### 61. [C3] NOT NULL設定があるがデフォルト値なし: 担当者別作業設計.原価/仕入金額

  - テーブル: work_executor_plans
  - カラム: unit_cost
  - 型: DECIMAL(12,0)

### 62. [C3] NOT NULL設定があるがデフォルト値なし: 担当者別作業設計.基準価格

  - テーブル: work_executor_plans
  - カラム: cost
  - 型: DECIMAL(12,0)

### 63. [C3] NOT NULL設定があるがデフォルト値なし: 作業実績.作業日

  - テーブル: work_time_entries
  - カラム: work_on
  - 型: DATE

### 64. [C3] NOT NULL設定があるがデフォルト値なし: 作業実績.開始時刻

  - テーブル: work_time_entries
  - カラム: start_time
  - 型: TIMESTAMP(0)

### 65. [C3] NOT NULL設定があるがデフォルト値なし: 社内仕掛在庫金額計上.計上額

  - テーブル: in_progress_inv_postings
  - カラム: accrual_cost
  - 型: DECIMAL(12,0)

### 66. [C3] NOT NULL設定があるがデフォルト値なし: 社内仕掛在庫金額計上.計上月

  - テーブル: in_progress_inv_postings
  - カラム: year_month
  - 型: CHAR(7)

### 67. [C3] NOT NULL設定があるがデフォルト値なし: 見積.見積書No

  - テーブル: quots
  - カラム: quot_number
  - 型: CHAR(12)

### 68. [C3] NOT NULL設定があるがデフォルト値なし: 見積書発行履歴.ファイル名

  - テーブル: quot_issue_log
  - カラム: file_name
  - 型: VARCHAR(255)

### 69. [C3] NOT NULL設定があるがデフォルト値なし: 作業部門別見積.基準価格

  - テーブル: quot_operations
  - カラム: cost
  - 型: DECIMAL(12,0)

### 70. [C3] NOT NULL設定があるがデフォルト値なし: 作業部門別見積.見積金額

  - テーブル: quot_operations
  - カラム: quot_amount
  - 型: DECIMAL(12,0)

### 71. [C3] NOT NULL設定があるがデフォルト値なし: 受注.年号

  - テーブル: orders
  - カラム: order_cd_year
  - 型: CHAR(2)

### 72. [C3] NOT NULL設定があるがデフォルト値なし: 受注.工番（通番）

  - テーブル: orders
  - カラム: order_cd
  - 型: CHAR(5)

### 73. [C3] NOT NULL設定があるがデフォルト値なし: 受注.品名

  - テーブル: orders
  - カラム: prod_name
  - 型: VARCHAR(50)

### 74. [C3] NOT NULL設定があるがデフォルト値なし: 受注.正式品名

  - テーブル: orders
  - カラム: official_prod_name
  - 型: VARCHAR(255)

### 75. [C3] NOT NULL設定があるがデフォルト値なし: 受注.数量

  - テーブル: orders
  - カラム: quantity
  - 型: INTEGER

### 76. [C3] NOT NULL設定があるがデフォルト値なし: 受注.受注日

  - テーブル: orders
  - カラム: order_on
  - 型: DATE

### 77. [C3] NOT NULL設定があるがデフォルト値なし: 受注.品名（略称）

  - テーブル: orders
  - カラム: short_prod_name
  - 型: VARCHAR(50)

### 78. [C3] NOT NULL設定があるがデフォルト値なし: 作業部門別受注金額.基準価格

  - テーブル: order_operation_amounts
  - カラム: cost
  - 型: DECIMAL(12,0)

### 79. [C3] NOT NULL設定があるがデフォルト値なし: 作業部門別受注金額.受注金額

  - テーブル: order_operation_amounts
  - カラム: order_amount
  - 型: DECIMAL(12,0)

### 80. [C3] NOT NULL設定があるがデフォルト値なし: 作業部門別受注金額.初回基準価格

  - テーブル: order_operation_amounts
  - カラム: first_cost
  - 型: DECIMAL(12,0)

### 81. [C3] NOT NULL設定があるがデフォルト値なし: 作業部門別受注金額.初回受注金額

  - テーブル: order_operation_amounts
  - カラム: first_order_amount
  - 型: DECIMAL(12,0)

### 82. [C3] NOT NULL設定があるがデフォルト値なし: 部署別受注計画.年月

  - テーブル: section_order_plans
  - カラム: year_month
  - 型: CHAR(7)

### 83. [C3] NOT NULL設定があるがデフォルト値なし: 部署別受注計画.受注金額計画値

  - テーブル: section_order_plans
  - カラム: planned_order_amount
  - 型: DECIMAL(12,0)

### 84. [C3] NOT NULL設定があるがデフォルト値なし: 部署別受注計画.差益率計画値

  - テーブル: section_order_plans
  - カラム: planned_profit_margin
  - 型: DECIMAL(4,1)

### 85. [C3] NOT NULL設定があるがデフォルト値なし: 部署別売上計画.年月

  - テーブル: section_sale_plans
  - カラム: year_month
  - 型: CHAR(7)

### 86. [C3] NOT NULL設定があるがデフォルト値なし: 部署別売上計画.売上金額計画値

  - テーブル: section_sale_plans
  - カラム: planned_sale_amount
  - 型: DECIMAL(12,0)

### 87. [C3] NOT NULL設定があるがデフォルト値なし: 部署別売上計画.差益率計画値

  - テーブル: section_sale_plans
  - カラム: planned_profit_margin
  - 型: DECIMAL(4,1)

### 88. [C3] NOT NULL設定があるがデフォルト値なし: 受注週報集計明細.年月

  - テーブル: order_weekly_details
  - カラム: year_month
  - 型: CHAR(7)

### 89. [C3] NOT NULL設定があるがデフォルト値なし: 受注週報集計明細.売上見込

  - テーブル: order_weekly_details
  - カラム: sales_forecast_amount
  - 型: DECIMAL(12,0)

### 90. [C3] NOT NULL設定があるがデフォルト値なし: 受注週報集計明細.受注残見込

  - テーブル: order_weekly_details
  - カラム: backlog_forecast_amount
  - 型: DECIMAL(12,0)

### 91. [C3] NOT NULL設定があるがデフォルト値なし: 受注週報集計明細.受注実績

  - テーブル: order_weekly_details
  - カラム: actual_orders
  - 型: DECIMAL(12,0)

### 92. [C3] NOT NULL設定があるがデフォルト値なし: 受注週報集計明細.受注目標

  - テーブル: order_weekly_details
  - カラム: order_target
  - 型: DECIMAL(12,0)

### 93. [C3] NOT NULL設定があるがデフォルト値なし: 受注週報集計明細.基準価格

  - テーブル: order_weekly_details
  - カラム: cost
  - 型: DECIMAL(12,0)

### 94. [C3] NOT NULL設定があるがデフォルト値なし: 受注週報集計明細.差益高

  - テーブル: order_weekly_details
  - カラム: profit_amount
  - 型: DECIMAL(12,0)

### 95. [C3] NOT NULL設定があるがデフォルト値なし: 受注週報集計明細.前年受注実績

  - テーブル: order_weekly_details
  - カラム: actual_orders_last_year
  - 型: DECIMAL(12,0)

### 96. [C3] NOT NULL設定があるがデフォルト値なし: 受注週報集計明細.前年基準価格

  - テーブル: order_weekly_details
  - カラム: cost_last_year
  - 型: DECIMAL(12,0)

### 97. [C3] NOT NULL設定があるがデフォルト値なし: 受注週報集計累計.年月

  - テーブル: order_weekly_totals
  - カラム: year_month
  - 型: CHAR(7)

### 98. [C3] NOT NULL設定があるがデフォルト値なし: 受注週報集計累計.売上見込

  - テーブル: order_weekly_totals
  - カラム: sales_forecast_amount
  - 型: DECIMAL(12,0)

### 99. [C3] NOT NULL設定があるがデフォルト値なし: 受注週報集計累計.受注残見込

  - テーブル: order_weekly_totals
  - カラム: backlog_forecast_amount
  - 型: DECIMAL(12,0)

### 100. [C3] NOT NULL設定があるがデフォルト値なし: 受注週報集計累計.受注実績

  - テーブル: order_weekly_totals
  - カラム: actual_orders
  - 型: DECIMAL(12,0)

### 101. [C3] NOT NULL設定があるがデフォルト値なし: 受注週報集計累計.受注目標

  - テーブル: order_weekly_totals
  - カラム: order_target
  - 型: DECIMAL(12,0)

### 102. [C3] NOT NULL設定があるがデフォルト値なし: 受注週報集計累計.基準価格

  - テーブル: order_weekly_totals
  - カラム: cost
  - 型: DECIMAL(12,0)

### 103. [C3] NOT NULL設定があるがデフォルト値なし: 受注週報集計累計.差益高

  - テーブル: order_weekly_totals
  - カラム: profit_amount
  - 型: DECIMAL(12,0)

### 104. [C3] NOT NULL設定があるがデフォルト値なし: 受注週報集計累計.前年受注実績

  - テーブル: order_weekly_totals
  - カラム: actual_orders_last_year
  - 型: DECIMAL(12,0)

### 105. [C3] NOT NULL設定があるがデフォルト値なし: 受注週報集計累計.前年基準価格

  - テーブル: order_weekly_totals
  - カラム: cost_last_year
  - 型: DECIMAL(12,0)

### 106. [C3] NOT NULL設定があるがデフォルト値なし: 作業手配.納期

  - テーブル: work_arrangements
  - カラム: delivery_on
  - 型: DATE

### 107. [C3] NOT NULL設定があるがデフォルト値なし: 作業手配.基準価格

  - テーブル: work_arrangements
  - カラム: cost
  - 型: DECIMAL(12,0)

### 108. [C3] NOT NULL設定があるがデフォルト値なし: 作業手配.作業手配日

  - テーブル: work_arrangements
  - カラム: work_arrgt_on
  - 型: DATE

### 109. [C3] NOT NULL設定があるがデフォルト値なし: 社内売上管理.金額

  - テーブル: internal_sales
  - カラム: cost
  - 型: DECIMAL(12,0)

### 110. [C3] NOT NULL設定があるがデフォルト値なし: 社内売上管理.年月

  - テーブル: internal_sales
  - カラム: year_month
  - 型: CHAR(7)

### 111. [C3] NOT NULL設定があるがデフォルト値なし: 作業部門別基準価格.基準価格

  - テーブル: operation_costs
  - カラム: cost
  - 型: DECIMAL(12,0)

### 112. [C3] NOT NULL設定があるがデフォルト値なし: 作業部門別基準価格.基準価格計上残

  - テーブル: operation_costs
  - カラム: cost_remaining
  - 型: DECIMAL(12,0)

### 113. [C3] NOT NULL設定があるがデフォルト値なし: 作業部門別基準価格.仕入処理日

  - テーブル: operation_costs
  - カラム: stocking_on
  - 型: DATE

### 114. [C3] NOT NULL設定があるがデフォルト値なし: 製品発送費基準価格.基準価格

  - テーブル: ship_costs
  - カラム: cost
  - 型: DECIMAL(12,0)

### 115. [C3] NOT NULL設定があるがデフォルト値なし: 製品発送費基準価格.基準価格計上残

  - テーブル: ship_costs
  - カラム: cost_remaining
  - 型: DECIMAL(12,0)

### 116. [C3] NOT NULL設定があるがデフォルト値なし: 製品発送費基準価格.仕入処理日

  - テーブル: ship_costs
  - カラム: stocking_on
  - 型: DATE

### 117. [C3] NOT NULL設定があるがデフォルト値なし: 作業部門別売上.計上日

  - テーブル: sales_operation_amounts
  - カラム: recorded_on
  - 型: DATE

### 118. [C3] NOT NULL設定があるがデフォルト値なし: 作業部門別売上.基準計上額

  - テーブル: sales_operation_amounts
  - カラム: accrual_cost
  - 型: DECIMAL(12,0)

### 119. [C3] NOT NULL設定があるがデフォルト値なし: 作業部門別売上.売上単価

  - テーブル: sales_operation_amounts
  - カラム: unit_amount
  - 型: DECIMAL(12,0)

### 120. [C3] NOT NULL設定があるがデフォルト値なし: 作業部門別売上.売上金額

  - テーブル: sales_operation_amounts
  - カラム: sales_amount
  - 型: DECIMAL(12,0)

### 121. [C3] NOT NULL設定があるがデフォルト値なし: 製品発送費売上.計上日

  - テーブル: sales_ship_amounts
  - カラム: recorded_on
  - 型: DATE

### 122. [C3] NOT NULL設定があるがデフォルト値なし: 製品発送費売上.基準計上額

  - テーブル: sales_ship_amounts
  - カラム: accrual_cost
  - 型: DECIMAL(12,0)

### 123. [C3] NOT NULL設定があるがデフォルト値なし: 製品発送費売上.売上金額

  - テーブル: sales_ship_amounts
  - カラム: sales_amount
  - 型: DECIMAL(12,0)

### 124. [C3] NOT NULL設定があるがデフォルト値なし: 諸経費売上.計上日

  - テーブル: sales_various_amounts
  - カラム: recorded_on
  - 型: DATE

### 125. [C3] NOT NULL設定があるがデフォルト値なし: 諸経費売上.売上金額

  - テーブル: sales_various_amounts
  - カラム: sales_amount
  - 型: DECIMAL(12,0)

### 126. [C3] NOT NULL設定があるがデフォルト値なし: 営業部署別売上.計上日

  - テーブル: sales_section_amounts
  - カラム: recorded_on
  - 型: DATE

### 127. [C3] NOT NULL設定があるがデフォルト値なし: 営業部署別売上.売上数量

  - テーブル: sales_section_amounts
  - カラム: sales_quantity
  - 型: DECIMAL(7,0)

### 128. [C3] NOT NULL設定があるがデフォルト値なし: 担当者別売上.計上日

  - テーブル: sales_person_amounts
  - カラム: recorded_on
  - 型: DATE

### 129. [C3] NOT NULL設定があるがデフォルト値なし: 売掛金.請求日

  - テーブル: accounts_receivables
  - カラム: billing_on
  - 型: DATE

### 130. [C3] NOT NULL設定があるがデフォルト値なし: 前受金.金額

  - テーブル: adv_payments
  - カラム: amount
  - 型: DECIMAL(12,0)

### 131. [C3] NOT NULL設定があるがデフォルト値なし: 前受金.入金日

  - テーブル: adv_payments
  - カラム: received_on
  - 型: DATE

### 132. [C3] NOT NULL設定があるがデフォルト値なし: 得意先別前受金残高.前受金残高

  - テーブル: customer_adv_payments
  - カラム: customer_adv_payments
  - 型: DECIMAL(12,0)

### 133. [C3] NOT NULL設定があるがデフォルト値なし: 得意先別前受金消込履歴.消込日

  - テーブル: customer_adv_payment_log
  - カラム: crearing_on
  - 型: DATE

### 134. [C3] NOT NULL設定があるがデフォルト値なし: 納品明細.納品書番号

  - テーブル: delivery_details
  - カラム: delivery_number
  - 型: VARCHAR(17)

### 135. [C3] NOT NULL設定があるがデフォルト値なし: 納品明細.納品日

  - テーブル: delivery_details
  - カラム: delivery_on
  - 型: DATE

### 136. [C3] NOT NULL設定があるがデフォルト値なし: 納品明細.数量

  - テーブル: delivery_details
  - カラム: quantity
  - 型: INTEGER

### 137. [C3] NOT NULL設定があるがデフォルト値なし: 納品明細.納品金額

  - テーブル: delivery_details
  - カラム: delivery_amount
  - 型: DECIMAL(12,0)

### 138. [C3] NOT NULL設定があるがデフォルト値なし: 納品明細.消費税

  - テーブル: delivery_details
  - カラム: tax
  - 型: DECIMAL(12,0)

### 139. [C3] NOT NULL設定があるがデフォルト値なし: 納品明細.合計納品金額

  - テーブル: delivery_details
  - カラム: total_delivery_amount
  - 型: DECIMAL(12,0)

### 140. [C3] NOT NULL設定があるがデフォルト値なし: 納品書発行履歴.発行種別

  - テーブル: delivery_issue_log
  - カラム: issued_type
  - 型: CHAR(1)

### 141. [C3] NOT NULL設定があるがデフォルト値なし: 納品書発行履歴.発行日時

  - テーブル: delivery_issue_log
  - カラム: issued_at
  - 型: TIMESTAMP(0)

### 142. [C3] NOT NULL設定があるがデフォルト値なし: 納品書発行履歴.ファイル名

  - テーブル: delivery_issue_log
  - カラム: file_name
  - 型: VARCHAR(255)

### 143. [C3] NOT NULL設定があるがデフォルト値なし: 納品書発行履歴.ファイルパス

  - テーブル: delivery_issue_log
  - カラム: file_path
  - 型: VARCHAR(1000)

### 144. [C3] NOT NULL設定があるがデフォルト値なし: 納品書データ出力履歴.出力日時

  - テーブル: delivery_export_log
  - カラム: exported_at
  - 型: TIMESTAMP(0)

### 145. [C3] NOT NULL設定があるがデフォルト値なし: 納品書データ出力履歴.ファイル名

  - テーブル: delivery_export_log
  - カラム: file_name
  - 型: VARCHAR(255)

### 146. [C3] NOT NULL設定があるがデフォルト値なし: 納品書データ出力履歴.ファイルパス

  - テーブル: delivery_export_log
  - カラム: file_path
  - 型: VARCHAR(1000)

### 147. [C3] NOT NULL設定があるがデフォルト値なし: 請求明細.請求書番号

  - テーブル: billing_details
  - カラム: billing_number
  - 型: VARCHAR(17)

### 148. [C3] NOT NULL設定があるがデフォルト値なし: 請求明細.請求日

  - テーブル: billing_details
  - カラム: billing_on
  - 型: DATE

### 149. [C3] NOT NULL設定があるがデフォルト値なし: 請求明細.数量

  - テーブル: billing_details
  - カラム: quantity
  - 型: INTEGER

### 150. [C3] NOT NULL設定があるがデフォルト値なし: 請求明細.請求金額

  - テーブル: billing_details
  - カラム: billing_amount
  - 型: DECIMAL(12,0)

### 151. [C3] NOT NULL設定があるがデフォルト値なし: 請求明細.消費税

  - テーブル: billing_details
  - カラム: tax
  - 型: DECIMAL(12,0)

### 152. [C3] NOT NULL設定があるがデフォルト値なし: 請求明細.合計請求金額

  - テーブル: billing_details
  - カラム: total_billing_amount
  - 型: DECIMAL(12,0)

### 153. [C3] NOT NULL設定があるがデフォルト値なし: 請求書発行履歴.発行種別

  - テーブル: billing_issue_log
  - カラム: issue_type
  - 型: CHAR(1)

### 154. [C3] NOT NULL設定があるがデフォルト値なし: 請求書発行履歴.発行日時

  - テーブル: billing_issue_log
  - カラム: issued_at
  - 型: TIMESTAMP(0)

### 155. [C3] NOT NULL設定があるがデフォルト値なし: 請求書発行履歴.ファイル名

  - テーブル: billing_issue_log
  - カラム: file_name
  - 型: VARCHAR(255)

### 156. [C3] NOT NULL設定があるがデフォルト値なし: 請求書発行履歴.ファイルパス

  - テーブル: billing_issue_log
  - カラム: file_path
  - 型: VARCHAR(1000)

### 157. [C3] NOT NULL設定があるがデフォルト値なし: 得意先別発送費.発生年月

  - テーブル: customer_ship_cost
  - カラム: year_month
  - 型: CHAR(7)

### 158. [C3] NOT NULL設定があるがデフォルト値なし: 得意先別発送費.基準価格

  - テーブル: customer_ship_cost
  - カラム: cost
  - 型: DECIMAL(12,0)

### 159. [C3] NOT NULL設定があるがデフォルト値なし: 得意先別発送費更新履歴.調整基準価格

  - テーブル: customer_ship_cost_log
  - カラム: cost
  - 型: DECIMAL(12,0)

### 160. [C3] NOT NULL設定があるがデフォルト値なし: 月次処理日データ.月次年月

  - テーブル: monthly_closing_date
  - カラム: year_month
  - 型: CHAR(7)

### 161. [C3] NOT NULL設定があるがデフォルト値なし: 月次処理日データ.月次処理日

  - テーブル: monthly_closing_date
  - カラム: monthly_closing_on
  - 型: DATE

### 162. [C3] NOT NULL設定があるがデフォルト値なし: 製品在庫金額集計.年月

  - テーブル: prod_inv_totals
  - カラム: year_month
  - 型: CHAR(7)

### 163. [C3] NOT NULL設定があるがデフォルト値なし: 製品在庫金額集計.在庫種別

  - テーブル: prod_inv_totals
  - カラム: prod_inv_type
  - 型: CHAR(1)

### 164. [C3] NOT NULL設定があるがデフォルト値なし: 製品在庫金額集計.年号

  - テーブル: prod_inv_totals
  - カラム: order_cd_year
  - 型: CHAR(2)

### 165. [C3] NOT NULL設定があるがデフォルト値なし: 製品在庫金額集計.工番（通番）

  - テーブル: prod_inv_totals
  - カラム: order_cd
  - 型: CHAR(5)

### 166. [C3] NOT NULL設定があるがデフォルト値なし: 製品在庫金額集計.品名

  - テーブル: prod_inv_totals
  - カラム: prod_name
  - 型: VARCHAR(50)

### 167. [C3] NOT NULL設定があるがデフォルト値なし: 製品在庫金額集計.受注日

  - テーブル: prod_inv_totals
  - カラム: order_on
  - 型: DATE

### 168. [C3] NOT NULL設定があるがデフォルト値なし: 製品在庫金額集計.受注金額計

  - テーブル: prod_inv_totals
  - カラム: total_order_amount
  - 型: DECIMAL(12,0)

### 169. [C3] NOT NULL設定があるがデフォルト値なし: 製品在庫金額集計.基準価格計上残計

  - テーブル: prod_inv_totals
  - カラム: remaining_cost
  - 型: DECIMAL(12,0)

### 170. [C3] NOT NULL設定があるがデフォルト値なし: 仕掛在庫金額.社内原価

  - テーブル: in_progress_inv_costs
  - カラム: internal_cost
  - 型: DECIMAL(12,0)

### 171. [C3] NOT NULL設定があるがデフォルト値なし: 仕掛在庫金額.社外原価

  - テーブル: in_progress_inv_costs
  - カラム: external_cost
  - 型: DECIMAL(12,0)

### 172. [C3] NOT NULL設定があるがデフォルト値なし: 仕掛在庫金額.原価合計

  - テーブル: in_progress_inv_costs
  - カラム: total_cost
  - 型: DECIMAL(12,0)

### 173. [C3] NOT NULL設定があるがデフォルト値なし: 計画値取込.取込実施年度

  - テーブル: plan_imports
  - カラム: year
  - 型: CHAR(4)

### 174. [C3] NOT NULL設定があるがデフォルト値なし: 得意先別倉庫料.発生年月

  - テーブル: customer_warehouse_cost
  - カラム: year_month
  - 型: CHAR(7)

### 175. [C3] NOT NULL設定があるがデフォルト値なし: 得意先別倉庫料.基準価格

  - テーブル: customer_warehouse_cost
  - カラム: cost
  - 型: DECIMAL(12,0)

### 176. [C3] NOT NULL設定があるがデフォルト値なし: 月別発送費.金額

  - テーブル: monthly_ship_costs
  - カラム: cost
  - 型: DECIMAL(12,0)

### 177. [C3] NOT NULL設定があるがデフォルト値なし: 月別発送費.年月

  - テーブル: monthly_ship_costs
  - カラム: year_month
  - 型: CHAR(7)
