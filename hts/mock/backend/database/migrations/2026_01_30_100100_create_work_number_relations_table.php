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
        Schema::create('work_number_relations', function (Blueprint $table) {
            // 工番関連id（PK、自動採番）
            $table->bigIncrements('work_number_relation_id');

            // 代表工番id（受注.order_id FK制約cascade）
            $table->bigInteger('parent_order_id');
            $table->foreign('parent_order_id')
                ->references('order_id')
                ->on('orders')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            // 関連工番id（受注.order_id FK制約cascade）
            $table->bigInteger('related_order_id');
            $table->foreign('related_order_id')
                ->references('order_id')
                ->on('orders')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            // 複合ユニーク制約（parent_order_id + related_order_id）
            $table->unique(['parent_order_id', 'related_order_id'], 'work_number_relations_parent_related_unique');

            // インデックス（検索条件に使用するカラム）
            $table->index('parent_order_id', 'work_number_relations_parent_order_id_index');
            $table->index('related_order_id', 'work_number_relations_related_order_id_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('work_number_relations');
    }
};
