# 見積API仕様書

## 概要

見積機能に関するAPIエンドポイントの仕様書。

## エンドポイント一覧

| メソッド | URL | 説明 |
|---------|-----|------|
| GET | `/api/quotes` | 見積一覧取得 |
| GET | `/api/quotes/access-info` | アクセス情報取得（初期表示用） |
| GET | `/api/quotes/section-cds` | 選択可能な部署コード一覧取得 |
| GET | `/api/quotes/{quotId}` | 見積詳細取得 |
| GET | `/api/quotes/customers/suggest` | 得意先サジェスト検索（検索フォーム用） |
| GET | `/api/quotes/customers/search` | 得意先検索（検索フォーム用ダイアログ） |
| GET | `/api/quotes/customers/suggest-for-create` | 得意先サジェスト検索（新規登録用） |
| GET | `/api/quotes/customers/search-for-create` | 得意先検索（新規登録用ダイアログ） |
| GET | `/api/quotes/center-managers/{centerId}` | センター所長一覧取得（制作見積依頼用） |
| GET | `/api/centers/quot` | 見積用センター一覧取得（編集・印刷のみ） |
| POST | `/api/quotes` | 見積新規登録 |
| PUT | `/api/quotes/{quotId}` | 見積更新（ステータス00のみ） |
| DELETE | `/api/quotes/{quotId}` | 見積削除（ステータス00のみ） |
| POST | `/api/quotes/{quotId}/approve` | 見積承認 |
| POST | `/api/quotes/{quotId}/cancel-approve` | 見積承認取消 |
| POST | `/api/quotes/{quotId}/request-production` | 制作見積依頼 |
| POST | `/api/quotes/{quotId}/reject` | 見積差戻し（ステータス30→20） |
| POST | `/api/quotes/{quotId}/receive-prod-quot` | 制作見積受取 |
| POST | `/api/quotes/{quotId}/register` | 見積登録（ステータス30→40） |
| POST | `/api/quotes/{quotId}/cancel-register` | 登録取消（ステータス40→30） |
| POST | `/api/quotes/{quotId}/update-amounts` | 見積金額更新（ステータス40） |
| POST | `/api/quotes/{quotId}/issue` | 見積発行（Excel、ステータス50→60） |
| POST | `/api/quotes/{quotId}/reissue` | 見積再発行（発行済の再発行） |
| POST | `/api/quotes/{quotId}/update-status60` | ステータス60更新（失注登録等） |

---

## 見積一覧取得API

### リクエストパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| section_cd | string | ○ | 部署コード（'all' または 6桁以内の半角数字） |
| quote_no | string | - | 見積書No（12桁以内、半角数字のみ） |
| quote_date_from | date | - | 見積日（開始） |
| quote_date_to | date | - | 見積日（終了） |
| quot_subject | string | - | 見積件名（50文字以内） |
| customer_id | integer | - | 得意先ID |
| product_name | string | - | 品名（50文字以内） |
| status | string | ○ | ステータスコード（'all' または 00,10,20,30） |
| page | integer | - | ページ番号（デフォルト: 1） |
| per_page | integer | - | 表示件数（10, 25, 50, 100、デフォルト: 10） |
| sort_field | string | - | ソートフィールド（quote_no, amount, quot_status） |
| sort_order | string | - | ソート順（asc, desc、デフォルト: desc） |

### レスポンス

```json
{
  "success": true,
  "quotes": [
    {
      "quote_id": 1,
      "quote_no": "000012501001",
      "customer_name": "株式会社サンプル",
      "quot_subject": "サンプル見積件名",
      "product_name": "サンプル商品",
      "amount": 100000,
      "quot_status": "30",
      "status_label": "発行済",
      "prod_quot_status": "30"
    }
  ],
  "total": 100,
  "page": 1,
  "per_page": 10,
  "total_pages": 10,
  "access_info": {
    "default_section_cd": null,
    "is_section_cd_disabled": false
  }
}
```

---

## アクセス情報取得API

フロントエンド初期表示時に部署コード入力欄の初期状態を取得するために使用。

### レスポンス

```json
{
  "success": true,
  "access_info": {
    "default_section_cd": null,
    "is_section_cd_disabled": false
  }
}
```

