#!/usr/bin/env python3
"""
画面設計書レビューツールの使用例
"""

from screen_design_parser import parse_screen_design
from table_def_parser import parse_table_definitions
from reviewer import review_screen_design, review_cross_reference, format_review_report


def main():
    # 1. 画面設計書をパース
    print("画面設計書をパース中...")
    screen_data = parse_screen_design(
        '../../design-sample/02-02_2_編-制作見積-制作見積書作成トップ_画面設計書_1007.xlsx'
    )

    # 2. テーブル定義書をパース
    print("テーブル定義書をパース中...")
    table_data_list = [
        parse_table_definitions('../../design-sample/共-テーブル定義書_1013.xlsx'),
        parse_table_definitions('../../design-sample/売-テーブル定義書_1022.xlsx'),
        parse_table_definitions('../../design-sample/編-テーブル定義書_1012.xlsx'),
    ]

    # 3. 画面設計書の内部整合性チェック（A1-A7）
    print("画面設計書の内部整合性をチェック中...")
    results = review_screen_design(screen_data)

    # 4. 画面設計書×テーブル定義書のクロスチェック（B1-B2）
    print("クロスリファレンスチェック中...")
    results += review_cross_reference(screen_data, table_data_list)

    # 5. レビュー結果をMarkdown形式で出力
    report = format_review_report(results, filename='制作見積書作成トップ画面')
    print("\n" + "=" * 60)
    print(report)
    print("=" * 60)

    # 6. 統計情報
    error_count = sum(1 for r in results if r['severity'] == 'error')
    warning_count = sum(1 for r in results if r['severity'] == 'warning')
    info_count = sum(1 for r in results if r['severity'] == 'info')

    print(f"\n✅ レビュー完了")
    print(f"   エラー: {error_count}件")
    print(f"   警告: {warning_count}件")
    print(f"   情報: {info_count}件")

    # 7. ファイルに保存（オプション）
    with open('review_report.md', 'w', encoding='utf-8') as f:
        f.write(report)
    print(f"\nレポートを review_report.md に保存しました")


if __name__ == "__main__":
    main()
