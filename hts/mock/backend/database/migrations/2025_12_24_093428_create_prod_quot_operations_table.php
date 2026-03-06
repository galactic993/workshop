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
        Schema::create('prod_quot_operations', function (Blueprint $table) {
            // 作業部門別制作見積id（PK、自動採番）
            $table->bigIncrements('prod_quot_operation_id');

            // 制作見積id（FK: prod_quots.prod_quot_id）
            $table->unsignedBigInteger('prod_quot_id');
            $table->foreign('prod_quot_id')
                ->references('prod_quot_id')
                ->on('prod_quots')
                ->onDelete('restrict');

            // 作業部門id（FK: operations.operation_id）
            $table->unsignedBigInteger('operation_id');
            $table->foreign('operation_id')
                ->references('operation_id')
                ->on('operations')
                ->onDelete('restrict');

            // 見積基準金額（12桁以内、小数なし）
            $table->decimal('prod_quot_cost', 12, 0);

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
        Schema::dropIfExists('prod_quot_operations');
    }
};
