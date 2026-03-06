"""
画面設計書レビューツール

画面設計書の内部整合性チェック、および
画面設計書とテーブル定義書のクロスリファレンスチェックを行う。
"""

import re
from typing import Dict, List, Any, Set


def review_screen_design(screen_data: dict) -> list:
    """
    画面設計書の内部整合性チェック（A1-A7）

    Args:
        screen_data: parse_screen_design()の戻り値

    Returns:
        レビュー結果のリスト
        [{"check": "A1", "severity": "error"|"warning"|"info", "message": str, "details": list}]
    """
    results = []

    # A1: イベント番号の連番性
    results.extend(_check_event_numbering(screen_data.get("events", [])))

    # A2: イベント番号のクロスシート対応
    results.extend(_check_event_cross_reference(
        screen_data.get("events", []),
        screen_data.get("items", [])
    ))

    # A3: 種別とイベントの矛盾
    results.extend(_check_type_event_consistency(screen_data.get("items", [])))

    # A4: 種別とバリデーションの矛盾
    results.extend(_check_type_validation_consistency(screen_data.get("items", [])))

    # A5: メッセージの存在確認
    results.extend(_check_message_existence(
        screen_data.get("items", []),
        screen_data.get("messages", [])
    ))

    # A6: 項目番号の連番性
    results.extend(_check_item_numbering(screen_data.get("items", [])))

    # A7: メッセージ番号の連番性
    results.extend(_check_message_numbering(screen_data.get("messages", [])))

    return results


def review_cross_reference(screen_data: dict, table_data_list: list) -> list:
    """
    画面設計書×テーブル定義書のクロスチェック（B1-B2）

    Args:
        screen_data: parse_screen_design()の戻り値
        table_data_list: [parse_table_definitions()の結果, ...]

    Returns:
        レビュー結果のリスト
        [{"check": "B1", "severity": "error"|"warning", "message": str, "details": list}]
    """
    results = []

    # 全テーブルのカラム物理名リストを構築
    all_columns = _build_column_list(table_data_list)

    # B1: DB登録値のフィールド存在確認
    results.extend(_check_db_field_existence(
        screen_data.get("db_values", []),
        all_columns
    ))

    # B2: 参照仕様のテーブル/カラム存在確認
    results.extend(_check_reference_spec(
        screen_data.get("db_values", []),
        table_data_list
    ))

    return results


def format_review_report(results: list, filename: str = "") -> str:
    """
    レビュー結果をMarkdown形式でフォーマット

    Args:
        results: review_screen_design()やreview_cross_reference()の戻り値
        filename: 対象ファイル名（オプション）

    Returns:
        Markdown形式のレポート文字列
    """
    lines = []

    # タイトル
    title = f"# レビュー結果: {filename}" if filename else "# レビュー結果"
    lines.append(title)
    lines.append("")

    # サマリー
    error_count = sum(1 for r in results if r["severity"] == "error")
    warning_count = sum(1 for r in results if r["severity"] == "warning")
    info_count = sum(1 for r in results if r["severity"] == "info")

    lines.append("## サマリー")
    lines.append("")
    lines.append(f"- エラー: {error_count}件")
    lines.append(f"- 警告: {warning_count}件")
    lines.append(f"- 情報: {info_count}件")
    lines.append("")

    # 重要度別にソート
    severity_order = {"error": 0, "warning": 1, "info": 2}
    sorted_results = sorted(results, key=lambda x: severity_order.get(x["severity"], 3))

    # 詳細
    lines.append("## 詳細")
    lines.append("")

    for result in sorted_results:
        severity_icon = {
            "error": "❌",
            "warning": "⚠️",
            "info": "ℹ️"
        }.get(result["severity"], "")

        lines.append(f"### {severity_icon} [{result['check']}] {result['message']}")
        lines.append("")

        if result.get("details"):
            for detail in result["details"]:
                lines.append(f"- {detail}")
            lines.append("")

    return "\n".join(lines)