| フィールド | 型 | 説明 |
|-----------|-----|------|
| default_section_cd | string\|null | デフォルトの部署コード（一般ユーザーの場合は自身の部署コード） |
| is_section_cd_disabled | boolean | 部署コード入力欄を非活性にするかどうか |

---

## 選択可能な部署コード一覧取得API

部署コードプルダウンの選択肢を取得するために使用。

### レスポンス

```json
{
  "success": true,
  "section_cds": [
    {
      "section_cd_id": 1,
      "section_cd": "262111",
      "section_name": "東京営業1課"
    }
  ],
  "is_disabled": false
}
```

| フィールド | 型 | 説明 |
|-----------|-----|------|
| section_cds | array | 選択可能な部署コード一覧 |
| section_cds[].section_cd_id | integer | 部署コードマスタID |
| section_cds[].section_cd | string | 部署コード |
| section_cds[].section_name | string | 部署名 |
| is_disabled | boolean | 選択肢が1件のみの場合true（非活性にする） |

---

## 得意先サジェスト検索API

### リクエストパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| query | string | ○ | 検索クエリ（得意先コード/得意先名で部分一致検索） |

### レスポンス

```json
{
  "success": true,
  "customers": [
    {
      "customer_id": 1,
      "customer_cd": "C001",
      "customer_name": "株式会社サンプル"
    }
  ]
}
```

---

## 得意先検索API（ダイアログ用）

### リクエストパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| customer_cd | string | - | 得意先コード（部分一致） |
| customer_name | string | - | 得意先名（部分一致） |

### レスポンス

```json
{
  "success": true,
  "customers": [
    {
      "customer_id": 1,
      "customer_cd": "C001",
      "customer_name": "株式会社サンプル"
    }
  ]
}
```

---

## センター所長一覧取得API

制作見積依頼時に送信先となる所長を取得するためのAPI。

### リクエスト

- メソッド: GET
- URL: `/api/quotes/center-managers/{centerId}`

### パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| centerId | integer | ○ | センターID（組織ID） |

### レスポンス（成功時）

```json
{
  "success": true,
  "managers": [
    {
      "employee_id": 7,
      "employee_cd": "000007",
      "employee_name": "東京所長太郎",
      "email": "tokyo-manager@example.com"
    }
  ]
}
```

### レスポンスフィールド

| フィールド | 型 | 説明 |
|-----------|-----|------|
| managers | array | 所長の一覧（アクセス区分20の社員） |
| managers[].employee_id | integer | 社員ID |
| managers[].employee_cd | string | 社員コード |
| managers[].employee_name | string | 社員名 |
| managers[].email | string\|null | メールアドレス（未登録の場合はnull） |

### エラーレスポンス

| HTTPステータス | メッセージ | 条件 |
|---------------|-----------|------|
| 401 | ログインしてください | 未認証（ミドルウェア） |
| 404 | センターが見つかりません | 該当センターなし |

---

## 見積承認API

### 権限

- アクセス区分 `00`（全て）または `20`（所長）のみ実行可能

### リクエスト

- メソッド: POST
- URL: `/api/quotes/{quotId}/approve`

### レスポンス（成功時）

```json
{
  "success": true,
  "message": "承認しました"
}
```

### エラーレスポンス

| HTTPステータス | メッセージ | 条件 |
|---------------|-----------|------|
| 401 | ログインしてください | 未認証（ミドルウェア） |
| 403 | 権限がありません | 承認権限なし |
| 404 | 見積が見つかりません | 該当見積なし |
| 400 | 承認待ちの見積のみ承認できます | ステータスが10以外 |

### データ更新内容

| カラム | 更新値 |
|--------|--------|
| quot_status | `20`（承認済） |
| approved_by | ログインユーザーの社員ID |
| approved_at | 現在日時 |

---

## 見積承認取消API

### 権限

- アクセス区分 `00`（全て）または `20`（所長）のみ実行可能

### リクエスト

- メソッド: POST
- URL: `/api/quotes/{quotId}/cancel-approve`

### レスポンス（成功時）

```json
{
  "success": true,
  "message": "承認を取り消しました"
}
```

### エラーレスポンス

