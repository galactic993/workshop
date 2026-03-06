<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * 見積書No（quot_number）の桁数を CHAR(11) → CHAR(12) に変更
     * 既存データの連番を2桁→3桁にパディング（'01' → '001'）
     *
     * 変更前: CCCCCYYMM99 (11桁) 例: 47904260101
     * 変更後: CCCCCYYMM999 (12桁) 例: 479042601001
     */
    public function up(): void
    {
        // 1. まずquot_number カラムを CHAR(11) → CHAR(12) に変更
        Schema::table('quots', function (Blueprint $table) {
            $table->char('quot_number', 12)->change();
        });

        // 2. 既存データの連番を2桁→3桁にパディング
        // quot_number の末尾2桁（連番部分）を3桁にする
        // 例: 47904260101 → 479042601001
        DB::statement("
            UPDATE quots
            SET quot_number = CONCAT(
                SUBSTRING(quot_number, 1, 9),
                LPAD(SUBSTRING(quot_number, 10, 2), 3, '0')
            )
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // quot_number カラムを CHAR(12) → CHAR(11) に戻す
        Schema::table('quots', function (Blueprint $table) {
            $table->char('quot_number', 11)->change();
        });

        // データを12桁→11桁に戻す（末尾3桁を2桁に）
        // 例: 479042601001 → 47904260101
        DB::statement("
            UPDATE quots
            SET quot_number = CONCAT(
                SUBSTRING(quot_number, 1, 9),
                LPAD(CAST(SUBSTRING(quot_number, 10, 3) AS INTEGER)::TEXT, 2, '0')
            )
        ");
    }
};
