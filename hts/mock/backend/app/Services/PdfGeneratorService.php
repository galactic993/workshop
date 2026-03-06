<?php

namespace App\Services;

/**
 * PDF生成サービス
 *
 * シンプルなPDFを生成する
 * 外部ライブラリを使用せず、PDF仕様に準拠したバイナリを直接生成
 */
class PdfGeneratorService
{
    /**
     * プレースホルダーPDFを生成
     *
     * タイトルのみを含む最小限のPDFを生成する
     * 将来的に内容を追加する際は、このメソッドを拡張するか
     * 別のPDFライブラリ（DomPDFなど）に置き換える
     *
     * @param  string  $title  PDFに表示するタイトル
     * @return string PDFバイナリ
     */
    public function generatePlaceholderPdf(string $title): string
    {
        $objects = [];
        $objectOffsets = [];

        // オブジェクト1: カタログ
        $objects[1] = "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";

        // オブジェクト2: ページツリー
        $objects[2] = "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n";

        // オブジェクト3: ページ（A4サイズ）
        $objects[3] = "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n";

        // オブジェクト4: ページコンテンツ（空のページ）
        // 将来的に内容を追加する際はここにストリームを記述
        $stream = '';
        $objects[4] = "4 0 obj\n<< /Length ".strlen($stream)." >>\nstream\n".$stream."\nendstream\nendobj\n";

        // オブジェクト5: フォント（日本語対応のため埋め込みなしの標準フォント）
        // 注: 実際の日本語表示には適切なフォント埋め込みが必要
        // ここではプレースホルダーとしてHelveticaを使用
        $objects[5] = "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n";

        // PDFヘッダー
        $pdf = "%PDF-1.4\n";
        $pdf .= "%\xe2\xe3\xcf\xd3\n"; // バイナリマーカー

        // オブジェクトを追加
        foreach ($objects as $num => $obj) {
            $objectOffsets[$num] = strlen($pdf);
            $pdf .= $obj;
        }

        // クロスリファレンステーブル
        $xrefOffset = strlen($pdf);
        $pdf .= "xref\n";
        $pdf .= '0 '.(count($objects) + 1)."\n";
        $pdf .= "0000000000 65535 f \n";
        foreach ($objects as $num => $obj) {
            $pdf .= sprintf("%010d 00000 n \n", $objectOffsets[$num]);
        }

        // トレーラー
        $pdf .= "trailer\n";
        $pdf .= '<< /Size '.(count($objects) + 1)." /Root 1 0 R >>\n";
        $pdf .= "startxref\n";
        $pdf .= $xrefOffset."\n";
        $pdf .= '%%EOF';

        return $pdf;
    }

    /**
     * PDF文字列をエスケープ
     *
     * @param  string  $str  エスケープする文字列
     * @return string エスケープされた文字列
     */
    private function escapePdfString(string $str): string
    {
        // PDFの文字列リテラルでエスケープが必要な文字
        $str = str_replace('\\', '\\\\', $str);
        $str = str_replace('(', '\\(', $str);
        $str = str_replace(')', '\\)', $str);

        return $str;
    }
}