| HTTPステータス | メッセージ | 条件 |
|---------------|-----------|------|
| 401 | ログインしてください | 未認証（ミドルウェア） |
| 403 | 権限がありません | 承認権限なし |
| 404 | 見積が見つかりません | 該当見積なし |
| 400 | 承認済の見積のみ取消できます | ステータスが20以外 |

### データ更新内容

| カラム | 更新値 |
|--------|--------|
| quot_status | `10`（承認待ち） |
| approved_by | `null` |
| approved_at | `null` |

---

## 見積新規登録API

### リクエスト

- メソッド: POST
- URL: `/api/quotes`

### リクエストボディ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| prod_name | string | - | 品名（50文字以内） |
| customer_id | integer | ○ | 得意先ID |
| customer_name | string | - | 得意先名（諸口の場合、120文字以内） |
| quot_subject | string | - | 見積件名（50文字以内） |
| quot_summary | string | - | 見積概要（2000文字以内） |
| message | string | - | 伝達事項（2000文字以内） |
| reference_doc_path | string | - | 参考資料パス（255文字以内） |
| center_id | integer | - | 主管センターID |
| submission_method | string | ○ | 提出方法（00:未定, 10:メール, 20:郵送, 30:持参）※初期値:00 |
| base_quot_id | integer | - | 流用元見積ID（流用作成時） |
| operations | array | - | 作業部門別見積（流用作成時） |
| operations[].operation_id | integer | △ | 作業部門ID（operations指定時は必須） |
| operations[].cost | integer | △ | 基準価格（operations指定時は必須、0以上） |
| operations[].quot_amount | integer | △ | 見積金額（operations指定時は必須、0以上） |

### レスポンス（成功時）

```json
{
  "success": true,
  "quot_id": 123,
  "quot_number": "000012501001",
  "message": "登録しました"
}
```

### エラーレスポンス

| HTTPステータス | メッセージ | 条件 |
|---------------|-----------|------|
| 401 | ログインしてください | 未認証 |
| 403 | アクセス権限がありません | 見積権限なし |
| 400 | 社員の部署情報が見つかりません | 社員別部署コード未設定 |
| 400 | センターの部署情報が見つかりません | 組織別部署コード未設定 |
| 422 | バリデーションエラー | 入力値不正 |
| 500 | 登録に失敗しました | サーバーエラー |

### データ登録内容

| カラム | 登録値 |
|--------|--------|
| section_cd_id | ログインユーザーの社員別部署コードに紐づく部署コードマスタID |
| employee_id | ログインユーザーの社員マスタID |
| quot_number | 自動採番（CCCCCYYMMNNN形式） |
| prod_name | 入力値 |
| customer_id | 選択した得意先ID |
| quot_subject | 入力値 |
| quot_summary | 入力値 |
| message | 入力値（任意） |
| reference_doc_path | 入力値（任意） |
| center_section_cd_id | 選択したセンターの組織別部署コードに紐づく部署コードマスタID |
| quot_status | `00`（作成中） |
| prod_quot_status | `00`（制作見積依頼前） |
| base_quot_id | 入力値（流用作成時） |

**作業部門別見積（quot_operations）:**
流用作成時に `operations` が指定された場合、各要素を新規レコードとして作成。

| カラム | 登録値 |
|--------|--------|
| quot_id | 新規作成された見積ID |
| operation_id | operations[].operation_id |
| cost | operations[].cost |
| quot_amount | operations[].quot_amount |

### 見積書No採番ルール

- 形式: `CCCCCYYMMNNN`（得意先コード5桁 + 年2桁 + 月2桁 + 連番3桁）
- 得意先 + 年月単位で連番がリセット
- 例: `000012501001`, `000012501002`, ..., `000012501999`（得意先00001、2025年01月の1〜999件目）

---

## 制作見積依頼API

### リクエスト

- メソッド: POST
- URL: `/api/quotes/{quotId}/request-production`

### レスポンス（成功時）

```json
{
  "success": true,
  "message": "制作見積依頼を行いました"
}
```

### エラーレスポンス

| HTTPステータス | メッセージ | 条件 |
|---------------|-----------|------|
| 401 | ログインしてください | 未認証（ミドルウェア） |
| 403 | アクセス権限がありません | 見積権限なし |
| 404 | 見積が見つかりません | 該当見積なし |
| 400 | 制作見積依頼前の見積のみ依頼できます | quot_status=00かつprod_quot_status=00以外 |

