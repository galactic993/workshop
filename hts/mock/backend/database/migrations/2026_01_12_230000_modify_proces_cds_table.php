<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('proces_cds', function (Blueprint $table) {
            // 1. proces_cost のデータ型変更（DECIMAL(12,0) → DECIMAL(10,2)）
            $table->decimal('proces_cost', 10, 2)->change();

            // 2. proces_unit カラム追加（単位）
            $table->string('proces_unit', 10)->nullable()->after('proces_cost');

            // 3. deleted_flag カラム追加
            $table->char('deleted_flag', 1)->default('0')->after('proces_unit');
        });

        // 4. deleted_at の値を deleted_flag に移行
        DB::statement("UPDATE proces_cds SET deleted_flag = '1' WHERE deleted_at IS NOT NULL");

        Schema::table('proces_cds', function (Blueprint $table) {
            // 5. deleted_at カラム削除
            $table->dropColumn('deleted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('proces_cds', function (Blueprint $table) {
            // deleted_at カラム復元
            $table->timestamp('deleted_at')->nullable()->after('proces_unit');
        });

        // deleted_flag の値を deleted_at に移行
        DB::statement("UPDATE proces_cds SET deleted_at = NOW() WHERE deleted_flag = '1'");

        Schema::table('proces_cds', function (Blueprint $table) {
            // deleted_flag カラム削除
            $table->dropColumn('deleted_flag');

            // proces_unit カラム削除
            $table->dropColumn('proces_unit');

            // proces_cost のデータ型を元に戻す
            $table->decimal('proces_cost', 12, 0)->change();
        });
    }
};
