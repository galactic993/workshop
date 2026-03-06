# レイアウトコンポーネント

## 概要

レイアウトに関連するコンポーネントの仕様を定義します。

---

## Header（ヘッダー）

**ファイルパス**: `frontend/src/components/layout/Header.tsx`

### 仕様

| 項目 | 値 |
|------|-----|
| **高さ** | 80px (`h-20`) |
| **背景色** | 白 (`bg-white`) |
| **ボーダー** | 下部に1px、グレー (`border-b border-gray-200`) |
| **パディング** | 左右 24px (`px-6`) |
| **レイアウト** | Flexbox、左右に配置 (`justify-between`) |

### タイトル（左側）

| 項目 | 値 |
|------|-----|
| **テキスト** | 「管理会計システム」 |
| **リンク先** | `/`（ポータル） |
| **フォントサイズ** | 24px (`text-2xl`) |
| **フォントウェイト** | Bold (`font-bold`) |
| **テキスト色** | グレー900 (`text-gray-900`) |
| **ホバー時** | グレー700 (`text-gray-700`) |

### ユーザーメニュー（右側・認証時のみ表示）

| 項目 | 値 |
|------|-----|
| **トリガー** | 社員名 + 下矢印アイコンをクリック |
| **ドロップダウン幅** | 192px (`w-48`) |
| **表示内容** | センター名、チーム名、ログアウトボタン |

**メニュー動作**:
- クリックでドロップダウン開閉
- 外部クリックで自動的に閉じる（`useRef` + `useEffect` で実装）
- ログアウト時はメニューを閉じてから`logout()`を実行

### コード概要

```tsx
'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useState, useRef, useEffect } from 'react';

export default function Header() {
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // メニュー外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="h-20 flex items-center justify-between px-6">
        <h1 className="text-2xl font-bold text-gray-900">
          <Link href="/" className="hover:text-gray-700 transition-colors">
            管理会計システム
          </Link>
        </h1>
        {user && (
          <div className="relative" ref={menuRef}>
            {/* ユーザーメニューボタン・ドロップダウン */}
          </div>
        )}
      </div>
    </header>
  );
}
```

### 表示例

```
┌──────────────────────────────────────────────────────┐
│  管理会計システム                        山田太郎 ▼  │  80px
└──────────────────────────────────────────────────────┘
                                          ┌──────────┐
                                          │センター   │
                                          │第1営業... │
                                          ├──────────┤
                                          │チーム     │
                                          │営業1課   │
                                          ├──────────┤
                                          │ログアウト │
                                          └──────────┘
```

---

## Breadcrumb（ブレッドクラム）

**ファイルパス**: `frontend/src/components/layout/Breadcrumb.tsx`

### 仕様

| 項目 | 値 |
|------|-----|
| **高さ** | 40px (`h-10`) |
| **背景色** | グレー50 (`bg-gray-50`) |
| **ボーダー** | 下部に1px、グレー (`border-b border-gray-200`) |
| **パディング** | 左右 24px (`px-6`) |
| **フォントサイズ** | 14px (`text-sm`) |

### 機能

**動的な階層表示**:
- URLパスに応じて自動的にブレッドクラムを生成
- `usePathname()` フックを使用してパスを取得
- メニュー構造定義（`menuItems.ts`）からパスラベルを自動生成
- すべてのページでポータルを先頭に表示

**動的ルート対応**:
- `/sales/quotes/[id]` のような動的ルートのパラメータ部分を適切なラベルで置き換え
- `dynamicPathLabels` マッピングで動的セグメント（`new`, 数字ID）を処理

### パスラベルマッピング

パスラベルはサイドメニューの構造定義（`frontend/src/config/menuItems.ts`）から自動生成されます。
これにより、メニュー項目を追加すれば自動的にブレッドクラムにも反映されます。

```typescript
// frontend/src/config/menuItems.ts からインポート
import { pathLabels } from '@/config/menuItems';

// pathLabels は以下のような形式で自動生成される
// {
//   '/': 'ポータル',
//   '/sales': '売上管理',
//   '/sales/orders': '受注',
//   '/sales/orders/create': '受注情報登録',
//   ...
// }
```

### 表示ルール

1. **ルートページ**: 「ポータル」のみ表示（リンクなし）
2. **その他のページ**: 「ポータル」を先頭に表示し、現在のパス階層を続けて表示
3. **セパレーター**: `/` (薄いグレー `text-gray-400`)
4. **リンク**: グレー600、ホバーでグレー900（現在ページ以外はリンク）
5. **現在ページ**: グレー700、リンクなし

### 表示例

| URL | 表示 |
|-----|------|
| `/` | **ポータル** |
| `/sales` | [ポータル](#) / **売上管理** |
| `/sales/orders` | [ポータル](#) / [売上管理](#) / **受注** |
| `/sales/quotes/123` | [ポータル](#) / [売上管理](#) / [見積](#) / **見積詳細** |

### 新規ページの追加方法

新しいページを追加する場合、`frontend/src/config/menuItems.ts` のメニュー構造に項目を追加します。
追加されたメニュー項目は自動的にブレッドクラムにも反映されます。

---

## PageFooter（ページフッター）

**ファイルパス**: `frontend/src/components/layout/PageFooter.tsx`

### 概要

ページ下部に最終更新日とバージョン情報を表示するフッターコンポーネント。

### インターフェース

```typescript
interface PageFooterProps {
  lastUpdated?: string;  // 最終更新日（任意）
  version?: string;      // バージョン情報（任意）
}
```

### 使用例

```tsx
import PageFooter from '@/components/layout/PageFooter';

<PageFooter
  lastUpdated="2025-12-24"
  version="1.0.0"
/>
```

---

## 更新履歴

- 2025-12-08: 初版作成（Header、Breadcrumb仕様定義）
- 2025-12-10: Header実装詳細を追加（ユーザーメニュー、ログアウト機能）
- 2025-12-25: components.mdから分離、PageFooterを追加、Breadcrumbの動的ルート対応を追記