# ==================== 内部チェック関数 ====================

def _check_event_numbering(events: List[Dict[str, str]]) -> list:
    """A1: イベント番号の連番性チェック"""
    if not events:
        return []

    results = []
    event_numbers = []

    for event in events:
        event_no = event.get("event_no", "")
        # EVENT0001形式から数値を抽出
        match = re.match(r"EVENT(\d+)", event_no)
        if match:
            event_numbers.append(int(match.group(1)))

    if not event_numbers:
        return results

    event_numbers.sort()
    missing = []

    for i in range(len(event_numbers) - 1):
        current = event_numbers[i]
        next_num = event_numbers[i + 1]

        if next_num - current > 1:
            # 抜け番を検出
            for missing_num in range(current + 1, next_num):
                missing.append(f"EVENT{missing_num:04d}")

    if missing:
        results.append({
            "check": "A1",
            "severity": "warning",
            "message": "イベント番号に抜け番があります",
            "details": [f"抜けているイベント番号: {', '.join(missing)}"]
        })
    else:
        results.append({
            "check": "A1",
            "severity": "info",
            "message": "イベント番号は連番です",
            "details": []
        })

    return results


def _check_event_cross_reference(events: List[Dict[str, str]], items: List[Dict[str, str]]) -> list:
    """A2: イベント番号のクロスシート対応チェック"""
    results = []

    event_nos = {e.get("event_no", "") for e in events if e.get("event_no")}
    item_event_nos = {i.get("event_no", "") for i in items if i.get("event_no")}

    # 項目記述書にあるがイベント記述書にないEVENT No.を検出
    missing_in_events = item_event_nos - event_nos

    if missing_in_events:
        results.append({
            "check": "A2",
            "severity": "error",
            "message": "項目記述書に記載されているが、イベント記述書に存在しないイベント番号があります",
            "details": [f"未定義のイベント番号: {', '.join(sorted(missing_in_events))}"]
        })
    else:
        results.append({
            "check": "A2",
            "severity": "info",
            "message": "項目記述書のイベント番号は全てイベント記述書に定義されています",
            "details": []
        })

    return results


def _check_type_event_consistency(items: List[Dict[str, str]]) -> list:
    """A3: 種別とイベントの矛盾チェック"""
    results = []

    # イベントが必須の種別
    event_required_types = {"ボタン", "リンク", "プルダウン", "ラジオボタン"}

    inconsistent_items = []

    for item in items:
        item_type = item.get("type", "")
        event_no = item.get("event_no", "")

        if item_type in event_required_types and not event_no:
            inconsistent_items.append(
                f"No.{item.get('no', '?')} - {item.get('name', '(名称なし)')} (種別: {item_type})"
            )

    if inconsistent_items:
        results.append({
            "check": "A3",
            "severity": "error",
            "message": "ボタン/リンク/プルダウン/ラジオボタンにイベント番号が設定されていません",
            "details": inconsistent_items
        })
    else:
        results.append({
            "check": "A3",
            "severity": "info",
            "message": "種別とイベント番号の対応は正常です",
            "details": []
        })

    return results


