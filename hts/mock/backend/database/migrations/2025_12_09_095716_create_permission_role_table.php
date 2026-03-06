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
        Schema::create('permission_role', function (Blueprint $table) {
            // 権限割当id (自動採番なし)
            $table->bigInteger('permission_role_id')->primary();
            $table->unique('permission_role_id');

            // 役割id (FK制約 cascade)
            $table->bigInteger('role_id');
            $table->foreign('role_id')
                ->references('role_id')
                ->on('roles')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            // 権限id (FK制約 cascade)
            $table->bigInteger('permission_id');
            $table->foreign('permission_id')
                ->references('permission_id')
                ->on('permissions')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            // 複合ユニーク制約
            $table->unique(['role_id', 'permission_id']);

            // 更新日のみ (created_at は使用しない)
            $table->timestamp('updated_at', 0)->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permission_role');
    }
};
