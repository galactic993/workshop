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
        Schema::create('visible_departments', function (Blueprint $table) {
            // 参照可能組織id (自動採番なし)
            $table->bigInteger('visible_department_id')->primary();
            $table->unique('visible_department_id');

            // 社員id (FK制約 cascade)
            $table->bigInteger('employee_id');
            $table->foreign('employee_id')
                ->references('employee_id')
                ->on('employees')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            // 組織id (FK制約 cascade)
            $table->bigInteger('department_id');
            $table->foreign('department_id')
                ->references('department_id')
                ->on('departments')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            // 複合ユニーク制約
            $table->unique(['employee_id', 'department_id']);

            // 更新日のみ (created_at は使用しない)
            $table->timestamp('updated_at', 0)->useCurrent()->useCurrentOnUpdate();

            // メンテナンス用カラム
            $table->char('employee_cd', 6)->nullable();
            $table->string('remarks', 20)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visible_departments');
    }
};
