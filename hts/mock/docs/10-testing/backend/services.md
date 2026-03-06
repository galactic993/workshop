# ビジネスロジックテスト仕様

**ファイル**: `backend/tests/Unit/Services/QuotActionServiceTest.php`

## 概要

見積アクションサービス（QuotActionService）のユニットテスト。
RefreshDatabaseトレイトを使用し、テストごとにデータベースをリセット。

## テスト対象メソッド

| メソッド | 説明 |
|---------|------|
| approve | 承認 |
| cancelApproval | 承認取消 |
| requestProduction | 制作見積依頼 |
| reject | 差戻し |
| register | 登録（承認待ちへ） |
| cancelRegister | 登録取消 |
| updateAmounts | 金額更新 |
| issue | 発行 |
| reissue | 再発行 |

---

## approve（承認）

### 正常系

| テストケース | チェック内容 |
|-------------|-------------|
| 承認でステータスが承認済に変更される | quot_status = STATUS_APPROVED ('50') |
| 承認者IDが設定される | approved_by = 指定したemployee_id |
| 承認日時が設定される | approved_at が null でない |

### 異常系

| テストケース | チェック内容 |
|-------------|-------------|
| ステータス不正で例外 | STATUS_REGISTERED('00')でInvalidArgumentException |
| エラーメッセージ | 「承認待ちの見積のみ承認できます」 |

---

## cancelApproval（承認取消）

### 正常系

| テストケース | チェック内容 |
|-------------|-------------|
| 承認取消でステータスが承認待ちに変更される | quot_status = STATUS_PENDING_APPROVAL ('40') |
| 承認者IDがクリアされる | approved_by = null |
| 承認日時がクリアされる | approved_at = null |

### 異常系

| テストケース | チェック内容 |
|-------------|-------------|
| ステータス不正で例外 | STATUS_PENDING_APPROVAL('40')でInvalidArgumentException |
| エラーメッセージ | 「承認済の見積のみ取消できます」 |

---

## requestProduction（制作見積依頼）

### 正常系

| テストケース | チェック内容 |
|-------------|-------------|
| 制作見積レコードが作成される | ProdQuotインスタンスが返される |
| 見積IDが紐付く | prod_quot.quot_id = quot.quot_id |
| 原価初期値 | cost = 0 |
| ステータス初期値 | prod_quot_status = STATUS_NOT_STARTED ('00') |
| バージョン初期値 | version = 1 |
| 見積ステータス変更 | quot_status = STATUS_PRODUCTION_REQUESTED ('10') |

### 異常系

| テストケース | チェック内容 |
|-------------|-------------|
| ステータス不正で例外 | STATUS_PENDING_APPROVAL('40')でInvalidArgumentException |
| エラーメッセージ | 「登録済の見積のみ制作見積依頼できます」 |

---

## reject（差戻し）

### 正常系

| テストケース | チェック内容 |
|-------------|-------------|
| 見積ステータスが制作見積中に変更される | quot_status = STATUS_PRODUCTION_IN_PROGRESS ('20') |
| 制作見積ステータスが差戻しに変更される | prod_quot_status = STATUS_REJECTED ('50') |
| バージョンがインクリメントされる | version +1 |
| 差戻しログが作成される | ProdQuotReturnLogレコードが存在 |
| 差戻しログの前バージョン | previous_version = 変更前version |
| 差戻しログの次バージョン | next_version = 変更後version |
| 差戻し理由 | remand_reason = 指定した理由 |

### 異常系

| テストケース | チェック内容 |
|-------------|-------------|
| ステータス不正で例外 | STATUS_PENDING_APPROVAL('40')でInvalidArgumentException |
| エラーメッセージ | 「制作見積済の見積のみ差戻しできます」 |
| 制作見積が見つからない場合 | RuntimeException |
| エラーメッセージ | 「制作見積が見つかりません」 |

---

## register（登録）

### 正常系

| テストケース | チェック内容 |
|-------------|-------------|
| 見積ステータスが承認待ちに変更される | quot_status = STATUS_PENDING_APPROVAL ('40') |
| 見積金額が設定される | quot_amount = 合計金額 |
| QuotOperationが作成される | 各作業部門の見積金額レコード |

### 異常系

| テストケース | チェック内容 |
|-------------|-------------|
| ステータス不正で例外 | STATUS_PENDING_APPROVAL('40')でInvalidArgumentException |
| エラーメッセージ | 「制作見積済の見積のみ登録できます」 |
| 制作見積が見つからない場合 | RuntimeException「制作見積が見つかりません」 |
| 作業部門別制作見積が見つからない場合 | RuntimeException「作業部門別制作見積が見つかりません」 |

---

## cancelRegister（登録取消）

### 正常系

| テストケース | チェック内容 |
|-------------|-------------|
| 見積ステータスが制作見積済に変更される | quot_status = STATUS_PRODUCTION_COMPLETED ('30') |
| 見積金額がクリアされる | quot_amount = null |
| QuotOperationが削除される | 関連レコード数 = 0 |

### 異常系

| テストケース | チェック内容 |
|-------------|-------------|
| ステータス不正で例外 | STATUS_APPROVED('50')でInvalidArgumentException |
| エラーメッセージ | 「承認待ちの見積のみ登録取消できます」 |

---

## updateAmounts（金額更新）

### 正常系

| テストケース | チェック内容 |
|-------------|-------------|
| 見積金額が更新される | quot_amount = 新しい合計金額 |
| QuotOperationの金額が更新される | quot_operation.quot_amount = 新しい金額 |

### 異常系

| テストケース | チェック内容 |
|-------------|-------------|
| ステータス不正で例外 | STATUS_APPROVED('50')でInvalidArgumentException |
| エラーメッセージ | 「承認待ちの見積のみ更新できます」 |

---

## issue（発行）

### 正常系

| テストケース | チェック内容 |
|-------------|-------------|
| ファイルパスが返される | 一時ファイルパスが存在する |
| 見積ステータスが発行済に変更される | quot_status = STATUS_ISSUED ('60') |
| 見積日が設定される | quot_on が設定される |
| 発行ログが作成される | QuotIssueLogレコード数 = 1 |

### 異常系

| テストケース | チェック内容 |
|-------------|-------------|
| ステータス不正で例外 | STATUS_PENDING_APPROVAL('40')でInvalidArgumentException |
| エラーメッセージ | 「承認済の見積のみ発行できます」 |

---

## reissue（再発行）

### 正常系

| テストケース | チェック内容 |
|-------------|-------------|
| ファイルパスが返される | 一時ファイルパスが存在する |
| 発行ログが追加される | QuotIssueLogレコード数 = 2（既存1 + 新規1） |

### 異常系

| テストケース | チェック内容 |
|-------------|-------------|
| ステータス不正で例外 | STATUS_APPROVED('50')でInvalidArgumentException |
| エラーメッセージ | 「発行済の見積のみ再発行できます」 |

---

## ステータス定数

| 定数 | 値 | 説明 |
|------|-----|------|
| STATUS_REGISTERED | '00' | 登録済 |
| STATUS_PRODUCTION_REQUESTED | '10' | 制作見積依頼済 |
| STATUS_PRODUCTION_IN_PROGRESS | '20' | 制作見積中 |
| STATUS_PRODUCTION_COMPLETED | '30' | 制作見積済 |
| STATUS_PENDING_APPROVAL | '40' | 承認待ち |
| STATUS_APPROVED | '50' | 承認済 |
| STATUS_ISSUED | '60' | 発行済 |
