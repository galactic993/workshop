# フロントエンド レイアウト仕様書

## 概要

管理会計システムのフロントエンドにおける全体レイアウトの仕様を定義します。

---

## 全体構成

### 画面レイアウト構造

#### 未認証時（ログイン画面）

```
┌──────────────────────────────────────────────┐
│ 余白 (#d1d5db / bg-gray-300)                  │
│  ┌────────────────────────────────────────┐  │
│  │ メインコンテンツ (1366px, #ffffff)     │  │
│  │  ┌──────────────────────────────────┐  │  │
│  │  │ Header (80px)                    │  │  │
│  │  │  管理会計システム                 │  │  │
│  │  ├──────────────────────────────────┤  │  │
│  │  │ Breadcrumb (40px)                │  │  │
│  │  │  ホーム / 売上管理 / 月次集計      │  │  │
│  │  ├──────────────────────────────────┤  │  │
│  │  │                                  │  │  │
│  │  │ Main Content                     │  │  │
│  │  │  (ログインフォーム)               │  │  │
│  │  │                                  │  │  │
│  │  └──────────────────────────────────┘  │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

#### 認証後（サイドメニュー表示）

```
┌──────────────────────────────────────────────┐
│ 余白 (#d1d5db / bg-gray-300)                  │
│  ┌────────────────────────────────────────┐  │
│  │ メインコンテンツ (1366px, #ffffff)     │  │
│  │  ┌──────────────────────────────────┐  │  │
│  │  │ Header (80px)                    │  │  │
│  │  │  管理会計システム                 │  │  │
│  │  ├──────────────────────────────────┤  │  │
│  │  │ Breadcrumb (40px)                │  │  │
│  │  │  ホーム / 売上管理 / 月次集計      │  │  │
│  │  ├────────┬─────────────────────────┤  │  │
│  │  │Sidebar │                         │  │  │
│  │  │(256px) │ Main Content            │  │  │
│  │  │        │  (ページコンテンツ)      │  │  │
│  │  │ ポータル│                         │  │  │
│  │  │ 売上管理│                         │  │  │
│  │  │ 編集管理│                         │  │  │
│  │  │ ...    │                         │  │  │
│  │  └────────┴─────────────────────────┘  │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

---

## レイアウト詳細仕様

### 1. 余白エリア

| 項目 | 値 |
|------|-----|
| **背景色** | `#f5f5f5` (薄いグレー) |
| **範囲** | 画面全体 |
| **目的** | メインコンテンツとの境界を明確化 |

**実装場所**: `frontend/src/app/globals.css`

```css
:root {
  --background: #f5f5f5;
}

body {
  background: var(--background);
}
```

---

### 2. メインコンテンツコンテナ

| 項目 | 値 |
|------|-----|
| **最大幅** | 1366px |
| **配置** | 中央揃え (`margin: 0 auto`) |
| **背景色** | `#ffffff` (白) |
| **シャドウ** | `shadow-sm` (軽い影) |

**実装場所**: `frontend/src/app/layout.tsx`

```tsx
<div className="mx-auto max-w-[1366px] bg-white shadow-sm">
  <Header />
  <Breadcrumb />
  {children}
</div>
```

---

### 3. Header（ヘッダー）

| 項目 | 値 |
|------|-----|
| **高さ** | 80px |
| **背景色** | `#ffffff` |
| **ボーダー** | 下部 1px `#e5e7eb` |
| **位置** | 固定（最上部） |

詳細は [components.md](./components.md#header) を参照

---

### 4. Breadcrumb（ブレッドクラム）

| 項目 | 値 |
|------|-----|
| **高さ** | 40px |
| **背景色** | `#f9fafb` (グレー50) |
| **ボーダー** | 下部 1px `#e5e7eb` |
| **位置** | Header 直下 |

詳細は [components.md](./components.md#breadcrumb) を参照

---

### 5. Sidebar（サイドメニュー）

| 項目 | 値 |
|------|-----|
| **幅** | 256px (`w-64`) |
| **最小高さ** | `calc(100vh - 120px)` |
| **背景色** | `#f3f4f6` (gray-100) |
| **ボーダー** | 右側 1px `#e5e7eb` |
| **表示条件** | 認証済みの場合のみ |

詳細は [components.md](./components.md#sidebar) を参照

---

### 6. Main Content（メインコンテンツ）

| 項目 | 値 |
|------|-----|
| **最小高さ** | `calc(100vh - 120px)` |
| **パディング** | ページごとに定義 |
| **背景色** | ページごとに定義 |

**高さ計算**:
```
100vh - (Header 80px + Breadcrumb 40px) = 100vh - 120px
```

---

## RootLayout実装

### ファイルパス

`frontend/src/app/layout.tsx`

### 実装コード

```tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "管理会計システム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="font-sans bg-gray-300">
        <div className="mx-auto max-w-[1366px] bg-white shadow-sm">
          <Header />
          <Breadcrumb />
          {children}
        </div>
      </body>
    </html>
  );
}
```

### 主要機能

1. **Meiryo UI フォント適用**
   - Tailwind CSSでfont-sansにMeiryo UIを設定
   - Windowsシステムフォントを使用

2. **固定幅レイアウト**
   - 1366px でコンテンツを固定
   - 中央配置で余白を均等に

3. **共通コンポーネント配置**
   - Header: すべてのページで表示
   - Breadcrumb: すべてのページで表示

---

## ページテンプレート

### 基本ページ構造

```tsx
export default function PageName() {
  return (
    <main className="min-h-[calc(100vh-120px)] bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* ページコンテンツ */}
      </div>
    </main>
  );
}
```

### クラス説明

- `min-h-[calc(100vh-120px)]`: Header + Breadcrumb を除いた高さ
- `bg-gray-50`: ページ背景色（白との差別化）
- `p-6`: ページ全体のパディング (24px)

---

## レスポンシブ対応（将来予定）

現在は1366px固定ですが、将来的にレスポンシブ対応する場合の方針:

### ブレークポイント戦略

| 画面サイズ | 最大幅 | 対応 |
|-----------|--------|------|
| モバイル (< 640px) | 100% | 今後対応 |
| タブレット (640-1024px) | 100% | 今後対応 |
| デスクトップ (1024-1366px) | 1366px | 現在対応 |
| 大画面 (> 1366px) | 1366px | 現在対応 |

### 実装イメージ（将来）

```tsx
<div className="mx-auto w-full md:max-w-[1366px] bg-white shadow-sm">
  {/* コンテンツ */}
</div>
```

---

## パフォーマンス最適化

### フォント設定

- Tailwind CSSでMeiryo UIをデフォルトフォントに設定
- システムフォントを使用するため、外部リソースの読み込みが不要

### レイアウトシフト防止

- Header、Breadcrumb の高さを固定
- メインコンテンツの最小高さを設定
- システムフォント使用によりレイアウトシフトが発生しない

---

## アクセシビリティ

### セマンティックHTML

```tsx
<html lang="ja">           {/* 日本語指定 */}
  <body>
    <header>...</header>   {/* ヘッダー */}
    <nav>...</nav>         {/* ブレッドクラム */}
    <main>...</main>       {/* メインコンテンツ */}
  </body>
</html>
```

### ランドマークロール

- `<header>`: ページヘッダーとして認識
- `<nav>`: ナビゲーションとして認識
- `<main>`: メインコンテンツとして認識

---

## トラブルシューティング

### ホットリロードが効かない場合

Docker 環境でファイル監視が効かない場合、コンテナを再起動:

```bash
docker compose restart frontend
```

### フォントが適用されない場合

Meiryo UIはWindowsシステムフォントのため、Windows環境では自動的に適用されます。
他の環境ではMeiryo → sans-serifにフォールバックします。

1. `.next` ディレクトリを削除
2. コンテナを再ビルド

```bash
docker compose down
docker compose build frontend
docker compose up -d
```

---

## ページ別レイアウト仕様

### ログインページ (`/`)

**未認証時のレイアウト**:

ログインページも標準レイアウト（Header + Breadcrumb + Main Content）を使用しますが、メインコンテンツ部分が画面中央配置のログインフォームとなります。

**構成**:
```
┌────────────────────────────────────┐
│ Header (80px)                      │
│  管理会計システム                   │
├────────────────────────────────────┤
│ Breadcrumb (40px)                  │
├────────────────────────────────────┤
│                                    │
│      ┌──────────────────┐          │
│      │  ログインフォーム  │          │
│      │  (中央配置)       │          │
│      └──────────────────┘          │
│                                    │
└────────────────────────────────────┘
```

**特徴**:
- Header と Breadcrumb は表示される
- メインコンテンツは全画面を使用し、フォームを中央配置
- 背景色: グレー (`bg-gray-50`)

**実装**:
```tsx
// frontend/src/app/page.tsx (未認証時)
// layout.tsx により Header + Breadcrumb が自動表示される
<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
  <div className="w-full max-w-md space-y-8">
    {/* ログインフォーム */}
  </div>
</div>
```

**認証後のレイアウト**:

認証済みの場合、標準レイアウトのままダッシュボードを表示します。

---

## 更新履歴

- 2025-12-08: 初版作成（1366px固定幅レイアウト、Noto Sans JP、Header、Breadcrumb）
- 2025-12-08: ログインページのレイアウト仕様を追加
- 2025-12-09: 認証後のサイドメニュー表示を追加
- 2025-12-10: 背景色を実装に合わせて更新（#f5f5f5 → #d1d5db）
- 2025-12-22: フォントをMeiryo UIに変更、ToastContainer追加
- 2026-01-28: ToastContainerを削除（トースト機能削除に伴う修正）