### データ更新内容

| テーブル | カラム | 更新値 |
|----------|--------|--------|
| quots | prod_quot_status | `10`（制作見積依頼済） |
| prod_quots | （新規作成） | quot_id, cost=0, prod_quot_status=未着手, version=1 |

### メール送信

制作見積依頼時に、主管センターに所属する所長（アクセス区分20）宛てにメールを送信する。

**送信条件:**
- 主管センターが設定されている
- 所長のメールアドレスが登録されている

**メール内容:**

| 項目 | 値 |
|------|-----|
| 件名 | 【制作見積依頼】{見積書番号} |
| 本文 | 下記参照 |

**本文フォーマット:**
```
制作見積依頼が行われました

【見積書No】 {見積書番号}
【担当部署】 {部署コード} {部署名}
【得意先】 {得意先コード} {得意先名}
【見積件名】 {見積件名}
【品名】 {品名}
【見積概要】
{見積概要}
【参考資料】 {参考資料パス} ※未登録時は「参考資料は未登録です」
【伝達事項】
{伝達事項} ※未登録時は「伝達事項はありません」
```

**開発環境での動作:**
- メールドライバーが`log`に設定されている場合、メールはログファイルに出力される
- ログ出力先: `storage/logs/laravel.log`

---

## 見積削除API

### リクエスト

- メソッド: DELETE
- URL: `/api/quotes/{quotId}`

### レスポンス（成功時）

```json
{
  "success": true,
  "message": "削除しました"
}
```

### エラーレスポンス

| HTTPステータス | メッセージ | 条件 |
|---------------|-----------|------|
| 401 | ログインしてください | 未認証（ミドルウェア） |
| 403 | この見積を削除する権限がありません | アクセス権限なし |
| 404 | 見積が見つかりません | 該当見積なし |
| 400 | 作成中の見積のみ削除できます | quot_statusが00以外 |

### データ削除内容

- 該当する見積レコードを物理削除

---

## 見積更新API（ステータス00のみ）

### リクエスト

- メソッド: PUT
- URL: `/api/quotes/{quotId}`

### リクエストボディ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| prod_name | string | - | 品名（50文字以内） |
| customer_id | integer | - | 得意先ID |
| customer_name | string | △ | 得意先名（諸口選択時は必須、120文字以内） |
| quot_subject | string | - | 見積件名（50文字以内） |
| quot_summary | string | - | 見積概要（2000文字以内） |
| message | string | - | 伝達事項（2000文字以内） |
| reference_doc_path | string | - | 参考資料パス（255文字以内） |
| center_id | integer | - | 主管センターID |
| submission_method | string | ○ | 提出方法（00:未定, 10:メール, 20:郵送, 30:持参） |
| base_quot_id | integer | - | 流用元見積ID（流用作成で更新時） |
| operations | array | - | 作業部門別見積（流用作成で更新時） |
| operations[].operation_id | integer | △ | 作業部門ID（operations指定時は必須） |
| operations[].cost | integer | △ | 基準価格（operations指定時は必須、0以上） |
| operations[].quot_amount | integer | △ | 見積金額（operations指定時は必須、0以上） |

### レスポンス（成功時）

```json
{
  "success": true,
  "message": "更新しました"
}
```

### エラーレスポンス

| HTTPステータス | メッセージ | 条件 |
|---------------|-----------|------|
| 401 | ログインしてください | 未認証（ミドルウェア） |
| 403 | この見積を更新する権限がありません | アクセス権限なし |
| 404 | 見積が見つかりません | 該当見積なし |
| 400 | 作成中の見積のみ更新できます | quot_statusが00以外 |
| 422 | バリデーションエラー | 入力値不正 |

### データ更新内容

| カラム | 更新値 |
|--------|--------|
| prod_name | 入力値 |
| customer_id | 入力値 |
| customer_name | 入力値 |
| quot_subject | 入力値 |
| quot_summary | 入力値 |
| message | 入力値 |
| reference_doc_path | 入力値 |
| center_section_cd_id | 選択したセンターの組織別部署コードに紐づく部署コードマスタID |
| submission_method | 入力値 |
| base_quot_id | 入力値（流用作成時） |

