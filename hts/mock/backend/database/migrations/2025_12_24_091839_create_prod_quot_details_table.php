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
        Schema::create('prod_quot_details', function (Blueprint $table) {
            // 制作見積詳細id（PK、自動採番）
            $table->bigIncrements('prod_quot_detail_id');

            // 制作見積依頼id（FK: prod_quot_requests.prod_quot_request_id）
            $table->unsignedBigInteger('prod_quot_request_id');
            $table->foreign('prod_quot_request_id')
                ->references('prod_quot_request_id')
                ->on('prod_quot_requests')
                ->onDelete('restrict');

            // 加工品内容id（FK: proces_cds.proces_cd_id）
            $table->unsignedBigInteger('proces_cd_id');
            $table->foreign('proces_cd_id')
                ->references('proces_cd_id')
                ->on('proces_cds')
                ->onDelete('restrict');

            // 設計者id（FK: employees.employee_id）
            $table->unsignedBigInteger('employee_id');
            $table->foreign('employee_id')
                ->references('employee_id')
                ->on('employees')
                ->onDelete('restrict');

            // 数量
            $table->integer('quantity');

            // 単価（12桁以内、小数なし）
            $table->decimal('unit_cost', 12, 0);

            // 金額（12桁以内、小数なし）
            $table->decimal('cost', 12, 0);

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
        Schema::dropIfExists('prod_quot_details');
    }
};
