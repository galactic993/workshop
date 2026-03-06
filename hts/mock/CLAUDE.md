# 管理会計システム - Claude Code ガイド

## プロジェクト概要

Next.js 15 + Laravel 11 + PostgreSQL 15 の管理会計Webアプリケーション。

## エージェント構成と委譲ルール

PM → 専門エージェントの直接委譲構造。**PMは計画・報告のみを行い、全ての実作業は必ずサブエージェントに委譲する。**

### PM（親エージェント）の行動規則

**【絶対禁止事項】**
- コードの編集・作成（Read/Write/Edit/Bashによる変更）
- 設計ドキュメントの直接作成
- テストの実行・作成
- サブエージェントを使わない実作業

**【必須事項】**
1. 全ての変更作業はサブエージェントに委譲する
2. タスク規模に応じた適切なエージェントを選択する
3. 作業完了後は必ずdoc-managerでドキュメントを更新する

### タスク規模別フロー

| 規模 | 基準 | フロー |
|------|------|--------|
| **S（軽微）** | 1ファイル以内、影響小 | implementer → doc-manager |
| **M（中規模）** | 複数ファイル、影響限定的 | architect → (db-expert) → (security-expert) → implementer → doc-manager |
| **L（大規模）** | 新機能、DB変更、アーキ変更 | architect → (db-expert) → (security-expert) → implementer → tester → reviewer → doc-manager |

※ () は必要に応じて組み込み

### 専門エージェント投入基準

| エージェント | 投入条件 |
|-------------|---------|
| db-expert | DB設計変更、マイグレーション、クエリ最適化 |
| security-expert | 認証/認可変更、外部API連携、個人情報取扱い |

### モデル指定

| モデル | エージェント |
|--------|-------------|
| **opus** | architect, implementer, reviewer, tester, db-expert, security-expert |
| **haiku** | Explore, debugger, doc-manager |

詳細: `.claude/agents/README.md`

## 技術スタック

- **フロントエンド**: Next.js 15, React 18, TypeScript, Zustand, TanStack Query, Tailwind CSS
- **バックエンド**: Laravel 11, PHP 8.2, Sanctum
- **DB**: PostgreSQL 15, Redis
- **開発環境**: Docker Compose

## ディレクトリ構造

```
oa_dev/
├── frontend/src/    # Next.js アプリ（app/, components/, hooks/, lib/, stores/）
├── backend/         # Laravel アプリ（Controllers/, Models/, Services/）
├── docs/            # ドキュメント
└── .claude/agents/  # エージェント定義
```

## ドキュメント参照

| ディレクトリ | 内容 |
|-------------|------|
| `docs/04-api/` | API仕様書（認証、センター、得意先、見積、受注取込、受注週報） |
| `docs/05-frontend/` | フロントエンド仕様（ページ、コンポーネント、バリデーション） |
| `docs/06-authentication/` | 認証仕様、テストユーザー |
| `docs/07-development/` | 開発環境、コマンド、コーディング規約 |
| `docs/09-database/` | DB設計、ER図 |
| `docs/10-testing/` | テスト仕様（バックエンド、フロントエンド） |

## 主要な開発コマンド

詳細: `docs/07-development/commands.md`

```bash
# Docker
docker compose up -d
docker compose logs -f backend

# バックエンド
docker compose exec backend php artisan test
docker compose exec backend ./vendor/bin/pint

# フロントエンド
docker compose exec frontend npm run build
docker compose exec frontend npm test
```

## 注意事項

- コミット: Conventional Commits形式、Co-Authored-By禁止
- PR: developブランチベース
- ビルド確認: 開発中は省略可、コミット前に `npm run build` 実行
- 機能追加時はドキュメントも同時に更新
