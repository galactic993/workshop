"""
テーブル定義書の内部チェック機能

レビュー項目:
- C1: FK参照先の存在確認（重要度: 高）
- C2: PK定義の確認（重要度: 中）
- C3: NOT NULL + デフォルト値の整合性（重要度: 低）
"""

import re
from typing import Dict, List, Any


def review_table_definitions(table_data: dict) -> list:
    """
    単一テーブル定義書の内部チェック（C2、C3）

    Args:
        table_data: parse_table_definitions()の結果

    Returns:
        [{"check": "C1"|"C2"|"C3", "severity": "error"|"warning"|"info", "message": str, "details": list}]
    """
    results = []

    # C2: PK定義の確認
    for table_name, table_info in table_data.get("tables", {}).items():
        has_pk = any(col["pk"] for col in table_info["columns"])
        if not has_pk:
            results.append({
                "check": "C2",
                "severity": "warning",
                "message": f"PKが定義されていません: {table_info['logical_name']} ({table_name})",
                "details": []
            })

    # C3: NOT NULL + デフォルト値の整合性
    for table_name, table_info in table_data.get("tables", {}).items():
        for col in table_info["columns"]:
            if col["pk"] or col["fk"]:
                continue

            if col["not_null"] and not col["default"]:
                results.append({
                    "check": "C3",
                    "severity": "info",
                    "message": f"NOT NULL設定があるがデフォルト値なし: {table_info['logical_name']}.{col['logical_name']}",
                    "details": [
                        f"テーブル: {table_name}",
                        f"カラム: {col['physical_name']}",
                        f"型: {col['data_type']}"
                    ]
                })

    return results


def review_cross_table_fk(table_data_list: list) -> list:
    """
    複数テーブル定義書を横断したFK参照チェック（C1）

    Args:
        table_data_list: [parse_table_definitions()の結果, ...]

    Returns:
        [{"check": "C1", "severity": "error", "message": str, "details": list}]
    """
    results = []

    all_tables = {}
    for table_data in table_data_list:
        for table_name, table_info in table_data.get("tables", {}).items():
            all_tables[table_name] = table_info
            if table_info["logical_name"]:
                all_tables[table_info["logical_name"]] = table_info

    for table_data in table_data_list:
        for table_name, table_info in table_data.get("tables", {}).items():
            for col in table_info["columns"]:
                if not col["fk"]:
                    continue

                fk_refs = _extract_fk_references(col["remarks"])

                for ref_table, ref_column in fk_refs:
                    ref_table_info = all_tables.get(ref_table)
                    if not ref_table_info:
                        results.append({
                            "check": "C1",
                            "severity": "error",
                            "message": f"FK参照先テーブルが見つかりません: {table_info['logical_name']}.{col['logical_name']} → {ref_table}",
                            "details": [
                                f"参照元テーブル: {table_name}",
                                f"参照元カラム: {col['physical_name']}",
                                f"参照先テーブル: {ref_table}",
                                f"備考: {col['remarks']}"
                            ]
                        })
                        continue

                    ref_col_exists = any(c["physical_name"] == ref_column for c in ref_table_info["columns"])
                    if not ref_col_exists:
                        results.append({
                            "check": "C1",
                            "severity": "error",
                            "message": f"FK参照先カラムが見つかりません: {table_info['logical_name']}.{col['logical_name']} → {ref_table}.{ref_column}",
                            "details": [
                                f"参照元テーブル: {table_name}",
                                f"参照元カラム: {col['physical_name']}",
                                f"参照先テーブル: {ref_table}",
                                f"参照先カラム: {ref_column}",
                                f"備考: {col['remarks']}"
                            ]
                        })

    return results


def _extract_fk_references(remarks: str) -> List[tuple]:
    """備考欄からFK参照情報を抽出"""
    if not remarks:
        return []

    pattern = r'([a-zA-Z_][a-zA-Z0-9_]*|[ぁ-んァ-ヶー一-龠々]+)\.([a-zA-Z_][a-zA-Z0-9_]*)'
    matches = re.findall(pattern, remarks)

    return [(table, column) for table, column in matches]


def format_table_review_report(results: list, filename: str = "") -> str:
    """レビュー結果をMarkdown形式でフォーマット"""
    lines = []

    if filename:
        lines.append(f"# テーブル定義書レビュー結果: {filename}\n")
    else:
        lines.append("# テーブル定義書レビュー結果\n")

    if not results:
        lines.append("問題は検出されませんでした。\n")
        return "\n".join(lines)

    errors = [r for r in results if r["severity"] == "error"]
    warnings = [r for r in results if r["severity"] == "warning"]
    infos = [r for r in results if r["severity"] == "info"]

    lines.append("## サマリー\n")
    lines.append(f"- エラー: {len(errors)}件")
    lines.append(f"- 警告: {len(warnings)}件")
    lines.append(f"- 情報: {len(infos)}件")
    lines.append("")

    if errors:
        lines.append("## エラー\n")
        for idx, err in enumerate(errors, 1):
            lines.append(f"### {idx}. [{err['check']}] {err['message']}\n")
            if err["details"]:
                for detail in err["details"]:
                    lines.append(f"  - {detail}")
            lines.append("")

    if warnings:
        lines.append("## 警告\n")
        for idx, warn in enumerate(warnings, 1):
            lines.append(f"### {idx}. [{warn['check']}] {warn['message']}\n")
            if warn["details"]:
                for detail in warn["details"]:
                    lines.append(f"  - {detail}")
            lines.append("")

    if infos:
        lines.append("## 情報\n")
        for idx, info in enumerate(infos, 1):
            lines.append(f"### {idx}. [{info['check']}] {info['message']}\n")
            if info["details"]:
                for detail in info["details"]:
                    lines.append(f"  - {detail}")
            lines.append("")

    return "\n".join(lines)
