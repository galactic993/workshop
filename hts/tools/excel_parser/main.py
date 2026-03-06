#!/usr/bin/env python3
"""
Excel Parser CLI
画面設計書・テーブル定義書のパース、変換、レビューを行う
"""

import argparse
import json
import sys
import unicodedata
from pathlib import Path
from typing import List, Tuple

from screen_design_parser import parse_screen_design, to_markdown as screen_to_markdown
from table_def_parser import parse_table_definitions, to_markdown as table_to_markdown
from reviewer import review_screen_design, review_cross_reference, format_review_report
from table_reviewer import review_table_definitions, review_cross_table_fk, format_table_review_report


def parse_file(input_path: Path, output_dir: Path, format: str) -> Tuple[bool, str]:
    """1つのExcelファイルをパースして出力"""
    filename = unicodedata.normalize('NFC', input_path.stem)

    try:
        if "テーブル定義書" in filename:
            data = parse_table_definitions(str(input_path))
            parser_type = "テーブル定義書"

            if format == "markdown":
                content = table_to_markdown(data)
                output_file = output_dir / f"{filename}.md"
                output_file.write_text(content, encoding="utf-8")
            else:
                output_file = output_dir / f"{filename}.json"
                output_file.write_text(
                    json.dumps(data, ensure_ascii=False, indent=2),
                    encoding="utf-8"
                )

        elif "画面設計書" in filename:
            data = parse_screen_design(str(input_path))
            parser_type = "画面設計書"

            if format == "markdown":
                content = screen_to_markdown(data)
                output_file = output_dir / f"{filename}.md"
                output_file.write_text(content, encoding="utf-8")
            else:
                output_file = output_dir / f"{filename}.json"
                output_file.write_text(
                    json.dumps(data, ensure_ascii=False, indent=2),
                    encoding="utf-8"
                )
        else:
            return False, f"スキップ: {input_path.name} (画面設計書/テーブル定義書のいずれでもありません)"

        return True, f"成功: {input_path.name} → {output_file.name} ({parser_type})"

    except Exception as e:
        return False, f"エラー: {input_path.name} - {str(e)}"


def run_convert(args):
    """変換コマンドの実行"""
    input_path = Path(args.input)
    if not input_path.exists():
        print(f"エラー: 入力パスが存在しません: {input_path}", file=sys.stderr)
        sys.exit(1)

    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)

    if input_path.is_file():
        if input_path.suffix.lower() not in [".xlsx", ".xls"]:
            print(f"エラー: Excelファイルではありません: {input_path}", file=sys.stderr)
            sys.exit(1)
        files: List[Path] = [input_path]
    else:
        files = list(input_path.glob("*.xlsx")) + list(input_path.glob("*.xls"))
        # 一時ファイル（~$で始まるファイル）を除外
        files = [f for f in files if not f.name.startswith("~$")]
        if not files:
            print(f"警告: {input_path} にExcelファイルが見つかりませんでした", file=sys.stderr)
            sys.exit(0)

    print(f"処理開始: {len(files)}件のファイルを処理します")
    print(f"出力先: {output_dir.absolute()}")
    print(f"出力形式: {args.format}")
    print("-" * 60)

    success_count = 0
    skip_count = 0
    error_count = 0

    for file in files:
        success, message = parse_file(file, output_dir, args.format)
        print(message)

        if success:
            success_count += 1
        elif "スキップ" in message:
            skip_count += 1
        else:
            error_count += 1

    print("-" * 60)
    print(f"処理完了:")
    print(f"  成功: {success_count}件")
    print(f"  スキップ: {skip_count}件")
    print(f"  エラー: {error_count}件")

    if error_count > 0:
        sys.exit(1)


