# 学習・ベストプラクティス

## Windows環境でのNode.js開発

### 学んだこと
- npxはWindows環境でパス解決に問題が発生することがある
- ESLint v9はデフォルトでflat config（eslint.config.js）を使用する

### ベストプラクティス
- huskyフックでは`node path/to/binary`形式で直接実行
- レガシー設定を使う場合は`ESLINT_USE_FLAT_CONFIG=false`を設定
- パス区切り文字は`/`に統一（Windowsでも動作する）

### アンチパターン
- グローバルインストールに依存した設定
- OSごとに異なるコマンドを使用

---

## テスト設計

### 学んだこと
- Zustandストアのテストでは`getState()`で状態を取得
- hooksのテストでは`renderHook`と`act`を組み合わせる
- APIモックは`vi.mock()`で行い、型安全に取得する

### ベストプラクティス
```typescript
// モックの型安全な取得
vi.mock('@/lib/api');
import { someFunction } from '@/lib/api';
const mockFunction = someFunction as ReturnType<typeof vi.fn>;
```

### アンチパターン
- テスト間で状態が共有される（beforeEachでリセットする）
- 非同期処理をactでラップしない

---

## CI/CD

### 学んだこと
- GitHub Actionsのservicesでテスト用DB/Redisを起動できる
- `continue-on-error: true`でジョブを止めずに続行可能

### ベストプラクティス
- PRワークフローとデプロイワークフローを分離
- セキュリティスキャンは情報提供目的（ブロックしない）
- キャッシュを活用（npm ci, composer install）

### アンチパターン
- 全てのチェックを同一ジョブで実行（並列化の余地なし）
- 本番環境の認証情報をログ出力

---

## プロジェクト構成

### 学んだこと
- PM → PL → 専門エージェントの階層構造で分業
- PMは実装を行わず、PLに委譲
- サブエージェント定義は`.claude/agents/`に配置

### ベストプラクティス
- 各エージェントの責務を明確に定義
- コンテキスト管理用のヘルパーエージェントを用意
- セッション間の引き継ぎ情報を構造化して保存

### アンチパターン
- PMが直接コードを書く
- エージェント間の責務が曖昧

---

## ドキュメント管理

### 学んだこと
- CLAUDE.md は全開発者が参照する重要ファイル（段階的開示が効果的）
- 基本情報と詳細情報を分離することで保守性が向上
- エージェント定義は個別ファイルで管理すると探しやすい

### ベストプラクティス
- `CLAUDE.md`: 67行（基本構成のみ、詳細は別ドキュメント参照）
- `.claude/agents/README.md`: エージェント概要
- `docs/`: ドメイン別の詳細ドキュメント
- `.claude/context/`: セッション情報の構造化保存

### アンチパターン
- 全情報を1ファイルに集約（スクロール疲れ、検索困難）
- ドキュメント構造が不明確

### 成果
2026-01-25セッションで CLAUDE.md を 346行→67行（81%削減）
スクリーンショット等のドキュメント追加により、むしろ利用性が向上

---

## テスト自動化の効率性

### 学んだこと
- 小さなテストを追加していくことで、安定度が段階的に向上
- 92テストを短期間（1セッション）で追加可能
- ファクトリーの不足は後続セッションに委譲できる

### ベストプラクティス
- テストケース数より質を重視（カバレッジ指標を明確に）
- テスト追加時は段階的フェーズ分け（フロント→バック→E2E）
- スキップテストは次セッションの明確なタスクとして記録

### アンチパターン
- 完璧なテストカバレッジを目指すと進捗が止まる
- ファクトリーなど基盤が無いときの無理なテスト作成

---

## GitHub Actions での環境構築

### 学んだこと
- PHPUnit の `phpunit.xml` でカバレッジ計測設定可能
- npm/composer キャッシュで CI 時間を短縮
- サービス構成（DB/Redis）で統合テストが実行可能

