<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            // 受注id (自動採番)
            $table->bigIncrements('order_id');

            // 年号 (2桁、年号-通番で工番として使用)
            $table->char('order_cd_year', 2)->comment('年号（2桁）');

            // 工番（通番） (5桁、年号-通番で工番として使用)
            $table->char('order_cd', 5)->comment('工番・通番（5桁）');

            // 見積id (見積.quot_id FK制約restrict)
            $table->bigInteger('quot_id')->nullable();
            $table->foreign('quot_id')
                ->references('quot_id')
                ->on('quots')
                ->onDelete('restrict')
                ->onUpdate('restrict');

            // 受注部署id (部署コードマスタ.section_cd_id FK制約restrict)
            $table->bigInteger('section_cd_id');
            $table->foreign('section_cd_id')
                ->references('section_cd_id')
                ->on('section_cds')
                ->onDelete('restrict')
                ->onUpdate('restrict');

            // 得意先id (得意先マスタ.customer_id FK制約restrict)
            $table->bigInteger('customer_id');
            $table->foreign('customer_id')
                ->references('customer_id')
                ->on('customers')
                ->onDelete('restrict')
                ->onUpdate('restrict');

            // 得意先名 (得意先コードが33900（諸口）のときのみ入力)
            $table->string('customer_name', 120)->nullable()->comment('得意先名（諸口の場合のみ）');

            // 担当者id (社員マスタ.employee_id FK制約restrict)
            $table->bigInteger('employee_id');
            $table->foreign('employee_id')
                ->references('employee_id')
                ->on('employees')
                ->onDelete('restrict')
                ->onUpdate('restrict');

            // 品名 (50桁以内)
            $table->string('prod_name', 50)->comment('品名（50桁以内）');

            // 正式品名 (255桁以内)
            $table->string('official_prod_name', 255)->comment('正式品名（255桁以内）');

            // 品名コード (10桁以内)
            $table->string('prod_cd', 10)->nullable()->comment('品名コード（10桁以内）');

            // サイズ (10桁以内)
            $table->string('size', 10)->nullable()->comment('サイズ（10桁以内）');

            // 数量
            $table->integer('quantity')->comment('数量');

            // 受注日
            $table->date('order_on')->comment('受注日');

            // 版下納期
            $table->date('bc_delivery_on')->nullable()->comment('版下納期');

            // 製品納期
            $table->date('delivery_on')->nullable()->comment('製品納期');

            // 最終完了日 (社内仕入時に更新)
            $table->date('completion_on')->nullable()->comment('最終完了日（社内仕入時に更新）');

            // 受注区分 (00:通常, 10:見込, 20:事前生産, 30:セット製品, 40:発送作業)
            $table->char('orders_category', 2)->default('00')->comment('受注区分');

            // 売上区分 (00:通常, 10:見込, 20:概算)
            $table->char('sales_category', 2)->default('00')->comment('売上区分');

            // 売上状況 (00:未売上, 10:一部売上済, 20:売上済)
            $table->char('sales_status', 2)->default('00')->comment('売上状況');

            // 発注書番号 (20桁以内)
            $table->string('purchase_order_number', 20)->nullable()->comment('発注書番号（20桁以内）');

            // 発注書番号承認区分 (False:未承認, True:承認済)
            $table->boolean('is_approved')->default(false)->comment('発注書番号承認区分');

            // 承認者id (社員マスタ.employee_id FK制約restrict)
            $table->bigInteger('approved_by')->nullable();
            $table->foreign('approved_by')
                ->references('employee_id')
                ->on('employees')
                ->onDelete('restrict')
                ->onUpdate('restrict');

            // 承認日時
            $table->timestamp('approved_at', 0)->nullable()->comment('承認日時');

            // 品名（略称） (50桁以内)
            $table->string('short_prod_name', 50)->comment('品名略称（50桁以内）');

            // 初校納期
            $table->date('first_proof_on')->nullable()->comment('初校納期');

            // 再校納期
            $table->date('second_proof_on')->nullable()->comment('再校納期');

            // 三校納期
            $table->date('third_proof_on')->nullable()->comment('三校納期');

            // 原稿枚数
            $table->integer('manuscript_pages')->nullable()->comment('原稿枚数');

            // 支給図面枚数
            $table->integer('drawing_count')->nullable()->comment('支給図面枚数');

            // 支給写真枚数
            $table->integer('provided_photos_count')->nullable()->comment('支給写真枚数');

            // 作業区分1有無 (False:編集作業なし, True:編集作業あり)
            $table->boolean('is_work_category1')->default(false)->comment('編集作業有無');

            // 作業区分2有無 (False:編集デザイン作業なし, True:編集デザイン作業あり)
            $table->boolean('is_work_category2')->default(false)->comment('編集デザイン作業有無');

            // 作業区分3有無 (False:印刷作業なし, True:印刷作業あり)
            $table->boolean('is_work_category3')->default(false)->comment('印刷作業有無');

            // 作業区分4有無 (False:ソフトウェア作業なし, True:ソフトウェア作業あり)
            $table->boolean('is_work_category4')->default(false)->comment('ソフトウェア作業有無');

            // 作業区分5有無 (False:エレクトロニクス設計作業なし, True:エレクトロニクス設計作業あり)
            $table->boolean('is_work_category5')->default(false)->comment('エレクトロニクス設計作業有無');

            // 作業区分6有無 (False:物流・部材作業なし, True:物流・部材作業あり)
            $table->boolean('is_work_category6')->default(false)->comment('物流・部材作業有無');

            // 個人情報有無 (False:個人情報なし, True:個人情報あり)
            $table->boolean('is_personal_data')->default(false)->comment('個人情報有無');

            // 機密情報有無 (False:機密情報なし, True:機密情報あり)
            $table->boolean('is_confidential_data')->default(false)->comment('機密情報有無');

            // データ保管有無 (False:データ保管不要, True:データ保管必要)
            $table->boolean('is_retention_required')->default(false)->comment('データ保管有無');

            // 主管センターid (部署コードマスタ.section_cd_id FK制約restrict)
            $table->bigInteger('center_section_cd_id');
            $table->foreign('center_section_cd_id')
                ->references('section_cd_id')
                ->on('section_cds')
                ->onDelete('restrict')
                ->onUpdate('restrict');

            // 主管担当者id (社員マスタ.employee_id FK制約restrict)
            $table->bigInteger('person_in_charge_id');
            $table->foreign('person_in_charge_id')
                ->references('employee_id')
                ->on('employees')
                ->onDelete('restrict')
                ->onUpdate('restrict');

            // 伝達事項
            $table->text('communication_note')->nullable()->comment('伝達事項');

            // 売上完了日 (売上登録時に更新（売上完了時）)
            $table->date('sales_completion_on')->nullable()->comment('売上完了日');

            // ステータス (00:工番発行済, 10:作業手配済, 20:作業受付済, 30:作業完了済, 40:社内仕入済)
            $table->char('order_status', 2)->default('00')->comment('受注ステータス');

            // 作成日・更新日
            $table->timestamps();

            // 複合ユニーク制約 (order_cd_year + order_cd)
            $table->unique(['order_cd_year', 'order_cd'], 'orders_order_cd_year_order_cd_unique');

            // インデックス (検索条件に使用するカラム)
            $table->index('order_on', 'orders_order_on_index');
            $table->index('order_status', 'orders_order_status_index');
            $table->index('section_cd_id', 'orders_section_cd_id_index');
            $table->index('customer_id', 'orders_customer_id_index');
            $table->index('employee_id', 'orders_employee_id_index');
            $table->index('center_section_cd_id', 'orders_center_section_cd_id_index');
            $table->index('quot_id', 'orders_quot_id_index');
            $table->index('delivery_on', 'orders_delivery_on_index');
            $table->index('sales_status', 'orders_sales_status_index');

            // 複合インデックス (よく使われる検索パターン)
            $table->index(['section_cd_id', 'order_on'], 'orders_section_cd_id_order_on_index');
            $table->index(['section_cd_id', 'order_status'], 'orders_section_cd_id_order_status_index');
            $table->index(['customer_id', 'order_on'], 'orders_customer_id_order_on_index');
            $table->index(['center_section_cd_id', 'order_on'], 'orders_center_section_cd_id_order_on_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
