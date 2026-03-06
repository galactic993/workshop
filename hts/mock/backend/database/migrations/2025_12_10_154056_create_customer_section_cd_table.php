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
        Schema::create('customer_section_cd', function (Blueprint $table) {
            // 部署別得意先id (自動採番)
            $table->bigIncrements('customer_section_cd_id');
            $table->unique('customer_section_cd_id');

            // センター部署id (FK制約 cascade)
            $table->bigInteger('section_cd_id');
            $table->foreign('section_cd_id')
                ->references('section_cd_id')
                ->on('section_cds')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            // 得意先id (FK制約 cascade)
            $table->bigInteger('customer_id');
            $table->foreign('customer_id')
                ->references('customer_id')
                ->on('customers')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            // 複合ユニーク制約
            $table->unique(['section_cd_id', 'customer_id']);

            // 更新日のみ (created_at は使用しない)
            $table->timestamp('updated_at', 0)->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_section_cd');
    }
};
