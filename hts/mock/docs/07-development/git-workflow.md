# Git ブランチ戦略・ワークフロー

## ブランチ戦略の概要

本プロジェクトでは、**GitHub Flow ベースの簡略化されたブランチ戦略**を採用します。
CI/CD による自動デプロイを前提とし、シンプルで運用しやすい戦略とします。

## ブランチ構成

### 主要ブランチ

#### 1. `main` ブランチ（本番環境）

**役割**
- 常にデプロイ可能な状態を保つ
- 本番環境に自動デプロイされる
- 直接プッシュは禁止（保護設定）

**保護ルール**
- ✅ プルリクエスト必須
- ✅ 最低1名の承認必須
- ✅ ステータスチェック必須（CI テスト合格）
- ✅ 直接プッシュ禁止
- ✅ Force push 禁止

**自動デプロイ**
```yaml
main ブランチへのマージ → CI/CD 実行 → 本番環境へ自動デプロイ
```

#### 2. `develop` ブランチ（開発環境）【オプション】

**役割**
- 開発中の機能を統合するブランチ
- 開発環境に自動デプロイされる
- 統合テスト用

**運用方針**
- feature ブランチからのマージ先
- main ブランチへのマージ前の最終確認
- 開発環境での動作確認後、main へプルリクエスト

**自動デプロイ**
```yaml
develop ブランチへのマージ → CI/CD 実行 → 開発環境へ自動デプロイ
```

### 作業用ブランチ

#### 3. `feature/*` ブランチ（機能開発）

**命名規則**
```
feature/<issue番号>-<機能名>
feature/<機能名>

例:
feature/1-user-authentication
feature/login-page
feature/estimate-management
```

**作成元**
- develop ブランチから作成（develop がある場合）
- main ブランチから作成（develop がない場合）

**マージ先**
- develop ブランチ（develop がある場合）
- main ブランチ（develop がない場合）

**運用ルール**
- 1つの機能・タスクごとに1ブランチ
- こまめにコミット
- 定期的に base ブランチ（main or develop）を pull して最新化
- 完成したらプルリクエストを作成

#### 4. `hotfix/*` ブランチ（緊急修正）

**命名規則**
```
hotfix/<issue番号>-<修正内容>
hotfix/<修正内容>

例:
hotfix/42-login-error
hotfix/security-patch
```

**作成元**
- main ブランチから作成

**マージ先**
- main ブランチ（本番へ即時反映）
- develop ブランチ（開発環境にも反映）

**運用ルール**
- 本番環境の緊急バグ修正のみ
- 最優先で対応
- main と develop 両方にマージ

#### 5. `release/*` ブランチ（リリース準備）【オプション】

**命名規則**
```
release/v1.0.0
release/v1.1.0
```

**作成元**
- develop ブランチから作成

**マージ先**
- main ブランチ
- develop ブランチ（バージョン番号更新などを反映）

**運用ルール**
- リリース前の最終調整のみ
- バグ修正、ドキュメント更新、バージョン番号変更
- 新機能追加は禁止

---

## 推奨ブランチ戦略（2パターン）

### パターン A: シンプル戦略（推奨）

小規模チーム向け、最もシンプルな構成

```
main (本番環境)
 ↑
 └── feature/* (機能開発)
 └── hotfix/* (緊急修正)
```

**メリット**
- 非常にシンプルで理解しやすい
- 運用コストが低い
- 小規模チームに最適

**デメリット**
- 統合テスト環境がない
- 複数機能の同時開発時に注意が必要

**適用条件**
- チーム規模: 1〜5名
- リリース頻度: 高頻度（週1回以上）
- 統合テストは main マージ前に実施

### パターン B: 標準戦略

開発環境での統合テストを行う構成

```
main (本番環境)
 ↑
develop (開発環境)
 ↑
 ├── feature/* (機能開発)
 └── hotfix/* → main & develop
```

**メリット**
- 開発環境で統合テスト可能
- 本番環境の安定性が高い
- 複数機能の同時開発に対応

**デメリット**
- ブランチ管理がやや複雑
- develop ブランチのメンテナンスが必要

**適用条件**
- チーム規模: 3〜10名
- リリース頻度: 中程度（月2〜4回）
- 開発環境での統合テストが必要

