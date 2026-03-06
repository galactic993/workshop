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
        Schema::create('department_section_cd', function (Blueprint $table) {
            // 組織別部署コードid (自動採番)
            $table->bigIncrements('department_section_cd_id');
            $table->unique('department_section_cd_id');

            // 部署id (FK制約 cascade)
            $table->bigInteger('section_cd_id');
            $table->foreign('section_cd_id')
                ->references('section_cd_id')
                ->on('section_cds')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            // 組織id (FK制約 cascade)
            $table->bigInteger('department_id');
            $table->foreign('department_id')
                ->references('department_id')
                ->on('departments')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            // 組織idの単体ユニーク制約 (1組織1部署)
            $table->unique('department_id');

            // 複合ユニーク制約
            $table->unique(['section_cd_id', 'department_id']);

            // 更新日のみ (created_at は使用しない)
            $table->timestamp('updated_at', 0)->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('department_section_cd');
    }
};
