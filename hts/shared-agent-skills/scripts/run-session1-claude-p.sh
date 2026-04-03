#!/usr/bin/env bash
# 第一回講義スキル（a1–c3＋任意 d1）と Session 1.5 個別スキル（s1.5-*）を claude -p で並列実行する。
# 必須引数: 画面設計書.xlsx テーブル定義書.xlsx
#
# 使い方:
#   ./scripts/run-session1-claude-p.sh /path/to/画面設計書.xlsx /path/to/テーブル定義書.xlsx
#
# 環境変数（任意）:
#   WITH_MARKDOWN=1          D1（統合 Markdown）も実行
#   MAX_PARALLEL=4           同時実行数（既定 4）
#   OUT_DIR=...              ログ出力先（既定 session1-claude-runs/<日時>）
#   SKIP_S15_PROMPTS=1       s1.5 プロンプトスキルをスキップ
#   RUN_S15_PYTHON=1         従来の Python 一括（s1.5-all-docs）も最後に実行（openpyxl 要）
#   RUN_S15_PYTHON_STRICT=1  Python 失敗でスクリプト全体を失敗終了
#   INTERACTIVE_FIX=0        修正確認プロンプトを出さない（非対話向け）
#   CLAUDE_EXTRA_FLAGS       claude に追加で渡すフラグ
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VALIDATE="$ROOT/scripts/validate_design_table_pair.py"
BUILD_PROMPT="$ROOT/scripts/build_skill_prompt.py"
FIX_PROMPT_MD="$ROOT/scripts/prompts/fix_workbooks.md"

usage() {
  sed -n '1,25p' "$0" | tail -n +2
}

