# システムアーキテクチャ概要

## システム構成図

```
┌─────────────────────────────────────────────────────────────┐
│                        ユーザー（ブラウザ）                      │
│                     Chrome / Edge / Safari                  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   フロントエンド層                             │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Next.js 15 (App Router)                  │  │
│  │                                                        │  │
│  │  - React 18                                           │  │
│  │  - TypeScript                                         │  │
│  │  - Tailwind CSS                                       │  │
│  │  - Zustand (クライアント状態)                          │  │
│  │  - TanStack Query (サーバー状態)                      │  │
│  │  - React Hook Form + Zod                             │  │
│  │  - Axios (HTTP通信)                                   │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API (Session Cookie)
                         │ HTTPS
┌────────────────────────▼────────────────────────────────────┐
│                   バックエンド層                               │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                Laravel 11 API                         │  │
│  │                                                        │  │
│  │  - PHP 8.2+                                           │  │
│  │  - Laravel Sanctum (認証)                             │  │
│  │  - API Resources (レスポンス整形)                     │  │
│  │  - Eloquent ORM                                       │  │
│  │  - Form Request (バリデーション)                      │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ TCP/IP
┌────────────────────────▼────────────────────────────────────┐
│                    データベース層                              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              PostgreSQL 15+                           │  │
│  │                                                        │  │
│  │  - ユーザーデータ                                      │  │
│  │  - 会計データ                                         │  │
│  │  - マスタデータ                                       │  │
│  │  - ログデータ                                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## アーキテクチャパターン

### クライアント・サーバー型（3層アーキテクチャ）

1. **プレゼンテーション層**: Next.js（フロントエンド）
2. **アプリケーション層**: Laravel（バックエンドAPI）
3. **データ層**: PostgreSQL（データベース）

### 特徴

- **分離**: 各層が独立して開発・デプロイ可能
- **疎結合**: REST APIで通信、フロント・バックの技術スタックが独立
- **スケーラビリティ**: 各層を個別にスケール可能

## 通信フロー

### 1. 初回ロード時

```
[ブラウザ]
   ↓ (1) https://app.example.com にアクセス
[Next.js Server]
   ↓ (2) HTMLを生成・返却
[ブラウザ]
   ↓ (3) JavaScriptをロード
   ↓ (4) 認証状態チェック（/api/auth/check）
   ↓ (5) Cookie送信（セッションベース）
[Laravel API]
   ↓ (6) セッション検証
   ↓ (7) ユーザー情報返却
[Next.js Client]
   ↓ (8) Zustandにユーザー情報保存
   ↓ (9) ポータル画面表示
```

### 2. データ取得フロー

```
[ユーザー操作]
   ↓
[Next.js Component]
   ↓ (1) TanStack Query でデータ要求
[Axios]
   ↓ (2) GET /api/transactions?page=1 (Cookie自動送信)
[Laravel API]
   ↓ (3) Sanctum Middleware でセッション認証
   ↓ (4) Controller で処理
   ↓ (5) Eloquent でDB問い合わせ
[PostgreSQL]
   ↓ (6) データ返却
[Laravel API]
   ↓ (7) API Resource で整形
   ↓ (8) JSONレスポンス
[TanStack Query]
   ↓ (9) キャッシュに保存
   ↓ (10) コンポーネントに渡す
[画面表示]
```

### 3. データ更新フロー

```
[ユーザー操作: フォーム送信]
   ↓
[React Hook Form]
   ↓ (1) Zodでバリデーション
   ↓ (2) POST /api/transactions (Cookie + CSRF Token)
[Laravel API]
   ↓ (3) セッション・CSRF検証
   ↓ (4) Form Request でバリデーション
   ↓ (5) Controller で処理
   ↓ (6) Eloquent でDB更新
[PostgreSQL]
   ↓ (7) トランザクション実行
[Laravel API]
   ↓ (8) 成功レスポンス
[TanStack Query]
   ↓ (9) キャッシュ無効化
   ↓ (10) 再取得（自動）
[画面更新]
```

## データフロー

### 状態管理の責務分離

```
┌─────────────────────────────────────────────────────────┐
│                   Next.js (フロントエンド)                 │
│                                                          │
│  ┌──────────────────┐  ┌──────────────────┐           │
│  │    Zustand       │  │  TanStack Query  │           │
│  │ (クライアント状態) │  │  (サーバー状態)   │           │
│  │                  │  │                  │           │
│  │ - ユーザー情報    │  │ - 会計データ      │           │
│  │ - テーマ設定     │  │ - マスタデータ    │           │
│  │ - UI状態        │  │ - レポートデータ  │           │
│  └──────────────────┘  └──────────────────┘           │
│           │                      │                      │
│           │                      │ Axios                │
│           └──────────────────────┴──────────────────────┤
│                                   │                     │
└───────────────────────────────────┼─────────────────────┘
                                    │ REST API
┌───────────────────────────────────▼─────────────────────┐
│                Laravel (バックエンド)                      │
│                                                          │
│  Controller → Service → Repository → Eloquent          │
│                                           │              │
└───────────────────────────────────────────┼─────────────┘
                                            │
