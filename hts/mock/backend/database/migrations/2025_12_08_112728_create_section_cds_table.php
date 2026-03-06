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
        Schema::create('section_cds', function (Blueprint $table) {
            // 部署コードマスタid (PK, BIGINT without auto-increment)
            $table->bigInteger('section_cd_id')->primary()->comment('部署コードマスタid');

            // 部署コード (CHAR(6), UNIQUE, NOT NULL)
            $table->char('section_cd', 6)->unique()->comment('部署コード（半角数字6桁、集計単位）');

            // 部署名 (VARCHAR(30), NOT NULL)
            $table->string('section_name', 30)->comment('部署名（30桁以内）');

            // 経費区分 (CHAR(2), NOT NULL)
            $table->char('expense_category', 2)->comment('経費区分（23:製造費, 25:製造管理費, 29:販売費, 30:販売管理費, 60:一般管理費）');

            // 削除日 (TIMESTAMP(0), NULLABLE)
            $table->timestamp('deleted_at', 0)->nullable()->comment('削除日');

            // 更新日 (TIMESTAMP(0), NOT NULL, DEFAULT CURRENT_TIMESTAMP)
            $table->timestamp('updated_at', 0)->useCurrent()->comment('更新日');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('section_cds');
    }
};
