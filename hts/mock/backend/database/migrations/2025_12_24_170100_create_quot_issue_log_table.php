<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * 見積書発行履歴テーブルを作成
     * 見積書の発行記録として利用
     */
    public function up(): void
    {
        Schema::create('quot_issue_log', function (Blueprint $table) {
            // 見積書発行履歴id（自動採番、PK、UK）
            $table->bigIncrements('quot_issue_log_id');

            // 見積id（FK制約restrict）
            $table->bigInteger('quot_id');
            $table->foreign('quot_id')
                ->references('quot_id')
                ->on('quots')
                ->onDelete('restrict')
                ->onUpdate('restrict');

            // 発行日時（現在日時）
            $table->timestamp('issued_at', 0)->useCurrent();

            // 発行者id（FK制約restrict）
            $table->bigInteger('issued_by');
            $table->foreign('issued_by')
                ->references('employee_id')
                ->on('employees')
                ->onDelete('restrict')
                ->onUpdate('restrict');

            // ファイル名
            $table->string('file_name', 255);

            // 作成日・更新日
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quot_issue_log');
    }
};
