# フロントエンドテスト仕様

## 概要

フロントエンドのテストは Vitest + React Testing Library で実装されています。
ユーティリティ関数、Zodスキーマ、Zustandストア、UIコンポーネントを対象としています。

## テストフレームワーク

- **Vitest**: テストランナー
- **React Testing Library**: コンポーネントテスト
- **@testing-library/user-event**: ユーザーインタラクションのシミュレーション

## テストファイル構成

```
frontend/src/
├── lib/
│   ├── permissions.test.ts      # 権限判定ユーティリティ
│   ├── utils.test.ts            # 共通ユーティリティ関数
│   └── apiHelpers.test.ts       # API呼び出しラッパー
├── hooks/
│   └── useDebounce.test.ts      # デバウンスフック
├── schemas/
│   ├── quotCreateSchema.test.ts # 見積作成フォームスキーマ
│   ├── quotSearchSchema.test.ts # 見積検索フォームスキーマ
│   └── sectionCustomerSchema.test.ts # 部署別得意先フォームスキーマ
└── components/
    ├── ui/
    │   ├── Pagination.test.tsx  # ページネーション
    │   └── ErrorBoundary.test.tsx # エラー境界
    └── forms/
        └── CustomerSelectDialog.test.tsx # 得意先選択ダイアログ
```

## テストカテゴリ

| カテゴリ | ドキュメント | 説明 |
|---------|------------|------|
| ユーティリティ・フック | [utils.md](./utils.md) | permissions, utils, apiHelpers, useDebounce |
| スキーマ | [schemas.md](./schemas.md) | quotCreateSchema, quotSearchSchema, sectionCustomerSchema |
| コンポーネント | [components.md](./components.md) | Pagination, ErrorBoundary, CustomerSelectDialog |

## テスト実行

```bash
# 全テスト実行
docker compose exec frontend npm test

# ウォッチモード
docker compose exec frontend npm run test:watch

# 特定ファイルのみ
docker compose exec frontend npm test -- src/schemas/quotSearchSchema.test.ts
```
