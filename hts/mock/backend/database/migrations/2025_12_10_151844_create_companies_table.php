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
        Schema::create('companies', function (Blueprint $table) {
            // 会社団体マスタid (自動採番なし)
            $table->bigInteger('company_id')->primary();
            $table->unique('company_id');

            // 得意先グループid (FK制約 restrict)
            $table->bigInteger('customer_group_id');
            $table->foreign('customer_group_id')
                ->references('customer_group_id')
                ->on('customer_groups')
                ->onDelete('restrict')
                ->onUpdate('restrict');

            // 会社団体名 (50桁以内)
            $table->string('company_name', 50);

            // ソフトデリート
            $table->softDeletes();

            // 更新日のみ (created_at は使用しない)
            $table->timestamp('updated_at', 0)->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