---

## 本プロジェクトでの採用戦略

### 採用: **パターン B（標準戦略）**

**理由**
- 管理会計システムのため、本番環境の安定性が重要
- 開発環境での統合テストが必要
- 将来的な機能追加を見据えた拡張性

**ブランチ構成**
```
main (本番環境) ← 自動デプロイ
 ↑
develop (開発環境) ← 自動デプロイ
 ↑
 ├── feature/1-user-auth
 ├── feature/2-estimate-management
 └── feature/3-work-hours-tracking
```

---

## ワークフロー

### 1. 新機能開発のフロー

```bash
# 1. develop ブランチを最新化
git checkout develop
git pull origin develop

# 2. feature ブランチを作成
git checkout -b feature/1-user-authentication

# 3. 開発作業
# ... コーディング ...
git add .
git commit -m "feat: ユーザー認証機能を追加"

# 4. 定期的に develop を取り込む（コンフリクト防止）
git fetch origin develop
git merge origin/develop

# 5. リモートにプッシュ
git push origin feature/1-user-authentication

# 6. GitHub/GitLab でプルリクエスト作成
# develop ← feature/1-user-authentication

# 7. レビュー・承認後にマージ
# develop ブランチへ自動デプロイ（開発環境）

# 8. 開発環境で動作確認

# 9. main へプルリクエスト作成（リリース準備完了時）
# main ← develop

# 10. レビュー・承認後にマージ
# main ブランチへ自動デプロイ（本番環境）
```

### 2. 緊急修正（Hotfix）のフロー

```bash
# 1. main ブランチから hotfix ブランチを作成
git checkout main
git pull origin main
git checkout -b hotfix/login-error

# 2. 修正作業
git add .
git commit -m "fix: ログインエラーを修正"

# 3. プッシュ
git push origin hotfix/login-error

# 4. main へプルリクエスト作成
# main ← hotfix/login-error

# 5. 承認後マージ → 本番環境へ自動デプロイ

# 6. develop へもマージ（修正を開発環境にも反映）
git checkout develop
git merge hotfix/login-error
git push origin develop
```

---

## コミットメッセージ規約

### Conventional Commits 採用

**フォーマット**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type（必須）**
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの意味に影響しない変更（空白、フォーマット等）
- `refactor`: リファクタリング
- `perf`: パフォーマンス改善
- `test`: テストの追加・修正
- `chore`: ビルドプロセスやツールの変更

**例**
```bash
# 良い例
git commit -m "feat(auth): ユーザー認証機能を追加"
git commit -m "fix(login): ログイン時のバリデーションエラーを修正"
git commit -m "docs(readme): セットアップ手順を更新"

# 悪い例
git commit -m "修正"
git commit -m "update"
git commit -m "バグ直した"
```

---

## プルリクエスト（PR）運用ルール

### PR 作成時のルール

**1. PR タイトル**
- コミットメッセージと同じ規約に従う
- 何を変更したのか明確に記述

```
例:
feat(auth): ユーザー認証機能を実装
fix(login): ログインページのレイアウト崩れを修正
```

**2. PR 説明（テンプレート）**

```markdown
## 概要
<!-- この PR で何を実現するか -->

## 変更内容
<!-- 主な変更点を箇条書きで -->
-
-

## スクリーンショット（該当する場合）
<!-- UI 変更がある場合は画像を添付 -->

## テスト
<!-- どのようにテストしたか -->
- [ ] ローカル環境で動作確認
- [ ] 単体テスト追加
- [ ] 統合テスト確認

## チェックリスト
- [ ] コードレビューを受ける準備ができている
- [ ] テストが通過している
- [ ] ドキュメントを更新した（必要な場合）
- [ ] breaking change がある場合は明記した
```

### PR レビュールール

**レビュアー**
- 最低 1 名の承認が必要
- 可能であれば 2 名のレビューが望ましい

**レビュー観点**
- ✅ コードの品質
- ✅ 要件を満たしているか
- ✅ テストが十分か
- ✅ セキュリティ上の問題はないか
- ✅ パフォーマンス上の問題はないか
- ✅ ドキュメントが更新されているか

**レビューコメント**
- 建設的なフィードバックを心がける
- 問題点だけでなく良い点も指摘
- 必要に応じてコード例を提示

