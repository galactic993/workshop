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
     * 1. base_quot_id（流用元見積id）を追加
     * 2. quot_number の桁数を CHAR(8) → CHAR(11) に変更
     * 3. prod_quot_status（制作見積ステータス）を追加
     * 4. 既存データの quot_status を新しい値にマッピング
     *
     * ステータスマッピング:
     * 旧 quot_status → 新 quot_status, prod_quot_status
     * - 00:登録済 → 00:作成中, 00:制作見積依頼前
     * - 10:制作見積依頼済 → 00:作成中, 10:制作見積依頼済
     * - 20:制作見積中 → 00:作成中, 10:制作見積依頼済
     * - 30:制作見積済 → 00:作成中, 20:制作見積済
     * - 40:承認待ち → 10:承認待ち, 30:制作見積受取済
     * - 50:承認済 → 20:承認済, 30:制作見積受取済
     * - 60:発行済 → 30:発行済, 30:制作見積受取済
     */
    public function up(): void
    {
        // 1. base_quot_id（流用元見積id）を追加
        Schema::table('quots', function (Blueprint $table) {
            $table->bigInteger('base_quot_id')->nullable()->after('employee_id');
            $table->foreign('base_quot_id')
                ->references('quot_id')
                ->on('quots')
                ->onDelete('restrict')
                ->onUpdate('restrict');
        });

        // 2. quot_number の桁数を CHAR(8) → CHAR(11) に変更
        Schema::table('quots', function (Blueprint $table) {
            $table->char('quot_number', 11)->change();
        });

        // 3. prod_quot_status（制作見積ステータス）を追加（一旦nullableで追加）
        Schema::table('quots', function (Blueprint $table) {
            $table->char('prod_quot_status', 2)->nullable()->after('quot_status');
        });

        // 4. 既存データのステータスマッピング
        // prod_quot_status を設定
        DB::statement("UPDATE quots SET prod_quot_status = '00' WHERE quot_status = '00'");  // 登録済 → 制作見積依頼前
        DB::statement("UPDATE quots SET prod_quot_status = '10' WHERE quot_status = '10'");  // 制作見積依頼済 → 制作見積依頼済
        DB::statement("UPDATE quots SET prod_quot_status = '10' WHERE quot_status = '20'");  // 制作見積中 → 制作見積依頼済
        DB::statement("UPDATE quots SET prod_quot_status = '20' WHERE quot_status = '30'");  // 制作見積済 → 制作見積済
        DB::statement("UPDATE quots SET prod_quot_status = '30' WHERE quot_status IN ('40', '50', '60')");  // 承認待ち以降 → 制作見積受取済

        // quot_status を新しい値にマッピング
        DB::statement("UPDATE quots SET quot_status = '30' WHERE quot_status = '60'");  // 発行済 60 → 30
        DB::statement("UPDATE quots SET quot_status = '20' WHERE quot_status = '50'");  // 承認済 50 → 20
        DB::statement("UPDATE quots SET quot_status = '10' WHERE quot_status = '40'");  // 承認待ち 40 → 10
        DB::statement("UPDATE quots SET quot_status = '00' WHERE quot_status IN ('10', '20', '30')");  // 制作見積系 → 作成中

        // 5. prod_quot_status にデフォルト値とNOT NULL制約を設定
        Schema::table('quots', function (Blueprint $table) {
            $table->char('prod_quot_status', 2)
                ->default('00')
                ->comment('制作見積ステータス（00:制作見積依頼前, 10:制作見積依頼済, 20:制作見積済, 30:制作見積受取済）')
                ->change();
        });

        // 6. quot_status のコメントを更新
        Schema::table('quots', function (Blueprint $table) {
            $table->char('quot_status', 2)
                ->default('00')
                ->comment('見積ステータス（00:作成中, 10:承認待ち, 20:承認済, 30:発行済）')
                ->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 1. quot_status を元の値に戻す
        DB::statement("UPDATE quots SET quot_status = '60' WHERE quot_status = '30'");  // 発行済 30 → 60
        DB::statement("UPDATE quots SET quot_status = '50' WHERE quot_status = '20'");  // 承認済 20 → 50
        DB::statement("UPDATE quots SET quot_status = '40' WHERE quot_status = '10'");  // 承認待ち 10 → 40

        // prod_quot_status から旧ステータスを復元
        DB::statement("UPDATE quots SET quot_status = '30' WHERE quot_status = '00' AND prod_quot_status = '20'");  // 制作見積済
        DB::statement("UPDATE quots SET quot_status = '20' WHERE quot_status = '00' AND prod_quot_status = '10'");  // 制作見積依頼済/中
        DB::statement("UPDATE quots SET quot_status = '10' WHERE quot_status = '00' AND prod_quot_status = '10'");  // 注: 制作見積中は区別不可
        // quot_status = '00' かつ prod_quot_status = '00' はそのまま（登録済）

        // 2. prod_quot_status を削除
        Schema::table('quots', function (Blueprint $table) {
            $table->dropColumn('prod_quot_status');
        });

        // 3. quot_number の桁数を CHAR(11) → CHAR(8) に戻す
        Schema::table('quots', function (Blueprint $table) {
            $table->char('quot_number', 8)->change();
        });

        // 4. base_quot_id を削除
        Schema::table('quots', function (Blueprint $table) {
            $table->dropForeign(['base_quot_id']);
            $table->dropColumn('base_quot_id');
        });

        // 5. quot_status のコメントを元に戻す
        Schema::table('quots', function (Blueprint $table) {
            $table->char('quot_status', 2)
                ->default('00')
                ->comment('ステータス（00:登録済, 10:制作見積依頼済, 20:制作見積中, 30:制作見積済, 40:承認待ち, 50:承認済, 60:発行済）')
                ->change();
        });
    }
};
