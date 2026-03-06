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
        Schema::create('department_employee', function (Blueprint $table) {
            // 所属組織ID (PK, UK, 自動採番なし)
            $table->bigInteger('department_employee_id')->primary();
            $table->unique('department_employee_id');

            // 組織ID (NOT NULL, FK: departments.department_id, CASCADE)
            $table->bigInteger('department_id');
            $table->foreign('department_id')
                ->references('department_id')
                ->on('departments')
                ->cascadeOnDelete()
                ->cascadeOnUpdate()
                ->comment('組織マスタ.department_id FK制約cascade');

            // 社員ID (NOT NULL, FK: employees.employee_id, CASCADE)
            $table->bigInteger('employee_id');
            $table->foreign('employee_id')
                ->references('employee_id')
                ->on('employees')
                ->cascadeOnDelete()
                ->cascadeOnUpdate()
                ->comment('社員マスタ.employee_id FK制約cascade');

            // 複合ユニーク制約 (department_id, employee_id)
            $table->unique(['department_id', 'employee_id'], 'department_employee_unique');

            // 社員IDのユニーク制約（1社員は1組織のみ所属）
            $table->unique('employee_id');

            // 更新日
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('department_employee');
    }
};
