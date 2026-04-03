#!/usr/bin/env python3
"""SKILL.md と画面/テーブルパスから claude -p 用プロンプトを生成する。"""
from __future__ import annotations

import sys
from pathlib import Path


def main() -> int:
    if len(sys.argv) != 4:
        print(
            "Usage: build_skill_prompt.py <SKILL.md> <画面設計書.xlsx> <テーブル定義書.xlsx>",
            file=sys.stderr,
        )
        return 1
    skill_path, screen, table = sys.argv[1], sys.argv[2], sys.argv[3]
    skill = Path(skill_path).read_text(encoding="utf-8")
    text = f"""あなたは設計書レビューを行うアシスタントです。次のパスにある Excel を読み取れるようにツールを使ってください。

- 画面設計書（フルパス）: {screen}
- テーブル定義書（フルパス）: {table}

B 系・D 系以外では、片方だけしか使わない指示のときは、不要なファイルは参照しなくて構いません。

以下のスキル定義（Markdown 全体）に従い、結果をこのチャットに出力してください。

---

{skill}"""
    sys.stdout.write(text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