### ベストプラクティス
```yaml
# キャッシュ活用でCI時間を短縮
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

### アンチパターン
- 毎回 `npm install` を実行（時間が掛かる）
- サービス起動後すぐテスト実行（readiness checkなし）

---

## フロントエンド API スキーマ設計（第3セッション）

### 学んだこと
- Zod スキーマはバリデーション + 型推論に最適
- 複数のAPIで共通する検証ルール（期間、部署など）はスキーマで統一
- テスト時は `.safeParse()` で戻り値を検証しやすくする

### ベストプラクティス
```typescript
// スキーマの再利用性
export const sectionReportSchema = z.object({
  fromDate: z.string().date('Invalid date format'),
  toDate: z.string().date('Invalid date format'),
  departments: z.array(z.string()).optional(),
});

// テスト: success/error パターンを両立
const result = sectionReportSchema.safeParse(data);
expect(result.success).toBe(true);
```

### アンチパターン
- スキーマをAPIごとに異なる形式で定義
- バリデーション結果の型推論を使わない

---

## バックエンド API 層の整理（第3セッション）

### 学んだこと
- FormRequest + Trait パターンで共通バリデーションルールを一元管理
- ミドルウェアで権限チェックを集約すると保守性が向上
- 空の実装（スタブ）でもAPI構造を決めておくと実装がしやすい

### ベストプラクティス
```php
// バリデーション Trait で共通ルールを定義
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

### アンチパターン
- バリデーションルールをコントローラーに直接記述
- 同じ検証ルールを複数の FormRequest で繰り返す

---

## PDF 生成の拡張性設計（第3セッション）

### 学んだこと
- `PdfGeneratorService` は見積書、周報、その他帳票で再利用を想定
- 生成処理の基盤実装（空）を先にすることで、後続の実装がスムーズ
- サービス層に集約することで、複数のコントローラーから呼び出し可能

### ベストプラクティス
```php
// サービス層で PDF 生成を一元化
class PdfGeneratorService {
    public function generate(array $data): string {
        // PDF生成ロジック
        // 将来: 見積書、周報、カスタム形式に対応
    }
}

// コントローラーから利用
class SectionReportController {
    public function __construct(private PdfGeneratorService $pdfService) {}

    public function export(SectionReportExportRequest $request) {
        $pdf = $this->pdfService->generate($request->validated());
        return response($pdf)->header('Content-Type', 'application/pdf');
    }
}
```

### アンチパターン
- PDF生成ロジックをコントローラーに直接記述
- 複数のコントローラーで似たようなPDF生成処理を繰り返す

---

## セッション管理と委譲プロセス（第3セッション）

### 学んだこと
- 大規模機能実装は「基盤実装」と「詳細実装」の2フェーズに分割可能
- 基盤実装でAPI仕様・バリデーション・権限制御を完成させると、詳細実装が簡潔になる
- セッション間の引き継ぎ情報を「具体的なタスク」として記録すると次セッションの効率が向上

### ベストプラクティス
```markdown
## 基盤実装フェーズ（第3セッション）
- [x] API設計・ルーティング定義
- [x] 権限チェック・ミドルウェア
- [x] バリデーション全体
- [x] 画面レイアウト・UI構造

## 詳細実装フェーズ（第4セッション以降）
- [ ] 集計処理の実装
- [ ] PDF内容の実装
- [ ] テスト実装
```

### アンチパターン
- 全てを1セッションで完成させようとする（コンテキスト超過）
- 次セッションへの引き継ぎ情報が曖昧（タスクが不明確）

---

## 権限管理の実装パターン（第3セッション）

### 学んだこと
- 権限チェック関数（`canAccessXxx`）はフロントエンドのみならずバックエンド実装の参考になる
- ミドルウェアでAPI層の権限チェックを一元化すると、コントローラーの実装がシンプル
- アクセス区分（00, 20, 40など）の判定は `user()->accessLevel` で統一

### ベストプラクティス
```php
// ミドルウェア: 権限チェック一元化
class CheckSectionReportPermission {
    public function handle(Request $request, Closure $next) {
        if (!auth()->user() || auth()->user()->accessLevel !== '00') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return $next($request);
    }
}

// コントローラー: 権限チェック済みで実装可能
class SectionReportController {
    public function aggregate(SectionReportAggregateRequest $request) {
        // ここで権限チェックは不要（ミドルウェアで済み）
        // 集計ロジックに集中
    }
}
```

### アンチパターン
- 各コントローラーメソッドで権限チェックを繰り返す
- 権限判定ロジックがコントローラーに散在