def run_review(args):
    """レビューコマンドの実行"""
    input_path = Path(args.input)
    if not input_path.exists():
        print(f"エラー: 入力パスが存在しません: {input_path}", file=sys.stderr)
        sys.exit(1)

    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)

    # Excelファイルの収集
    if input_path.is_file():
        files = [input_path]
    else:
        files = list(input_path.glob("*.xlsx")) + list(input_path.glob("*.xls"))

    # 一時ファイル（~$で始まるファイル）を除外
    files = [f for f in files if not f.name.startswith("~$")]

    # 画面設計書とテーブル定義書に分類
    screen_files = []
    table_files = []

    for f in files:
        filename = unicodedata.normalize('NFC', f.stem)
        if "画面設計書" in filename:
            screen_files.append(f)
        elif "テーブル定義書" in filename:
            table_files.append(f)

    print(f"レビュー開始:")
    print(f"  画面設計書: {len(screen_files)}件")
    print(f"  テーブル定義書: {len(table_files)}件")
    print("-" * 60)

    # テーブル定義書を先にパース（クロスチェックに必要）
    table_data_list = []
    for tf in table_files:
        print(f"テーブル定義書パース中: {tf.name}")
        table_data_list.append(parse_table_definitions(str(tf)))

    all_results = []

    # 画面設計書のレビュー（A1-A7, B1-B2）
    for sf in screen_files:
        filename = unicodedata.normalize('NFC', sf.stem)
        print(f"画面設計書レビュー中: {sf.name}")

        screen_data = parse_screen_design(str(sf))

        # A1-A7: 内部整合性チェック
        results = review_screen_design(screen_data)

        # B1-B2: クロスリファレンスチェック
        if table_data_list:
            results += review_cross_reference(screen_data, table_data_list)

        report = format_review_report(results, filename)
        report_file = output_dir / f"review_{filename}.md"
        report_file.write_text(report, encoding="utf-8")
        print(f"  → {report_file.name}")

        all_results.extend(results)

    # テーブル定義書のレビュー（C1-C3）
    table_results = []
    for td in table_data_list:
        table_results += review_table_definitions(td)

    # C1: FK横断チェック
    if len(table_data_list) > 0:
        table_results += review_cross_table_fk(table_data_list)

    if table_results:
        table_report = format_table_review_report(table_results)
        table_report_file = output_dir / "review_テーブル定義書.md"
        table_report_file.write_text(table_report, encoding="utf-8")
        print(f"  → {table_report_file.name}")

    all_results.extend(table_results)

    # サマリー
    error_count = sum(1 for r in all_results if r["severity"] == "error")
    warning_count = sum(1 for r in all_results if r["severity"] == "warning")
    info_count = sum(1 for r in all_results if r["severity"] == "info")

    print("-" * 60)
    print(f"レビュー完了:")
    print(f"  エラー: {error_count}件")
    print(f"  警告: {warning_count}件")
    print(f"  情報: {info_count}件")
    print(f"  合計: {len(all_results)}件のチェックを実行")


def main():
    parser = argparse.ArgumentParser(
        description="Excel設計書の変換・レビューツール"
    )
    subparsers = parser.add_subparsers(dest="command")

    # convert サブコマンド
    convert_parser = subparsers.add_parser(
        "convert", help="Excel設計書をMarkdown/JSON形式に変換"
    )
    convert_parser.add_argument("input", help="Excelファイルパスまたはディレクトリパス")
    convert_parser.add_argument("-o", "--output", default="output", help="出力先ディレクトリ")
    convert_parser.add_argument("--format", choices=["markdown", "json"], default="markdown", help="出力形式")

    # review サブコマンド
    review_parser = subparsers.add_parser(
        "review", help="設計書の自動レビュー・整合性チェック"
    )
    review_parser.add_argument("input", help="Excelファイルパスまたはディレクトリパス")
    review_parser.add_argument("-o", "--output", default="output", help="レビュー結果の出力先ディレクトリ")

    args = parser.parse_args()

    if args.command == "review":
        run_review(args)
    elif args.command == "convert":
        run_convert(args)
    else:
        # サブコマンドなしの場合は後方互換性のためconvert扱い
        # ただしargsにinputがないので再パース
        parser.print_help()
        sys.exit(0)


if __name__ == "__main__":
    main()
