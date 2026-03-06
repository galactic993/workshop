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
        Schema::create('employee_section_cd', function (Blueprint $table) {
            // 社員別部署コードid (PK, BIGSERIAL with auto-increment)
            $table->id('employee_section_cd_id')->comment('社員別部署コードid');

            // 部署id (BIGINT, FK to section_cds.section_cd_id, RESTRICT)
            $table->bigInteger('section_cd_id')->comment('部署コードマスタid');
            $table->foreign('section_cd_id')
                ->references('section_cd_id')
                ->on('section_cds')
                ->onDelete('restrict')
                ->onUpdate('restrict');

            // 社員id (BIGINT, FK to employees.employee_id, RESTRICT, UNIQUE)
            $table->bigInteger('employee_id')->unique()->comment('社員マスタid');
            $table->foreign('employee_id')
                ->references('employee_id')
                ->on('employees')
                ->onDelete('restrict')
                ->onUpdate('restrict');

            // 更新日 (TIMESTAMP(0), NOT NULL, DEFAULT CURRENT_TIMESTAMP)
            $table->timestamp('updated_at', 0)->useCurrent()->comment('更新日');

            // メンテナンス用カラム
            $table->char('section_cd', 6)->nullable()->comment('部署コード（メンテナンス用）');
            $table->char('employee_cd', 6)->nullable()->comment('社員コード（メンテナンス用）');

            // 複合ユニーク制約 (section_cd_id, employee_id)
            $table->unique(['section_cd_id', 'employee_id'], 'employee_section_cd_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_section_cd');
    }
};