**作業部門別見積（quot_operations）:**
`operations` が指定された場合、既存の作業部門別見積を全削除し、新しいレコードを作成。

| カラム | 登録値 |
|--------|--------|
| quot_id | 更新対象の見積ID |
| operation_id | operations[].operation_id |
| cost | operations[].cost |
| quot_amount | operations[].quot_amount |

---

## 見積詳細取得API

### リクエスト

- メソッド: GET
- URL: `/api/quotes/{quotId}`

### レスポンス

```json
{
  "success": true,
  "quot": {
    "quot_id": 1,
    "quot_number": "000012501001",
    "section_cd": "262111",
    "section_name": "東京営業1課",
    "employee_name": "東京太郎",
    "customer_id": 1,
    "customer_cd": "C001",
    "customer_name": "株式会社サンプル",
    "prod_name": "サンプル商品",
    "quot_subject": "サンプル件名",
    "quot_summary": "見積概要の内容",
    "reference_doc_path": "参考資料パス",
    "center_id": 1,
    "center_name": "東京センター",
    "quot_status": "10",
    "status_label": "承認待ち",
    "prod_quot_status": "30",
    "prod_quot_status_label": "制作見積受取済",
    "quot_on": "2025-01-15",
    "quot_amount": 185000,
    "submission_method": "01",
    "submission_method_label": "郵送",
    "quot_result": null,
    "quot_result_label": null,
    "lost_reason": null,
    "message": null
  }
}
```

### エラーレスポンス

| HTTPステータス | メッセージ | 条件 |
|---------------|-----------|------|
| 401 | ログインしてください | 未認証（ミドルウェア） |
| 403 | アクセス権限がありません | 見積権限なし |
| 404 | 見積が見つかりません | 該当見積なし or アクセス権限外 |

---

## 見積発行API（Excel）

見積書をExcel形式で発行し、ステータスを30（発行済）に更新します。

### リクエスト

- メソッド: POST
- URL: `/api/quotes/{quotId}/issue`

### リクエストボディ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| submission_method | string | ○ | 提出方法（00:未定, 10:メール, 20:郵送, 30:持参） |

### レスポンス（成功時）

```json
{
  "success": true,
  "file_path": "/path/to/generated/file.xlsx",
  "message": "見積書を発行しました"
}
```

### エラーレスポンス

| HTTPステータス | メッセージ | 条件 |
|---------------|-----------|------|
| 401 | ログインしてください | 未認証（ミドルウェア） |
| 403 | アクセス権限がありません | 見積権限なし |
| 404 | 見積が見つかりません | 該当見積なし |
| 400 | 承認済の見積のみ発行できます | quot_statusが20以外 |

### データ更新内容

| カラム | 更新値 |
|--------|--------|
| quot_status | `30`（発行済） |
| submission_method | 入力値 |
| quot_on | 現在日時 |
| quot_doc_path | 生成されたファイルパス |

---

## 見積再発行API

発行済（ステータス30）の見積書を再発行します。ステータスは変更せず、新しいファイルを生成します。

### リクエスト

- メソッド: POST
- URL: `/api/quotes/{quotId}/reissue`

### リクエストボディ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| submission_method | string | - | 提出方法（変更する場合） |

### レスポンス（成功時）

```json
{
  "success": true,
  "file_path": "/path/to/regenerated/file.xlsx",
  "message": "見積書を再発行しました"
}
```

### エラーレスポンス

| HTTPステータス | メッセージ | 条件 |
|---------------|-----------|------|
| 401 | ログインしてください | 未認証（ミドルウェア） |
| 403 | アクセス権限がありません | 見積権限なし |
| 404 | 見積が見つかりません | 該当見積なし |
| 400 | 発行済の見積のみ再発行できます | quot_statusが30以外 |

### データ更新内容

| カラム | 更新値 |
|--------|--------|
| quot_doc_path | 新しく生成されたファイルパス |
| submission_method | 入力値（指定された場合） |

### 発行履歴

再発行時は `quot_issue_log` テーブルに発行履歴が追加されます。

---

## ステータス30更新API（失注登録等）

### リクエスト

