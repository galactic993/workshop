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
        Schema::create('quot_operations', function (Blueprint $table) {
            // 作業部門別見積id（PK、自動採番）
            $table->bigIncrements('quot_operation_id');

            // 見積id（FK: quots.quot_id）
            $table->unsignedBigInteger('quot_id');
            $table->foreign('quot_id')
                ->references('quot_id')
                ->on('quots')
                ->onDelete('cascade');

            // 作業部門別制作見積id（FK: prod_quot_operations.prod_quot_operation_id）
            $table->unsignedBigInteger('prod_quot_operation_id');
            $table->foreign('prod_quot_operation_id')
                ->references('prod_quot_operation_id')
                ->on('prod_quot_operations')
                ->onDelete('cascade');

            // 作業部門id（FK: operations.operation_id）
            $table->unsignedBigInteger('operation_id');
            $table->foreign('operation_id')
                ->references('operation_id')
                ->on('operations')
                ->onDelete('restrict');

            // 見積金額（12桁以内、小数なし）
            $table->decimal('quot_amount', 12, 0);

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
        Schema::dropIfExists('quot_operations');
    }
};
