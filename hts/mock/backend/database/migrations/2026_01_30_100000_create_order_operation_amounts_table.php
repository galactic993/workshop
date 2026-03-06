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
        Schema::create('order_operation_amounts', function (Blueprint $table) {
            // 作業部門別受注金額id（PK、自動採番）
            $table->bigIncrements('order_operation_amount_id');

            // 受注id（受注.order_id FK制約cascade）
            $table->bigInteger('order_id');
            $table->foreign('order_id')
                ->references('order_id')
                ->on('orders')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            // 作業部門id（作業部門マスタ.operation_id FK制約restrict）
            $table->bigInteger('operation_id');
            $table->foreign('operation_id')
                ->references('operation_id')
                ->on('operations')
                ->onDelete('restrict')
                ->onUpdate('restrict');

            // 基準価格（12桁以内、小数なし、最終基準価格）
            $table->decimal('cost', 12, 0)->comment('基準価格（最終）');

            // 受注金額（12桁以内、小数なし、最終受注金額）
            $table->decimal('order_amount', 12, 0)->comment('受注金額（最終）');

            // 初回基準価格（12桁以内、小数なし）
            $table->decimal('first_cost', 12, 0)->comment('初回基準価格');

            // 初回受注金額（12桁以内、小数なし）
            $table->decimal('first_order_amount', 12, 0)->comment('初回受注金額');

            // 作成日・更新日
            $table->timestamps();

            // インデックス（検索条件に使用するカラム）
            $table->index('order_id', 'order_operation_amounts_order_id_index');
            $table->index('operation_id', 'order_operation_amounts_operation_id_index');

            // 複合インデックス（受注IDと作業部門IDの組み合わせ検索用）
            $table->index(['order_id', 'operation_id'], 'order_operation_amounts_order_operation_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_operation_amounts');
    }
};
