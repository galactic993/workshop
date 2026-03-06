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
     * deleted_at (TIMESTAMP, nullable) → deleted_flag (CHAR(1), NOT NULL, default '0')
     * 既存データ: NULL → '0' (有効), NOT NULL → '1' (無効)
     */
    public function up(): void
    {
        // 1. 新しいカラムを追加
        Schema::table('section_cds', function (Blueprint $table) {
            $table->char('deleted_flag', 1)
                ->default('0')
                ->after('expense_category')
                ->comment('削除フラグ（0:有効, 1:無効）');
        });

        // 2. 既存データを移行
        DB::statement("UPDATE section_cds SET deleted_flag = CASE WHEN deleted_at IS NULL THEN '0' ELSE '1' END");

        // 3. NOT NULL制約を追加
        Schema::table('section_cds', function (Blueprint $table) {
            $table->char('deleted_flag', 1)
                ->nullable(false)
                ->default('0')
                ->comment('削除フラグ（0:有効, 1:無効）')
                ->change();
        });

        // 4. 古いカラムを削除
        Schema::table('section_cds', function (Blueprint $table) {
            $table->dropColumn('deleted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 1. deleted_at カラムを追加
        Schema::table('section_cds', function (Blueprint $table) {
            $table->timestamp('deleted_at', 0)
                ->nullable()
                ->after('expense_category')
                ->comment('削除日');
        });

        // 2. データを移行（deleted_flag = '1' の場合は現在日時を設定）
        DB::statement("UPDATE section_cds SET deleted_at = CASE WHEN deleted_flag = '1' THEN NOW() ELSE NULL END");

        // 3. deleted_flag カラムを削除
        Schema::table('section_cds', function (Blueprint $table) {
            $table->dropColumn('deleted_flag');
        });
    }
};