def _check_type_validation_consistency(items: List[Dict[str, str]]) -> list:
    """A4: 種別とバリデーションの矛盾チェック"""
    results = []

    text_with_control = []
    text_input_without_control = []

    for item in items:
        item_type = item.get("type", "")
        control_type = item.get("control_type", "")
        control_detail = item.get("control_detail", "")
        message = item.get("message", "")

        # 種別が「テキスト」（表示のみ）の場合、制御内容やメッセージがあるのは異常
        if item_type == "テキスト" and (control_type or control_detail or message):
            text_with_control.append(
                f"No.{item.get('no', '?')} - {item.get('name', '(名称なし)')}"
            )

        # 種別が「テキストインプット」の場合、制御内容が全くないのは警告
        if item_type == "テキストインプット" and not (control_type or control_detail or message):
            text_input_without_control.append(
                f"No.{item.get('no', '?')} - {item.get('name', '(名称なし)')}"
            )

    if text_with_control:
        results.append({
            "check": "A4",
            "severity": "error",
            "message": "表示専用の「テキスト」に制御内容・メッセージが設定されています",
            "details": text_with_control
        })

    if text_input_without_control:
        results.append({
            "check": "A4",
            "severity": "warning",
            "message": "「テキストインプット」に制御内容・メッセージが全く設定されていません",
            "details": text_input_without_control
        })

    if not text_with_control and not text_input_without_control:
        results.append({
            "check": "A4",
            "severity": "info",
            "message": "種別とバリデーションの対応は正常です",
            "details": []
        })

    return results


def _check_message_existence(items: List[Dict[str, str]], messages: List[Dict[str, str]]) -> list:
    """A5: メッセージの存在確認"""
    results = []

    # メッセージ一覧から全メッセージテキストを取得
    message_texts = {m.get("message", "") for m in messages if m.get("message")}

    # 項目記述書のメッセージを確認
    missing_messages = []

    for item in items:
        item_message = item.get("message", "")
        if item_message and item_message not in message_texts:
            missing_messages.append(
                f"No.{item.get('no', '?')} - {item.get('name', '(名称なし)')}: 「{item_message}」"
            )

    if missing_messages:
        results.append({
            "check": "A5",
            "severity": "error",
            "message": "項目記述書に記載されているが、メッセージ一覧に存在しないメッセージがあります",
            "details": missing_messages
        })
    else:
        results.append({
            "check": "A5",
            "severity": "info",
            "message": "項目記述書のメッセージは全てメッセージ一覧に存在します",
            "details": []
        })

    return results


def _check_item_numbering(items: List[Dict[str, str]]) -> list:
    """A6: 項目番号の連番性チェック"""
    if not items:
        return []

    results = []
    item_numbers = []

    for item in items:
        no = item.get("no", "")
        try:
            item_numbers.append(int(no))
        except (ValueError, TypeError):
            pass

    if not item_numbers:
        return results

    item_numbers.sort()
    missing = []

    for i in range(len(item_numbers) - 1):
        current = item_numbers[i]
        next_num = item_numbers[i + 1]

        if next_num - current > 1:
            # 抜け番を検出
            for missing_num in range(current + 1, next_num):
                missing.append(str(missing_num))

    if missing:
        results.append({
            "check": "A6",
            "severity": "warning",
            "message": "項目番号に抜け番があります",
            "details": [f"抜けている項目番号: {', '.join(missing)}"]
        })
    else:
        results.append({
            "check": "A6",
            "severity": "info",
            "message": "項目番号は連番です",
            "details": []
        })

    return results


def _check_message_numbering(messages: List[Dict[str, str]]) -> list:
    """A7: メッセージ番号の連番性チェック"""
    if not messages:
        return []

    results = []
    message_numbers = []

    for message in messages:
        no = message.get("no", "")
        try:
            message_numbers.append(int(no))
        except (ValueError, TypeError):
            pass

    if not message_numbers:
        return results

    message_numbers.sort()
    missing = []

    for i in range(len(message_numbers) - 1):
        current = message_numbers[i]
        next_num = message_numbers[i + 1]

        if next_num - current > 1:
            # 抜け番を検出
            for missing_num in range(current + 1, next_num):
                missing.append(str(missing_num))

    if missing:
        results.append({
            "check": "A7",
            "severity": "warning",
            "message": "メッセージ番号に抜け番があります",
            "details": [f"抜けているメッセージ番号: {', '.join(missing)}"]
        })
    else:
        results.append({
            "check": "A7",
            "severity": "info",
            "message": "メッセージ番号は連番です",
            "details": []
        })

    return results


