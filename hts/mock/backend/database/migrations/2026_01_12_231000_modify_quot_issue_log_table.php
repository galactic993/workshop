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
        // 既存のNULL値をissued_atで埋める
        DB::statement('UPDATE quot_issue_log SET created_at = issued_at WHERE created_at IS NULL');

        Schema::table('quot_issue_log', function (Blueprint $table) {
            // created_at を NOT NULL + DEFAULT に変更
            $table->timestamp('created_at', 0)->nullable(false)->useCurrent()->change();

            // updated_at カラム削除
            $table->dropColumn('updated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quot_issue_log', function (Blueprint $table) {
            // updated_at カラム復元
            $table->timestamp('updated_at', 0)->nullable();

            // created_at を nullable に戻す
            $table->timestamp('created_at', 0)->nullable()->change();
        });
    }
};
