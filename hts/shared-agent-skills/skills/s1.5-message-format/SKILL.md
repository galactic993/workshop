---
name: s1.5-message-format
description: 画面設計書のメッセージ一覧シートを対象に、エラー/サクセスメッセージが定義済みフォーマットパターンに準拠しているかチェックする。
---

# s1.5-message-format スキル

## 概要
画面設計書のメッセージ一覧シートを対象に、エラー/サクセスメッセージが定義済みフォーマットパターンに準拠しているかチェックする。

## 使い方
```bash
python ~/.claude/skills/s1.5-message-format/scripts/check_message_format.py <設計書ディレクトリ> [--output result.xlsx]
```

## フォーマットルール（6パターン）
| パターンID | 区分 | 例 |
|---|---|---|
| MSG-AUTH | エラー | アクセス権限がありません |
| MSG-FETCH-FAIL | エラー | XXXの取得に失敗しました。時間を空けて再度お試しください |
| MSG-PROC-FAIL | エラー | XXXに失敗しました |
| MSG-INPUT-ERR | エラー | 入力内容に誤りがあります。各項目をご確認ください |
| MSG-NOT-FOUND | サクセス | 該当するXXXが見つかりません |
| MSG-SUCCESS | サクセス | XXXしました |

## 終了コード
- 0: 全PASS
- 1: WARN/FAILあり
