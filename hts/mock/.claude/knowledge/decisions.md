# 技術的意思決定記録（ADR）

## ADR-001: テストフレームワーク選定

### ステータス
Accepted

### コンテキスト
プロジェクトのテストカバレッジを向上させるため、テストフレームワークを選定する必要があった。

### 決定
- フロントエンド: Vitest + React Testing Library
- バックエンド: PHPUnit（Laravel標準）
- E2E: Playwright

### 理由
- Vitest: Vite互換で高速、Jest互換APIで学習コスト低
- PHPUnit: Laravel標準、既存テストとの互換性
- Playwright: クロスブラウザ対応、安定性、TypeScript対応

### 結果
- テスト実行が高速
- 既存のテストパターンを踏襲可能
- E2Eで主要フローを自動検証可能

---

## ADR-002: lint-staged実行方式

### ステータス
Accepted

### コンテキスト
Windows環境でhusky + lint-stagedを導入する際、npx経由でのeslint/prettier実行が失敗した。

### 決定
npxを使わず、直接node_modulesのバイナリを呼び出す方式を採用。

```js
node "${frontendDir}/node_modules/eslint/bin/eslint.js" --fix ${files}
```

### 理由
- Windows環境でのnpxのパス解決問題を回避
- 明示的なパス指定で確実に動作
- ESLint v9のflat config問題も環境変数で解決

### 結果
- Windows/Mac/Linux全環境で動作
- pre-commitフックが正常に機能

---

## ADR-003: CI/CDパイプライン構成

### ステータス
Accepted

### コンテキスト
PRマージ前の品質チェックを自動化する必要があった。

### 決定
- PRワークフロー（pr-check.yml）を新設
- テスト、lint、セキュリティスキャンを実行
- セキュリティスキャンは警告レベル（CIを止めない）

### 理由
- developへのデプロイワークフローとは分離
- 早期にフィードバックを得る
- セキュリティは情報提供目的

### 結果
- PR時に自動で品質チェック
- 脆弱性情報を早期に把握可能

---

## ADR-004: E2Eテストフレームワーク選定

### ステータス
Accepted

### コンテキスト
ユーザーシナリオベースの機能テストを実装する必要があった。

### 決定
Playwright を採用する。

### 理由
- TypeScript対応で型安全なテスト記述可能
- クロスブラウザテスト対応（Chrome, Firefox, Safari）
- 強力なデバッグ機能（UI mode, trace）
- パフォーマンスが良い
- 公式ドキュメントが充実している

### 結果
- E2Eテスト基盤の構築完了
- 認証フロー、見積操作などの重要フローをテスト可能に
- 開発時のUI modeでの対話的デバッグが可能

---

## ADR-005: エージェント階層構造の採用

### ステータス
Accepted

### コンテキスト
複雑なプロジェクト改善を効率的に実施する必要があった。

### 決定
PM → PL → 専門エージェントの3層構造を採用する。

### 理由
- 責務が明確で扱いやすい
- スケーラビリティが高い（エージェント追加が容易）
- セッション間での引き継ぎが構造化される
- 各エージェントが専門分野に集中可能

### 結果
- テスト・CI/CD・E2E等の複数フェーズを並列実施
- CLAUDE.md を 81%削減してもドキュメント完成度が向上
- session-helper による自動化が可能

---

## ADR-006: セクションレポート機能の段階的実装（第3セッション）

### ステータス
Accepted

### コンテキスト
受注週報（部署別）機能の実装に際し、大規模な機能実装をどのように段階化するか検討が必要だった。

### 決定
大規模機能を「基盤実装」と「詳細実装」の2フェーズに分割する。

#### 第3セッション（基盤実装フェーズ）：
1. API仕様設計・ルーティング定義
2. 権限チェック・ミドルウェア実装
3. バリデーション全体実装（FormRequest + Trait パターン）
4. フロントエンド画面構造実装
5. 空の実装（スタブ）でコントローラーロジック実装

#### 第4セッション以降（詳細実装フェーズ）：
1. 集計処理の実装（コントローラーロジック）
2. PDF生成機能の実装（PdfGeneratorService）
3. テスト実装
4. E2Eテスト実装

