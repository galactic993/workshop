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
     * 得意先マスタのカラム変更:
     * - phone_number: NOT NULL → nullable
     * - is_discount (BOOLEAN) → discount_flag (CHAR(1), nullable, default null)
     * - deleted_at (TIMESTAMP) → deleted_flag (CHAR(1), NOT NULL, default '0')
     */
    public function up(): void
    {
        // 1. phone_number: NOT NULL → nullable
        Schema::table('customers', function (Blueprint $table) {
            $table->string('phone_number', 15)->nullable()->change();
        });

        // 2. is_discount → discount_flag
        Schema::table('customers', function (Blueprint $table) {
            $table->char('discount_flag', 1)
                ->nullable()
                ->after('is_discount')
                ->comment('値引有無フラグ（null:無, 1:有）');
        });

        // データ移行: boolean → char(1)
        DB::statement("UPDATE customers SET discount_flag = CASE WHEN is_discount = true THEN '1' ELSE NULL END");

        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn('is_discount');
        });

        // 3. deleted_at → deleted_flag
        Schema::table('customers', function (Blueprint $table) {
            $table->char('deleted_flag', 1)
                ->default('0')
                ->after('discount_flag')
                ->comment('削除フラグ（0:有効, 1:無効）');
        });

        // データ移行
        DB::statement("UPDATE customers SET deleted_flag = CASE WHEN deleted_at IS NULL THEN '0' ELSE '1' END");

        // NOT NULL制約を追加
        Schema::table('customers', function (Blueprint $table) {
            $table->char('deleted_flag', 1)
                ->nullable(false)
                ->default('0')
                ->comment('削除フラグ（0:有効, 1:無効）')
                ->change();
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn('deleted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 1. deleted_flag → deleted_at
        Schema::table('customers', function (Blueprint $table) {
            $table->timestamp('deleted_at', 0)
                ->nullable()
                ->after('discount_flag')
                ->comment('削除日');
        });

        DB::statement("UPDATE customers SET deleted_at = CASE WHEN deleted_flag = '1' THEN NOW() ELSE NULL END");

        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn('deleted_flag');
        });

        // 2. discount_flag → is_discount
        Schema::table('customers', function (Blueprint $table) {
            $table->boolean('is_discount')
                ->default(false)
                ->after('order_limit')
                ->comment('値引有無（0:無, 1:有）');
        });

        DB::statement("UPDATE customers SET is_discount = CASE WHEN discount_flag = '1' THEN true ELSE false END");

        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn('discount_flag');
        });

        // 3. phone_number: nullable → NOT NULL
        Schema::table('customers', function (Blueprint $table) {
            $table->string('phone_number', 15)->nullable(false)->change();
        });
    }
};