if [[ $# -lt 2 ]]; then
  usage >&2
  exit 1
fi

SCREEN="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
TABLE="$(cd "$(dirname "$2")" && pwd)/$(basename "$2")"
shift 2

if [[ $# -gt 0 ]]; then
  echo "余分な引数があります（画面・テーブルの2パスのみ指定してください）: $*" >&2
  exit 1
fi

python3 "$VALIDATE" "$SCREEN" "$TABLE" || exit 1

SESSION1_CHECK_SKILLS=(
  "a1-event-number-sequence"
  "a2-event-number-cross-sheet"
  "a3-control-type-event-mismatch"
  "a4-control-type-validation-mismatch"
  "a6-item-number-sequence"
  "a7-message-number-sequence"
  "b1-db-registration-field-exists"
  "b2-ref-spec-table-column-exists"
  "c1-fk-reference-target-exists"
  "c2-pk-definition-check"
  "c3-not-null-without-default"
)
SESSION1_MARKDOWN_SKILLS=(
  "d1-unified-design-to-markdown"
)

S15_PROMPT_SKILLS=(
  "s1.5-doc-format-pattern"
  "s1.5-event-no"
  "s1.5-message-format"
  "s1.5-validation-consistency"
  "s1.5-reference-spec"
  "s1.5-screen-capture"
)

WITH_MARKDOWN="${WITH_MARKDOWN:-0}"
MAX_PARALLEL="${MAX_PARALLEL:-4}"
SKIP_S15_PROMPTS="${SKIP_S15_PROMPTS:-0}"
RUN_S15_PYTHON="${RUN_S15_PYTHON:-0}"
RUN_S15_PYTHON_STRICT="${RUN_S15_PYTHON_STRICT:-0}"
INTERACTIVE_FIX="${INTERACTIVE_FIX:-1}"

OUT_DIR="${OUT_DIR:-$ROOT/session1-claude-runs/$(date +%Y%m%d-%H%M%S)}"
mkdir -p "$OUT_DIR"

SCREEN_DIR="$(cd "$(dirname "$SCREEN")" && pwd)"
TABLE_DIR="$(cd "$(dirname "$TABLE")" && pwd)"

ALL=()
ALL+=("${SESSION1_CHECK_SKILLS[@]}")
if [[ "$WITH_MARKDOWN" == "1" ]]; then
  ALL+=("${SESSION1_MARKDOWN_SKILLS[@]}")
fi
if [[ "$SKIP_S15_PROMPTS" != "1" ]]; then
  ALL+=("${S15_PROMPT_SKILLS[@]}")
fi

EXTRA_CLAUDE_FLAGS=()
if [[ -n "${CLAUDE_EXTRA_FLAGS:-}" ]]; then
  # shellcheck disable=SC2206
  EXTRA_CLAUDE_FLAGS=($CLAUDE_EXTRA_FLAGS)
fi

echo "Output directory: $OUT_DIR" | tee "$OUT_DIR/run.log"
echo "Screen: $SCREEN" | tee -a "$OUT_DIR/run.log"
echo "Table:  $TABLE" | tee -a "$OUT_DIR/run.log"
echo "Parallel: $MAX_PARALLEL  skills: ${#ALL[@]}" | tee -a "$OUT_DIR/run.log"
echo | tee -a "$OUT_DIR/run.log"

run_claude_skill() {
  local name=$1
  local skill_md="$ROOT/skills/${name}/SKILL.md"
  if [[ ! -f "$skill_md" ]]; then
    echo "Missing $skill_md" | tee -a "$OUT_DIR/run.log" >&2
    echo "1" > "$OUT_DIR/${name}.exit"
    return 0
  fi
  set +e
  local PROMPT
  PROMPT="$(python3 "$BUILD_PROMPT" "$skill_md" "$SCREEN" "$TABLE")"
  claude -p "$PROMPT" --print \
    --add-dir "$SCREEN_DIR" \
    --add-dir "$TABLE_DIR" \
    "${EXTRA_CLAUDE_FLAGS[@]}" \
    2>&1 | tee "$OUT_DIR/${name}.log"
  local ec=${PIPESTATUS[0]}
  set -e
  echo "$ec" > "$OUT_DIR/${name}.exit"
}

idx=0
n=${#ALL[@]}
while (( idx < n )); do
  batch=()
  for ((i = 0; i < MAX_PARALLEL && idx < n; i++)); do
    batch+=("${ALL[idx]}")
    ((idx++)) || true
  done
  for name in "${batch[@]}"; do
    echo "======== start ${name} ========" | tee -a "$OUT_DIR/run.log"
    (
      run_claude_skill "$name"
    ) &
  done
  wait
done

any_fail=0
echo | tee -a "$OUT_DIR/run.log"
echo "======== 実行サマリー（claude -p） ========" | tee -a "$OUT_DIR/run.log"
for name in "${ALL[@]}"; do
  ec=$(cat "$OUT_DIR/${name}.exit" 2>/dev/null || echo "?")
  printf "%-45s exit=%s\n" "$name" "$ec" | tee -a "$OUT_DIR/run.log"
  if [[ "$ec" != "0" ]]; then
    any_fail=1
  fi
done

# --- オプション: Python 一括（レガシー）---
if [[ "$RUN_S15_PYTHON" == "1" ]]; then
  SKILLS_DIR="$ROOT/skills"
  RUN15="$SKILLS_DIR/s1.5-all-docs/scripts/run_all_checks.py"
  if [[ ! -f "$RUN15" ]]; then
    echo "Missing $RUN15" | tee -a "$OUT_DIR/run.log" >&2
    any_fail=1
  elif ! python3 -c "import openpyxl" 2>/dev/null; then
    echo "RUN_S15_PYTHON: openpyxl が必要です（pip install openpyxl）" | tee -a "$OUT_DIR/run.log" >&2
    any_fail=1
  else
    WORK15="$(mktemp -d "${TMPDIR:-/tmp}/session1.5-design.XXXXXX")"
    # shellcheck disable=SC2064
    trap 'rm -rf "$WORK15"' EXIT
    ln -sf "$SCREEN" "$WORK15/$(basename "$SCREEN")"
    ln -sf "$TABLE" "$WORK15/$(basename "$TABLE")"
    echo "======== s1.5-all-docs (Python) ========" | tee -a "$OUT_DIR/run.log"
    set +e
    python3 "$RUN15" "$WORK15" \
      --skills-dir "$SKILLS_DIR" \
      --output "$OUT_DIR/check_all_result.xlsx" \
      2>&1 | tee "$OUT_DIR/s1.5-all-docs-python.log"
    ec15=${PIPESTATUS[0]}
    set -e
    echo "s1.5-all-docs (Python) exit=$ec15" | tee -a "$OUT_DIR/run.log"
    if [[ "$ec15" -ne 0 ]]; then
      any_fail=1
      if [[ "$RUN_S15_PYTHON_STRICT" == "1" ]]; then
        echo "RUN_S15_PYTHON_STRICT: 失敗終了" | tee -a "$OUT_DIR/run.log" >&2
        exit "$ec15"
      fi
    fi
  fi
fi

# --- 修正フロー（対話）---
if [[ "$INTERACTIVE_FIX" == "1" ]] && [[ -t 0 ]] && [[ -t 1 ]]; then
  echo | tee -a "$OUT_DIR/run.log"
  read -r -p "レビュー結果を踏まえ、コピーを作成して Claude で修正を試みますか? [y/N] " ans || true
  if [[ "${ans:-}" =~ ^[Yy]$ ]]; then
    COPY_DIR="$OUT_DIR/copies"
    mkdir -p "$COPY_DIR"
    S_COPY="$COPY_DIR/screen_review_copy.xlsx"
    T_COPY="$COPY_DIR/table_review_copy.xlsx"
    cp "$SCREEN" "$S_COPY"
    cp "$TABLE" "$T_COPY"
    echo "コピー: $S_COPY , $T_COPY" | tee -a "$OUT_DIR/run.log"
    FIX_HEAD="$(cat "$FIX_PROMPT_MD")"
    FIX_BODY=$(
      cat <<EOF

## パス
- 画面設計書コピー（編集可）: ${S_COPY}
- テーブル定義書コピー（編集可）: ${T_COPY}
- レビューログディレクトリ: ${OUT_DIR}

ログファイル名は \`<スキル名>.log\` です。
EOF
    )
    set +e
    claude -p "${FIX_HEAD}${FIX_BODY}" --print \
      --add-dir "$OUT_DIR" \
      --add-dir "$COPY_DIR" \
      "${EXTRA_CLAUDE_FLAGS[@]}" \
      2>&1 | tee "$OUT_DIR/fix-workbooks.log"
    fex=${PIPESTATUS[0]}
    set -e
    echo "fix-workbooks exit=$fex" | tee -a "$OUT_DIR/run.log"
    if [[ "$fex" -ne 0 ]]; then
      any_fail=1
    fi
  fi
elif [[ "$INTERACTIVE_FIX" == "1" ]]; then
  echo "（非TTYのため修正確認をスキップしました。INTERACTIVE_FIX=0 で抑制メッセージを消せます）" | tee -a "$OUT_DIR/run.log"
fi

echo "Done. Logs under $OUT_DIR" | tee -a "$OUT_DIR/run.log"
if [[ "$any_fail" -ne 0 ]]; then
  exit 1
fi
exit 0
