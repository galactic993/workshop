#!/usr/bin/env python3
"""画面設計書とテーブル定義書のファイル名からプレフィックス（共/売/編など）を抽出し、対応するか検証する。

命名の考え方（旧 excel-to-md スキルと同様）:
- テーブル定義書: {プレフィックス}-テーブル定義書_XXXX.xlsx
- 画面設計書: ..._{プレフィックス}-{画面名}_画面設計書_XXXX.xlsx（途中に _数字_プレフィックス- の形を想定）

終了コード: 0=OK, 1=エラー（メッセージは stderr）
"""
from __future__ import annotations

import re
import sys
from pathlib import Path


def prefix_from_table(filename: str) -> str | None:
    m = re.match(r"^(.+?)-テーブル定義書", filename)
    return m.group(1) if m else None


def prefix_from_screen(filename: str) -> str | None:
    # 例: 02-02_2_編-制作見積-..._画面設計書_1007.xlsx → 編
    m = re.search(r"_\d+_([^_/\\-]+)-", filename)
    if m:
        return m.group(1)
    m = re.search(r"_([^_/\\-]+)-[^/\\]*_画面設計書", filename)
    if m:
        return m.group(1)
    m = re.search(r"_([共売編])-", filename)
    return m.group(1) if m else None


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: validate_design_table_pair.py <画面設計書.xlsx> <テーブル定義書.xlsx>", file=sys.stderr)
        return 1
    screen = Path(sys.argv[1])
    table = Path(sys.argv[2])

    if not screen.is_file():
        print(f"画面設計書が見つかりません: {screen}", file=sys.stderr)
        return 1
    if not table.is_file():
        print(f"テーブル定義書が見つかりません: {table}", file=sys.stderr)
        return 1

    sn = screen.name
    tn = table.name

    ps = prefix_from_screen(sn)
    pt = prefix_from_table(tn)

    if pt is None:
        print(
            f"テーブル定義書のファイル名からプレフィックスを抽出できませんでした（期待: `{{プレフィックス}}-テーブル定義書_...`）: {tn}",
            file=sys.stderr,
        )
        return 1
    if ps is None:
        print(
            f"画面設計書のファイル名からプレフィックスを抽出できませんでした（`_数字_{{プレフィックス}}-` または `_{{プレフィックス}}-..._画面設計書` を想定）: {sn}",
            file=sys.stderr,
        )
        return 1
    if ps != pt:
        print(
            f"プレフィックスが一致しません。画面設計書: {ps!r} / テーブル定義書: {pt!r}",
            file=sys.stderr,
        )
        return 1

    print(f"プレフィックス一致: {ps!r}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