def _build_column_list(table_data_list: List[Dict[str, Any]]) -> Dict[str, Set[str]]:
    """
    全テーブルのカラム物理名リストを構築

    Returns:
        {テーブル物理名: {カラム物理名のセット}, ...}
    """
    all_columns = {}

    for table_data in table_data_list:
        tables = table_data.get("tables", {})
        for table_name, table_info in tables.items():
            columns = table_info.get("columns", [])
            column_names = {col.get("physical_name", "") for col in columns if col.get("physical_name")}
            all_columns[table_name] = column_names

    return all_columns


def _check_db_field_existence(db_values: List[Dict[str, str]], all_columns: Dict[str, Set[str]]) -> list:
    """B1: DB登録値のフィールド存在確認"""
    results = []

    # 全カラム物理名のフラットなセット
    all_column_names = set()
    for columns in all_columns.values():
        all_column_names.update(columns)

    missing_fields = []

    for db_val in db_values:
        field_name = db_val.get("field_name", "")

        # ヘッダー行をスキップ（field_nameが「フィールド名」そのものの場合）
        if field_name in {"フィールド名", "項目名", "No.", "No"}:
            continue

        if field_name and field_name not in all_column_names:
            missing_fields.append(
                f"No.{db_val.get('no', '?')} - {db_val.get('name', '(名称なし)')}: フィールド名「{field_name}」"
            )

    if missing_fields:
        results.append({
            "check": "B1",
            "severity": "error",
            "message": "DB登録値に記載されているが、テーブル定義書に存在しないフィールド名があります",
            "details": missing_fields
        })
    else:
        results.append({
            "check": "B1",
            "severity": "info",
            "message": "DB登録値のフィールド名は全てテーブル定義書に存在します",
            "details": []
        })

    return results


def _check_reference_spec(db_values: List[Dict[str, str]], table_data_list: List[Dict[str, Any]]) -> list:
    """B2: 参照仕様のテーブル/カラム存在確認"""
    results = []

    # 全テーブル名と全カラム名のセット
    all_tables = set()
    table_columns = {}

    for table_data in table_data_list:
        tables = table_data.get("tables", {})
        for table_name, table_info in tables.items():
            all_tables.add(table_name)
            columns = table_info.get("columns", [])
            column_names = {col.get("physical_name", "") for col in columns if col.get("physical_name")}
            table_columns[table_name] = column_names

    # テーブル名.カラム名パターンを抽出
    # 例: "t_users.user_id" のようなパターン
    table_col_pattern = re.compile(r'([a-zA-Z_][a-zA-Z0-9_]*)\.([a-zA-Z_][a-zA-Z0-9_]*)')

    missing_references = []

    for db_val in db_values:
        value_text = db_val.get("value", "")
        condition_text = db_val.get("condition", "")

        # 登録値と条件の両方から参照を抽出
        for text in [value_text, condition_text]:
            if not text:
                continue

            matches = table_col_pattern.findall(text)
            for table_name, col_name in matches:
                # テーブル存在確認
                if table_name not in all_tables:
                    missing_references.append(
                        f"No.{db_val.get('no', '?')} - テーブル「{table_name}」が存在しません (参照: {table_name}.{col_name})"
                    )
                # カラム存在確認
                elif col_name not in table_columns.get(table_name, set()):
                    missing_references.append(
                        f"No.{db_val.get('no', '?')} - テーブル「{table_name}」にカラム「{col_name}」が存在しません"
                    )

    if missing_references:
        results.append({
            "check": "B2",
            "severity": "warning",
            "message": "参照仕様に記載されているテーブル/カラムが存在しない可能性があります",
            "details": missing_references
        })
    else:
        results.append({
            "check": "B2",
            "severity": "info",
            "message": "参照仕様のテーブル/カラムは正常です（検出されたパターンは全て存在します）",
            "details": []
        })

    return results