### 理由
- コンテキスト制限を回避しつつ、API仕様・バリデーション・権限を完全に整備
- 詳細実装フェーズでは実装者がAPI構造・バリデーション仕様を参照可能で効率的
- 基盤整備により、複数の開発者による並列実装が可能に
- セッション間で自然なハンドオフポイントが発生

### 結果
- 第3セッション：8ファイル新規作成、フロント・バック共に基盤完成
- API仕様明確化により、フロントエンド実装が容易
- バリデーション・権限制御が一元化され、保守性向上
- 詳細実装フェーズのタスクが具体的かつ明確

---

## ADR-007: FormRequest + Trait パターンによるバリデーション一元化

### ステータス
Accepted

### コンテキスト
複数のAPIで共通のバリデーションルール（営業日数・稼働日数の検証など）を繰り返し記述する必要が出た。

### 決定
FormRequest内で Trait を使用し、共通バリデーションルールを一元管理するパターンを採用。

```php
// Trait で共通ルールを定義
trait SectionReportValidationRules {
    protected function sectionReportRules(): array {
        return [
            'salesDays' => 'required|integer|max:31',
            'workingDays' => 'required|integer|max:31',
        ];
    }
}

// FormRequest で使用
class SectionReportAggregateRequest extends FormRequest {
    use SectionReportValidationRules;

    public function rules(): array {
        return $this->sectionReportRules();
    }
}
```

### 理由
- 複数の FormRequest で同一ルール記述の重複を回避
- ルール変更時に1箇所を修正するだけで全部に反映
- FormRequest としての責務は明確（リクエスト単位の固有ルール）
- Trait で再利用可能な粒度で管理

### 結果
- SectionReportAggregateRequest と SectionReportExportRequest が共通ルールを共有
- 将来の帳票機能で同じ Trait を再利用可能
- テスト時のルール検証が一元化

---

## ADR-008: PdfGeneratorService による帳票生成の拡張性設計

### ステータス
Accepted

### コンテキスト
セクションレポートでPDF出力が必要となり、将来的に見積書やその他帳票でも同様の機能が必要になることが予想された。

### 決定
PDF生成ロジックをサービス層（PdfGeneratorService）に集約し、複数のコントローラーから呼び出し可能な設計を採用。

```php
class PdfGeneratorService {
    public function generate(array $data): string {
        // PDF生成ロジック
        // 対応形式: セクションレポート、見積書、その他カスタム形式
    }
}
```

### 理由
- 帳票生成ロジックの一元化による重複排除
- 将来の見積書・その他帳票機能での再利用が容易
- テスト性の向上（モック可能）
- 複雑度が高い処理の分離で、コントローラーをシンプルに

### 結果
- セクションレポート export API で即座に利用可能
- 将来の帳票機能で同じサービスを呼び出し
- PDF関連バグが発生した場合、サービス層で一括修正可能

---

## ADR-009: 権限チェックのミドルウェア一元化

### ステータス
Accepted

### コンテキスト
セクションレポートへのアクセス権限が管理者のみに限定されるため、権限チェック機構を設計する必要があった。

### 決定
ミドルウェア（CheckSectionReportPermission）でAPI層の権限チェックを一元化。ルーティング時に適用。

```php
// ミドルウェア
class CheckSectionReportPermission {
    public function handle(Request $request, Closure $next) {
        if (!auth()->user() || auth()->user()->accessLevel !== '00') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return $next($request);
    }
}

// ルーティング
Route::post('/aggregate', 'aggregate')
    ->middleware('checkSectionReportPermission');
```

### 理由
- 権限チェックロジックがミドルウェアに集約され、コントローラーが単純化
- 同じ権限要件の複数のエンドポイントで簡単に適用可能
- ルーティング定義で権限要件が明示的（可読性向上）
- 権限ロジック変更時にミドルウェアのみ修正

### 結果
- SectionReportController::aggregate(), export() の両メソッドが同じ権限チェックで保護
- 将来の権限周辺エンドポイントで同じミドルウェアを再利用可能
- コントローラーコード内に権限チェックロジックなし（責務分離）

---

## ADR-010: フロントエンド Zod スキーマ化による入力バリデーション

### ステータス
Accepted

### コンテキスト
セクションレポートの検索条件（日付範囲、部署フィルタなど）をクライアント側でバリデーションする際、複数フォームで共通ルール（期間の妥当性など）を効率的に管理する必要があった。

