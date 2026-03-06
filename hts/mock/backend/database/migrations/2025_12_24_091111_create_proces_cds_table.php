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
        Schema::create('proces_cds', function (Blueprint $table) {
            // 加工品内容コードマスタid（PK、自動採番）
            $table->bigIncrements('proces_cd_id');

            // 加工品内容コード（半角数字8桁）
            $table->char('proces_cd', 8);

            // 内容
            $table->string('proces_content', 255);

            // 基準単価（12桁以内、小数なし）
            $table->decimal('proces_cost', 12, 0);

            // 削除日（ソフトデリート）
            $table->timestamp('deleted_at')->nullable();

            // 更新日
            $table->timestamp('updated_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proces_cds');
    }
};
