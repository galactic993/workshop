#!/usr/bin/env python3
"""
design-sample の画面設計書をコピーし、画面概要シートに PNG を埋め込む。
s1.5-screen-capture のテスト用。

Usage:
  python embed_capture_image.py <画面設計書.xlsx> <画像.png> <出力.xlsx>
"""
import argparse
import shutil
import sys
import unicodedata
from pathlib import Path

from openpyxl import load_workbook
from openpyxl.drawing.image import Image as XLImage


def norm(s):
    return unicodedata.normalize("NFC", str(s))


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("design_xlsx", type=Path)
    p.add_argument("png", type=Path)
    p.add_argument("out_xlsx", type=Path)
    args = p.parse_args()

    if not args.design_xlsx.is_file():
        print(f"not found: {args.design_xlsx}", file=sys.stderr)
        sys.exit(1)
    if not args.png.is_file():
        print(f"not found: {args.png}", file=sys.stderr)
        sys.exit(1)

    args.out_xlsx.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(args.design_xlsx, args.out_xlsx)

    wb = load_workbook(args.out_xlsx)
    target = None
    for ws in wb.worksheets:
        if "画面概要" in norm(ws.title):
            target = ws
            break
    if target is None:
        print("画面概要シートがありません", file=sys.stderr)
        sys.exit(1)

    img = XLImage(str(args.png))
    img.width = min(img.width, 900)
    img.height = min(img.height, 700)
    target.add_image(img, "B2")

    wb.save(args.out_xlsx)
    wb.close()
    print(f"saved: {args.out_xlsx}")


if __name__ == "__main__":
    main()