### 決定
Zod スキーマで集約し、スキーマファイル（sectionReportSchema.ts）として管理。

```typescript
export const sectionReportSchema = z.object({
  fromDate: z.string().date('Invalid date format'),
  toDate: z.string().date('Invalid date format'),
  departments: z.array(z.string()).optional(),
});

// テスト時も同じスキーマを使用
const result = sectionReportSchema.safeParse(data);
expect(result.success).toBe(true);
```

### 理由
- バリデーションロジック + 型推論を同時実現
- 複数のフォームやAPI呼び出しで同じスキーマ再利用
- TS型の自動生成で、フォーム値の型安全性確保
- テスト時にも同じスキーマで検証可能

### 結果
- sectionReportSchema.ts で集約管理
- フロントエンドのバリデーション重複を排除
- TypeScript の型推論による入力値の型安全性向上

---

## ADR-011: 段階的実装フェーズにおけるコミット戦略

### ステータス
Accepted

### コンテキスト
セクションレポート機能の段階的実装（基盤→詳細）において、第3セッションで基盤実装が完了した時点で、詳細実装待ちの状態になった。コミット・PR戦略をどうするか検討が必要だった。

### 決定
基盤実装フェーズの完了後、以下の手順で進める：

1. **第3セッション終了時点**
   - 全テスト（既存266件）がパスすることを確認
   - ビルド成功を確認
   - コミット未実施（詳細実装待ち）

2. **詳細実装フェーズ（第4セッション以降）**
   - 集計ロジック・PDF実装完了後、テスト追加
   - 全テストパス確認後にコミット実行
   - PR作成・マージ

### 理由
- 基盤実装は動作検証できるレベルではあるが、機能が不完全
- 実装者が複数セッション分かれる場合、コミット時点の品質状態を統一
- PR時には機能が完全な状態で提出（レビューが容易）
- 不完全なコードの混在を避ける

### 結果
- 第3セッション：コミット未実施（ただし、リファクタリングブランチは機能完全を想定）
- 詳細実装完了時点で、完全な機能セットでコミット・PR提出

---

## ADR-012: 見積書No採番ロジック（11桁→12桁変更）

### ステータス
Accepted

### コンテキスト
見積書No の形式が11桁（得意先5桁+年月4桁+連番2桁）から、連番の拡張（99→999）により12桁（得意先5桁+年月4桁+連番3桁）への変更が必要となった。

### 決定
- 見積書No形式を 12桁に統一（連番3桁）
- QuotService::generateQuotNo() のロジックを更新
- マイグレーション・シーダー・テスト値を更新
- フロントエンド表示フォーマット（QuotNoDisplay）を更新

### 理由
- 連番99では1年で上限に達する可能性
- 連番999なら、将来の拡張にも耐える
- 見積書No体系の統一で、将来の搪張予備があり、保守性向上

### 結果
- 12桁形式へ統一（全体で一貫性確保）
- テストで形式検証
- フロントエンド表示も統一フォーマット（スペース区切り）

---

## 技術的決定一覧（サマリー）

| ADR | 決定内容 | ステータス | 決定時期 |
|-----|---------|-----------|--------|
| ADR-001 | テストフレームワーク選定（Vitest/PHPUnit/Playwright） | Accepted | 第1セッション |
| ADR-002 | lint-staged 実行方式（npx回避） | Accepted | 第1セッション |
| ADR-003 | CI/CDパイプライン構成（PR/デプロイ分離） | Accepted | 第1セッション |
| ADR-004 | E2Eテスト Playwright 採用 | Accepted | 第1セッション |
| ADR-005 | エージェント階層構造（PM→PL→専門） | Accepted | 第1セッション |
| ADR-006 | セクションレポート段階的実装 | Accepted | 第3セッション |
| ADR-007 | FormRequest+Trait バリデーション一元化 | Accepted | 第3セッション |
| ADR-008 | PdfGeneratorService による帳票設計 | Accepted | 第3セッション |
| ADR-009 | ミドルウェアによる権限チェック一元化 | Accepted | 第3セッション |
| ADR-010 | Zod スキーマによるフロント入力バリデーション | Accepted | 第3セッション |
| ADR-011 | 段階実装フェーズのコミット戦略 | Accepted | 第3セッション |
| ADR-012 | 見積書No 12桁化（連番拡張） | Accepted | 第1セッション |
