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
        Schema::create('customer_groups', function (Blueprint $table) {
            // 得意先グループマスタid (自動採番なし)
            $table->bigInteger('customer_group_id')->primary();
            $table->unique('customer_group_id');

            // 業種id (FK制約 restrict)
            $table->bigInteger('industry_id');
            $table->foreign('industry_id')
                ->references('industry_id')
                ->on('industries')
                ->onDelete('restrict')
                ->onUpdate('restrict');

            // 得意先グループ名 (40桁以内、一意制約)
            $table->string('customer_group_name', 40);
            $table->unique('customer_group_name');

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
        Schema::dropIfExists('customer_groups');
    }
};