### マージルール

**マージ方法**
- `Squash and merge` を推奨（コミット履歴を整理）
- `Merge commit` も可（履歴を残したい場合）
- `Rebase and merge` は非推奨（コンフリクト時に複雑）

**マージ後**
- マージ後は feature ブランチを削除
- 自動デプロイの完了を確認

---

## CI/CD パイプライン

### develop ブランチへのマージ時

```yaml
トリガー: develop ブランチへの push

ステップ:
1. コードチェックアウト
2. 依存関係インストール
3. Lint チェック（ESLint, Prettier, PHPStan）
4. 単体テスト実行（Vitest, PHPUnit）
5. ビルド（Next.js, Laravel）
6. 統合テスト実行
7. 開発環境へデプロイ
8. デプロイ成功通知（Slack など）
```

### main ブランチへのマージ時

```yaml
トリガー: main ブランチへの push

ステップ:
1. コードチェックアウト
2. 依存関係インストール
3. Lint チェック
4. テスト実行（全テスト）
5. セキュリティスキャン
6. ビルド（本番用）
7. 本番環境へデプロイ
8. デプロイ成功通知
9. Sentry などへリリースタグ送信
```

---

## ブランチ保護設定

### GitHub の場合

**main ブランチ**
```
Settings → Branches → Add rule

Branch name pattern: main

☑ Require a pull request before merging
  ☑ Require approvals: 1
  ☑ Dismiss stale pull request approvals when new commits are pushed
☑ Require status checks to pass before merging
  ☑ Require branches to be up to date before merging
  - CI テスト
  - Lint チェック
☑ Require conversation resolution before merging
☑ Do not allow bypassing the above settings
☑ Restrict who can push to matching branches
```

**develop ブランチ**
```
Settings → Branches → Add rule

Branch name pattern: develop

☑ Require a pull request before merging
  ☑ Require approvals: 1
☑ Require status checks to pass before merging
  - CI テスト
  - Lint チェック
```

---

## バージョニング

### Semantic Versioning 採用

**形式**: `MAJOR.MINOR.PATCH`

```
1.0.0
│ │ │
│ │ └─ PATCH: バグ修正
│ └─── MINOR: 後方互換性のある機能追加
└───── MAJOR: 後方互換性のない変更
```

**例**
- `v1.0.0`: 初回リリース
- `v1.1.0`: 見積管理機能追加
- `v1.1.1`: ログインバグ修正
- `v2.0.0`: 認証システム刷新（breaking change）

**タグの付け方**
```bash
# main ブランチでタグを作成
git checkout main
git pull origin main
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

---

## トラブルシューティング

### コンフリクト発生時

```bash
# 1. base ブランチを取り込む
git fetch origin develop
git merge origin/develop

# 2. コンフリクトを解消
# エディタでコンフリクト箇所を修正

# 3. コミット
git add .
git commit -m "merge: developブランチをマージ、コンフリクト解消"
git push
```

### 誤って main に直接プッシュしてしまった場合

```bash
# ブランチ保護設定があれば拒否されるはず
# もし通ってしまった場合:

# 1. 最新のコミットを取り消す（push 前なら）
git reset --soft HEAD~1

# 2. feature ブランチを作成してそちらにコミット
git checkout -b feature/fix-accidental-commit
git push origin feature/fix-accidental-commit

# 3. PR を作成して正式な手順でマージ
```

---

## ベストプラクティス

### DO（推奨）

✅ こまめにコミット（論理的な単位で）
✅ 意味のあるコミットメッセージを書く
✅ PR 作成前にセルフレビュー
✅ レビューコメントには誠実に対応
✅ マージ前に最新の base ブランチを取り込む
✅ CI が通ることを確認してから PR 作成
✅ 小さな PR を心がける（500行以内が理想）

### DON'T（非推奨）

❌ main ブランチに直接プッシュ
❌ 巨大な PR を作成（1000行以上）
❌ 「修正」「update」などの曖昧なコミットメッセージ
❌ レビューなしでマージ
❌ テストを書かずにコード変更
❌ コンフリクトを放置
❌ WIP（Work In Progress）状態で PR マージ

---

## 参考資料

- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

## 更新履歴

- 2025-12-08: 初版作成
