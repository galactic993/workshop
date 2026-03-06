# 変更履歴

このプロジェクトの全ての注目すべき変更はこのファイルに記録されます。

フォーマットは [Keep a Changelog](https://keepachangelog.com/ja/1.0.0/) に基づいており、
このプロジェクトは [セマンティック バージョニング](https://semver.org/lang/ja/) に準拠しています。

## [Unreleased]

### 追加予定
- 受注管理機能
- 発注管理機能
- レポート出力機能

## [0.1.0] - 2026-01-25

### 追加
- **認証システム**
  - パスワードレス認証（部署コード + 社員コード）
  - Laravel Sanctum によるSPA認証
  - アクセス区分に基づく権限管理（全て、ディレクター、所長、リーダー、一般）

- **見積管理機能**
  - 見積一覧・検索機能
  - 見積詳細表示
  - 見積新規作成・編集
  - 承認ワークフロー（申請、承認、差戻し、承認取消）
  - 見積Excel発行
  - 得意先選択機能

- **基盤機能**
  - Next.js 15 + React 18 によるフロントエンド
  - Laravel 11 によるバックエンドAPI
  - PostgreSQL 15 によるデータストレージ
  - Docker Compose による開発環境

- **テスト基盤**
  - Vitest によるユニットテスト
  - Playwright によるE2Eテスト
  - PHPUnit による機能テスト

### 技術スタック
- フロントエンド: Next.js 15.1, React 18.3, TypeScript 5.7, Zustand 5.0, TanStack Query 5.62
- バックエンド: Laravel 11.31, PHP 8.2
- データベース: PostgreSQL 15
- インフラ: Docker, Nginx, Redis

---

[Unreleased]: https://github.com/your-org/oa_dev/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/your-org/oa_dev/releases/tag/v0.1.0
