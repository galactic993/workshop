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
        Schema::create('prod_quot_return_log', function (Blueprint $table) {
            // 制作見積差戻管理id（PK、自動採番）
            $table->bigIncrements('prod_quot_return_log_id');

            // 制作見積id（FK: prod_quots.prod_quot_id）
            $table->unsignedBigInteger('prod_quot_id');
            $table->foreign('prod_quot_id')
                ->references('prod_quot_id')
                ->on('prod_quots')
                ->onDelete('restrict');

            // 差戻前バージョン
            $table->smallInteger('previous_version');

            // 差戻後バージョン
            $table->smallInteger('next_version');

            // 差戻理由
            $table->text('remand_reason')->nullable();

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
        Schema::dropIfExists('prod_quot_return_log');
    }
};
