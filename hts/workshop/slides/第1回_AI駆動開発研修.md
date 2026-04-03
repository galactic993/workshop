---
marp: true
theme: default
paginate: true
header: 'AI駆動開発研修 第1回'
footer: '© 2026 KZP'
style: |
  section {
    font-family: 'Hiragino Sans', 'Noto Sans JP', sans-serif;
    font-size: 24px;
  }
  section.small {
    font-size: 20px;
  }
  section.small table {
    font-size: 16px;
  }
  section.small pre {
    font-size: 15px;
  }
  section.xsmall {
    font-size: 18px;
  }
  section.xsmall pre {
    font-size: 14px;
  }
  h1 { color: #1a365d; font-size: 40px; }
  h2 { color: #2c5282; font-size: 30px; }
  h3 { color: #2b6cb0; font-size: 24px; }
  table { font-size: 20px; }
  pre { font-size: 18px; }
  blockquote {
    border-left: 4px solid #4299e1;
    padding-left: 16px;
    color: #4a5568;
    font-style: italic;
  }
  .warning {
    background: #fffbeb;
    border-left: 4px solid #f6ad55;
    padding: 8px 12px;
    font-size: 20px;
  }
  .accent {
    background: #ebf8ff;
    border-left: 4px solid #4299e1;
    padding: 8px 12px;
    font-size: 20px;
  }
  section.title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
  section.section-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    background: #1a365d;
    color: white;
  }
  section.section-title h1 { color: white; font-size: 44px; }
  section.section-title h2 { color: #bee3f8; font-size: 28px; }
---

<!-- _class: title -->
<!-- _paginate: false -->

# AI駆動開発研修 第1回
## Claude Codeで始めるAI開発

2026年3月3日（火）13:30〜15:30

---

<!-- _class: small -->

## タイムスケジュール

| 時間 | 内容 | 形式 |
|------|------|------|
| 13:30 - 13:35 | セットアップ確認 | 確認 |
| 13:35 - 13:45 | AI駆動開発の全体像 | 講義 |
| 13:45 - 14:15 | Claude Code DeepDive | 講義 |
| 14:15 - 14:30 | 演習①: xlsxスキル導入 + スキル作成 | ハンズオン |
| 14:30 - 14:40 | 休憩 | - |
| 14:40 - 14:55 | 設計書チェックプロンプト解説 | 講義 |
| 14:55 - 15:10 | 演習②: 設計書レビュー実践 | ハンズオン |
| 15:10 - 15:20 | セルフフィードバックループ | 講義+実践 |
| 15:20 - 15:30 | まとめ・質疑応答 | - |

---

<!-- _class: section-title -->

# セクション1
## セットアップ確認（5分）

---

## セットアップ確認 ① Claude Code

ターミナルで以下を実行：

```bash
claude
```

→ Claudeからの応答があれば **OK**

⚠️ 問題がある方は挙手してください

---

## セットアップ確認 ② Claude in Excel

1. Excelでサンプルファイルを開く
2. サイドバー起動: `Ctrl+Option+C`（Mac）/ `Ctrl+Alt+C`（Win）
3. 右側にClaudeのチャットパネルが表示されれば **OK**

→ Claudeに「このシートの内容を要約して」と話しかけてみよう

⚠️ サイドバーが表示されない方は挙手してください

---

<!-- _class: section-title -->

# セクション2
## AI駆動開発の全体像（10分）

---

## AI駆動開発の全体フロー

```
Excel設計書 → Claudeでレビュー → Markdown化
                                    ↓
Claude Codeで開発 ← Agent Team ← CI/CD
```

**本日のスコープ**: レビュー → Markdown化 を実践

---

<!-- _class: small -->

## 従来開発 vs AI駆動開発

| 項目 | 従来開発 | AI駆動開発 |
|------|---------|-----------|
| 設計書レビュー | 人力で目視確認 | AIが自動チェック |
| コーディング | 人が書く | AIが書く、人がレビュー |
| テスト | 人がテスト作成 | AIがテスト生成・実行 |
| ドキュメント | 人が書く | AIが自動生成 |

→ 人間は「書く人」から **「指揮する人」** に変わる

---

## 人間の役割の変化

| 従来 | AI駆動開発 |
|------|-----------|
| コードを書く | 何を作るか指示する |
| デバッグする | AIの出力をレビューする |
| テストを書く | 品質を判断する |

> **AIが書いたコードの責任は人間にある**

---

<!-- _class: section-title -->

# セクション3
## Claude Code DeepDive（30分）

---

## Claude Codeとは

- **Anthropic社**のCLIベースのコーディングエージェント
- ターミナルから直接使う
- ファイル読み書き、コマンド実行が可能

<div class="warning">

「チャットで相談する」ツールではなく **「作業を任せる」** ツール

</div>

---

## Claude Codeの基本操作

```bash
# プロジェクトフォルダで起動（推奨）
cd /path/to/project && claude        # Mac
cd C:\path\to\project && claude      # Windows
```

- **終了**: `/exit`
- **プロジェクトフォルダで起動**するとコードや設定を自動で理解
- CLAUDE.md を読んでプロジェクトのルールを把握

---

## CLAUDE.md — プロジェクトの指示書

プロジェクトルートに `CLAUDE.md` を置くと自動で読み込まれる

```markdown
# プロジェクト概要
本プロジェクトはFileMaker管理システムです

# 開発ルール
- 日本語で回答すること
- テストは必ず書くこと
```

→ **毎回同じ説明をする手間が不要に**

---

## 良い指示の出し方

❌ **悪い例**:「コードを書いて」

✅ **良い例**:

```
顧客管理DBを作成してください。要件：
- 顧客名、電話番号、メールを登録
- 重複チェック機能付き
```

**コツ**: 何を作るか + 要件リスト + 制約条件

---

<!-- _class: small -->

## Permissions（権限設定）

Claude Codeは危険な操作前に確認を求めます

| 操作 | 例 |
|------|-----|
| ファイル書き込み | 新規作成、編集、削除 |
| コマンド実行 | `rm`, `git push` |
| 外部通信 | API呼び出し |

| モード | 説明 |
|--------|------|
| 🔒 確認モード | デフォルト。毎回確認 |
| ⚡ 自動承認 | 指定した操作を自動承認 |
| 🛡️ 読み取り専用 | 読み取りのみ |

---

<!-- _class: small -->

## 設定の全体像

Claude Codeは **4つのスコープ** で設定を管理する

| スコープ | 場所 | 影響範囲 | チーム共有 |
|---------|------|---------|-----------|
| **Managed** | サーバー管理設定 / MDM | マシン上の全ユーザー | はい（IT管理） |
| **User** | `~/.claude/settings.json` | 全プロジェクトの自分 | いいえ |
| **Project** | `.claude/settings.json` | リポジトリの全メンバー | はい（git管理） |
| **Local** | `.claude/settings.local.json` | このリポジトリの自分のみ | いいえ |

> `/config` コマンドで設定UIを開ける

---

<!-- _class: small -->

## 設定の優先順位

上位の設定が下位を **オーバーライド** する

```
1. Managed（最高）  — IT管理。何もオーバーライドできない
2. コマンドライン引数    — セッション限定の一時オーバーライド
3. Local              — 個人的なプロジェクト固有設定
4. Project            — チーム共有のプロジェクト設定
5. User（最低）       — 個人グローバル設定
```

**例**: User設定で `Bash(npm run *)` を許可 → Project設定で拒否 → **拒否が優先**

> `/status` コマンドで現在有効な設定とその出所を確認可能

---

<!-- _class: small -->

## 権限設定の詳細

```json
{
  "permissions": {
    "allow": ["Bash(npm run *)", "Read(~/.zshrc)"],
    "ask": ["Bash(git push *)"],
    "deny": ["Bash(curl *)", "Read(./.env)", "WebFetch"]
  }
}
```

| キー | 説明 |
|------|------|
| `allow` | 自動許可するツールのルール配列 |
| `ask` | 毎回確認を求めるツールのルール配列 |
| `deny` | 拒否するツールのルール配列 |
| `additionalDirectories` | 追加の作業ディレクトリ |
| `defaultMode` | デフォルト権限モード |
| `disableBypassPermissionsMode` | `--dangerously-skip-permissions` を無効化 |

**評価順序**: deny → ask → allow（最初に一致したルールが優先）

---

<!-- _class: small -->

## 権限ルールの書き方

`Tool` または `Tool(specifier)` の形式で記述

| ルール | 効果 |
|--------|------|
| `Bash` | すべてのBashコマンドに一致 |
| `Bash(npm run *)` | `npm run` で始まるコマンドに一致 |
| `Read(./.env)` | `.env` ファイルの読み取りに一致 |
| `Read(./secrets/**)` | secrets配下の全ファイルに一致 |
| `WebFetch` | すべてのWebアクセスに一致 |
| `WebFetch(domain:example.com)` | 特定ドメインへのアクセスに一致 |

**機密ファイルの除外例:**
```json
{ "deny": ["Read(./.env)", "Read(./.env.*)", "Read(./secrets/**)"]}
```

---

<!-- _class: xsmall -->

## サンドボックス設定

Bashコマンドをファイルシステム・ネットワークから分離する

```json
{
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": true,
    "excludedCommands": ["git", "docker"],
    "network": {
      "allowedDomains": ["github.com", "*.npmjs.org"],
      "allowLocalBinding": true
    }
  }
}
```

| キー | 説明 |
|------|------|
| `enabled` | サンドボックス有効化（デフォルト: false） |
| `autoAllowBashIfSandboxed` | サンドボックス内Bash自動承認（デフォルト: true） |
| `excludedCommands` | サンドボックス外で実行するコマンド |
| `network.allowedDomains` | 許可ドメイン（ワイルドカード対応） |
| `network.allowLocalBinding` | localhost バインド許可（macOSのみ） |

---

<!-- _class: small -->

## スコープ別の設定ファイル一覧

| 機能 | User | Project | Local |
|------|------|---------|-------|
| **Settings** | `~/.claude/settings.json` | `.claude/settings.json` | `.claude/settings.local.json` |
| **CLAUDE.md** | `~/.claude/CLAUDE.md` | `CLAUDE.md` / `.claude/CLAUDE.md` | `CLAUDE.local.md` |
| **SubAgents** | `~/.claude/agents/` | `.claude/agents/` | — |
| **MCP** | `~/.claude.json` | `.mcp.json` | `~/.claude.json`（PJ毎） |
| **Plugins** | `~/.claude/settings.json` | `.claude/settings.json` | `.claude/settings.local.json` |

> 設定ファイルは自動的にバックアップされ、最新5件が保持される

---

## セキュリティとコスト

<div class="warning">

**APIキーは他人に教えない**（クレジットカードと同等）
漏洩した場合 → **キーを再生成**すればOK

</div>

**コスト目安:**
- Claude Code: 1会話あたり数円〜数十円
- Claude in Excel: 1会話あたり〜1円程度
- API経由のデータは**モデル学習に使用されない**

---

## Skills（スキル）

よく使うプロンプトを **コマンド化** したもの

```
/review    → コードレビューを実行
/markdown  → 設計書をMarkdown化
/xlsx      → Excelファイルを操作
```

**メリット**: チーム全員が同じ品質の指示を出せる

<div class="accent">

**Pythonコードも使える**: Skillsは `scripts/` にPython等のスクリプトを同梱し、Claudeが実行できる。プロンプトだけでは難しい処理を自動化可能。

</div>

> 詳細: https://code.claude.com/docs/en/skills

---

## Skillsの作り方

`.claude/skills/` にMarkdownファイル（または `SKILL.md`）を作成するだけ

**例**: `.claude/skills/review.md`

```markdown
# 設計書レビュー
以下の観点でレビューしてください：
1. 項目番号の連番性
2. EVENT番号の整合性
```

→ `/review` で呼び出せる

**Pythonスクリプトを同梱する例**: `scripts/helper.py` を置くと、Claudeが実行可能

---

## xlsxスキル — Excel操作の自動化

公式スキルをインストール：

```bash
npx skills add https://github.com/anthropics/skills --skill xlsx
```

**できること:**
- Excelファイルの読み書き（openpyxl/pandas）
- 数式の再計算（LibreOffice連携）
- `/xlsx` コマンドでExcel操作を指示

→ Claude CodeがExcelを直接操作できるようになる

---

<!-- _class: small -->

## ⚠️ Skillsのセキュリティ注意

<div class="warning">

環境変数やAPIキーを抜き取ろうとする**悪質なSkills**が蔓延しています

</div>

**必ず守ること:**
- **信頼できる発行元**のSkillsのみ使用（公式: `anthropics/skills`）
- インストール前にSkillsの中身（.mdファイル）を確認
- 不審な `env` / `process.env` / `export` の記述がないかチェック

**自作も推奨:**
- Context7で最新ドキュメントを参照し、自分でSkillを作れる
- `.claude/skills/` にMarkdownファイルを置くだけ
- チーム専用Skillsなら安全性も確保できる
---

## MCP（Model Context Protocol）

Claude Codeの能力を**拡張するプラグイン**

```
Claude Code ←→ MCP Server ←→ 外部ツール
```

**活用例:**
- ブラウザ操作（テスト自動化）
- データベース接続
- API連携（GitHub, Slack等）

---

## SubAgent（サブエージェント）

メインAgentが **別のAIに作業を委任** する仕組み

```
👤 あなた → 🤖 メインAgent(Opus)
               ├→ 🤖 Agent1(Haiku): 調査
               ├→ 🤖 Agent2(Haiku): 実装
               └→ 🤖 Agent3(Haiku): テスト
             ↓ 結果統合 → レポート
```

→ **並列実行で高速化**

---

## モデルの使い分け

| モデル | 特徴 | 用途 |
|--------|------|------|
| **Opus** | 最高の判断力 | 設計・レビュー |
| **Sonnet** | バランス型 | 標準的な開発 |
| **Haiku** | 高速・低コスト | 定型作業・調査 |

<div class="accent">

メインAgent(Opus)が計画 → サブAgent(Haiku)が実行

</div>

---

## Hooks（フック）

特定イベントに連動して**自動実行**される処理

| トリガー | アクション例 |
|---------|-------------|
| ファイル保存時 | 自動フォーマット |
| コミット前 | テスト実行 |
| ツール実行前 | カスタム検証 |

→ 品質チェックを自動化できる

---

## Agent Team（エージェントチーム）

複数Agentが**チームとして協働**する開発手法

```
🤖 メインAgent: 計画を立てる
  ├→ 🤖 FE Agent: フロントエンド
  ├→ 🤖 BE Agent: バックエンド
  └→ 🤖 Test Agent: テスト
  ↓ 統合 → レビュー → デプロイ
```

**ルール**: メインAgentは自分でコードを書かない

---

<!-- _class: small -->

## Claude Code DeepDive まとめ

| 機能 | 何ができるか |
|------|-------------|
| CLAUDE.md | プロジェクトの指示書 |
| Permissions | 操作の安全管理 |
| Skills | プロンプトのコマンド化 |
| xlsxスキル | Excelファイルの読み書き |
| MCP | 外部ツール連携 |
| SubAgent | 作業の並列委任 |
| Hooks | イベント駆動の自動処理 |
| Agent Team | チーム開発 |

---

<!-- _class: section-title -->

# セクション3.5
## Claude in Excel vs Claude Code

---

## Claude in Excel — サイドバー型

**特徴:**
- Mac `Ctrl+Option+C` / Win `Ctrl+Alt+C` でサイドバー起動
- 右側にチャットパネルが表示される
- 現在開いているExcelファイルの内容を理解
- 対話的に質問・指示が可能

**向いている作業:**
- 1ファイルの内容確認・質問
- A系/C系チェック（単一ファイル内）
- 簡単なデータ分析

---

<!-- _class: small -->

## Claude in Excel vs Claude Code 比較

| 項目 | Claude in Excel | Claude Code |
|------|-----------------|-------------|
| 操作方法 | サイドバーでチャット | ターミナルで指示 |
| 対象 | 開いている1ファイル | 複数ファイル一括 |
| 向いている作業 | A系/C系（1ファイル） | B系（2ファイル横断） |
| バッチ処理 | ✕ | ◎ |
| スキル/自動化 | ✕ | ◎ |
| xlsxスキル | ✕ | ◎（インストール必要） |

---

<!-- _class: section-title -->

# 演習①
## xlsxスキル導入 + スキル作成（15分）

---

## 演習①-1: xlsxスキルをインストール

**手順:**

```bash
# Claude Codeを起動
claude

# xlsxスキルをインストール
npx skills add https://github.com/anthropics/skills --skill xlsx
```

インストール後、`/xlsx` と入力してコマンドが認識されれば **OK**

---

## 演習①-2: カスタムスキルを作成

以下のいずれかを作成してください：

**A. シンプル版:**
```
.claude/skills/hello.md を作成して。
「自己紹介してください」というスキルにして。
```

**B. 実践版:**
```
.claude/skills/check.md を作成して。
「指定Excelファイルのシート一覧と行数を報告」するスキルに。
```

完了したら `/hello` または `/check` で動作確認

---

<!-- _class: section-title -->

# 休憩
## 10分（14:30 - 14:40）

---

<!-- _class: section-title -->

# セクション4
## 設計書チェックプロンプト解説（15分）

---

## プロンプト集の全体構成

チェックプロンプトは**4カテゴリ**に分類：

| カテゴリ | 内容 | 推奨ツール |
|---------|------|----------|
| **A系** | 画面設計書の内部整合性 | Claude in Excel / Code |
| **B系** | 画面×テーブル クロスチェック | Claude Code |
| **C系** | テーブル定義書チェック | Claude in Excel / Code |
| **D系** | 設計書のMarkdown変換 | Claude Code |

---

<!-- _class: small -->

## A系: 画面設計書の内部整合性チェック（7項目）

| ID | チェック内容 | 重要度 |
|----|-------------|--------|
| A1 | イベント番号の連番性 | ⚠ warning |
| A2 | イベント番号のクロスシート対応 | 🔴 error |
| A3 | 種別とイベントの矛盾 | 🔴 error |
| A4 | 種別とバリデーションの矛盾 | 🔴 error |
| A6 | 項目番号の連番性 | ⚠ warning |
| A7 | メッセージ番号の連番性 | ⚠ warning |

→ 画面設計書の**単一ファイル内**で完結するチェック

---

<!-- _class: xsmall -->

## A1: イベント番号の連番性チェック

```
イベント記述書シートを確認してください。
- ヘッダーは5行目（B列=EVENT No.）
- EVENT No.は「EVENT0001」形式

チェック内容：
1. すべてのEVENT番号を抽出し、連番を確認
2. 抜け番・重複を検出

結果形式：
| 行番号 | EVENT番号 | チェック結果 | 詳細 |
```

→ Claude in Excelのサイドバーにコピペして実行

---

## A2: イベント番号のクロスシート対応チェック

```
項目記述書とイベント記述書のクロスチェックを実行。

【項目記述書】Y列=EVENT No.
【イベント記述書】B列=EVENT No.（マスタ）

チェック：項目記述書のEVENT No.が
イベント記述書に存在するか確認

結果形式：
| シート | 行番号 | 項目名 | EVENT番号 | 結果 |
```

→ **2シート横断チェック**（単一ファイル内）

---

## A3: 種別とイベントの矛盾チェック

```
項目記述書で種別とイベント番号の整合性をチェック。

以下の種別はイベント番号が必須：
- ボタン / リンク / プルダウン / ラジオボタン

チェック：R列(種別)が上記で、
Y列(EVENT No.)が空欄の行を検出

結果形式：
| 行番号 | 項目名 | 種別 | EVENT No. | 結果 |
```

→ ボタンなのにイベント未定義 = **設計漏れ**

---

## B系: 画面×テーブル クロスチェック

**2つのファイルを横断するチェック** → Claude Codeで実行

| ID | チェック内容 | 重要度 |
|----|-------------|--------|
| B1 | DB登録値のフィールド名がテーブル定義に存在するか | 🔴 error |
| B2 | 参照仕様のテーブル.カラムが存在するか | ⚠ warning |

→ 画面設計書 + テーブル定義書の**両方が必要**

---

## C系: テーブル定義書チェック

テーブル定義書の**単一ファイル内**で完結

| ID | チェック内容 | 重要度 |
|----|-------------|--------|
| C1 | FK参照先テーブル/カラム存在 | 🔴 error |
| C2 | PK定義チェック | ⚠ warning |
| C3 | NOT NULLかつデフォルト値未設定 | ℹ info |

→ DB設計の整合性を自動検証

---

## D系: 設計書のMarkdown変換

| ID | 用途 | 前提 |
|----|------|------|
| D1 | 画面設計書 → Markdown | 画面設計書のみ |
| D2 | テーブル定義書 → Markdown | テーブル定義書のみ |
| D3 | 統合設計書Markdown | 両方を開く |

**目的**: AIが設計書を正確に読めるようにする

→ Markdown化した設計書をClaude Codeに読ませて開発

---

<!-- _class: small -->

## D1: 画面設計書 → Markdown変換（構造）

D1プロンプトは全シートを以下の順序で統合：

1. **画面概要** → 説明文、利用権限一覧
2. **イベント記述書** → 各EVENTをh3見出しで出力
3. **項目記述書** → Markdownテーブルで出力
4. **参照仕様** → 見出し+番号リストで構造化
5. **DB登録値** → テーブルごとにセクション分け
6. **表示切替項目** → 条件ごとにセクション分け
7. **メッセージ一覧** → Markdownテーブルで出力

---

<!-- _class: section-title -->

# 演習②
## 設計書レビュー実践（15分）

---

## 演習②-1: Claude in Excelサイドバーでチェック

**手順:**
1. サンプルExcelファイルを開く
2. サイドバー起動: `Ctrl+Option+C`（Mac）/ `Ctrl+Alt+C`（Win）
3. A1プロンプトをサイドバーにコピペ
4. 実行して結果を確認

**確認ポイント:**
- イベント番号に抜けや重複はあったか？
- 結果は表形式で出力されたか？

---

## 演習②-2: Claude Codeで一括チェック

Claude Codeで以下を実行：

```
training/sample/ の全Excelファイルで
A1〜A3のチェックを一括実行し、
結果をMarkdownテーブルで出力して
```

→ **1コマンドで複数ファイル×複数チェック**
→ これがClaude Codeの真価！

---

## 演習②-3: Markdown変換を実行

Claude Codeで以下を実行：

```
training/sample/の画面設計書を
Markdownに変換してください。
```

**確認ポイント:**
- 全シートが含まれているか？
- テーブル形式は正しいか？
- `.md` ファイルとして保存できるか？

---

<!-- _class: section-title -->

# セクション5
## セルフフィードバックループ（10分）

---

## セルフフィードバックループとは

AIの出力を **「AIに検証させる」** 仕組み

```
指示 → AI出力 → 検証AI → 修正 → 完了
         ↑                  |
         └──────────────────┘
```

- 人間のダブルチェックに相当
- 1回目:85% → 2回目:95% → 3回目:99%

---

## なぜ必要か

<div class="warning">

AIは「もっともらしい嘘」をつくことがある（**ハルシネーション**）

</div>

**対策**: 検証→修正のサイクルを回す

```
先ほどの結果を元データと照合し、
見落としや誤りがないか検証してください
```

---

## 実践: セルフフィードバック

演習②の結果に対して以下を実行：

```
先ほどのチェック結果を再度検証して。
元のExcelファイルと照合し、
見落としや誤った指摘がないか確認して。
```

**ルール:**
- ループは **2〜3回** で十分
- **最後の判断は必ず人間が行う**

---

<!-- _class: section-title -->

# まとめ

---

<!-- _class: small -->

## 本日のまとめ

| 学んだこと | 内容 |
|-----------|------|
| Claude Code | 作業を任せるAIエージェント |
| Claude in Excel | サイドバーで対話的にExcel操作 |
| xlsxスキル | Excel読み書きを自動化 |
| CLAUDE.md | プロジェクトの指示書 |
| Skills | プロンプトのコマンド化 |
| A系プロンプト | 画面設計書の内部整合性チェック |
| B系プロンプト | 画面×テーブル クロスチェック |
| セルフフィードバック | AI出力をAIで検証 |

---

## 次回予告 & サポート体制

**第2回:** テスト仕様書の作成・AIテスト実践

**サポート:**
- Slackチャンネルで質問・相談OK
- エラー報告はスクリーンショット付きで

**質問のコツ:** 何をしようとしたか + エラー内容

---

## ご参加ありがとうございました！

**本日のゴール確認:**
- [ ] Claude Codeの基本操作を理解した
- [ ] Claude in Excelをサイドバーで使えるようになった
- [ ] xlsxスキルをインストールできた
- [ ] スキルを1つ作成できた
- [ ] 設計書チェックプロンプトを実行できた
- [ ] セルフフィードバックを理解した

---

<!-- _class: section-title -->

# 付録
## プロンプト リファレンス

---

<!-- _class: xsmall -->

## A4: 種別とバリデーションの矛盾チェック

```
項目記述書で種別とバリデーション(制御内容)の
整合性をチェック。

【エラー】種別が「テキスト」(表示専用)なのに
  AI列(制御内容)に入力がある場合
【警告】種別が「テキストインプット」なのに
  AI列(制御内容)が空欄の場合

結果形式：
| 行番号 | 項目名 | 種別 | 制御内容 | 結果 | 重要度 |
```

---

<!-- _class: xsmall -->

## A6/A7: 連番性チェック

### A6: 項目番号の連番性チェック
```
項目記述書のB列(No.)の連番性をチェック。
抜け番・重複を検出。
結果: | 行番号 | 項目番号 | 項目名 | 結果 | 詳細 |
```

### A7: メッセージ番号の連番性チェック
```
メッセージ一覧のB列(No.)の連番性をチェック。
抜け番・重複を検出。
結果: | 行番号 | メッセージ番号 | 条件 | 結果 | 詳細 |
```

---

<!-- _class: xsmall -->

## B1: DB登録値のフィールド名存在チェック

```
画面設計書「DB登録値」シートとテーブル定義書を
クロスチェック。

【DB登録値】テーブルごとにセクション分け
  O列=フィールド名
【テーブル定義書】各シートのN列=物理名

チェック：DB登録値のフィールド名が
テーブル定義書に存在するか確認

結果: | セクション | 行 | 項目名 | フィールド名 | 結果 |
```

⚠️ Claude Codeで実行（2ファイル横断）

---

<!-- _class: xsmall -->

## B2: 参照仕様のテーブル.カラム存在チェック

```
画面設計書「参照仕様」シートとテーブル定義書を
クロスチェック。

参照仕様シートから「テーブル名.カラム名」パターンを
抽出し、テーブル定義書と照合。

結果: | パターン | テーブル存在 | カラム存在 | 結果 |
例：customer.customer_id → OK
    order.item_code → 警告: カラムなし
```

⚠️ Claude Codeで実行（2ファイル横断）

---

<!-- _class: xsmall -->

## C1: FK参照先テーブル/カラム存在チェック

```
テーブル定義書の全シートでFK参照の整合性をチェック。

AT列(備考)に「FK」を含む行を抽出し、
参照先テーブル・カラムの存在を確認。

結果:
| シート | 行 | カラム | FK参照先 | テーブル | カラム | 結果 |
例：注文明細 | 8 | quot_id | 見積.quot_id | あり | あり | OK
```

---

<!-- _class: xsmall -->

## C2/C3: テーブル定義書チェック

### C2: PK定義チェック
```
全テーブルでPK(主キー)が定義されているかチェック。
AI列(PK)に値がある行が存在するか確認。
結果: | テーブル名 | PK定義 | 結果 |
```

### C3: NOT NULLかつデフォルト値未設定チェック
```
NOT NULL制約があるのにデフォルト値未設定の
カラムを検出。PK/FKは除外。
結果: | シート | 行 | カラム(論理) | カラム(物理) | 結果 |
```

---

<!-- _class: small -->

## 研修用スキル一覧

| スキル | コマンド | 内容 |
|--------|---------|------|
| 一括レビュー | `run-session1-claude-p.sh` | 画面＋テーブル指定で a1〜・s1.5 を並列実行 |
| D1（任意） | `WITH_MARKDOWN=1` + 同スクリプト | 統合 Markdown 変換スキル |
| cross-review | `/cross-review` | B系クロスチェック |
| batch-review | `/batch-review` | フォルダ内一括レビュー |

→ `training/skills/` に配置済み

---

<!-- _class: small -->

## プロンプト使用上の注意点

**Claude in Excel起動:**
- Mac: `Ctrl + Option + C` / Win: `Ctrl + Alt + C`

**効果的な使い方:**
- 複数チェックを一度に行わず **1つずつ実行**
- ヘッダー行番号がファイルにより異なる場合は調整
- B系チェックは**Claude Codeで実行**（2ファイル必要）

**エラー対処:**
- 「シートが見つかない」→ シート名を確認
- 「データ抽出できない」→ ヘッダー行番号を確認

---

<!-- _class: small -->

## クイック参照表

| ID | チェック内容 | 重要度 | 対象 |
|----|-------------|--------|------|
| A1 | イベント番号の連番性 | warning | 画面設計書 |
| A2 | イベント番号クロスシート対応 | error | 画面設計書 |
| A3 | 種別とイベントの矛盾 | error | 画面設計書 |
| A4 | 種別とバリデーション矛盾 | error | 画面設計書 |
| A6 | 項目番号の連番性 | warning | 画面設計書 |
| A7 | メッセージ番号の連番性 | warning | 画面設計書 |
| B1 | DB登録値フィールド名存在 | error | 画面+テーブル |
| B2 | 参照仕様テーブル.カラム存在 | warning | 画面+テーブル |
| C1 | FK参照先存在 | error | テーブル定義書 |
| C2 | PK定義 | warning | テーブル定義書 |
| C3 | NOT NULL+デフォルト未設定 | info | テーブル定義書 |

---

<!-- _class: title -->

# 質疑応答

ご質問をお待ちしています
