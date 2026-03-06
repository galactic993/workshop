# フロントエンド仕様書

## 概要

管理会計システムのフロントエンド仕様を定義します。

---

## ドキュメント構成

```
docs/05-frontend/
├── README.md              # 本ファイル（概要、設計原則、ファイル構成）
├── components/
│   ├── layout.md          # レイアウトコンポーネント（Header, Breadcrumb, PageFooter）
│   ├── sidebar.md         # Sidebar（サイドメニュー）詳細仕様
│   ├── ui.md              # UIコンポーネント（ErrorBoundary, ConfirmDialog, Pagination, MessageDialog）
│   └── forms.md           # フォームコンポーネント（CustomerSelectDialog）
├── hooks.md               # カスタムフック（useDebounce, useAuthGuard, useCustomerSuggest, useQuotSearch）
├── pages/
│   ├── quotes.md          # 見積ページ
│   ├── sales.md           # 売上管理ページ、部署別得意先メンテナンス
│   └── orders.md          # 受注管理ページ（受注情報取込）
├── design-system.md       # デザインシステム
├── layout.md              # 全体レイアウト構造
└── validation.md          # バリデーション共通仕様
```

---

## コンポーネント設計原則

### 1. Single Responsibility（単一責任）

各コンポーネントは1つの明確な責任を持つ

### 2. Reusability（再利用性）

汎用的に使えるように設計し、props で柔軟にカスタマイズ可能に

### 3. Accessibility（アクセシビリティ）

- 適切なHTML要素を使用（セマンティックHTML）
- ARIA属性を必要に応じて追加
- キーボード操作をサポート

### 4. Performance（パフォーマンス）

- 不要な再レンダリングを避ける
- 適切に `'use client'` ディレクティブを使用
- 動的インポートでコード分割

---

## ファイル構成

```
frontend/src/
├── components/
│   ├── layout/           # レイアウト関連
│   │   ├── Header.tsx
│   │   ├── Breadcrumb.tsx
│   │   ├── Sidebar.tsx
│   │   └── PageFooter.tsx
│   ├── ui/              # 汎用UIコンポーネント
│   │   ├── Pagination.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── ConfirmDialog.tsx
│   ├── forms/           # フォーム関連コンポーネント
│   │   └── CustomerSelectDialog.tsx
│   ├── quotes/          # 見積機能コンポーネント
│   │   ├── QuotSearchForm.tsx
│   │   └── QuotTable.tsx
│   └── RouterInitializer.tsx  # ルーター初期化
├── hooks/                # カスタムフック
│   ├── useAuthGuard.ts
│   ├── useDebounce.ts
│   ├── useCustomerSuggest.ts
│   ├── useQuotSearch.ts
│   └── useSectionCustomerData.ts
├── lib/                  # ユーティリティ・API
│   ├── api.ts
│   ├── auth.ts
│   ├── customer.ts
│   ├── navigationService.ts  # ルーターサービス
│   ├── quot.ts
│   ├── permissions.ts
│   ├── types.ts
│   └── utils.ts
├── stores/               # Zustandストア
│   ├── authStore.ts       # 認証状態管理
│   └── authErrorStore.ts  # 認証エラー管理
└── schemas/              # Zodスキーマ
    ├── loginSchema.ts
    ├── sectionCustomerSchema.ts
    ├── orderImportSchema.ts
    └── quotSearchSchema.ts
```

---

## 今後追加予定のコンポーネント

### ナビゲーション
- **タブ**: ページ内セクション切り替え

### フォーム
- **Input**: テキスト入力フィールド
- **Select**: ドロップダウン選択
- **Button**: アクションボタン
- **DatePicker**: 日付選択

### データ表示
- **Table**: データテーブル
- **Card**: カード形式の情報表示
- **Badge**: ステータス表示

### フィードバック
- **Alert**: 通知メッセージ
- **Modal**: モーダルダイアログ

---

## 更新履歴

- 2025-12-08: 初版作成
- 2025-12-25: ドキュメント分割（components.mdを複数ファイルに分割）
- 2026-01-18: storesディレクトリをファイル構成に追加
- 2026-01-18: navigationService.ts、RouterInitializer.tsx を追加
- 2026-01-28: ファイル構成にuseSectionCustomerData.tsを追加
- 2026-01-28: トースト機能を削除、MessageDialogに統一（Toast.tsx、toastStore.tsを削除）
- 2026-01-30: 受注管理ページドキュメント（orders.md）を追加、orderImportSchema.ts をスキーマに追加
