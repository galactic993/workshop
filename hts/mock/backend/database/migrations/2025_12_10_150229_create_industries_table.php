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
        Schema::create('industries', function (Blueprint $table) {
            // 業種マスタid (自動採番なし)
            $table->bigInteger('industry_id')->primary();
            $table->unique('industry_id');

            // 業種名 (40桁以内、一意制約)
            $table->string('industry_name', 40);
            $table->unique('industry_name');

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
        Schema::dropIfExists('industries');
    }
};
