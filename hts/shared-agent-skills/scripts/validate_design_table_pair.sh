#!/usr/bin/env bash
# 画面設計書とテーブル定義書のファイル名からプレフィックス（共/売/編など）を抽出し、対応するか検証する。
# 終了コード: 0=OK, 1=エラー（メッセージは stderr）
set -euo pipefail

prefix_from_table() {
  local tn="$1"
  local pt="${tn%%-テーブル定義書*}"
  if [[ "$pt" == "$tn" || -z "$pt" ]]; then
    echo "テーブル定義書のファイル名からプレフィックスを抽出できませんでした（期待: \`{プレフィックス}-テーブル定義書_...\`）: $tn" >&2
    return 1
  fi
  printf '%s\n' "$pt"
}

prefix_from_screen() {
  local sn="$1"
  if [[ "$sn" =~ _[0-9]+_([^/_/-]+)- ]]; then
    printf '%s\n' "${BASH_REMATCH[1]}"
    return 0
  fi
  if [[ "$sn" =~ _([^/_/-]+)-[^/]*_画面設計書 ]]; then
    printf '%s\n' "${BASH_REMATCH[1]}"
    return 0
  fi
  if [[ "$sn" =~ _([共売編])- ]]; then
    printf '%s\n' "${BASH_REMATCH[1]}"
    return 0
  fi
  echo "画面設計書のファイル名からプレフィックスを抽出できませんでした（\`_数字_{プレフィックス}-\` または \`_{プレフィックス}-..._画面設計書\` を想定）: $sn" >&2
  return 1
}

if [[ $# -ne 2 ]]; then
  echo "Usage: validate_design_table_pair.sh <画面設計書.xlsx> <テーブル定義書.xlsx>" >&2
  exit 1
fi

SCREEN="$1"
TABLE="$2"

if [[ ! -f "$SCREEN" ]]; then
  echo "画面設計書が見つかりません: $SCREEN" >&2
  exit 1
fi
if [[ ! -f "$TABLE" ]]; then
  echo "テーブル定義書が見つかりません: $TABLE" >&2
  exit 1
fi

sn="$(basename "$SCREEN")"
tn="$(basename "$TABLE")"

pt="$(prefix_from_table "$tn")" || exit 1
ps="$(prefix_from_screen "$sn")" || exit 1

if [[ "$ps" != "$pt" ]]; then
  printf 'プレフィックスが一致しません。画面設計書: %q / テーブル定義書: %q\n' "$ps" "$pt" >&2
  exit 1
fi

printf 'プレフィックス一致: %q\n' "$ps"
