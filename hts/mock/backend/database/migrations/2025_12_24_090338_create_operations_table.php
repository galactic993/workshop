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
        Schema::create('operations', function (Blueprint $table) {
            // 作業部門マスタid（PK、自動採番）
            $table->bigIncrements('operation_id');

            // 作業部門コード（半角数字3桁、ユニーク）
            $table->char('operation_cd', 3)->unique();

            // 作業部門名（30桁以内、ユニーク）
            $table->string('operation_name', 30)->unique();

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
        Schema::dropIfExists('operations');
    }
};