- メソッド: POST
- URL: `/api/quotes/{quotId}/update-status60`

### リクエストボディ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| quot_doc_path | string | ○ | 見積書格納先パス |
| is_lost | boolean | ○ | 失注フラグ |
| lost_reason | string | △ | 失注理由（is_lost=trueの場合必須） |

### レスポンス（成功時）

```json
{
  "success": true,
  "message": "更新しました"
}
```

### エラーレスポンス

| HTTPステータス | メッセージ | 条件 |
|---------------|-----------|------|
| 401 | ログインしてください | 未認証（ミドルウェア） |
| 403 | アクセス権限がありません | 見積権限なし |
| 404 | 見積が見つかりません | 該当見積なし |
| 400 | 発行済の見積のみ更新できます | quot_statusが30以外 |

### データ更新内容

| カラム | 更新値 |
|--------|--------|
| quot_result | 入力値（10:受注 or 20:失注） |
| lost_reason | 入力値（失注の場合） |
| quot_doc_path | 入力値（見積書格納先） |

---

## 差戻しAPI（制作見積済→制作見積中）

### リクエスト

- メソッド: POST
- URL: `/api/quotes/{quotId}/reject`

### リクエストボディ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| remand_reason | string | ○ | 差戻し理由（1000文字以内） |

### レスポンス（成功時）

```json
{
  "success": true,
  "message": "差戻しを行いました"
}
```

### エラーレスポンス

| HTTPステータス | メッセージ | 条件 |
|---------------|-----------|------|
| 401 | ログインしてください | 未認証（ミドルウェア） |
| 404 | 見積が見つかりません | 該当見積なし |
| 400 | 制作見積済の見積のみ差戻しできます | prod_quot_statusが20以外 |
| 422 | 差戻し理由を入力してください | 未入力 |
| 422 | 1000文字以内で入力してください | 文字数超過 |

### データ更新内容

| テーブル | カラム | 更新値 |
|----------|--------|--------|
| prod_quots | prod_quot_status | `50`（差戻） |
| prod_quots | version | +1 |
| prod_quot_return_log | - | 差戻しログを新規作成 |

---

## 制作見積受取API

制作見積済（prod_quot_status=20）の見積を受け取り、制作見積受取済（prod_quot_status=30）に更新します。

### リクエスト

- メソッド: POST
- URL: `/api/quotes/{quotId}/receive-prod-quot`

### レスポンス（成功時）

```json
{
  "success": true,
  "message": "制作見積を受け取りました"
}
```

### エラーレスポンス

| HTTPステータス | メッセージ | 条件 |
|---------------|-----------|------|
| 401 | ログインしてください | 未認証（ミドルウェア） |
| 403 | アクセス権限がありません | 見積権限なし |
| 404 | 見積が見つかりません | 該当見積なし |
| 400 | 制作見積済の見積のみ受け取れます | prod_quot_statusが20以外 |
| 500 | 制作見積の受け取りに失敗しました | サーバーエラー |

### データ更新内容

| カラム | 更新値 |
|--------|--------|
| prod_quot_status | `30`（制作見積受取済） |
| updated_at | 現在日時 |

---

## 見積登録API（制作見積済→承認待ち）

### リクエスト

- メソッド: POST
- URL: `/api/quotes/{quotId}/register`

### リクエストボディ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| amounts | array | ○ | 見積金額の配列 |
| amounts[].prod_quot_operation_id | integer | ○ | 作業部門別制作見積ID |
| amounts[].quot_amount | number | ○ | 見積金額（0以上、12桁以内） |

### レスポンス（成功時）

```json
{
  "success": true,
  "message": "見積を登録しました"
}
```

### エラーレスポンス

| HTTPステータス | メッセージ | 条件 |
|---------------|-----------|------|
| 401 | ログインしてください | 未認証（ミドルウェア） |
| 404 | 見積が見つかりません | 該当見積なし |
| 400 | 制作見積済の見積のみ登録できます | prod_quot_statusが20以外 |
| 422 | バリデーションエラー | 入力値不正 |

### データ更新内容

| テーブル | カラム | 更新値 |
|----------|--------|--------|
| quots | quot_status | `10`（承認待ち） |
| quots | prod_quot_status | `30`（制作見積受取済） |
| quots | quot_amount | 見積金額の合計 |
| quot_operations | - | 作業部門別見積を新規作成 |

