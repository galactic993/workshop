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
        Schema::create('employee_role', function (Blueprint $table) {
            // 役割割当id (自動採番なし)
            $table->bigInteger('employee_role_id')->primary();
            $table->unique('employee_role_id');

            // 社員id (FK制約 cascade)
            $table->bigInteger('employee_id');
            $table->foreign('employee_id')
                ->references('employee_id')
                ->on('employees')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            // 役割id (FK制約 cascade)
            $table->bigInteger('role_id');
            $table->foreign('role_id')
                ->references('role_id')
                ->on('roles')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            // 複合ユニーク制約
            $table->unique(['employee_id', 'role_id']);

            // 更新日のみ (created_at は使用しない)
            $table->timestamp('updated_at', 0)->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_role');
    }
};
