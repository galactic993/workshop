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
     * prod_quot_operation_idを削除し、costカラムを追加
     */
    public function up(): void
    {
        Schema::table('quot_operations', function (Blueprint $table) {
            // 外部キー制約を削除
            $table->dropForeign(['prod_quot_operation_id']);

            // prod_quot_operation_idカラムを削除
            $table->dropColumn('prod_quot_operation_id');

            // costカラムを追加（一旦nullableで、operation_idの後に配置）
            $table->decimal('cost', 12, 0)->nullable()->after('operation_id');
        });

        // 既存データにデフォルト値を設定
        DB::statement('UPDATE quot_operations SET cost = 0 WHERE cost IS NULL');

        // NOT NULL制約を追加
        Schema::table('quot_operations', function (Blueprint $table) {
            $table->decimal('cost', 12, 0)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quot_operations', function (Blueprint $table) {
            // costカラムを削除
            $table->dropColumn('cost');

            // prod_quot_operation_idカラムを復元
            $table->unsignedBigInteger('prod_quot_operation_id')->after('quot_id');
            $table->foreign('prod_quot_operation_id')
                ->references('prod_quot_operation_id')
                ->on('prod_quot_operations')
                ->onDelete('cascade');
        });
    }
};