---

## 登録取消API（承認待ち→作成中）

### リクエスト

- メソッド: POST
- URL: `/api/quotes/{quotId}/cancel-register`

### レスポンス（成功時）

```json
{
  "success": true,
  "message": "登録を取り消しました"
}
```

### エラーレスポンス

| HTTPステータス | メッセージ | 条件 |
|---------------|-----------|------|
| 401 | ログインしてください | 未認証（ミドルウェア） |
| 404 | 見積が見つかりません | 該当見積なし |
| 400 | 承認待ちの見積のみ登録取消できます | quot_statusが10以外 |

### データ更新内容

| テーブル | カラム | 更新値 |
|----------|--------|--------|
| quots | quot_status | `00`（作成中） |
| quots | prod_quot_status | `20`（制作見積済） |
| quots | quot_amount | `null` |
| quot_operations | - | 該当見積の作業部門別見積を全削除 |

---

## 見積金額更新API（承認待ち）

### リクエスト

- メソッド: POST
- URL: `/api/quotes/{quotId}/update-amounts`

### リクエストボディ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| amounts | array | ○ | 見積金額の配列 |
| amounts[].prod_quot_operation_id | integer | ○ | 作業部門別制作見積ID |
| amounts[].quot_amount | number | ○ | 見積金額（0以上、12桁以内） |

### レスポンス（成功時）

```json
{
  "success": true,
  "message": "見積を更新しました"
}
```

### エラーレスポンス

| HTTPステータス | メッセージ | 条件 |
|---------------|-----------|------|
| 401 | ログインしてください | 未認証（ミドルウェア） |
| 404 | 見積が見つかりません | 該当見積なし |
| 400 | 承認待ちの見積のみ更新できます | quot_statusが10以外 |
| 422 | バリデーションエラー | 入力値不正 |

### データ更新内容

| テーブル | カラム | 更新値 |
|----------|--------|--------|
| quots | quot_amount | 見積金額の合計 |
| quot_operations | quot_amount | 各作業部門別の見積金額 |

---

## 見積用センター取得API

- URL: `GET /api/centers/quot`
- 認証: 必要
- 対象: 制作・印刷センター（`departments.is_center = true` かつ `department_category IN ('20', '30')`）

### レスポンス

```json
{
  "success": true,
  "centers": [
    {
      "department_id": 13,
      "department_name": "第2ソフトウェア開発センター"
    },
    {
      "department_id": 14,
      "department_name": "第1UX編集センター"
    }
  ]
}
```

---

## アクセス制御

### 概要

見積データの絞り込みは、ユーザーのアクセス区分と参照可能組織に基づいて行われる。

### アクセス区分別の制御

| アクセス区分 | 参照可能組織 | 取得可能な見積データ | 部署コード入力欄 |
|-------------|-------------|---------------------|-----------------|
| 一般（40） | なし | 自身の社員別部署コードに紐づく見積のみ | 自身の部署コードをセット、非活性 |
| 一般（40） | あり（センター） | ①自身の部署コードに紐づく見積 ②参照可能組織（センター）配下の部署コードに紐づく見積 | 活性（空欄可） |
| 所長（20） | - | ①自身の所属センター配下の部署コードに紐づく見積 ②参照可能組織（センター）配下の部署コードに紐づく見積 | 活性（空欄可） |
| 全て（00） | - | 全ての見積データ | 活性（空欄可） |

### センター配下の部署コード取得ロジック

1. センターの組織別部署コード（department_section_cd）の頭3桁を取得
2. 頭3桁が一致する部署コード（section_cds）を取得
3. 取得した部署コードが組織別部署コード（department_section_cd）に存在する場合は除外
   - センター・チームの部署コードには見積データが紐づかないため除外

### 所属組織がチームの場合

- 所長でチームに所属している場合、`departments.center_id` から親センターを特定
- 特定したセンター配下の部署コードに紐づく見積データが取得可能

### 部署コード入力欄の初期状態

| 条件 | 初期値 | 状態 |
|------|--------|------|
| アクセス区分が一般かつ参照可能組織なし | 自身の部署コード | 非活性（disabled） |
| 上記以外 | 空欄 | 活性 |