┌───────────────────────────────────────────▼─────────────┐
│                    PostgreSQL                            │
└─────────────────────────────────────────────────────────┘
```

## ディレクトリ構造

### フロントエンド（Next.js）

```
frontend/
├── app/                        # Next.js App Router
│   ├── (auth)/                # 認証グループ（レイアウト共有）
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/           # ダッシュボードグループ
│   │   ├── dashboard/
│   │   ├── transactions/
│   │   ├── reports/
│   │   └── layout.tsx
│   ├── layout.tsx             # ルートレイアウト
│   └── page.tsx              # トップページ
├── components/
│   ├── ui/                   # 共通UIコンポーネント
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Table.tsx
│   └── features/             # 機能別コンポーネント
│       ├── auth/
│       ├── transactions/
│       └── reports/
├── hooks/                    # カスタムフック
│   ├── useAuth.ts
│   └── useTransactions.ts
├── lib/                      # ユーティリティ
│   ├── api.ts               # Axios設定
│   └── utils.ts             # 汎用関数
├── stores/                  # Zustandストア
│   └── authStore.ts
├── types/                   # TypeScript型定義
│   ├── user.ts
│   └── transaction.ts
├── styles/
│   └── globals.css
└── __tests__/              # テスト
```

### バックエンド（Laravel）

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       ├── AuthController.php
│   │   │       ├── UserController.php
│   │   │       └── TransactionController.php
│   │   ├── Requests/
│   │   │   └── Auth/
│   │   │       └── LoginRequest.php
│   │   ├── Resources/
│   │   │   ├── UserResource.php
│   │   │   └── TransactionResource.php
│   │   └── Middleware/
│   │       └── CheckRole.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Transaction.php
│   │   └── Department.php
│   └── Services/            # ビジネスロジック（必要に応じて）
│       └── TransactionService.php
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── factories/
├── routes/
│   ├── api.php
│   └── web.php
├── tests/
│   ├── Feature/
│   └── Unit/
└── config/
```

## API設計原則

### RESTful API

- **リソースベース**: URLはリソースを表現
- **HTTPメソッド**: GET, POST, PUT, DELETE を適切に使用
- **ステートレス**: 各リクエストは独立

### エンドポイント例

```
# 認証
POST   /api/login
POST   /api/logout
GET    /api/user

# ユーザー管理
GET    /api/users              # 一覧
GET    /api/users/{id}         # 詳細
POST   /api/users              # 作成
PUT    /api/users/{id}         # 更新
DELETE /api/users/{id}         # 削除

# トランザクション
GET    /api/transactions
GET    /api/transactions/{id}
POST   /api/transactions
PUT    /api/transactions/{id}
DELETE /api/transactions/{id}

# レポート
GET    /api/reports/trial-balance      # 試算表
GET    /api/reports/pl-by-department   # 部門別損益
```

### レスポンス形式

**成功時（単一リソース）**
```json
{
  "data": {
    "id": 1,
    "name": "田中太郎",
    "email": "tanaka@example.com"
  }
}
```

**成功時（コレクション）**
```json
{
  "data": [...],
  "meta": {
    "current_page": 1,
    "total": 100,
    "per_page": 20
  },
  "links": {
    "first": "...",
    "last": "...",
    "next": "..."
  }
}
```

**エラー時**
```json
{
  "message": "エラーメッセージ",
  "errors": {
    "field_name": ["エラー詳細"]
  }
}
```

## セキュリティ層

```
[リクエスト]
   ↓
┌──────────────────────────────┐
│ 1. HTTPS/TLS暗号化            │
└────────────┬─────────────────┘
             ↓
┌──────────────────────────────┐
│ 2. CORS検証                   │
└────────────┬─────────────────┘
             ↓
┌──────────────────────────────┐
│ 3. レート制限                  │
└────────────┬─────────────────┘
             ↓
┌──────────────────────────────┐
│ 4. Sanctum認証（セッション検証） │
└────────────┬─────────────────┘
             ↓
┌──────────────────────────────┐
│ 5. 権限チェック（RBAC）        │
└────────────┬─────────────────┘
             ↓
┌──────────────────────────────┐
│ 6. バリデーション              │
└────────────┬─────────────────┘
             ↓
┌──────────────────────────────┐
│ 7. ビジネスロジック実行        │
└────────────┬─────────────────┘
             ↓
[レスポンス]
```

## パフォーマンス最適化

### フロントエンド
- **TanStack Query**: データキャッシュ、重複リクエスト防止
- **Code Splitting**: ページごとに分割ロード
- **画像最適化**: Next.js Image コンポーネント使用

### バックエンド
- **Eager Loading**: N+1問題対策
- **ページネーション**: 大量データの分割取得
- **インデックス**: データベースクエリ最適化
- **キャッシュ**: Redis使用（本番環境）

### データベース
- **インデックス**: 頻繁に検索されるカラムに設定
- **パーティショニング**: 大規模データの分割（将来対応）

## スケーラビリティ

### 水平スケーリング

```
[ロードバランサー]
       │
   ┌───┴───┬───────┐
   │       │       │
[Next.js] [Next.js] [Next.js]  ← 複数インスタンス
       │
[Laravel API]
   ┌───┴───┬───────┐
   │       │       │
[API 1] [API 2] [API 3]        ← 複数インスタンス
       │
[PostgreSQL]
   ↓
[Read Replica] ← 読み取り専用レプリカ（将来対応）
```

## 更新履歴

- 2025-12-08: 初版作成
- 2025-12-08: 管理会計システムとして再定義
- 2025-12-08: プロジェクト名を「管理会計システム」に変更
- 2025-12-09: 認証フローをセッションベース認証に修正
- 2025-12-10: Next.jsバージョンを15に更新
