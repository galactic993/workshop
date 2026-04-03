---
name: s1.5-message-format
description: 画面設計書のメッセージ一覧シートを対象に、エラー/サクセスメッセージが定義済みフォーマットパターンに準拠しているかチェックする。
---

# s1.5-message-format スキル

## 概要
画面設計書のメッセージ一覧シートを対象に、エラー/サクセスメッセージが定義済みフォーマットパターンに準拠しているかチェックする。

## 使い方

`shared-agent-skills` では `scripts/run-session1-claude-p.sh` に画面設計書・テーブル定義書を渡すと、本スキルを含む s1.5 プロンプトが並列実行されます。

単体で使う場合は本ディレクトリの `SKILL.md` を `~/.claude/skills/` に置き、Claude / Claude Code で Excel を読み取れるように指示してください。

## フォーマットルール（6パターン）
| パターンID | 区分 | 例 |
|---|---|---|
| MSG-AUTH | エラー | アクセス権限がありません |
| MSG-FETCH-FAIL | エラー | XXXの取得に失敗しました。時間を空けて再度お試しください |
| MSG-PROC-FAIL | エラー | XXXに失敗しました |
| MSG-INPUT-ERR | エラー | 入力内容に誤りがあります。各項目をご確認ください |
| MSG-NOT-FOUND | サクセス | 該当するXXXが見つかりません |
| MSG-SUCCESS | サクセス | XXXしました |

## レビュー上の判定
- **PASS**: 定義済みパターンに準拠
- **WARN/FAIL**: 逸脱または要確認
