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
     * - customer_name: VARCHAR(30) → VARCHAR(120)
     * - customer_name_kana: VARCHAR(50) → VARCHAR(120)
     * - payment_method → payment_type (カラム名変更)
     * - is_tax_rounded (BOOLEAN) → tax_rounded_type CHAR(1) (0:切り捨て, 1:四捨五入, default:1)
     * - is_fee_bearer (BOOLEAN) → fee_beare_type CHAR(1) (0:先方負担, 1:当方負担, default:0)
     * - credit_limit: VARCHAR(30) → DECIMAL(9,0)
     */
    public function up(): void
    {
        // データ型変更とカラム名変更
        Schema::table('customers', function (Blueprint $table) {
            // 得意先名: VARCHAR(30) → VARCHAR(120)
            $table->string('customer_name', 120)->change();

            // フリガナ: VARCHAR(50) → VARCHAR(120)
            $table->string('customer_name_kana', 120)->change();
        });

        // payment_method → payment_type (カラム名変更)
        Schema::table('customers', function (Blueprint $table) {
            $table->renameColumn('payment_method', 'payment_type');
        });

        // is_tax_rounded (BOOLEAN) → tax_rounded_type CHAR(1)
        // まず新しいカラムを追加し、データを移行してから古いカラムを削除
        Schema::table('customers', function (Blueprint $table) {
            $table->char('tax_rounded_type', 1)->default('1')->after('is_tax_rounded');
        });

        // データ移行: boolean → char(1)
        DB::statement("UPDATE customers SET tax_rounded_type = CASE WHEN is_tax_rounded = true THEN '1' ELSE '0' END");

        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn('is_tax_rounded');
        });

        // is_fee_bearer (BOOLEAN) → fee_beare_type CHAR(1)
        Schema::table('customers', function (Blueprint $table) {
            $table->char('fee_beare_type', 1)->default('0')->after('tax_rounded_type');
        });

        // データ移行: boolean → char(1)
        DB::statement("UPDATE customers SET fee_beare_type = CASE WHEN is_fee_bearer = true THEN '1' ELSE '0' END");

        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn('is_fee_bearer');
        });

        // credit_limit: VARCHAR(30) → DECIMAL(9,0)
        // PostgreSQLでは直接変換が必要
        DB::statement('ALTER TABLE customers ALTER COLUMN credit_limit TYPE DECIMAL(9,0) USING credit_limit::DECIMAL(9,0)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // credit_limit: DECIMAL(9,0) → VARCHAR(30)
        DB::statement('ALTER TABLE customers ALTER COLUMN credit_limit TYPE VARCHAR(30) USING credit_limit::VARCHAR(30)');

        // fee_beare_type → is_fee_bearer
        Schema::table('customers', function (Blueprint $table) {
            $table->boolean('is_fee_bearer')->default(false)->after('fee_beare_type');
        });

        DB::statement("UPDATE customers SET is_fee_bearer = CASE WHEN fee_beare_type = '1' THEN true ELSE false END");

        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn('fee_beare_type');
        });

        // tax_rounded_type → is_tax_rounded
        Schema::table('customers', function (Blueprint $table) {
            $table->boolean('is_tax_rounded')->default(true)->after('payment_type');
        });

        DB::statement("UPDATE customers SET is_tax_rounded = CASE WHEN tax_rounded_type = '1' THEN true ELSE false END");

        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn('tax_rounded_type');
        });

        // payment_type → payment_method
        Schema::table('customers', function (Blueprint $table) {
            $table->renameColumn('payment_type', 'payment_method');
        });

        // フリガナ: VARCHAR(120) → VARCHAR(50)
        Schema::table('customers', function (Blueprint $table) {
            $table->string('customer_name_kana', 50)->change();
        });

        // 得意先名: VARCHAR(120) → VARCHAR(30)
        Schema::table('customers', function (Blueprint $table) {
            $table->string('customer_name', 30)->change();
        });
    }
};
