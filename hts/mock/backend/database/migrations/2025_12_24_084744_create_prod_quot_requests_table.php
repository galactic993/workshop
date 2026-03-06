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
        Schema::create('prod_quot_requests', function (Blueprint $table) {
            // 制作見積依頼id（PK、自動採番）
            $table->bigIncrements('prod_quot_request_id');

            // 制作見積id（FK: prod_quots.prod_quot_id）
            $table->unsignedBigInteger('prod_quot_id');
            $table->foreign('prod_quot_id')
                ->references('prod_quot_id')
                ->on('prod_quots')
                ->onDelete('restrict');

            // 作業部署id（FK: section_cds.section_cd_id）
            $table->unsignedBigInteger('section_cd_id');
            $table->foreign('section_cd_id')
                ->references('section_cd_id')
                ->on('section_cds')
                ->onDelete('restrict');

            // 依頼者id（FK: employees.employee_id）
            $table->unsignedBigInteger('requested_by');
            $table->foreign('requested_by')
                ->references('employee_id')
                ->on('employees')
                ->onDelete('restrict');

            // 依頼概要
            $table->text('request_summary')->nullable();

            // 参考資料
            $table->string('reference_doc_path', 255)->nullable();

            // 根拠資料
            $table->string('supporting_doc_path', 255)->nullable();

            // 設計者id（FK: employees.employee_id）
            $table->unsignedBigInteger('designed_by')->nullable();
            $table->foreign('designed_by')
                ->references('employee_id')
                ->on('employees')
                ->onDelete('restrict');

            // 承認者id（FK: employees.employee_id）
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->foreign('approved_by')
                ->references('employee_id')
                ->on('employees')
                ->onDelete('restrict');

            // 承認日時
            $table->timestamp('approved_at')->nullable();

            // ステータス（00:設計中, 10:設計済, 20:承認済, 30:承認取消）
            $table->char('prod_quot_request_status', 2)->default('00');

            // 作成日・更新日
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prod_quot_requests');
    }
};
