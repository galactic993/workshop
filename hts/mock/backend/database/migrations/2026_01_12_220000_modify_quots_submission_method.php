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
     * 見積テーブルの変更:
     * 1. submission_method の値変更:
     *    - 00:メール → 10:メール
     *    - 10:郵送 → 20:郵送
     *    - 20:持参 → 30:持参
     *    - 00:未定（新規デフォルト）
     * 2. submission_method にデフォルト値 '00' を追加
     * 3. 以下を nullable 化:
     *    - prod_name
     *    - quot_subject
     *    - quot_summary
     *    - center_section_cd_id
     */
    public function up(): void
    {
        // 1. submission_method の値を移行（逆順で実行して衝突回避）
        DB::statement("UPDATE quots SET submission_method = '30' WHERE submission_method = '20'");
        DB::statement("UPDATE quots SET submission_method = '20' WHERE submission_method = '10'");
        DB::statement("UPDATE quots SET submission_method = '10' WHERE submission_method = '00'");

        // 2. submission_method のデフォルト値とコメントを変更
        Schema::table('quots', function (Blueprint $table) {
            $table->char('submission_method', 2)
                ->default('00')
                ->comment('提出方法（00:未定, 10:メール, 20:郵送, 30:持参）')
                ->change();
        });

        // 3. 4項目を nullable 化
        Schema::table('quots', function (Blueprint $table) {
            $table->string('prod_name', 50)->nullable()->change();
            $table->string('quot_subject', 50)->nullable()->change();
            $table->text('quot_summary')->nullable()->change();
            $table->bigInteger('center_section_cd_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 1. 4項目を NOT NULL に戻す
        Schema::table('quots', function (Blueprint $table) {
            $table->string('prod_name', 50)->nullable(false)->change();
            $table->string('quot_subject', 50)->nullable(false)->change();
            $table->text('quot_summary')->nullable(false)->change();
            $table->bigInteger('center_section_cd_id')->nullable(false)->change();
        });

        // 2. submission_method の値を元に戻す
        DB::statement("UPDATE quots SET submission_method = '00' WHERE submission_method = '10'");
        DB::statement("UPDATE quots SET submission_method = '10' WHERE submission_method = '20'");
        DB::statement("UPDATE quots SET submission_method = '20' WHERE submission_method = '30'");

        // 3. submission_method のデフォルトとコメントを元に戻す
        Schema::table('quots', function (Blueprint $table) {
            $table->char('submission_method', 2)
                ->default(null)
                ->comment('提出方法（00:メール, 10:郵送, 20:持参）')
                ->change();
        });
    }
};