### 絞り込みの実行タイミング

- フロントエンドで入力された部署コードを検索条件としてAPIに送信
- バックエンドで上記のアクセス制御ロジックを適用し、取得可能な部署コードの範囲内で絞り込み
- 入力された部署コードが取得可能範囲外の場合は、該当なしとして0件を返す

---

## バックエンドバリデーション

```php
// backend/app/Http/Requests/QuotSearchRequest.php

public function rules(): array
{
    return [
        'section_cd' => ['required', 'string'],
        'quote_no' => ['nullable', 'string', 'max:12', 'regex:/^[0-9]*$/'],
        'quote_date_from' => ['nullable', 'date'],
        'quote_date_to' => ['nullable', 'date', 'after_or_equal:quote_date_from'],
        'quot_subject' => ['nullable', 'string', 'max:50'],
        'customer_id' => ['nullable', 'integer', 'min:1'],
        'product_name' => ['nullable', 'string', 'max:50'],
        'status' => ['required', 'string', 'in:all,00,10,20,30'],
        'page' => ['nullable', 'integer', 'min:1'],
        'per_page' => ['nullable', 'integer', 'in:10,25,50,100'],
        'sort_field' => ['nullable', 'string', 'in:quote_no,amount,quot_status'],
        'sort_order' => ['nullable', 'string', 'in:asc,desc'],
    ];
}

// エラーメッセージ
public function messages(): array
{
    return [
        'section_cd.required' => '部署を選択してください',
        'status.required' => '有効な値を選択してください',
        'status.in' => '有効な値を選択してください',
        // ...
    ];
}

// カスタムバリデーション（withValidator）
// section_cdが'all'以外の場合、ユーザーが選択可能な部署コード一覧に含まれているかチェック
// エラーメッセージ: '有効な値を選択してください'
```

---

## 関連ドキュメント

- [見積ページ仕様書](../05-frontend/pages/quotes.md)
- [見積登録・更新ページ仕様書](../05-frontend/pages/quotes-registration.md)
- [見積ダイアログ仕様書](../05-frontend/pages/quotes-dialogs.md)
- [見積Zodスキーマ](../05-frontend/schemas/quot-schemas.md)
- [見積テーブル仕様](../09-database/tables/17-quots.md)

---

## 更新履歴

- 2025-12-11: 初版作成
- 2025-12-22: quotes.mdから分離
- 2026-01-12: ドキュメント再構成
- 2026-01-13: 見積削除APIを追加
- 2026-01-18: ステータス体系を変更（quot_status 4種類 + prod_quot_status 4種類）、見積書No形式を11桁に変更
- 2026-01-18: section_cdパラメータを必須に変更、'all'値による全部署検索をサポート
- 2026-01-18: section_cdの選択肢バリデーションを追加（ユーザーが選択可能な部署コードのみ許可）
- 2026-01-18: statusパラメータを必須に変更、'all'値による全ステータス検索をサポート
- 2026-01-18: 制作見積受取APIを追加、一覧レスポンスにprod_quot_statusを追加
- 2026-01-19: 見積新規登録APIのバリデーション変更
  - 品名、得意先、見積件名、見積概要、主管センターを任意に変更
  - 提出方法を必須パラメータに追加（初期値:未定）
  - 提出方法の値を修正（00:未定, 10:メール, 20:郵送, 30:持参）
- 2026-01-19: 伝達事項（message）フィールドを追加
  - 見積新規登録・更新リクエストにmessageパラメータ追加（任意、2000文字以内）
  - 見積詳細レスポンスにmessageフィールド追加
- 2026-01-19: 見積新規登録APIの得意先（customer_id）を必須に変更
- 2026-01-19: 見積新規登録・更新APIに流用作成用パラメータを追加（base_quot_id, operations）
- 2026-01-19: 見積更新API（ステータス00）のセクションを追加
- 2026-01-19: センター所長一覧取得APIを追加（制作見積依頼用）
- 2026-01-19: 制作見積依頼APIにメール送信機能を追加（主管センターの所長宛て、開発環境はログ出力）
- 2026-01-28: 認証チェック統一により401エラーレスポンスを更新（「未認証（ミドルウェア）」に統一）
